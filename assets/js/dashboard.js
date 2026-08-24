/**
 * Rent o Ride - Dashboards & Interactive UI (Customer & Admin)
 */

(function () {
  'use strict';

  window.RentORideDashboard = {
    initCharts: function () {
      const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
      const textColor = isDark ? '#94A3B8' : '#6B7280';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

      // 1. Admin Revenue Line Chart
      const revChartEl = document.getElementById('adminRevenueChart');
      if (revChartEl && window.Chart) {
        new Chart(revChartEl, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Revenue (₹)',
              data: [12400, 14800, 18200, 21500, 28400, 36200, 42800, 47500, 39200, 31400, 24600, 29800],
              borderColor: '#EA580C',
              backgroundColor: 'rgba(234, 88, 12, 0.12)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: '#EA580C'
            }, {
              label: 'Previous Year (₹)',
              data: [9800, 11200, 13400, 16800, 21000, 27500, 32000, 35400, 29000, 22100, 18500, 21400],
              borderColor: '#0EA5E9',
              borderDash: [5, 5],
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: textColor } }
            },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }

      // 2. Admin Fleet Distribution Chart
      const fleetChartEl = document.getElementById('adminFleetCategoryChart');
      if (fleetChartEl && window.Chart) {
        new Chart(fleetChartEl, {
          type: 'doughnut',
          data: {
            labels: ['City Scooters', 'Electric EV', 'Premium Maxi', 'Adventure'],
            datasets: [{
              data: [42, 35, 18, 15],
              backgroundColor: ['#EA580C', '#0EA5E9', '#F59E0B', '#6366F1'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: textColor } }
            },
            cutout: '70%'
          }
        });
      }

      // 3. Customer Spendings Chart
      const customerSpendEl = document.getElementById('customerSpendingChart');
      if (customerSpendEl && window.Chart) {
        new Chart(customerSpendEl, {
          type: 'bar',
          data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
              label: 'Rental Expenses (₹)',
              data: [120, 210, 185, 340, 290, 175],
              backgroundColor: '#EA580C',
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }
    },

    initActiveRentalControls: function () {
      const lockBtn = document.getElementById('toggleDigitalLockBtn');
      const lockStatusText = document.getElementById('activeLockStatus');
      const lockIcon = document.getElementById('activeLockIcon');

      if (lockBtn && lockStatusText && lockIcon) {
        let isLocked = false;
        lockBtn.addEventListener('click', () => {
          isLocked = !isLocked;
          if (isLocked) {
            lockStatusText.textContent = 'Vehicle Locked';
            lockStatusText.className = 'badge bg-danger-soft';
            lockIcon.className = 'bi bi-lock-fill text-danger fs-3';
            lockBtn.textContent = 'Unlock Scooter';
            lockBtn.className = 'btn btn-success w-100';
            window.RentORideToast?.show('Digital Key', 'Scooter engine locked & immobilized.', 'warning');
          } else {
            lockStatusText.textContent = 'Vehicle Unlocked & Ready';
            lockStatusText.className = 'badge bg-success-soft';
            lockIcon.className = 'bi bi-unlock-fill text-success fs-3';
            lockBtn.textContent = 'Lock Vehicle';
            lockBtn.className = 'btn btn-danger w-100';
            window.RentORideToast?.show('Digital Key', 'Scooter unlocked. Ride safely!', 'success');
          }
        });
      }
    },

    initSidebarToggle: function () {
      const toggleBtns = document.querySelectorAll('.dashboard-sidebar-toggle, .dashboard-sidebar-close');
      const sidebar = document.querySelector('.dashboard-sidebar');
      const backdrop = document.querySelector('.sidebar-backdrop');

      const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
      };

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (sidebar) {
            sidebar.classList.toggle('show');
            if (backdrop) backdrop.classList.toggle('show', sidebar.classList.contains('show'));
          }
        });
      });

      if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
      }

      // On mobile screens, close sidebar when clicking internal links
      document.querySelectorAll('.dashboard-sidebar .sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 992) {
            closeSidebar();
          }
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.RentORideDashboard.initCharts();
    window.RentORideDashboard.initActiveRentalControls();
    window.RentORideDashboard.initSidebarToggle();
  });
})();
