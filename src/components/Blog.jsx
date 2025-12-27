import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock, ArrowRight, Tag, Heart, Eye } from 'lucide-react';
import { blogAPI } from '../services/api';

const Blog = () => {
  const { isDark } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('/api')) {
      const base = import.meta.env.VITE_API_URL || '';
      return `${base}${url.slice(4)}`;
    }
    return url;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll({ limit: 6 });
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <section id="blog" className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <motion.div
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Latest <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Blog Posts</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Thoughts, tutorials, and insights from my development journey
          </p>
        </motion.div>

        {blogs.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-900 border border-slate-800' 
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  {/* Blog Image */}
                  <div className="relative overflow-hidden group">
                    <img
                      src={getImageUrl(blog.featuredImage) || getImageUrl('/api/placeholder/400/250')}
                      alt={blog.title}
                      className="w-full h-48 object-contain md:object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <div className={`flex items-center space-x-4 mb-3 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {blog.readTime} min read
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {blog.title}
                    </h3>

                    <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-md flex items-center ${
                              isDark 
                                ? 'bg-slate-800 text-slate-300' 
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats and Read More */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-4 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {blog.likes || 0}
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-purple-600 font-medium transition-colors duration-300 group"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                View All Posts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No blog posts available yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
