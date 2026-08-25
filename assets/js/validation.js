/**
 * Rent o Ride - Form Validations & Toast System
 */

(function () {
  'use strict';

  window.RentORideToast = {
    show: function (title, message, type = 'primary') {
      let container = document.getElementById('rentorideToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'rentorideToastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }

      const toastId = 'toast_' + Date.now();
      const iconMap = {
        primary: 'bi-info-circle-fill text-primary',
        success: 'bi-check-circle-fill text-success',
        warning: 'bi-exclamation-triangle-fill text-warning',
        danger: 'bi-x-circle-fill text-danger',
        info: 'bi-bell-fill text-info'
      };
      const icon = iconMap[type] || iconMap.primary;

      const toastEl = document.createElement('div');
      toastEl.className = 'toast show shadow-lg border-0';
      toastEl.id = toastId;
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', 'assertive');
      toastEl.setAttribute('aria-atomic', 'true');
      toastEl.innerHTML = `
        <div class="toast-header">
          <i class="bi ${icon} me-2 fs-5"></i>
          <strong class="me-auto">${title}</strong>
          <small class="text-muted">Just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      `;

      container.appendChild(toastEl);

      const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
      bsToast.show();

      toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Bootstrap standard form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          window.RentORideToast.show('Form Incomplete', 'Please fill in all required fields properly.', 'warning');
        } else {
          event.preventDefault();
          const actionMsg = form.getAttribute('data-success-msg') || 'Action completed successfully!';
          const redirectUrl = form.getAttribute('data-redirect');

          // Check if this is an Auth Form (Login / Register / Profile)
          const isLoginForm = form.closest('.auth-section') && form.querySelector('button[type="submit"]')?.textContent.includes('Sign In');
          const isRegisterForm = form.closest('.auth-section') && (form.querySelector('button[type="submit"]')?.textContent.includes('Create') || form.closest('.auth-register-wrapper'));
          const isProfileForm = form.closest('.dashboard-content') && form.querySelector('button[type="submit"]')?.textContent.includes('Profile');

          if (isLoginForm || isRegisterForm) {
            const emailInput = form.querySelector('input[type="email"]');
            const firstNameInput = form.querySelector('input[placeholder*="Alex"], input[name="firstName"]');
            const lastNameInput = form.querySelector('input[placeholder*="Vance"], input[name="lastName"]');
            const email = emailInput ? emailInput.value : 'alex.vance@example.com';
            let name = 'Alex Vance';
            if (firstNameInput && firstNameInput.value) {
              name = (firstNameInput.value + ' ' + (lastNameInput ? lastNameInput.value : '')).trim();
            } else if (email) {
              name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }

            if (window.RentORideAuth) {
              window.RentORideAuth.login({ email, name }, redirectUrl || 'customer-dashboard.html');
              return;
            }
          } else if (isProfileForm) {
            const inputs = form.querySelectorAll('input');
            const firstName = inputs[0] ? inputs[0].value : 'Alex';
            const lastName = inputs[1] ? inputs[1].value : 'Vance';
            const email = inputs[2] ? inputs[2].value : 'alex.vance@example.com';
            const phone = inputs[3] ? inputs[3].value : '+1 (555) 019-2834';

            const user = {
              name: (firstName + ' ' + lastName).trim() || 'Alex Vance',
              email: email,
              phone: phone,
              role: 'customer',
              avatar: 'assets/images/testimonials/avatar-1.svg',
              joinedDate: 'June 2024',
              licenseNo: 'DL-US-9482910-CA',
              licenseVerified: true
            };
            localStorage.setItem('rentoride_current_user', JSON.stringify(user));
            if (window.RentORideAuth) window.RentORideAuth.syncNavbar();
            window.RentORideToast.show('Profile Updated', 'Your personal details have been saved.', 'success');
            return;
          }

          window.RentORideToast.show('Success', actionMsg, 'success');
          
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 800);
          } else {
            form.reset();
            form.classList.remove('was-validated');
          }
        }
        form.classList.add('was-validated');
      }, false);
    });

    // Password visibility toggle
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-group')?.querySelector('input');
        const icon = btn.querySelector('i');
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            icon?.classList.replace('bi-eye', 'bi-eye-slash');
          } else {
            input.type = 'password';
            icon?.classList.replace('bi-eye-slash', 'bi-eye');
          }
        }
      });
    });
  });
})();
