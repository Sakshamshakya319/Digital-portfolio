import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, User, MessageSquare, Trash2, Eye } from 'lucide-react';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(id);
        setContacts(contacts.filter(contact => contact._id !== id));
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'read':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
          <p className="text-slate-400">Manage incoming messages and inquiries</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' && ` (${contacts.length})`}
            {status !== 'all' && ` (${contacts.filter(c => c.status === status).length})`}
          </button>
        ))}
      </div>

      {filteredContacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No messages found</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{contact.name}</h3>
                    <p className="text-slate-400 text-sm">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">{contact.subject}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {contact.message}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                    className="bg-slate-700 text-white text-sm px-3 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <a
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                    className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply</span>
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManager;