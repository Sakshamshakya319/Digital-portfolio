import React, { useEffect } from 'react';
import anime from 'animejs';
import BlogTable from './components/BlogTable.jsx';
import ProjectTable from './components/ProjectTable.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function initPortfolioEffects() {
  if (window.__sakshamPortfolioInit) {
    return;
  }
  window.__sakshamPortfolioInit = true;

  const dot = document.getElementById('cur-dot');
  const outer = document.getElementById('cur-outer');
  const blade = document.getElementById('cur-blade');
  let mx = 0;
  let my = 0;
  let ox = 0;
  let oy = 0;
  let bx = 0;
  let by = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }
  });

  function animCursor() {
    ox += (mx - ox) * 0.14;
    oy += (my - oy) * 0.14;
    bx += (mx - bx) * 0.08;
    by += (my - by) * 0.08;
    if (outer) {
      outer.style.left = ox + 'px';
      outer.style.top = oy + 'px';
    }
    if (blade) {
      blade.style.left = bx + 'px';
      blade.style.top = by + 'px';
    }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  const hoverTargets = document.querySelectorAll(
    'a,button,.trio-card,.blog-mini,.pc,.ac,.cert,.brow'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-expand');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-expand');
    });
  });

  const trailCanvas = document.createElement('canvas');
  trailCanvas.style.cssText =
    'position:fixed;inset:0;z-index:9990;pointer-events:none;';
  document.body.appendChild(trailCanvas);
  const tc = trailCanvas.getContext('2d');
  let trailW;
  let trailH;
  let trails = [];
  function resizeTrail() {
    trailCanvas.width = trailW = window.innerWidth;
    trailCanvas.height = trailH = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);
  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 2; i += 1) {
      trails.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        life: 1,
        size: Math.random() * 3 + 1,
        color:
          Math.random() > 0.6
            ? 'rgba(0,229,255,'
            : Math.random() > 0.5
            ? 'rgba(255,149,0,'
            : 'rgba(0,255,136,'
      });
    }
  });
  function drawTrails() {
    tc.clearRect(0, 0, trailW, trailH);
    trails = trails.filter(t => {
      const next = t;
      next.life -= 0.06;
      if (next.life <= 0) return false;
      tc.beginPath();
      tc.arc(next.x, next.y, next.size * next.life, 0, Math.PI * 2);
      tc.fillStyle = next.color + next.life * 0.6 + ')';
      tc.fill();
      return true;
    });
    requestAnimationFrame(drawTrails);
  }
  drawTrails();

  const bgc = document.getElementById('bgc');
  const ctx = bgc ? bgc.getContext('2d') : null;
  let W = 0;
  let H = 0;
  const pts = [];
  function resizeBg() {
    if (!bgc) return;
    W = bgc.width = window.innerWidth;
    H = bgc.height = window.innerHeight;
  }
  resizeBg();
  window.addEventListener('resize', resizeBg);

  for (let i = 0; i < 110; i += 1) {
    pts.push({
      x: Math.random() * 3000,
      y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.3,
      color:
        Math.random() > 0.7
          ? 'rgba(0,229,255,'
          : Math.random() > 0.5
          ? 'rgba(255,149,0,'
          : 'rgba(0,255,136,',
      o: Math.random() * 0.5 + 0.1
    });
  }

  const rings = [
    { r: 80, speed: 0.0004, n: 8 },
    { r: 160, speed: -0.0003, n: 12 },
    { r: 260, speed: 0.0002, n: 18 },
    { r: 380, speed: -0.00015, n: 24 }
  ];
  let rAngle = 0;

  function drawBg() {
    if (!ctx) {
      requestAnimationFrame(drawBg);
      return;
    }
    ctx.clearRect(0, 0, W, H);

    const grd = ctx.createRadialGradient(
      W * 0.75,
      H * 0.25,
      0,
      W * 0.75,
      H * 0.25,
      W * 0.65
    );
    grd.addColorStop(0, 'rgba(0,229,255,0.04)');
    grd.addColorStop(0.5, 'rgba(0,100,200,0.02)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    const grd2 = ctx.createRadialGradient(
      W * 0.15,
      H * 0.8,
      0,
      W * 0.15,
      H * 0.8,
      W * 0.4
    );
    grd2.addColorStop(0, 'rgba(255,149,0,0.03)');
    grd2.addColorStop(1, 'transparent');
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0,229,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 90) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    pts.forEach(p => {
      const next = p;
      next.x += next.vx;
      next.y += next.vy;
      if (next.x < 0) next.x = W;
      if (next.x > W) next.x = 0;
      if (next.y < 0) next.y = H;
      if (next.y > H) next.y = 0;
      ctx.beginPath();
      ctx.arc(next.x, next.y, next.r, 0, Math.PI * 2);
      ctx.fillStyle = next.color + next.o + ')';
      ctx.fill();
    });

    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(0,229,255,' + 0.06 * (1 - d / 120) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    rAngle += 0.0003;
    const cx = W * 0.88;
    const cy = H * 0.18;
    rings.forEach(ring => {
      const a = (rAngle * ring.speed * 10000);
      for (let i = 0; i < ring.n; i += 1) {
        const angle = ((Math.PI * 2) / ring.n) * i + a;
        const px = cx + Math.cos(angle) * ring.r;
        const py = cy + Math.sin(angle) * ring.r;
        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,0.2)';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,229,255,0.06)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    const hx = W * 0.08;
    const hy = H * 0.85;
    const hs = 35;
    for (let r = -2; r <= 2; r += 1) {
      for (let c = -2; c <= 2; c += 1) {
        const hpx = hx + c * (hs * 1.73) + ((r % 2) * 0.866 * hs);
        const hpy = hy + r * (hs * 1.5);
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const ha = (Math.PI / 3) * i - Math.PI / 6;
          const px =
            hpx + hs * 0.6 * Math.cos(ha);
          const py =
            hpy + hs * 0.6 * Math.sin(ha);
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(0,229,255,0.05)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawBg);
  }
  drawBg();

  function goPage(pg) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pg);
    if (target) {
      target.classList.add('active');
    }
    document.querySelectorAll('.nl').forEach(a => a.classList.remove('on'));
    const link = document.querySelector('.nl[data-pg="' + pg + '"]');
    if (link) {
      link.classList.add('on');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initFadeIns, 100);
    if (pg === 'home') triggerHeroAnime();
    if (pg === 'achievements') animateCounters();
  }

  function openMob() {
    const m = document.getElementById('mobNav');
    if (m) m.classList.add('open');
  }

  function closeMob() {
    const m = document.getElementById('mobNav');
    if (m) m.classList.remove('open');
  }

  document.querySelectorAll('.nl').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const pg = el.getAttribute('data-pg');
      if (pg) goPage(pg);
    });
  });

  const mobLinks = document.querySelectorAll('#mobNav a[data-pg]');
  mobLinks.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const pg = el.getAttribute('data-pg');
      if (pg) goPage(pg);
      closeMob();
    });
  });

  const mobClose = document.querySelector('.mob-close');
  if (mobClose) {
    mobClose.addEventListener('click', e => {
      e.preventDefault();
      closeMob();
    });
  }

  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', e => {
      e.preventDefault();
      openMob();
    });
  }

  const thBtn = document.getElementById('thBtn');
  function toggleTheme() {
    const d = document.documentElement;
    const isLight = d.getAttribute('data-theme') === 'light';
    d.setAttribute('data-theme', isLight ? 'dark' : 'light');
    if (thBtn) {
      thBtn.textContent = isLight ? '☀️' : '🌙';
    }
    anime({
      targets: 'body',
      opacity: [0.8, 1],
      duration: 400,
      easing: 'easeOutQuad'
    });
  }
  if (thBtn) {
    thBtn.addEventListener('click', e => {
      e.preventDefault();
      toggleTheme();
    });
  }
  toggleTheme();

  // Handle Hire Me button click
  const hireCta = document.querySelector('.hire-cta');
  if (hireCta) {
    hireCta.addEventListener('click', e => {
      e.preventDefault();
      const pg = hireCta.getAttribute('data-pg');
      if (pg) goPage(pg);
    });
  }

  const path = window.location.pathname.replace(/\/+$/, '');
  let initialPage = 'home';
  let initialBlogSlug = '';
  let initialProjectSlug = '';
  if (path === '/admin') {
    initialPage = 'admin';
  } else if (path === '/hire') {
    initialPage = 'hire';
  } else if (path === '/contact') {
    initialPage = 'contact';
  } else if (path === '/blogs' || path === '/blog') {
    initialPage = 'blogs';
  } else if (path.startsWith('/blog/')) {
    initialPage = 'blogs';
    initialBlogSlug = path.slice('/blog/'.length);
  } else if (path === '/projects' || path === '/project') {
    initialPage = 'projects';
  } else if (path.startsWith('/project/')) {
    initialPage = 'projects';
    initialProjectSlug = path.slice('/project/'.length);
  }
  if (initialBlogSlug) {
    window.__initialBlogSlug = initialBlogSlug;
  }
  if (initialProjectSlug) {
    window.__initialProjectSlug = initialProjectSlug;
  }
  goPage(initialPage);

  function triggerHeroAnime() {
    anime
      .timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '#heroFirst',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 700
      })
      .add(
        {
          targets: '#heroLast',
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 700
        },
        '-=400'
      )
      .add(
        {
          targets: '#heroRole',
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 500
        },
        '-=300'
      )
      .add(
        {
          targets: '.h-status',
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 400
        },
        '-=200'
      )
      .add(
        {
          targets: '.h-btns',
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 500
        },
        '-=100'
      )
      .add(
        {
          targets: '.hst',
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(80),
          duration: 500
        },
        '-=200'
      )
      .add(
        {
          targets: '.h-outer',
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 600
        },
        '-=600'
      );

    document.querySelectorAll('.hst-v[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      anime({
        targets: el,
        innerHTML: [0, target],
        round: 1,
        duration: 1500,
        easing: 'easeOutQuart',
        delay: 800,
        update(a) {
          const value = Math.round(a.animations[0].currentValue);
          el.textContent = String(value) + (target >= 5 ? '+' : '');
        }
      });
    });
  }
  triggerHeroAnime();

  function animateCounters() {
    document.querySelectorAll('.sb-v[data-target]').forEach((el, i) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      anime({
        targets: el,
        innerHTML: [0, target],
        round: 1,
        duration: 1200,
        delay: i * 100,
        easing: 'easeOutQuart',
        update() {
          const value = Math.round(parseFloat(el.innerHTML));
          el.textContent = String(value);
        }
      });
    });
  }

  function initFadeIns() {
    document.querySelectorAll('.ani').forEach(el => {
      el.classList.remove('vis');
      setTimeout(() => {
        const obs = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                e.target.classList.add('vis');
                anime({
                  targets: e.target,
                  opacity: [0, 1],
                  translateY: [24, 0],
                  duration: 700,
                  easing: 'easeOutQuart'
                });
                observer.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12 }
        );
        obs.observe(el);
      }, 80);
    });
  }
  initFadeIns();

  document.querySelectorAll('#page-projects .fb').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const type = btn.getAttribute('data-type') || btn.textContent.toLowerCase();
      document
        .querySelectorAll('#page-projects .fb')
        .forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      document.querySelectorAll('.pc').forEach(card => {
        const cardType = card.getAttribute('data-type');
        const show = type === 'all' || cardType === type;
        anime({
          targets: card,
          opacity: show ? 1 : 0.15,
          scale: show ? 1 : 0.96,
          duration: 300,
          easing: 'easeOutQuad'
        });
        card.style.pointerEvents = show ? 'auto' : 'none';
      });
    });
  });

  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  async function sendMsg(e) {
    e.preventDefault();
    if (!contactForm || !toast) return;

    const formData = new FormData(contactForm);
    const payload = {
      firstName: formData.get('firstName') || '',
      lastName: formData.get('lastName') || '',
      email: formData.get('email') || '',
      subject: formData.get('subject') || '',
      message: formData.get('message') || ''
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
    }

    toast.classList.add('show');
    anime({
      targets: '#toast',
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutBack'
    });
    setTimeout(() => {
      anime({
        targets: '#toast',
        translateY: [0, 60],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInQuad',
        complete() {
          toast.classList.remove('show');
        }
      });
    }, 4000);
    contactForm.reset();
  }
  if (contactForm) {
    contactForm.addEventListener('submit', sendMsg);
  }

  const hireForm = document.getElementById('hireForm');
  async function sendHire(e) {
    e.preventDefault();
    if (!hireForm || !toast) return;

    const formData = new FormData(hireForm);
    const payload = {
      fullName: formData.get('fullName') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      company: formData.get('company') || '',
      projectType: formData.get('projectType') || '',
      budget: formData.get('budget') || '',
      timeline: formData.get('timeline') || '',
      description: formData.get('description') || ''
    };

    try {
      await fetch('/api/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
    }

    toast.classList.add('show');
    anime({
      targets: '#toast',
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutBack'
    });
    setTimeout(() => {
      anime({
        targets: '#toast',
        translateY: [0, 60],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInQuad',
        complete() {
          toast.classList.remove('show');
        }
      });
    }, 4000);
    hireForm.reset();
  }
  if (hireForm) {
    hireForm.addEventListener('submit', sendHire);
  }

  anime({
    targets: '.logo-hex',
    boxShadow: [
      '0 0 0px rgba(0,229,255,0)',
      '0 0 16px rgba(0,229,255,0.6)'
    ],
    direction: 'alternate',
    loop: true,
    duration: 2000,
    easing: 'easeInOutSine'
  });

  setInterval(() => {
    anime({
      targets: '.nav-pill',
      borderColor: [
        'rgba(0,229,255,0.12)',
        'rgba(0,229,255,0.4)',
        'rgba(0,229,255,0.12)'
      ],
      duration: 1200,
      easing: 'easeInOutSine'
    });
  }, 3000);

  setInterval(() => {
    document.querySelectorAll('.scan-fx,.ab-scan').forEach(el => {
      anime({
        targets: el,
        opacity: [0.5, 0.9, 0.5],
        duration: 400,
        easing: 'easeInOutSine'
      });
    });
  }, 2500);
}

export default function App() {
  useEffect(() => {
    initPortfolioEffects();
  }, []);

  return (
    <>
      <div id="cur-dot" />
      <div id="cur-outer" />
      <div id="cur-blade">
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="25"
            y1="0"
            x2="25"
            y2="50"
            stroke="rgba(0,229,255,0.3)"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="25"
            x2="50"
            y2="25"
            stroke="rgba(0,229,255,0.3)"
            strokeWidth="0.5"
          />
          <circle
            cx="25"
            cy="25"
            r="3"
            stroke="rgba(0,229,255,0.4)"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="25"
            cy="25"
            r="8"
            stroke="rgba(0,229,255,0.15)"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      <canvas id="bgc" />

      <div className="mob-nav" id="mobNav">
        <button className="mob-close" type="button">
          ✕ CLOSE
        </button>
        <a href="#" data-pg="home">
          Home
        </a>
        <a href="#" data-pg="about">
          About
        </a>
        <a href="#" data-pg="education">
          Education
        </a>
        <a href="#" data-pg="projects">
          Projects
        </a>
        <a href="#" data-pg="achievements">
          Achievements
        </a>
        <a href="#" data-pg="blogs">
          Blogs
        </a>
        <a href="#" data-pg="contact">
          Contact
        </a>
        <a href="#" data-pg="hire">
          Hire Me
        </a>
      </div>

      <nav id="nav">
        <a className="nav-logo" href="#" data-pg="home">
          <div className="logo-hex">
            <span>SS</span>
          </div>
          <span className="logo-name">
            SAKSHAM&nbsp;<em>SHAKYA</em>
          </span>
        </a>

        <div className="nav-pill">
          <a className="nl on" href="#" data-pg="home">
            Home
          </a>
          <a className="nl" href="#" data-pg="about">
            About
          </a>
          <a className="nl" href="#" data-pg="education">
            Education
          </a>
          <a className="nl" href="#" data-pg="projects">
            Projects
          </a>
          <a className="nl" href="#" data-pg="achievements">
            Wins
          </a>
          <a className="nl" href="#" data-pg="blogs">
            Blog
          </a>
          <a className="nl" href="#" data-pg="contact">
            Contact
          </a>
        </div>

        <div className="nav-r">
          <button
            className="th-btn"
            id="thBtn"
            type="button"
            title="Toggle theme"
          >
            ☀️
          </button>
          <a className="hire-cta" href="#" data-pg="hire">
            ⚡ Hire Me
          </a>
          <button className="hamburger" id="hamburgerBtn" type="button">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className="page active" id="page-home">
        <section className="hero">
          <div className="hero-in">
            <div className="h-left">
              <div className="h-status">
                <span className="sdot" />
                Open to Opportunities
              </div>
              <div className="h-eyebrow">
                {'// Full-Stack Developer \u0026 MCA Student'}
              </div>
              <h1 className="h-name">
                <span className="fn" id="heroFirst">
                  SAKSHAM
                </span>
                <span className="ln" id="heroLast">
                  SHAKYA
                </span>
              </h1>
              <div className="h-role" id="heroRole">
                Aspiring Full-Stack Developer
              </div>
              <p className="h-sub">
                Dedicated student building real-world skills at{' '}
                <strong style={{ color: 'var(--c)' }}>
                  Lovely Professional University
                </strong>
                . NSS Achiever who visited Parliament. Publishing on{' '}
                <strong style={{ color: 'var(--am)' }}>Socio.io</strong>. Crafting
                tomorrow&apos;s web — one commit at a time.
              </p>
              <div className="h-btns">
                <a className="btn-c" href="#" data-pg="projects">
                  ⚡ View Projects
                </a>
                <a className="btn-g" href="#" data-pg="blogs">
                  ✦ Read Blog
                </a>
              </div>
              <div className="h-stats">
                <div className="hst">
                  <span className="hst-v" data-target="5">
                    0
                  </span>
                  <span className="hst-k">Projects Live</span>
                </div>
                <div className="hst">
                  <span className="hst-v" data-target="3">
                    0
                  </span>
                  <span className="hst-k">Skills Top</span>
                </div>
                <div className="hst">
                  <span className="hst-v" data-target="1">
                    0
                  </span>
                  <span className="hst-k">Publication</span>
                </div>
              </div>
            </div>

            <div className="h-photo-zone">
              <div className="h-frame">
                <div className="h-outer">
                  <div className="h-inner">
                    <img
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAIwAZkDASIAAhEBAxEB/8QAHQAAAgIDAQEBAAAAAAAAAAAAAgMBBAAFBgcICf/EAEQQAAEDAwIEBAQDBQYFBAIDAAEAAgMEESEFMQYSQVEHE2FxIjKBkRShsQgjM0LBFVJictHwFiRDguElNLLxY5JzoqP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBQQG/8QAJxEBAAICAgICAwACAwEAAAAAAAECAxEhMQQSQVEFEyJhcTKRobH/2gAMAwEAAhEDEQA/AOPI+JFspssstDLqVgCKyCApspAUgKCAEQCkBSAgwBTZSApAUEAKbKQFNlQICyyOyyyAbLLIrKbKACFlkdllkA29FlkVlNkAWUEI7LCqFkKLI7KLKgLIbJtlBCoXZQQmWUEIFkISE2yEhAshCQmEISECyFBCYQhIQLIQkJpCEhAshCQmEISqFkISmEISECyhKYQhIQLIQlMIQkIFkKCEZCEhULIQuTCEDlEKcgITXBLIQLcgsmOQ29ER1ZWAKVgCy0wIlgCkBQYAiAWAIgEEAIgFNkVkA2U2RAKbKCLKbKQFNlQNlNkVlllANllkVlNkA2WWRWWWQDZZZFbKyyoGyghHZQQkBZHossjIUWWgFlBCZZQQqF2UEJhCghAshQQmEISECyEJCYQhIQLIQkJhCEhABCEhMIQkIFkISmFAQgAhCQjIQkKgCEJCMhCQgA7ISjIQlABQlGQhKACgITCgcoFuCW5NclORCyosiKBEdYFICwBEAsNIsiAUgKQEGAIwFgCkBQZZEAsARAIMAWfRSpsggBTZSAiAQDZTZTZTZANllkQCmyALLLI7LLIAspsisssgCywhHZRZaAEKCEyyiysBZCghMsoIVAWUEIyFBCBZCiyYQhIQLIQEJpCEhAshCQmEISECyEJCYQhIQLIQEJpCEhAshAQmEKCECiEJCYQhIRCiEJTCEJVNllCUwoCoAKAphCAoFuCW5NcluQKcENvRG5CojrAEQCwBEAstMAUgKQFNkGBEAsARAIMCILAFICgwKbKbKQEEAKbKVNkEWUgKbLEEW9FlkSyyAbKbIrLLIBsssisssqBsssisssroBZRZGQssqAsoIR2UEKhdlBCZZQQgXZQQmWUEIhTggITSEJCBZCAhNIQkIFEIbJhCEhAshAQmkISECiEJCaQhIQKcEBCaQgIQLIQOTSEDggWQgKaQgcqFuCApjggcoFuS3BNcEtyBRQ4RuCFEdaEYQgIwsNMCIBYApCCQEQCgBGAoMUgKQpAQYApAU2U2QRZTZSApsgGymyKymyAbKbIgFllQNllkdlllQNllkVlICALLLI7LLeioWQosmWWWRCyEJCaQoIVC7KCEwhRZAuyEhNshIQKIQkJxCBwRCiEJCaQhsqpRCAhOIQEeiIUQhITSEJCBJCEhNcEJCBJCEhMIQkIFOCAhNIQOCKUQhcE0hA4KBTggcmOQOVCnBA4JjggcohLkCY4IUHWhGEIRBYaEEQCgIgEEgIwFACIKDAEQCwBEERllICwBEAioARWUgKbIiLLLIrKQFYUNlNkVlgCuk0GymyKymyulAApR29FFkQNllkdllkC7LLI7LLIhdlBCZZRZULIUEJhCiyBdvRQQmW9EJCBRBQkJpCEhAohCQmkICEC3BAQmkISFQohCU0gICECXBCQmkISECSEBTiEshAohCRlMIQuQKIS3JrgluUCnBAU0pbkC3JbgmuS3IFOCDPZ"
                      alt="Saksham portrait"
                    />
                    <div className="scan-fx" />
                    <div className="crnr tl" />
                    <div className="crnr tr" />
                    <div className="crnr bl" />
                    <div className="crnr br" />
                    <div className="hud-tl">MCA · LPU · India</div>
                    <div className="hud-br">
                      NSS Achiever
                      <br />
                      Socio.io Publisher
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-chip">
                <span>Next.js</span>
                <span>Google API</span>
                <span>Vercel</span>
              </div>
              <div
                className="orbit-ring"
                style={{ width: '260px', height: '260px' }}
              />
              <div
                className="orbit-ring"
                style={{ width: '360px', height: '360px' }}
              />
            </div>
          </div>
          <div className="scroll-cue">
            <span>SCROLL</span>
            <div className="ln" />
          </div>
        </section>

        <section className="ticker-wrap">
          <div className="ticker">
            <div className="tki hi">
              <span>Next.js</span>
              <span className="sep">•</span>
              <span>Google API</span>
              <span className="sep">•</span>
              <span>Vercel</span>
            </div>
            <div className="tki">
              <span>Canvas API</span>
              <span className="sep">•</span>
              <span>Anime.js</span>
              <span className="sep">•</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="tki">
              <span>MongoDB</span>
              <span className="sep">•</span>
              <span>Node.js</span>
              <span className="sep">•</span>
              <span>Express</span>
            </div>
            <div className="tki">
              <span>TypeScript</span>
              <span className="sep">•</span>
              <span>Figma</span>
              <span className="sep">•</span>
              <span>Git</span>
            </div>
          </div>
        </section>

        <section className="sec ct ani">
          <div className="sh">
            <div className="sh-tag">Profile</div>
            <h2 className="sh-title">
              Building{' '}
              <span className="cy">
                disciplined
              </span>{' '}
              software 
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="proj-trio">
            <div className="trio-card">
              <div className="t-num">01 / FOCUS</div>
              <h3 className="t-title">Student With Production Mindset</h3>
              <p className="t-desc">
                From MCA coursework to real-world projects, I focus on writing
                clean, maintainable code that scales.
              </p>
              <div className="t-tags">
                <span className="t-tag">Clean Code</span>
                <span className="t-tag">Design Systems</span>
                <span className="t-tag">Team Work</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
            <div className="trio-card">
              <div className="t-num">02 / VALUES</div>
              <h3 className="t-title">Discipline, Patience, Consistency</h3>
              <p className="t-desc">
                I bring a reliable, calm energy to every collaboration. I stay
                with problems until they are solved.
              </p>
              <div className="t-tags">
                <span className="t-tag">Ownership</span>
                <span className="t-tag">Communication</span>
                <span className="t-tag">Reliability</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
            <div className="trio-card">
              <div className="t-num">03 / GOAL</div>
              <h3 className="t-title">Full-Stack Developer Role</h3>
              <p className="t-desc">
                I aim to join a team where I can build impactful products using
                React, Next.js, Node.js and MongoDB.
              </p>
              <div className="t-tags">
                <span className="t-tag">Internships</span>
                <span className="t-tag">Junior Roles</span>
                <span className="t-tag">Mentorship</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
          </div>
        </section>

        <section className="sec ct ani">
          <div className="feat-head">
            <div>
              <div
                className="sh-tag"
                style={{ justifyContent: 'flex-start', marginBottom: '.5rem' }}
              >
                Selected Work
              </div>
              <h2 className="sh-title">
                Featured <span className="cy">Projects</span>
              </h2>
            </div>
            <a className="btn-g" href="#" data-pg="projects">
              All Projects →
            </a>
          </div>
          <div className="proj-trio">
            <div className="trio-card">
              <div className="t-num">01 / FOCUS</div>
              <h3 className="t-title">Student With Production Mindset</h3>
              <p className="t-desc">
                From MCA coursework to real-world projects, I focus on writing
                clean, maintainable code that scales.
              </p>
              <div className="t-tags">
                <span className="t-tag">Clean Code</span>
                <span className="t-tag">Design Systems</span>
                <span className="t-tag">Team Work</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
            <div className="trio-card">
              <div className="t-num">02 / VALUES</div>
              <h3 className="t-title">Discipline, Patience, Consistency</h3>
              <p className="t-desc">
                I bring a reliable, calm energy to every collaboration. I stay
                with problems until they are solved.
              </p>
              <div className="t-tags">
                <span className="t-tag">Ownership</span>
                <span className="t-tag">Communication</span>
                <span className="t-tag">Reliability</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
            <div className="trio-card">
              <div className="t-num">03 / GOAL</div>
              <h3 className="t-title">Full-Stack Developer Role</h3>
              <p className="t-desc">
                I aim to join a team where I can build impactful products using
                React, Next.js, Node.js and Firebase.
              </p>
              <div className="t-tags">
                <span className="t-tag">Internships</span>
                <span className="t-tag">Junior Roles</span>
                <span className="t-tag">Mentorship</span>
              </div>
              <div className="t-arrow">↗</div>
            </div>
          </div>
        </section>

        <section className="sec ct ani" style={{ paddingTop: 0 }}>
          <div className="feat-head">
            <div>
              <div
                className="sh-tag"
                style={{ justifyContent: 'flex-start', marginBottom: '.5rem' }}
              >
                Latest Posts
              </div>
              <h2 className="sh-title">
                From the <span className="cy">Blog</span>
              </h2>
            </div>
            <a className="btn-g" href="#" data-pg="blogs">
              All Posts →
            </a>
          </div>
          <div className="blog-duo">
            <div className="blog-mini">
              <div className="bm-cat">Next.js · 7 min read</div>
              <h3 className="bm-title">
                Mastering Next.js App Router — A Student&apos;s Real-World Guide
              </h3>
              <p className="bm-exc">
                From pages to app directory — what I learned building production
                apps at LPU and how it changed how I think about React.
              </p>
              <div className="bm-meta">Jan 2025 · Next.js, React, Vercel</div>
            </div>
            <div className="blog-mini">
              <div className="bm-cat">Career · 5 min read</div>
              <h3 className="bm-title">
                How I Visited Parliament as an NSS Achiever — and What It Taught
                Me
              </h3>
              <p className="bm-exc">
                Beyond code — my experience as an NSS achiever, what the
                Parliament visit meant, and lessons every student developer
                should hear.
              </p>
              <div className="bm-meta">Dec 2024 · Life, NSS, India</div>
            </div>
          </div>
        </section>

        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fs">
              Full-Stack Developer · MCA @ LPU · India 🇮🇳
            </div>
            <div className="fb2">
              © 2025 Saksham Shakya · sakshamshakya.tech · Made with ⚡ in India
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-about">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">About Me</div>
            <h2 className="sh-title">
              The <span className="cy">Story</span> Behind the{' '}
              <span className="ol">Code</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="ab-grid ani">
            <div className="ab-left">
              <div className="ab-photo">
                <div className="ab-photo-in">
                  <img
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAIwAZkDASIAAhEBAxEB/8QAHQAAAgIDAQEBAAAAAAAAAAAAAgMBBAAFBgcICf/EAEQQAAEDAwIEBAQDBQYFBAIDAAEAAgMEESEFMQYSQVEHE2FxIjKBkRShsQgjM0LBFVJictHwFiRDguElNLLxY5JzoqP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBQQG/8QAJxEBAAICAgICAwACAwEAAAAAAAECAxEhMQQSQVEFEyJhcTKRobH/2gAMAwEAAhEDEQA/AOPI+JFspssstDLqVgCKyCApspAUgKCAEQCkBSAgwBTZSApAUEAKbKQFNlQICyyOyyyAbLLIrKbKACFlkdllkA29FlkVlNkAWUEI7LCqFkKLI7KLKgLIbJtlBCoXZQQmWUEIFkISE2yEhAshCQmEISECyFBCYQhIQLIQkJpCEhAshCQmEISqFkISmEISECyhKYQhIQLIQlMIQkIFkKCEZCEhULIQuTCEDlEKcgITXBLIQLcgsmOQ29ER1ZWAKVgCy0wIlgCkBQYAiAWAIgEEAIgFNkVkA2U2RAKbKCLKbKQFNlQNlNkVlllANllkVlNkA2WWRWWWQDZZZFbKyyoGyghHZQQkBZHossjIUWWgFlBCZZQQqF2UEJhCghAshQQmEISECyEJCYQhIQLIQkJhCEhABCEhMIQkIFkISmFAQgAhCQjIQkKgCEJCMhCQgA7ISjIQlABQlGQhKACgITCgcoFuCW5NclORCyosiKBEdYFICwBEAsNIsiAUgKQEGAIwFgCkBQZZEAsARAIMAWfRSpsggBTZSAiAQDZTZTZTZANllkQCmyALLLI7LLIAspsisssgCywhHZRZaAEKCEyyiysBZCghMsoIVAWUEIyFBCBZCiyYQhIQLIQEJpCEhAshCQmEISECyEJCYQhIQLIQEJpCEhAshAQmEKCECiEJCYQhIRCiEJTCEJVNllCUwoCoAKAphCAoFuCW5NcluQKcENvRG5CojrAEQCwBEAstMAUgKQFNkGBEAsARAIMCILAFICgwKbKbKQEEAKbKVNkEWUgKbLEEW9FlkSyyAbKbIrLLIBsssisssqBsssisssroBZRZGQssqAsoIR2UEKhdlBCZZQQgXZQQmWUEIhTggITSEJCBZCAhNIQkIFEIbJhCEhAshAQmkISECiEJCaQhIQKcEBCaQgIQLIQOTSEDggWQgKaQgcqFuCApjggcoFuS3BNcEtyBRQ4RuCFEdaEYQgIwsNMCIBYApCCQEQCgBGAoMUgKQpAQYApAU2U2QRZTZSApsgGymyKymyAbKbIgFllQNllkdlllQNllkVlICALLLI7LLeioWQosmWWWRCyEJCaQoIVC7KCEwhRZAuyEhNshIQKIQkJxCBwRCiEJCaQhsqpRCAhOIQEeiIUQhITSEJCBJCEhNcEJCBJCEhMIQkIFOCAhNIQOCKUQhcE0hA4KBTggcmOQOVCnBA4JjggcohLkCY4IUHWhGEIRBYaEEQCgIgEEgIwFACIKDAEQCwBEERllICwBEAioARWUgKbIiLLLIrKQFYUNlNkVlgCuk0GymyKymyulAApR29FFkQNllkdllkC7LLI7LLIhdlBCZZRZULIUEJhCiyBdvRQQmW9EJCBRBQkJpCEhAohCQmkICEC3BAQmkISFQohCU0gICECXBCQmkISECSEBTiEshAohCRlMIQuQKIS3JrgluUCnBAU0pbkC3JbgmuS3IFOCDPZ"
                    alt="Saksham portrait"
                  />
                </div>
                <div className="ab-scan" />
              </div>
              <div className="info-table">
                <div className="i-cell">
                  <div className="i-lbl">Name</div>
                  <div className="i-val">Saksham Shakya</div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Location</div>
                  <div className="i-val">India 🇮🇳</div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Degree</div>
                  <div className="i-val">MCA @ LPU</div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Year</div>
                  <div className="i-val">2025 – 2027</div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Email</div>
                  <div className="i-val">
                    <a href="mailto:sakshamshakya94@gmail.com">
                      sakshamshakya@gmail.com
                    </a>
                  </div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Portfolio</div>
                  <div className="i-val">
                    <a
                      href="https://sakshamshakya.tech"
                      target="_blank"
                      rel="noreferrer"
                    >
                      sakshamshakya.tech
                    </a>
                  </div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Publication</div>
                  <div className="i-val">Socio.io Extension</div>
                </div>
                <div className="i-cell">
                  <div className="i-lbl">Status</div>
                  <div className="i-val" style={{ color: 'var(--gr)' }}>
                    ● Open to Work
                  </div>
                </div>
              </div>
            </div>
            <div className="ab-right">
              <div className="ab-story">
                <p>
                  Namaste! I&apos;m <strong>Saksham Shakya</strong> — an aspiring
                  Full-Stack Developer with a warm, cheerful personality who
                  believes that the best code comes from sincerity, patience, and
                  genuine curiosity about how things work.
                </p>
                <p>
                  Currently pursuing my{' '}
                  <strong>Master of Computer Applications (MCA)</strong> at{' '}
                  <strong>Lovely Professional University</strong>, I bring strong
                  team spirit, proactive thinking, and a serious attitude toward
                  my craft. I can endure hardships, work hard, and stay patient
                  through complex problems — qualities that make me a reliable
                  developer and teammate.
                </p>
                <p>
                  Beyond the screen, I was recognized as an{' '}
                  <strong>NSS Achiever</strong> and had the privilege of visiting{' '}
                  <strong>Parliament of India</strong> — an experience that
                  deepened my sense of responsibility toward building technology
                  that serves real people.
                </p>
                <p>
                  I published <strong>Socio.io</strong>, a web-based browser
                  extension, and continue to build with my top skills in{' '}
                  <strong>Next.js, Google APIs,</strong> and <strong>Vercel</strong>. My
                  approach: communicate clearly, commit fully, and ship work that
                  matters.
                </p>
              </div>

              <div className="sk-block">
                <div
                  className="sh-tag"
                  style={{
                    justifyContent: 'flex-start',
                    fontSize: '.62rem'
                  }}
                >
                  Technical Arsenal
                </div>
                <div className="sk-lbl">Core Skills</div>
                <div className="sk-pills">
                  <span className="sp hot">Next.js</span>
                  <span className="sp hot">React.js</span>
                  <span className="sp hot">Google API</span>
                  <span className="sp hot">Vercel</span>
                  <span className="sp">Node.js</span>
                  <span className="sp">JavaScript</span>
                  <span className="sp">TypeScript</span>
                </div>
                <div className="sk-lbl">Backend &amp; DB</div>
                <div className="sk-pills">
                  <span className="sp">Express.js</span>
                  <span className="sp">MongoDB</span>
                  <span className="sp">MySQL</span>
                  <span className="sp">Firebase</span>
                  <span className="sp">REST APIs</span>
                  <span className="sp">Python</span>
                </div>
                <div className="sk-lbl">Design &amp; Tools</div>
                <div className="sk-pills">
                  <span className="sp am">Tailwind CSS</span>
                  <span className="sp am">Figma</span>
                  <span className="sp">Git / GitHub</span>
                  <span className="sp">VS Code</span>
                  <span className="sp">Linux</span>
                  <span className="sp">Docker</span>
                </div>
              </div>

              <div className="facts-row" style={{ marginTop: '2rem' }}>
                <div className="fc">
                  <div className="fc-v">2+</div>
                  <div className="fc-k">Years Coding</div>
                </div>
                <div className="fc">
                  <div className="fc-v">5+</div>
                  <div className="fc-k">Projects Built</div>
                </div>
                <div className="fc">
                  <div className="fc-v">1</div>
                  <div className="fc-k">Publication</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              © 2025 · sakshamshakya.tech · 🇮🇳
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-education">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Academic Journey</div>
            <h2 className="sh-title">
              Education &amp; <span className="cy">Credentials</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="edu-grid ani">
            <div>
              <div className="tl">
                <div className="tl-item">
                  <div className="tl-gem" />
                  <div className="tl-yr">2025 — 2027 (Current)</div>
                  <div className="tl-t">Master of Computer Applications</div>
                  <div className="tl-s">Lovely Professional University, Punjab</div>
                  <div className="tl-b">
                    Pursuing MCA with specialization in Full-Stack Development, Cloud
                    Computing, and System Architecture. Actively building real-world
                    projects, contributing to open source, and growing as a developer
                    leader on campus.
                  </div>
                  <div className="tl-tags">
                    <span className="etag">MCA</span>
                    <span className="etag">Full-Stack</span>
                    <span className="etag">Cloud</span>
                    <span className="etag">LPU</span>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-gem" />
                  <div className="tl-yr">2022 — 2025</div>
                  <div className="tl-t">Bachelor&apos;s Degree — Computer Science</div>
                  <div className="tl-s">Lovely Professional University, Punjab</div>
                  <div className="tl-b">
                    Completed BCA CS at LPU with strong foundations in programming,
                    data structures, databases, web technologies, and networking.
                    Published Socio.io extension during this period.
                  </div>
                  <div className="tl-tags">
                    <span className="etag">BCA CS</span>
                    <span className="etag">DSA</span>
                    <span className="etag">Web Dev</span>
                    <span className="etag">Socio.io</span>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-gem dim" />
                  <div className="tl-yr">At 2022</div>
                  <div className="tl-t">Intermediate with Science</div>
                  <div className="tl-s">
                    Dr. Kiran Saujiya Senior Secondary School, Mainpuri
                  </div>
                  <div className="tl-b">
                    Foundation in Science and Mathematics. Discovered passion for
                    computers and technology during school years, which led to
                    pursuing Computer Science at LPU.
                  </div>
                  <div className="tl-tags">
                    <span className="etag">Science</span>
                    <span className="etag">Mathematics</span>
                    <span className="etag">Mainpuri, UP</span>
                  </div>
                </div>
                <div className="tl-item">
                  <div className="tl-gem dim" />
                  <div className="tl-yr">At 2020</div>
                  <div className="tl-t">High School</div>
                  <div className="tl-s">
                    St. Thomas Sr. Sec. School, Mainpuri
                  </div>
                  <div className="tl-b">
                    Foundation in Science and Mathematics. Discovered passion for
                    computers and technology during school years.
                  </div>
                  <div className="tl-tags">
                    <span className="etag">Science</span>
                    <span className="etag">Mathematics</span>
                    <span className="etag">Mainpuri, UP</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="sh-tag"
                style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}
              >
                Certifications
              </div>
              <div className="certs">
                <div className="cert">
                  <div className="cert-ic">🏅</div>
                  <div>
                    <div className="cert-nm">Hone Communication and Public Speaking Skills for Successful Career</div>
                    <div className="cert-is">Lovely Professional University · 2026</div>
                  </div>
                </div>
                <div className="cert">
                  <div className="cert-ic">⚡</div>
                  <div>
                    <div className="cert-nm">AptiGenius — A Comprehensive Course on Aptitude and Logical Reasoning</div>
                    <div className="cert-is">Lovely Professional University · 2026</div>
                  </div>
                </div>
                <div className="cert">
                  <div className="cert-ic">🚀</div>
                  <div>
                    <div className="cert-nm">Full-Stack Web Development</div>
                    <div className="cert-is">Coursera · 2023</div>
                  </div>
                </div>
                <div className="cert">
                  <div className="cert-ic">🛡️</div>
                  <div>
                    <div className="cert-nm">NSS Achiever — National Recognition</div>
                    <div className="cert-is">Visited Parliament of India</div>
                  </div>
                </div>
                <div className="cert">
                  <div className="cert-ic">🌐</div>
                  <div>
                    <div className="cert-nm">React.js Complete Guide</div>
                    <div className="cert-is">Udemy · 2023</div>
                  </div>
                </div>            
              </div>
            </div>
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              © 2025 · sakshamshakya.tech · 🇮🇳
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-projects">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Portfolio</div>
            <h2 className="sh-title">
              All <span className="cy">Projects</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="ani">
            <ProjectTable />
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              © 2025 · sakshamshakya.tech · 🇮🇳
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-achievements">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Milestones</div>
            <h2 className="sh-title">
              Achievements &amp; <span className="cy">Wins</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="stats-band ani">
            <div className="sb">
              <span className="sb-v" data-target="5">
                0
              </span>
              <div className="sb-k">Projects Live</div>
            </div>
            <div className="sb">
              <span className="sb-v" data-target="1">
                0
              </span>
              <div className="sb-k">Publication</div>
            </div>
            <div className="sb">
              <span className="sb-v" data-target="6">
                0
              </span>
              <div className="sb-k">Certifications</div>
            </div>
            <div className="sb">
              <span className="sb-v" data-target="2">
                0
              </span>
              <div className="sb-k">Degrees (B.Sc + MCA)</div>
            </div>
          </div>
          <div className="ag ani">
            <div className="ac">
              <div className="ac-ic">🏛️</div>
              <div className="ac-tp">National Achievement</div>
              <div className="ac-t">Visited Parliament of India</div>
              <p className="ac-d">
                Recognized as an NSS Achiever and selected to visit the
                Parliament of India — a testament to leadership, social
                responsibility, and national contribution beyond academics.
              </p>
              <div className="ac-dt">NSS · Government Recognition</div>
            </div>
            <div className="ac">
              <div className="ac-ic">📰</div>
              <div className="ac-tp">Publication</div>
              <div className="ac-t">Socio.io — Published Extension</div>
              <p className="ac-d">
                Authored and published Socio.io, a real-world web-based browser
                extension. This publication demonstrates ability to ideate, build,
                and ship production-grade software independently.
              </p>
              <div className="ac-dt">2024 · Browser Extension</div>
            </div>
            <div className="ac">
              <div className="ac-ic">🎓</div>
              <div className="ac-tp">Academic Excellence</div>
              <div className="ac-t">Dual Degree at LPU</div>
              <p className="ac-d">
                Successfully completed B.Sc. Computer Science (2022–2025) and now
                pursuing MCA (2025–2027) at Lovely Professional University — one
                of India&apos;s top ranked universities.
              </p>
              <div className="ac-dt">LPU · 2022 – 2027</div>
            </div>
            <div className="ac">
              <div className="ac-ic">⚡</div>
              <div className="ac-tp">Top Skills Recognition</div>
              <div className="ac-t">LinkedIn Top Skills</div>
              <p className="ac-d">
                Recognized on LinkedIn for top skills in Next.js, Google API, and
                Vercel — reflecting consistent learning, project building, and
                professional visibility in the developer community.
              </p>
              <div className="ac-dt">LinkedIn · 2024</div>
            </div>
            <div className="ac">
              <div className="ac-ic">🤝</div>
              <div className="ac-tp">NSS Achievement</div>
              <div className="ac-t">National Service Scheme Leader</div>
              <p className="ac-d">
                Active NSS member recognized for outstanding community service and
                social contribution at Lovely Professional University. Bridges the
                gap between technology and social good.
              </p>
              <div className="ac-dt">LPU NSS · 2023-2025</div>
            </div>
            <div className="ac">
              <div className="ac-ic">🌐</div>
              <div className="ac-tp">Open Source</div>
              <div className="ac-t">GitHub Active Contributor</div>
              <p className="ac-d">
                Consistent open-source contributor building real-world projects
                publicly. Portfolio at sakshamshakya.tech demonstrates breadth
                across frontend, backend, and extension development.
              </p>
              <div className="ac-dt">GitHub · Ongoing</div>
            </div>
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              © 2025 · sakshamshakya.tech · 🇮🇳
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-blogs">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Developer Diary</div>
            <h2 className="sh-title">
              Tech <span className="cy">Blog</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="ani">
            <BlogTable />
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              © 2025 · sakshamshakya.tech · 🇮🇳
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-contact">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Connect</div>
            <h2 className="sh-title">
              Get In <span className="cy">Touch</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="co-grid ani">
            <div>
              <p className="co-intro">
                Whether you have a project idea, want to collaborate, offer an
                internship, or just say <em>Namaste</em> — I&apos;d love to hear
                from you. I respond within 24 hours.
              </p>
              <div className="avail">
                <span className="sdot" />
                Available for Internships &amp; Freelance
              </div>
              <div className="ci-list">
                <div className="ci">
                  <div className="ci-ico">✉️</div>
                  <div>
                    <div className="ci-lbl">Email</div>
                    <div className="ci-val">
                      <a href="mailto:sakshamshakya94@gmail.com">
                        sakshamshakya@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="ci">
                  <div className="ci-ico">🌐</div>
                  <div>
                    <div className="ci-lbl">Portfolio</div>
                    <div className="ci-val">
                      <a
                        href="https://sakshamshakya.tech"
                        target="_blank"
                        rel="noreferrer"
                      >
                        sakshamshakya.tech
                      </a>
                    </div>
                  </div>
                </div>
                <div className="ci">
                  <div className="ci-ico">🎓</div>
                  <div>
                    <div className="ci-lbl">University</div>
                    <div className="ci-val">LPU, Phagwara, Punjab, India</div>
                  </div>
                </div>
                <div className="ci">
                  <div className="ci-ico">📍</div>
                  <div>
                    <div className="ci-lbl">Location</div>
                    <div className="ci-val">India 🇮🇳</div>
                  </div>
                </div>
              </div>
              <div className="soc-row">
                <a
                  className="sb2"
                  title="LinkedIn"
                  href="https://www.linkedin.com/in/sakshamshakya"
                  target="_blank"
                  rel="noreferrer"
                >
                  LI
                </a>
                <a className="sb2" title="GitHub" href="#">
                  GH
                </a>
                <a
                  className="sb2"
                  title="Portfolio"
                  href="https://sakshamshakya.tech"
                  target="_blank"
                  rel="noreferrer"
                >
                  WEB
                </a>
                <a
                  className="sb2"
                  title="Email"
                  href="mailto:sakshamshakya94@gmail.com"
                >
                  ✉
                </a>
              </div>
            </div>
            <form className="cf" id="contactForm">
              <div className="fr">
                <div className="fg">
                  <label className="fl" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="fi"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="fi"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="fg">
                <label className="fl" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="fi"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="subject">
                  Subject
                </label>
                <input
                  className="fi"
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project / Internship / Collaboration..."
                />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="fta"
                  id="message"
                  name="message"
                  placeholder="Tell me what you're working on..."
                  required
                />
              </div>
              <button type="submit" className="fsub">
                ⚡ Send Message
              </button>
            </form>
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fs">
              Full-Stack Developer · MCA @ LPU · India 🇮🇳
            </div>
            <div className="fb2">
              © 2025 Saksham Shakya · sakshamshakya.tech ·
              {' "Vasudhaiva Kutumbakam"'}
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-hire">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Hire Me</div>
            <h2 className="sh-title">
              Let&apos;s Build <span className="cy">Together</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="hire-grid ani">
            <div className="hire-info">
              <h3 className="hire-subtitle">Why Work With Me?</h3>
              <p className="hire-text">
                I&apos;m a dedicated MCA student with hands-on experience in building
                full-stack applications using modern technologies. I bring discipline,
                consistency, and a production mindset to every project.
              </p>
              
              <div className="hire-features">
                <div className="hire-feature">
                  <div className="hf-icon">⚡</div>
                  <div>
                    <h4 className="hf-title">Fast Turnaround</h4>
                    <p className="hf-desc">
                      I deliver quality work within agreed timelines, keeping you
                      updated throughout the process.
                    </p>
                  </div>
                </div>
                <div className="hire-feature">
                  <div className="hf-icon">🎯</div>
                  <div>
                    <h4 className="hf-title">Clean Code</h4>
                    <p className="hf-desc">
                      I write maintainable, well-documented code following industry
                      best practices and standards.
                    </p>
                  </div>
                </div>
                <div className="hire-feature">
                  <div className="hf-icon">💬</div>
                  <div>
                    <h4 className="hf-title">Clear Communication</h4>
                    <p className="hf-desc">
                      Regular updates, transparent progress tracking, and responsive
                      to feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hire-skills">
                <h4 className="hire-skills-title">Tech Stack</h4>
                <div className="hire-tags">
                  <span className="hire-tag">React</span>
                  <span className="hire-tag">Next.js</span>
                  <span className="hire-tag">Node.js</span>
                  <span className="hire-tag">Express</span>
                  <span className="hire-tag">MongoDB</span>
                  <span className="hire-tag">Firebase</span>
                  <span className="hire-tag">TypeScript</span>
                  <span className="hire-tag">Tailwind CSS</span>
                  <span className="hire-tag">REST APIs</span>
                  <span className="hire-tag">Git</span>
                </div>
              </div>

              <div className="hire-availability">
                <span className="sdot" />
                <span>Available for Freelance Projects &amp; Internships</span>
              </div>
            </div>

            <form className="hire-form" id="hireForm">
              <h3 className="hire-form-title">Project Details</h3>
              <p className="hire-form-subtitle">
                Fill out the form below and I&apos;ll get back to you within 24 hours.
              </p>

              <div className="fg">
                <label className="fl" htmlFor="hireFullName">
                  Full Name *
                </label>
                <input
                  className="fi"
                  id="hireFullName"
                  name="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="fr">
                <div className="fg">
                  <label className="fl" htmlFor="hireEmail">
                    Email *
                  </label>
                  <input
                    className="fi"
                    id="hireEmail"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="hirePhone">
                    Phone
                  </label>
                  <input
                    className="fi"
                    id="hirePhone"
                    name="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="fg">
                <label className="fl" htmlFor="hireCompany">
                  Company / Organization
                </label>
                <input
                  className="fi"
                  id="hireCompany"
                  name="company"
                  type="text"
                  placeholder="Your company name"
                />
              </div>

              <div className="fg">
                <label className="fl" htmlFor="hireProjectType">
                  Project Type *
                </label>
                <select
                  className="fi"
                  id="hireProjectType"
                  name="projectType"
                  required
                >
                  <option value="">Select project type</option>
                  <option value="web-app">Web Application</option>
                  <option value="website">Website</option>
                  <option value="api">API Development</option>
                  <option value="fullstack">Full-Stack Project</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="internship">Internship Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="fr">
                <div className="fg">
                  <label className="fl" htmlFor="hireBudget">
                    Budget Range
                  </label>
                  <select className="fi" id="hireBudget" name="budget">
                    <option value="">Select budget</option>
                    <option value="under-10k">Under ₹10,000</option>
                    <option value="10k-25k">₹10,000 - ₹25,000</option>
                    <option value="25k-50k">₹25,000 - ₹50,000</option>
                    <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                    <option value="above-100k">Above ₹1,00,000</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl" htmlFor="hireTimeline">
                    Timeline
                  </label>
                  <select className="fi" id="hireTimeline" name="timeline">
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (1-2 weeks)</option>
                    <option value="short">Short (2-4 weeks)</option>
                    <option value="medium">Medium (1-2 months)</option>
                    <option value="long">Long (2+ months)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="fg">
                <label className="fl" htmlFor="hireDescription">
                  Project Description *
                </label>
                <textarea
                  className="fta"
                  id="hireDescription"
                  name="description"
                  placeholder="Tell me about your project, goals, and requirements..."
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="fsub">
                🚀 Submit Project Request
              </button>
            </form>
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fs">
              Full-Stack Developer · MCA @ LPU · India 🇮🇳
            </div>
            <div className="fb2">
              © 2025 Saksham Shakya · sakshamshakya.tech ·
              {' "Vasudhaiva Kutumbakam"'}
            </div>
          </div>
        </footer>
      </div>

      <div className="page" id="page-admin">
        <section className="sec ct">
          <div className="sh ani">
            <div className="sh-tag">Admin</div>
            <h2 className="sh-title">
              Admin <span className="cy">Dashboard</span>
            </h2>
            <div className="sh-bar" />
          </div>
          <div className="ani">
            <AdminPanel />
          </div>
        </section>
        <footer>
          <div className="ct">
            <div className="ft">
              SAKSHAM <span>SHAKYA</span>
            </div>
            <div className="fb2">
              Admin area · Blogs &amp; Contact Messages
            </div>
          </div>
        </footer>
      </div>

      <div id="toast">✓ Message sent! Saksham will reply soon.</div>
    </>
  );
}
