import React, { useEffect, useState } from 'react';

export default function ProjectReader({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (!projectId) return;
    
    setLoading(true);
    setError('');
    
    fetch(`/api/projects?id=${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) {
          setProject(data.project);
        } else {
          setError('Project not found');
        }
      })
      .catch(() => {
        setError('Failed to load project');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  async function handleShare() {
    if (!project) return;
    
    const slug = project.slug || project._id;
    const url = `${window.location.origin}/project/${slug}`;
    const title = project.title || 'Project';
    const text = project.summary || title;
    
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareMessage('Project shared.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied to clipboard.');
      } else {
        setShareMessage(url);
      }
    } catch (e) {
      // User cancelled share
    }
    
    if (shareMessage) return;
    
    if (!navigator.share && !navigator.clipboard) return;
    
    setTimeout(() => {
      setShareMessage('');
    }, 3500);
  }

  if (loading) {
    return (
      <div className="project-reader-wrap">
        <div className="project-reader">
          <button className="reader-back" onClick={onClose}>
            ← Back to Projects
          </button>
          <div className="blog-reader-info">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-reader-wrap">
        <div className="project-reader">
          <button className="reader-back" onClick={onClose}>
            ← Back to Projects
          </button>
          <div className="blog-reader-error">{error || 'Project not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-reader-wrap">
      <div className="project-reader">
        <button className="reader-back" onClick={onClose}>
          ← Back to Projects
        </button>
        
        <div className="blog-reader-head">
          <div className="blog-reader-eyebrow">
            {project.type || project.category} · {project.date}
          </div>
          <h1 className="blog-reader-title">{project.title}</h1>
          <div className="blog-reader-meta">
            <span>{project.status || 'Completed'}</span>
            {project.tags && <span>Tags: {project.tags}</span>}
          </div>
        </div>

        {project.imageUrl && (
          <div className="blog-reader-image">
            <img
              src={project.imageUrl}
              alt={project.title}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="blog-reader-body">
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--c)', fontSize: '1.3rem' }}>
            About This Project
          </h2>
          
          {(project.body || project.summary || '')
            .split(/\n+/)
            .filter(Boolean)
            .map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: '1.2rem', lineHeight: '1.9', fontSize: '1rem' }}>
                {paragraph}
              </p>
            ))}

          {project.tags && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--bor)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--c)', fontSize: '1.1rem' }}>
                Technologies Used
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {(Array.isArray(project.tags)
                  ? project.tags
                  : String(project.tags).split(',').map(t => t.trim())
                ).map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.4rem 1rem',
                      background: 'rgba(0,229,255,0.1)',
                      border: '1px solid rgba(0,229,255,0.3)',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      color: 'var(--c)',
                      fontFamily: 'var(--ff3)',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="blog-reader-actions">
          {project.liveUrl && (
            <a
              className="blog-btn"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              style={{ borderColor: 'var(--gr)', color: 'var(--gr)' }}
            >
              ↗ Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              className="blog-btn"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              ⌥ GitHub
            </a>
          )}
          <button
            type="button"
            className="blog-btn share"
            onClick={handleShare}
          >
            ↗ Share
          </button>
          <button
            type="button"
            className="blog-btn ghost"
            onClick={onClose}
          >
            Close
          </button>
          {shareMessage && (
            <div className="blog-share-hint">{shareMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
