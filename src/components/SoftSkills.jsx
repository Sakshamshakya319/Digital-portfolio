import React from 'react';
import { useTheme } from '../context/ThemeContext';

const softSkills = [
  {
    name: 'Teamwork',
    description: 'Working well with others, contributing ideas, and supporting your teammates to achieve a common goal.',
  },
  {
    name: 'Adaptability',
    description: 'Being flexible and open to change; adjusting to new situations, technologies, or work environments.',
  },
  {
    name: 'Problem-Solving',
    description: 'Finding solutions to challenges using creativity, logic, and analytical thinking.',
  },
  {
    name: 'Time Management',
    description: 'Organizing your schedule efficiently so you can complete tasks on time and balance priorities.',
  },
  {
    name: 'Leadership',
    description: 'Guiding, motivating, and inspiring others toward achieving goals — even if you’re not in a formal management role.',
  },
  {
    name: 'Networking',
    description: 'Building and maintaining professional relationships that can support your personal and career growth.',
  },
];

const SoftSkills = () => {
  const { isDark } = useTheme();

  return (
    <div className={`py-12 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center mb-8">Soft Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {softSkills.map((skill) => (
            <div
              key={skill.name}
              className={`p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoftSkills;