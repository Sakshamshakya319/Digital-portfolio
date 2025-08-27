import React from 'react';
import { Code, Palette, Database, Cloud, Smartphone, Zap } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React', level: 87 },
        { name: 'JavaScript/TypeScript', level: 95 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 85 },
        { name: 'Vue.js', level: 80 },
        // { name: 'Next.js', level: 85 }
      ]
    },
    {
      title: 'Backend Development',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'C++', level: 80 },
        { name: 'MongoDB', level: 85 },
        { name: 'REST APIs', level: 90 },
        // { name: 'GraphQL', level: 75 }
      ]
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      skills: [
        // { name: 'AWS', level: 85 },
        { name: 'Docker', level: 47 },
        // { name: 'Kubernetes', level: 70 },
        // { name: 'CI/CD', level: 80 },
        { name: 'Linux', level: 56 },
        { name: 'Git', level: 78 }
      ]
    },
    {
      title: 'Design & UX',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Canva', level: 90 },
        { name: 'Adobe Photoshop', level: 68 },
        { name: 'UI/UX Design', level: 85 },

      ]
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      color: 'from-indigo-500 to-purple-500',
      skills: [
        { name: 'React Native', level: 69 },
        { name: 'Android Development', level: 65 },
        { name: 'Ionic', level: 80 },
      ]
    },
    {
      title: 'Tools & Others',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      skills: [
        { name: 'VS Code', level: 95 },
        { name: 'Webpack', level: 80 },
        { name: 'Jest/Testing', level: 85 },
        { name: 'Project Management', level: 85 },
        { name: 'Team Leadership', level: 80 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Skills & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Tools</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and the tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                {/* Category Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>

                {/* Skills List */}
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">{skill.name}</span>
                        <span className="text-white/60 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">5+</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Years of Experience</h4>
            <p className="text-white/60">Continuous learning and professional growth</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">50+</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Projects Completed</h4>
            <p className="text-white/60">From small websites to large-scale applications</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">17+</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Technologies</h4>
            <p className="text-white/60">Always exploring the latest tools and frameworks</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;