import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock, Tag, Search, Filter, Eye, Heart } from 'lucide-react';
import { blogAPI } from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const BlogList = () => {
  const { isDark } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await blogAPI.getAll(params);
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Technology', 'Web Development', 'Programming', 'Tutorial', 'Personal', 'Other'];

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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                My <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Sharing knowledge, experiences, and insights from my development journey
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`pl-10 pr-8 py-3 rounded-lg border transition-colors appearance-none ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : blogs.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
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
                          src={blog.featuredImage || '/api/placeholder/400/250'}
                          alt={blog.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
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
                        <div className="flex items-center space-x-4 mb-3 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {blog.readTime} min read
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {blog.views}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {blog.likes || 0}
                          </div>
                        </div>

                        <Link to={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                          <h3 className={`text-xl font-bold mb-3 line-clamp-2 hover:text-blue-500 transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {blog.title}
                          </h3>
                        </Link>

                        <p className={`text-sm mb-4 line-clamp-3 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
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
                      </div>
                    </motion.article>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center space-x-2"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : isDark
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  No blog posts found. Try adjusting your search or filter.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogList;
