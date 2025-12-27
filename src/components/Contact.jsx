import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Calendar, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit(formData);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'saksham.shakya@lpu.in',
      href: 'mailto:saksham.shakya@lpu.in',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9400000000',
      href: 'tel:+919400000000',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Maheru,Punjab',
      href: 'https://www.google.com/maps/place/LPU+FRONT+ENTRANCE+GATE/@31.2569601,75.6997863,15.74z/data=!4m6!3m5!1s0x391a5fca6a8887f9:0x48044ce5b6683280!8m2!3d31.2607955!4d75.7069368!16s%2Fg%2F11t6wp94qk?entry=ttu&g_ep=EgoyMDI1MDgyNC4wIKXMDSoASAFQAw%3D%3D',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/sakshamshakya319',
      color: 'hover:text-gray-400'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/sakshamshakya',
      color: 'hover:text-blue-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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
    <section id="contact" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get In <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Ready to start your next project? Let's discuss how I can help bring your ideas to life. 
            I'm always excited to work on new challenges and collaborate with amazing people.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className={`backdrop-blur-sm rounded-2xl p-8 border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white/50 border-gray-300'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send me a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Project Collaboration"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Hi, I'd love to discuss a potential project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Let's connect</h3>
              <p className={`mb-8 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                I'm currently available for freelance work and interesting project collaborations. 
                Whether you have a specific project in mind or just want to chat about technology 
                and opportunities, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : '_self'}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`block backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 group ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                        : 'bg-white/50 border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>{info.label}</div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{info.value}</div>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className={`backdrop-blur-sm rounded-xl p-6 border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white/50 border-gray-300'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Follow me on social media</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isDark
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                      }`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 border border-green-300"
            >
              <div className="flex items-center mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full mr-3"
                />
                <span className="text-green-700 font-medium">Currently Available</span>
              </div>
              <p className="text-green-700 text-sm">
                Open for new projects and collaborations. Response time: 24-48 hours.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
