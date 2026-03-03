import React, { useEffect, useState } from 'react';

export default function HireViewer() {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeHire, setActiveHire] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadHires();
  }, []);

  async function loadHires() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/hires', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load hire requests');
        setHires([]);
      } else {
        setHires(Array.isArray(data.hires) ? data.hires : []);
      }
    } catch (e) {
      setError('Network error while loading hire requests');
      setHires([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(hireId) {
    if (!window.confirm('Are you sure you want to delete this hire request?')) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/hires?id=${hireId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || 'Failed to delete hire request');
        return;
      }
      setActiveHire(null);
      loadHires();
    } catch (err) {
      alert('Network error while deleting hire request');
    } finally {
      setDeleting(false);
    }
  }

  function openHire(hire) {
    setActiveHire(hire);
  }

  function closeHire() {
    setActiveHire(null);
  }

  if (loading) {
    return (
      <div className="query-viewer">
        <div className="admin-info">Loading hire requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="query-viewer">
        <div className="admin-error">{error}</div>
        <button className="btn-g" onClick={loadHires}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {activeHire ? (
        <div className="query-detail-wrap">
          <div className="query-detail">
            <button className="reader-back" onClick={closeHire}>
              ← Back to Hire Requests
            </button>

            <div className="query-header">
              <div className="query-meta">
                <span className="query-date">
                  {activeHire.createdAt
                    ? new Date(activeHire.createdAt).toLocaleString()
                    : 'Unknown date'}
                </span>
                <span className={`query-status ${activeHire.status}`}>
                  {activeHire.status || 'new'}
                </span>
              </div>
              <h2 className="query-title">
                {activeHire.projectType} Project Request
              </h2>
            </div>

            <div className="query-info-grid">
              <div className="query-info-item">
                <div className="query-info-label">Name</div>
                <div className="query-info-value">{activeHire.fullName}</div>
              </div>
              <div className="query-info-item">
                <div className="query-info-label">Email</div>
                <div className="query-info-value">
                  <a href={`mailto:${activeHire.email}`}>
                    {activeHire.email}
                  </a>
                </div>
              </div>
              {activeHire.phone && (
                <div className="query-info-item">
                  <div className="query-info-label">Phone</div>
                  <div className="query-info-value">
                    <a href={`tel:${activeHire.phone}`}>{activeHire.phone}</a>
                  </div>
                </div>
              )}
              {activeHire.company && (
                <div className="query-info-item">
                  <div className="query-info-label">Company</div>
                  <div className="query-info-value">{activeHire.company}</div>
                </div>
              )}
              <div className="query-info-item">
                <div className="query-info-label">Project Type</div>
                <div className="query-info-value">{activeHire.projectType}</div>
              </div>
              {activeHire.budget && (
                <div className="query-info-item">
                  <div className="query-info-label">Budget</div>
                  <div className="query-info-value">{activeHire.budget}</div>
                </div>
              )}
              {activeHire.timeline && (
                <div className="query-info-item">
                  <div className="query-info-label">Timeline</div>
                  <div className="query-info-value">{activeHire.timeline}</div>
                </div>
              )}
            </div>

            <div className="query-message">
              <h3 className="query-message-title">Project Description</h3>
              <p className="query-message-text">{activeHire.description}</p>
            </div>

            <div className="query-actions">
              <a
                className="blog-btn"
                href={`mailto:${activeHire.email}?subject=Re: ${activeHire.projectType} Project`}
                style={{ borderColor: 'var(--gr)', color: 'var(--gr)' }}
              >
                ✉ Reply via Email
              </a>
              {activeHire.phone && (
                <a
                  className="blog-btn"
                  href={`tel:${activeHire.phone}`}
                  style={{ borderColor: 'var(--c)', color: 'var(--c)' }}
                >
                  📞 Call
                </a>
              )}
              <button
                type="button"
                className="blog-btn"
                style={{ borderColor: 'var(--re)', color: 'var(--re)' }}
                onClick={() => handleDelete(activeHire._id)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : '🗑 Delete'}
              </button>
              <button
                type="button"
                className="blog-btn ghost"
                onClick={closeHire}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="query-viewer">
          <div className="admin-actions" style={{ marginBottom: '1.5rem' }}>
            <button className="btn-g" onClick={loadHires}>
              🔄 Refresh
            </button>
          </div>

          {hires.length === 0 ? (
            <div className="admin-info">No hire requests yet.</div>
          ) : (
            <div className="query-list">
              {hires.map((hire) => (
                <div
                  key={hire._id}
                  className="query-card"
                  onClick={() => openHire(hire)}
                >
                  <div className="query-card-header">
                    <div className="query-card-meta">
                      <span className="query-card-date">
                        {hire.createdAt
                          ? new Date(hire.createdAt).toLocaleDateString()
                          : 'Unknown'}
                      </span>
                      <span className={`query-card-status ${hire.status}`}>
                        {hire.status || 'new'}
                      </span>
                    </div>
                    <h3 className="query-card-title">
                      {hire.projectType} Project
                    </h3>
                  </div>
                  <div className="query-card-body">
                    <div className="query-card-from">
                      From: {hire.fullName} ({hire.email})
                      {hire.company && ` - ${hire.company}`}
                    </div>
                    <div className="query-card-details">
                      {hire.budget && <span>Budget: {hire.budget}</span>}
                      {hire.timeline && <span>Timeline: {hire.timeline}</span>}
                    </div>
                    <p className="query-card-preview">
                      {hire.description.substring(0, 150)}
                      {hire.description.length > 150 ? '...' : ''}
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
