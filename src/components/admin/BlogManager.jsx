import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Calendar, Clock, Heart, Save, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api, { blogAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAllAdmin();
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogAPI.delete(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const togglePublish = async (blog) => {
    try {
      const updatedBlog = await blogAPI.update(blog._id, {
        isPublished: !blog.isPublished
      });
      setBlogs(blogs.map(b => b._id === blog._id ? updatedBlog.data : b));
      toast.success(`Blog post ${blog.isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog post');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingBlog(null);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingBlog(null);
    fetchBlogs(); // Refresh the list
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
    <Routes>
      <Route path="/" element={
        showEditor ? (
          <BlogEditor 
            blog={editingBlog} 
            onClose={handleEditorClose}
          />
        ) : (
          <BlogList 
            blogs={blogs} 
            onDelete={handleDelete} 
            onTogglePublish={togglePublish}
            onEdit={handleEdit}
            onCreate={handleCreate}
          />
        )
      } />
    </Routes>
  );
};

const BlogList = ({ blogs, onDelete, onTogglePublish, onEdit, onCreate }) => {
  const { isDark } = useTheme();
  const getImageUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('/api')) {
      const base = import.meta.env.VITE_API_URL || '';
      return `${base}${url.slice(4)}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transition-colors`}>Blog Posts</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} transition-colors`}>Manage your blog posts and articles</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>New Post</span>
        </button>
      </div>

      {blogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-lg mb-4 transition-colors`}>No blog posts yet</p>
          <button
            onClick={onCreate}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Post</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300'} backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
            >
              {/* Blog Image */}
              {blog.featuredImage && (
                <img
                  src={getImageUrl(blog.featuredImage)}
                  alt={blog.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  blog.isPublished
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} transition-colors`}>{blog.category}</span>
              </div>

              {/* Title */}
              <h3 className={`font-semibold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-gray-600'} transition-colors`}>
                {blog.excerpt}
              </p>

              {/* Meta Info */}
              <div className={`flex items-center space-x-4 mb-4 text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'} transition-colors`}>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {blog.readTime} min
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {blog.views}
                </div>
                <div className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {blog.likes || 0}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onTogglePublish(blog)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    blog.isPublished
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {blog.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button 
                  onClick={() => onEdit(blog)}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(blog._id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
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

const BlogEditor = ({ blog, onClose }) => {
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    featuredImage: blog?.featuredImage || '',
    tags: blog?.tags?.join(', ') || '',
    category: blog?.category || 'Technology',
    readTime: blog?.readTime || 5,
    isPublished: blog?.isPublished || false
  });
  const [saving, setSaving] = useState(false);
  const { isDark } = useTheme();

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const toastId = toast.loading('Uploading image...');
      try {
        const res = await api.post('/upload', formData);
        const url = res.data.url;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', url);
        toast.success('Image uploaded', { id: toastId });
      } catch (err) {
        toast.error('Upload failed', { id: toastId });
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: imageUrl
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (blog) {
        await blogAPI.update(blog._id, blogData);
        toast.success('Blog post updated successfully');
      } else {
        await blogAPI.create(blogData);
        toast.success('Blog post created successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transition-colors`}>
            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} transition-colors`}>Write and publish your blog content</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              isDark 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Enter blog title..."
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="blog-post-slug"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Brief description of your blog post..."
              required
            />
          </div>

          {/* Featured Image Upload */}
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.featuredImage}
            label="Featured Image"
          />

          {/* Content Editor */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
              Content *
            </label>
            <div className={`admin-editor rounded-xl overflow-hidden ${isDark ? 'bg-white' : 'bg-white'}`}>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                style={{ height: '400px' }}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className={`rounded-xl p-6 border transition-colors ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors`}>Publish Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublished" className={`ml-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'} transition-colors`}>
                  Publish immediately
                </label>
              </div>
            </div>
          </div>

          {/* Post Details */}
          <div className={`rounded-xl p-6 border transition-colors ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors`}>Post Details</h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Technology">Technology</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Programming">Programming</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Read Time */}
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2 transition-colors`}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="react, javascript, tutorial"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
