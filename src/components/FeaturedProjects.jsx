import React, { useEffect, useState } from 'react';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (res.ok && Array.isArray(data.projects)) {
          // Get first 3 projects
          setProjects(data.projects.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  function handleProjectClick(project) {
    // Navigate to projects page and open this project
    window.__initialProjectSlug = project.slug || project._id;
    const event = new Event('click');
    const link = document.querySelector('[data-pg="projects"]');
    if (link) link.dispatchEvent(event);
  }

  if (loading) {
    return (
      <div className="proj-trio">
        <div className="trio-card">
          <div className="t-num">Loading...</div>
          <h3 className="t-title">Fetching Projects</h3>
          <p className="t-desc">Loading featured projects from database...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="proj-trio">
        <div className="trio-card">
          <div className="t-num">No Projects</div>
          <h3 className="t-title">No Projects Yet</h3>
          <p className="t-desc">
            Projects will appear here once they are added to the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="proj-trio">
      {projects.map((project, index) => (
        <div
          key={project._id || index}
          className="trio-card"
          onClick={() => handleProjectClick(project)}
        >
          <div className="t-num">
            {String(index + 1).padStart(2, '0')} / {project.category?.toUpperCase() || 'PROJECT'}
          </div>
          <h3 className="t-title">{project.title}</h3>
          <p className="t-desc">
            {project.summary || 'No description available'}
          </p>
          <div className="t-tags">
            {(Array.isArray(project.tags)
              ? project.tags
              : typeof project.tags === 'string'
              ? project.tags.split(',').map(t => t.trim())
              : []
            )
              .slice(0, 3)
              .map((tag, i) => (
                <span key={i} className="t-tag">
                  {tag}
                </span>
              ))}
          </div>
          <div className="t-arrow">↗</div>
        </div>
      ))}
    </div>
  );
}
