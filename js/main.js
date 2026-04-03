/* ============================================================
   SVE Mockup — Enhanced Interactive JavaScript
   Particles, counters, parallax, drawer, reveals, typing
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── FAQ Accordion ───────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── Mobile Drawer ───────────────────────────────────────
  var toggle = document.querySelector('.mobile-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  var drawerOverlay = document.querySelector('.drawer-overlay');
  var drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    if (drawer) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
  }
  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  // Close drawer links
  document.querySelectorAll('.drawer-nav a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  // ─── Smooth Scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Quote Form Demo ───────────────────────────────────
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = 'Quote Requested!';
          btn.style.background = '#2d8a4e';
          setTimeout(function () {
            btn.textContent = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 2500);
        }, 1200);
      }
    });
  });

  // ─── Animated Counter ──────────────────────────────────
  function animateCounter(el) {
    var target = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;
    var numTarget = parseFloat(target);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * numTarget);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + numTarget.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  // ─── Scroll Reveal (Intersection Observer) ─────────────
  if ('IntersectionObserver' in window) {
    // Reveal elements
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    // Staggered children
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var children = entry.target.querySelectorAll('.reveal-child');
          children.forEach(function (child, i) {
            setTimeout(function () {
              child.classList.add('revealed');
            }, i * 120);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-stagger').forEach(function (el) {
      staggerObserver.observe(el);
    });

    // Counter trigger
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ─── Parallax on Hero ──────────────────────────────────
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrolled * 0.4) + 'px) scale(1.1)';
      }
    }, { passive: true });
  }

  // ─── Header shrink on scroll ───────────────────────────
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ─── Particle Canvas (Hero) ────────────────────────────
  var canvas = document.getElementById('hero-particles');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 168, 76, ' + p.opacity + ')';
        ctx.fill();
      });

      // Draw connections
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(201, 168, 76, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ─── Typing Effect (Hero Eyebrow) ─────────────────────
  var typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    var phrases = [
      'San Jose to Los Angeles \u2014 1.2 Hours',
      'San Jose to Hawaii \u2014 5 Hours',
      'San Jose to Las Vegas \u2014 1.3 Hours',
      'San Jose to New York \u2014 5 Hours',
      'San Jose to Cabo \u2014 3 Hours',
      'San Jose to Aspen \u2014 2.2 Hours',
      'Anywhere You Need to Be'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 60;

    function typeLoop() {
      var current = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 30;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 60;
      }

      if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }
    setTimeout(typeLoop, 1000);
  }

  // ─── Gallery Lightbox ──────────────────────────────────
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var lightbox = document.getElementById('lightbox');
      var lbImg = document.getElementById('lightbox-img');
      var lbCaption = document.getElementById('lightbox-caption');
      if (lightbox && lbImg) {
        var galleryImg = this.querySelector('.gallery-img');
        // Get the background-image URL from computed style (works regardless of how it was set)
        var computedBg = window.getComputedStyle(galleryImg).backgroundImage;
        lbImg.style.backgroundImage = computedBg;
        lbImg.style.backgroundSize = 'cover';
        lbImg.style.backgroundPosition = 'center';
        if (lbCaption) lbCaption.textContent = this.getAttribute('data-caption') || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── Scroll Progress Bar ───────────────────────────────
  var progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

});
