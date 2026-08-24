/**
 * Rent o Ride - Theme & RTL Engine
 * Handles Dark/Light Mode & LTR/RTL Layout switching with LocalStorage persistence.
 */

(function () {
  'use strict';

  const THEME_KEY = 'rentoride_theme';
  const DIR_KEY = 'rentoride_dir';

  // Apply saved theme immediately before render to avoid flash
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';

  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  document.documentElement.setAttribute('dir', savedDir);
  if (savedTheme === 'dark') {
    document.body?.classList.add('dark-mode');
  }

  window.RentORideTheme = {
    getTheme: () => localStorage.getItem(THEME_KEY) || 'light',
    getDir: () => localStorage.getItem(DIR_KEY) || 'ltr',
    
    setTheme: function (theme) {
      document.documentElement.setAttribute('data-bs-theme', theme);
      if (theme === 'dark') {
        document.body?.classList.add('dark-mode');
      } else {
        document.body?.classList.remove('dark-mode');
      }
      localStorage.setItem(THEME_KEY, theme);
      this.updateIcons();
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    toggleTheme: function () {
      const current = this.getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      this.setTheme(next);
    },

    setDir: function (dir) {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem(DIR_KEY, dir);
      this.updateIcons();
      window.dispatchEvent(new CustomEvent('dirChanged', { detail: { dir } }));
    },

    toggleDir: function () {
      const current = this.getDir();
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      this.setDir(next);
    },

    updateIcons: function () {
      const isDark = this.getTheme() === 'dark';
      const isRtl = this.getDir() === 'rtl';

      document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
        icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
      });

      document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
        btn.textContent = isRtl ? 'LTR' : 'RTL';
      });

      // Update logos if available
      document.querySelectorAll('img.brand-logo-img').forEach(img => {
        img.src = isDark ? 'assets/images/logo-white.svg' : 'assets/images/logo.svg';
      });
    },

    initFloatingWidget: function () {
      if (document.querySelector('.theme-floating-switcher')) return;
      // Skip the floating widget when the page already has in-navbar toggles
      if (document.querySelector('.site-header .theme-toggle-btn, .dashboard-topbar .theme-toggle-btn')) return;
      const widget = document.createElement('div');
      widget.className = 'theme-floating-switcher no-print';
      widget.innerHTML = `
        <button type="button" class="theme-switch-btn theme-toggle-btn" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
          <i class="bi ${this.getTheme() === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}"></i>
        </button>
        <button type="button" class="theme-switch-btn rtl-toggle-btn font-monospace fw-bold" style="font-size:0.75rem;" title="Toggle LTR/RTL Layout" aria-label="Toggle Direction">
          ${this.getDir() === 'rtl' ? 'LTR' : 'RTL'}
        </button>
      `;
      document.body.appendChild(widget);

      widget.querySelector('.theme-toggle-btn').addEventListener('click', () => this.toggleTheme());
      widget.querySelector('.rtl-toggle-btn').addEventListener('click', () => this.toggleDir());
    },

    initParallax: function () {
      const layers = document.querySelectorAll('.hero-parallax-layer');
      if (!layers.length) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let ticking = false;
      const update = () => {
        ticking = false;
        if (window.innerWidth < 768) {
          layers.forEach(el => { el.style.transform = 'none'; });
          return;
        }
        layers.forEach(el => {
          const rect = el.parentElement.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
          el.style.transform = 'translate3d(0, ' + (progress * 110).toFixed(1) + 'px,0)';
        });
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.RentORideTheme.updateIcons();
    window.RentORideTheme.initFloatingWidget();
    window.RentORideTheme.initParallax();

    // Bind any in-page toggles
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.RentORideTheme.toggleTheme();
      });
    });

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.RentORideTheme.toggleDir();
      });
    });
  });
})();
