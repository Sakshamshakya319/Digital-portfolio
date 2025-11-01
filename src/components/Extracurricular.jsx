import React from 'react';
import { PersonStanding, Camera,BookOpenText, Plane, BookOpen, Users, Heart, Gamepad2, Mountain } from 'lucide-react';

const Extracurricular = () => {
  const activities = [
    {
      icon: PersonStanding,
      title: 'NSS Acheiver',
      category: 'Visit To Parliament',
      description: 'Visited Indian Parliament with LPU, meeting leaders and witnessing democracy in action—an inspiring, transformative glimpse into governance.',
      details: ['NSS Acheiver', 'LPU NSS Chapter', 'Parliament visit', '2+ years experience', '1000+ Hours Completed'],
      color: 'from-purple-500 to-pink-500',
      image: 'https://i.ibb.co/mFF8nTtz/IMG-20241220-WA0055.jpg'
    },
    {
      icon: BookOpenText,
      title: 'Gyandeep',
      category: 'Social Work',
      description: 'Spreading the light of knowledge, empowering underprivileged children, and inspiring NSS volunteers to create a brighter, educated future.',
      details: ['Social Worker', 'Gyandeep NGO', 'Underprivileged children', 'Educational resources', '1 year experience'],
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=600'
    
    },
    {
      icon: Users,
      title: 'Community Leadership',
      category: 'Service',
      description: 'Organizer of local social service for the community with the Motto of “NOT ME, BUT YOU”.',
      details: ['Social Work', '200+ members', 'Weekly events'],
      color: 'from-indigo-500 to-purple-500',
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Heart,
      title: 'Volunteer Work',
      category: 'Service',
      description: 'Teaching coding skills to underprivileged youth.',
      details: ['Code for Good volunteer', '10+ nonprofits helped', 'Youth coding instructor'],
      color: 'from-red-500 to-pink-500',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const categories = ['All', 'Exploration', 'Education', 'Service'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredActivities = selectedCategory === 'All' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  return (
    <section id="extracurricular" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Extra<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">curricular</span> Activities
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Beyond coding, I'm passionate about various creative and community-driven activities that shape my perspective and fuel my creativity
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300 hover:bg-gray-100 transition-all duration-300 group"
              >
                {/* Activity Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {activity.category}
                    </span>
                  </div>
                </div>

                {/* Activity Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{activity.description}</p>

                  {/* Activity Details */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Key Highlights:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {activity.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-center text-gray-700 text-sm"
                        >
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Personal Philosophy */}
        <div className="mt-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border border-gray-300">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Life Philosophy</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              "I believe that diverse experiences outside of technology make me a better developer. 
              Each activity teaches me something new about problem-solving, creativity, and human connection 
              that I bring back to my work. Whether it's the patience learned from rock climbing, 
              the attention to detail from photography, or the empathy gained from volunteer work, 
              these experiences shape my approach to building meaningful digital solutions."
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">8+</div>
                <div className="text-gray-700 text-sm">Active Hobbies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">1000+</div>
                <div className="text-gray-700 text-sm">Volunteer Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Extracurricular;