import React, { useEffect, useState } from 'react';

export default function ContactViewer() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/contacts', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load contacts');
        setContacts([]);
      } else {
        setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      }
    } catch (e) {
      setError('Network error while loading contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(contactId) {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts?id=${contactId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || 'Failed to delete contact');
        return;
      }
      setActiveContact(null);
      loadContacts();
    } catch (err) {
      alert('Network error while deleting contact');
    } finally {
      setDeleting(false);
    }
  }

  function openContact(contact) {
    setActiveContact(contact);
  }

  function closeContact() {
    setActiveContact(null);
  }

  if (loading) {
    return (
      <div className="query-viewer">
        <div className="admin-info">Loading contact messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="query-viewer">
        <div className="admin-error">{error}</div>
        <button className="btn-g" onClick={loadContacts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {activeContact ? (
        <div className="query-detail-wrap">
          <div className="query-detail">
            <button className="reader-back" onClick={closeContact}>
              ← Back to Contact Messages
            </button>

            <div className="query-header">
              <div className="query-meta">
                <span className="query-date">
                  {activeContact.createdAt
                    ? new Date(activeContact.createdAt).toLocaleString()
                    : 'Unknown date'}
                </span>
                <span className={`query-status ${activeContact.status}`}>
                  {activeContact.status || 'new'}
                </span>
              </div>
              <h2 className="query-title">
                {activeContact.subject || 'No Subject'}
              </h2>
            </div>

            <div className="query-info-grid">
              <div className="query-info-item">
                <div className="query-info-label">Name</div>
                <div className="query-info-value">
                  {activeContact.firstName} {activeContact.lastName}
                </div>
              </div>
              <div className="query-info-item">
                <div className="query-info-label">Email</div>
                <div className="query-info-value">
                  <a href={`mailto:${activeContact.email}`}>
                    {activeContact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="query-message">
              <h3 className="query-message-title">Message</h3>
              <p className="query-message-text">{activeContact.message}</p>
            </div>

            <div className="query-actions">
              <a
                className="blog-btn"
                href={`mailto:${activeContact.email}?subject=Re: ${activeContact.subject || 'Your message'}`}
                style={{ borderColor: 'var(--gr)', color: 'var(--gr)' }}
              >
                ✉ Reply via Email
              </a>
              <button
                type="button"
                className="blog-btn"
                style={{ borderColor: 'var(--re)', color: 'var(--re)' }}
                onClick={() => handleDelete(activeContact._id)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : '🗑 Delete'}
              </button>
              <button
                type="button"
                className="blog-btn ghost"
                onClick={closeContact}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="query-viewer">
          <div className="admin-actions" style={{ marginBottom: '1.5rem' }}>
            <button className="btn-g" onClick={loadContacts}>
              🔄 Refresh
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="admin-info">No contact messages yet.</div>
          ) : (
            <div className="query-list">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="query-card"
                  onClick={() => openContact(contact)}
                >
                  <div className="query-card-header">
                    <div className="query-card-meta">
                      <span className="query-card-date">
                        {contact.createdAt
                          ? new Date(contact.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </span>
                      <span className={`query-card-status ${contact.status}`}>
                        {contact.status || 'new'}
                      </span>
                    </div>
                    <h3 className="query-card-title">
                      {contact.subject || 'No Subject'}
                    </h3>
                  </div>
                  <div className="query-card-body">
                    <div className="query-card-from">
                      From: {contact.firstName} {contact.lastName} ({contact.email})
                    </div>
                    <p className="query-card-preview">
                      {contact.message.substring(0, 150)}
                      {contact.message.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <div className="query-card-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
