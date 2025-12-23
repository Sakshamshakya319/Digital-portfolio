import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { educationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await educationAPI.getAll();
      setEducation(response.data);
    } catch (error) {
      console.error('Error fetching education:', error);
      toast.error('Failed to fetch education records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        await educationAPI.delete(id);
        setEducation(education.filter(edu => edu._id !== id));
        toast.success('Education record deleted successfully');
      } catch (error) {
        console.error('Error deleting education:', error);
        toast.error('Failed to delete education record');
      }
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
          <h1 className="text-2xl font-bold text-white mb-2">Education</h1>
          <p className="text-slate-400">Manage your educational background</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-4">No education records yet</p>
          <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
            <Plus className="w-5 h-5" />
            <span>Add Your First Education Record</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-blue-400 font-medium mb-2">{edu.institution}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(edu.startDate).getFullYear()} - {
                          edu.isCurrently ? 'Present' : new Date(edu.endDate).getFullYear()
                        }
                      </div>
                      {edu.location && (
                        <span>{edu.location}</span>
                      )}
                      {edu.grade && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        {edu.description}
                      </p>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-white text-sm font-medium mb-2">Achievements:</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationManager;