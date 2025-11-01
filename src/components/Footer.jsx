import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 backdrop-blur-sm border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-gray-900 font-semibold text-xl">Portfolio</span>
            </div>
            <p className="text-gray-700 max-w-sm">
              Full Stack Developer passionate about creating exceptional digital experiences 
              through clean code and beautiful design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'About', href: '#about' },
                { label: 'Resume', href: '#resume' },
                { label: 'Skills', href: '#skills' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'Contact', href: '#contact' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-2">
              <p className="text-gray-700">saksham.shakya@lpu.in</p>
              <p className="text-gray-700">+91 9411850565</p>
              <p className="text-gray-700">Maheru, Punjab</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 text-sm mb-4 md:mb-0">
              © {currentYear} Saksham Shakya. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2 text-gray-700 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>and</span>
              <Code className="w-4 h-4 text-blue-400" />
              <span>and</span>
              <Coffee className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;