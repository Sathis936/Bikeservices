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

  // ==========================================================================
  // Rent o Ride - Authentication & Navbar Session Manager
  // ==========================================================================
  window.RentORideAuth = {
    STORAGE_KEY: 'rentoride_current_user',

    getUser: function () {
      try {
        const u = localStorage.getItem(this.STORAGE_KEY);
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    },

    isLoggedIn: function () {
      return Boolean(this.getUser());
    },

    login: function (userData, redirectUrl = 'customer-dashboard.html') {
      const user = {
        name: (userData && userData.name) || 'Alex Vance',
        email: (userData && userData.email) || 'alex.vance@example.com',
        role: (userData && userData.role) || 'customer',
        avatar: (userData && userData.avatar) || 'assets/images/testimonials/avatar-1.svg',
        phone: (userData && userData.phone) || '+1 (555) 019-2834',
        joinedDate: 'June 2024',
        licenseNo: 'DL-US-9482910-CA',
        licenseVerified: true
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      if (window.RentORideToast) {
        window.RentORideToast.show('Welcome Back!', 'Signed in successfully as ' + user.name, 'success');
      }
      this.syncNavbar();
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      }
    },

    logout: function (redirectUrl = 'index.html') {
      localStorage.removeItem(this.STORAGE_KEY);
      if (window.RentORideToast) {
        window.RentORideToast.show('Signed Out', 'You have been logged out successfully.', 'info');
      }
      this.syncNavbar();
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 500);
    },

    syncNavbar: function () {
      const user = this.getUser();
      const isLogged = Boolean(user);

      // 1. Sync Desktop Navbar Actions (.navbar-actions)
      document.querySelectorAll('.site-header .navbar-actions').forEach(actionsContainer => {
        // Manage Dashboard Button
        let dashBtn = actionsContainer.querySelector('.nav-dashboard-btn');
        let loginBtn = actionsContainer.querySelector('.nav-login-btn');

        if (isLogged) {
          if (!dashBtn) {
            dashBtn = document.createElement('a');
            dashBtn.href = 'customer-dashboard.html';
            dashBtn.className = 'btn btn-sm btn-primary nav-dashboard-btn d-none d-sm-inline-flex align-items-center gap-1';
            dashBtn.innerHTML = '<i class="bi bi-speedometer2"></i> Dashboard';
            actionsContainer.insertBefore(dashBtn, actionsContainer.firstChild);
          } else {
            dashBtn.style.display = '';
          }
          if (loginBtn) loginBtn.style.display = 'none';
        } else {
          if (dashBtn) dashBtn.style.display = 'none';
          if (!loginBtn) {
            loginBtn = document.createElement('a');
            loginBtn.href = 'login.html';
            loginBtn.className = 'btn btn-sm btn-primary nav-login-btn d-none d-sm-inline-flex align-items-center gap-1';
            loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Sign In';
            actionsContainer.insertBefore(loginBtn, actionsContainer.firstChild);
          } else {
            loginBtn.className = 'btn btn-sm btn-primary nav-login-btn d-none d-sm-inline-flex align-items-center gap-1';
            loginBtn.style.display = '';
          }
        }

        // Manage Account Menu Dropdown (.account-menu)
        const accountMenu = actionsContainer.querySelector('.account-menu');
        if (accountMenu) {
          if (isLogged) {
            accountMenu.innerHTML = `
              <li>
                <div class="px-3 py-2 border-bottom">
                  <div class="fw-bold text-dark small text-truncate">${user.name}</div>
                  <div class="text-muted" style="font-size: 0.75rem;">${user.email}</div>
                </div>
              </li>
              <li><a class="dropdown-item py-2 fw-semibold text-primary" href="customer-dashboard.html"><i class="bi bi-speedometer2 me-2"></i> Customer Dashboard</a></li>
              <li><a class="dropdown-item py-2" href="active-rental.html"><i class="bi bi-lightning-charge-fill me-2 text-warning"></i> Active Ride</a></li>
              <li><a class="dropdown-item py-2" href="my-bookings.html"><i class="bi bi-calendar2-check me-2 text-success"></i> My Bookings</a></li>
              <li><a class="dropdown-item py-2" href="profile.html"><i class="bi bi-person-badge me-2 text-info"></i> Profile &amp; License</a></li>
              <li><hr class="dropdown-divider my-1"></li>
              <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="window.RentORideAuth.logout()"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
            `;
          } else {
            accountMenu.innerHTML = `
              <li><h6 class="dropdown-header fw-bold small text-uppercase">My Account</h6></li>
              <li><a class="dropdown-item py-2" href="login.html"><i class="bi bi-box-arrow-in-right me-2 text-primary"></i> Sign In</a></li>
              <li><a class="dropdown-item py-2" href="register.html"><i class="bi bi-person-plus me-2 text-success"></i> Create Account</a></li>
              <li><hr class="dropdown-divider my-1"></li>
              <li><a class="dropdown-item py-2 text-muted small" href="admin-dashboard.html"><i class="bi bi-shield-lock me-2"></i> Admin Portal</a></li>
            `;
          }
        }
      });

      // 2. Sync Mobile Offcanvas Menu (#mobileMenuOffcanvas)
      const offcanvas = document.getElementById('mobileMenuOffcanvas');
      if (offcanvas) {
        const offcanvasBody = offcanvas.querySelector('.offcanvas-body');
        if (offcanvasBody) {
          let authBlock = offcanvasBody.querySelector('.offcanvas-auth-block');
          if (!authBlock) {
            authBlock = document.createElement('div');
            authBlock.className = 'offcanvas-auth-block pt-3 border-top d-grid gap-2 mt-auto';
            offcanvasBody.appendChild(authBlock);
          }

          if (isLogged) {
            authBlock.innerHTML = `
              <div class="card bg-light border-0 p-3 mb-2 rounded-3">
                <div class="d-flex align-items-center gap-2">
                  <img src="${user.avatar}" class="rounded-circle" width="36" height="36" alt="${user.name}">
                  <div class="overflow-hidden">
                    <div class="fw-bold small text-dark text-truncate">${user.name}</div>
                    <div class="text-muted" style="font-size: 0.725rem;">${user.email}</div>
                  </div>
                </div>
              </div>
              <a href="customer-dashboard.html" class="btn btn-primary text-start"><i class="bi bi-speedometer2 me-2"></i> Customer Dashboard</a>
              <a href="active-rental.html" class="btn btn-outline-primary text-start"><i class="bi bi-lightning-charge me-2"></i> Active Ride</a>
              <a href="profile.html" class="btn btn-outline-secondary text-start"><i class="bi bi-person-badge me-2"></i> Profile &amp; License</a>
              <button type="button" class="btn btn-outline-danger text-start" onclick="window.RentORideAuth.logout()"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</button>
            `;
          } else {
            authBlock.innerHTML = `
              <a href="login.html" class="btn btn-outline-primary"><i class="bi bi-box-arrow-in-right me-1"></i> Sign In</a>
              <a href="register.html" class="btn btn-primary"><i class="bi bi-person-plus me-1"></i> Create Account</a>
            `;
          }
        }
      }

      // 3. Sync Dashboard Sidebar User Info
      document.querySelectorAll('.dashboard-sidebar .sidebar-footer').forEach(footer => {
        if (isLogged) {
          footer.innerHTML = `
            <div class="d-flex align-items-center gap-3">
              <img src="${user.avatar}" class="rounded-circle" width="40" height="40" alt="${user.name}">
              <div class="overflow-hidden">
                <div class="fw-bold small text-truncate text-white">${user.name}</div>
                <div class="text-muted" style="font-size: 0.725rem;">Verified Rider</div>
              </div>
              <a href="javascript:void(0)" onclick="window.RentORideAuth.logout()" class="ms-auto text-danger" title="Logout"><i class="bi bi-box-arrow-right fs-5"></i></a>
            </div>
          `;
        }
      });
    }
  };

  const initTheme = () => {
    window.RentORideTheme.updateIcons();
    window.RentORideTheme.initFloatingWidget();
    window.RentORideTheme.initParallax();
    window.RentORideAuth.syncNavbar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Global event delegation: works reliably across all pages, dynamic headers, offcanvas, and dashboards
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle-btn');
    if (themeBtn) {
      e.preventDefault();
      window.RentORideTheme.toggleTheme();
      return;
    }

    const rtlBtn = e.target.closest('.rtl-toggle-btn');
    if (rtlBtn) {
      e.preventDefault();
      window.RentORideTheme.toggleDir();
      return;
    }
  });
})();

