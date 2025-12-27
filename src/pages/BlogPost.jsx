import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Eye, Heart, MessageCircle } from 'lucide-react';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import { blogAPI } from '../services/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const getImageUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('/api')) {
      const base = import.meta.env.VITE_API_URL || '';
      return `${base}${url.slice(4)}`;
    }
    return url;
  };

  const normalizeContentImages = (html) => {
    if (!html) return html;
    const base = import.meta.env.VITE_API_URL || '';
    return html.replace(/src="\/api([^"]*)"/g, (_m, path) => `src="${base}${path}"`);
  };

  const fetchBlog = async () => {
    try {
      const response = await blogAPI.getBySlug(slug);
      const data = response.data;
      if (data.featuredImage) {
        data.featuredImage = getImageUrl(data.featuredImage);
      }
      if (data.content) {
        data.content = normalizeContentImages(data.content);
      }
      setBlog(data);
      setLikes(response.data.likes || 0);
      
      // Check if user has liked this blog (using localStorage for demo)
      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      setHasLiked(likedBlogs.includes(slug));
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await blogAPI.likeBlog(slug);
      setLikes(response.data.likes);
      setHasLiked(response.data.hasLiked);
      
      // Update localStorage
      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      if (response.data.hasLiked) {
        likedBlogs.push(slug);
      } else {
        const index = likedBlogs.indexOf(slug);
        if (index > -1) likedBlogs.splice(index, 1);
      }
      localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to like blog');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <Navigation />
        <div className="pt-20 flex items-center justify-center h-64">
          <motion.div
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <Navigation />
        <div className="pt-20 container mx-auto px-6">
          <div className="text-center py-20">
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Blog Post Not Found
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = blog.title;
  const shareDescription = blog.excerpt;

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
              className="max-w-4xl mx-auto"
            >
              {/* Back Button */}
              <Link
                to="/blog"
                className={`inline-flex items-center mb-8 text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              </div>

              {/* Title */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {blog.readTime} min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {blog.views} views
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  {likes} likes
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    hasLiked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                  {hasLiked ? 'Liked' : 'Like'} ({likes})
                </motion.button>

                <div className="relative">
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'
                    }`}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </motion.button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute top-full left-0 mt-2 p-4 rounded-lg shadow-lg border z-10 ${
                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
                      }`}
                    >
                      <div className="flex space-x-3 mb-3">
                        <FacebookShareButton url={shareUrl} quote={shareTitle}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription}>
                          <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className={`w-full text-sm px-3 py-2 rounded transition-colors ${
                          isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <p className={`text-xl leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {blog.excerpt}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featuredImage && (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                <img
                  src={getImageUrl(blog.featuredImage)}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`prose prose-lg max-w-none ${
                isDark 
                  ? 'prose-invert prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-slate-800 prose-blockquote:border-blue-500 prose-blockquote:text-slate-300'
                  : 'prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-code:text-blue-600 prose-pre:bg-slate-100 prose-blockquote:border-blue-500 prose-blockquote:text-slate-600'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isDark 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className={`py-12 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Link
                to="/blog"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to All Posts
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
