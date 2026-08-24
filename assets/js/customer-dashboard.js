/**
 * Rent o Ride - Customer Dashboard
 * Availability browsing, quick booking, active rental management,
 * extensions, and downloadable receipts/agreements.
 */

(function () {
  'use strict';

  const BOOKINGS_KEY = 'rentoride_bookings';
  const FLEET = (window.RentORideBooking && window.RentORideBooking.fleet) || [];

  const STATUS_OVERRIDE = {
    'scooter-3': 'On Rent',
    'scooter-5': 'Maintenance'
  };

  const DAY_MS = 24 * 60 * 60 * 1000;

  const todayISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  const addDays = (iso, n) => {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  const daysBetween = (a, b) => Math.max(1, Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / DAY_MS));

  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const money = (n) => '₹' + Math.round(n);

  const getStatus = (id) => STATUS_OVERRIDE[id] || 'Available';

  const loadBookings = () => {
    try {
      return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
    } catch (e) {
      return [];
    }
  };

  const saveBookings = (list) => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));

  const priceOf = (scooterId) => {
    const s = FLEET.find(f => f.id === scooterId);
    return s ? s.pricePerDay : 35;
  };

  const seedBookings = () => {
    if (localStorage.getItem(BOOKINGS_KEY)) return;
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const iso = (offset) => {
      const d = new Date(t);
      d.setDate(d.getDate() + offset);
      return d.toISOString().split('T')[0];
    };
    saveBookings([
      {
        id: 'BK-829104',
        scooterId: 'scooter-2',
        scooterName: 'Niu NQi GT Pro',
        scooterImage: 'assets/images/niqi.jpg',
        station: 'Downtown Hub (Station 1)',
        pickupDate: iso(0),
        returnDate: iso(2),
        totalAmount: '₹84',
        status: 'Active',
        bookedAt: new Date().toISOString()
      },
      {
        id: 'BK-741920',
        scooterId: 'scooter-1',
        scooterName: 'Vespa Primavera 150',
        scooterImage: 'assets/images/vispa.jpg',
        station: 'Beachfront Promenade (Station 3)',
        pickupDate: iso(-19),
        returnDate: iso(-17),
        totalAmount: '₹70',
        status: 'Completed',
        bookedAt: new Date(Date.now() - 20 * DAY_MS).toISOString()
      },
      {
        id: 'BK-618293',
        scooterId: 'scooter-3',
        scooterName: 'Honda PCX 160',
        scooterImage: 'assets/images/honda pcx 160.jpg',
        station: 'Airport Express Hub (Station 2)',
        pickupDate: iso(-41),
        returnDate: iso(-38),
        totalAmount: '₹144',
        status: 'Completed',
        bookedAt: new Date(Date.now() - 42 * DAY_MS).toISOString()
      }
    ]);
  };

  const el = (id) => document.getElementById(id);

  const toast = (title, msg, type) => {
    if (window.RentORideToast) window.RentORideToast.show(title, msg, type || 'success');
  };

  let bookings = [];

  const normalize = () => {
    const t = todayISO();
    let changed = false;
    bookings.forEach(b => {
      if (b.status !== 'Completed' && b.returnDate < t) {
        b.status = 'Completed';
        changed = true;
      } else if (b.status !== 'Completed' && b.pickupDate <= t && b.returnDate >= t && b.status !== 'Active') {
        b.status = 'Active';
        changed = true;
      }
    });
    if (changed) saveBookings(bookings);
  };

  const getActive = () => bookings.find(b => b.status === 'Active' && b.returnDate >= todayISO()) || null;

  const renderStats = () => {
    const active = getActive();
    const spent = bookings.reduce((sum, b) => sum + parseFloat(String(b.totalAmount).replace(/[₹$]/g, '') || 0), 0);
    const pts = Math.floor(spent);
    el('statActive').textContent = (active ? 1 : 0) + ' Live';
    el('statActiveNote').innerHTML = active
      ? '<i class="bi bi-activity"></i> In Progress'
      : '<i class="bi bi-moon"></i> No live ride';
    el('statTrips').textContent = bookings.length + ' Trips';
    el('statPoints').textContent = pts + ' Pts';
    el('statPoints').nextElementSibling.textContent = '₹' + (pts / 10) + ' redemption value';
    el('statSpent').textContent = money(spent);
    el('statAvg').textContent = 'Average ' + (bookings.length ? money(spent / bookings.length) : '-') + '/ride';
    const sideBadge = el('sideActiveBadge');
    if (sideBadge) sideBadge.style.display = active ? '' : 'none';
  };

  const renderBanner = () => {
    const host = el('liveBannerHost');
    const active = getActive();
    if (!active) {
      host.innerHTML = `
        <div class="card border rounded-4 p-4 bg-white shadow-sm mb-4 text-center">
          <p class="text-muted mb-2">No live ride right now.</p>
          <button class="btn btn-primary btn-sm" data-goto-tab="tab-book"><i class="bi bi-plus-lg me-1"></i> Start a New Booking</button>
        </div>`;
      return;
    }
    host.innerHTML = `
      <div class="card border rounded-4 p-4 bg-primary text-white mb-4 shadow-sm">
        <div class="row align-items-center gy-3">
          <div class="col-md-8">
            <span class="badge bg-white text-primary rounded-pill px-3 py-1 fw-bold mb-2">LIVE TRIP #${active.id.replace('BK-', '')}</span>
            <h4 class="fw-bold text-white mb-1">${active.scooterName}</h4>
            <p class="text-white-50 mb-0 small"><i class="bi bi-geo-alt me-1"></i> Picked up: ${fmtDate(active.pickupDate)} &bull; Return by: ${fmtDate(active.returnDate)}, 08:00 PM</p>
          </div>
          <div class="col-md-4 text-md-end">
            <button class="btn btn-secondary-accent" data-goto-tab="tab-rentals"><i class="bi bi-phone me-1"></i> Manage Ride</button>
          </div>
        </div>
      </div>`;
  };

  const renderRecent = () => {
    const body = el('recentBookingsBody');
    const rows = bookings.slice(0, 4).map(b => `
      <tr>
        <td class="fw-bold">#${b.id}</td>
        <td>${b.scooterName}</td>
        <td>${fmtDate(b.pickupDate)} - ${fmtDate(b.returnDate)}</td>
        <td class="fw-bold">${b.totalAmount}</td>
        <td><span class="badge ${b.status === 'Active' ? 'bg-success-soft' : b.status === 'Confirmed' ? 'bg-warning-soft' : 'bg-info-soft'}">${b.status}</span></td>
      </tr>`).join('');
    body.innerHTML = rows || '<tr><td colspan="5" class="text-muted text-center py-4">No bookings yet.</td></tr>';
  };

  const statusBadge = (status) => {
    const map = {
      'Available': 'bg-success-soft',
      'On Rent': 'bg-warning-soft',
      'Maintenance': 'bg-danger-soft'
    };
    return '<span class="badge ' + (map[status] || 'bg-light text-dark') + '">' + status + '</span>';
  };

  const renderFleetGrid = () => {
    const grid = el('fleetAvailabilityGrid');
    grid.innerHTML = FLEET.map(item => {
      const st = getStatus(item.id);
      const available = st === 'Available';
      return `
        <div class="col-lg-4 col-md-6">
          <div class="card h-100 border rounded-4 overflow-hidden bg-white shadow-sm">
            <div class="position-relative">
              <img src="${item.image}" alt="${item.name}" class="w-100 fleet-status-img">
              <span class="position-absolute top-0 start-0 m-3">${statusBadge(st)}</span>
            </div>
            <div class="card-body p-4 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <h6 class="fw-bold mb-0">${item.name}</h6>
                <span class="text-primary fw-bold">${'₹' + item.pricePerDay}<small class="text-muted fw-normal">/day</small></span>
              </div>
              <p class="text-muted small mb-3">${item.category} &bull; ${item.transmission} &bull; ${item.topSpeed}</p>
              <button class="btn btn-sm mt-auto ${available ? 'btn-outline-primary' : 'btn-outline-secondary'}" data-book-model="${item.id}" ${available ? '' : 'disabled'}>
                ${available ? '<i class="bi bi-calendar-plus me-1"></i> Book This Model' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
    const avail = FLEET.filter(f => getStatus(f.id) === 'Available').length;
    el('availCountBadge').innerHTML = '<i class="bi bi-check-circle me-1"></i> ' + avail + ' of ' + FLEET.length + ' models available now';
  };

  const selectedModel = () => FLEET.find(f => f.id === el('qbkModel').value) || FLEET[0];

  const updateBookPreview = () => {
    const s = selectedModel();
    const days = Math.min(30, Math.max(1, parseInt(el('qbkDays').value, 10) || 1));
    const pickup = el('qbkPickup').value || todayISO();
    const total = s.pricePerDay * days;
    el('qbkTotal').textContent = money(total);
    el('qbkPreviewCard').innerHTML = `
      <img src="${s.image}" alt="${s.name}" class="w-100 fleet-status-img">
      <div class="p-4">
        <h6 class="fw-bold mb-1">${s.name}</h6>
        <p class="text-muted small mb-2">₹${s.pricePerDay}/day &bull; Deposit ₹${s.deposit} refundable</p>
        <div class="small text-muted"><i class="bi bi-calendar3 me-1"></i> ${fmtDate(pickup)} &rarr; ${fmtDate(addDays(pickup, days))} (${days} day${days > 1 ? 's' : ''})</div>
      </div>`;
  };

  const initBookForm = () => {
    const sel = el('qbkModel');
    sel.innerHTML = FLEET.map(f => {
      const st = getStatus(f.id);
      return '<option value="' + f.id + '"' + (st === 'Available' ? '' : ' disabled') + '>' +
        f.name + (st === 'Available' ? '' : ' (' + st + ')') + '</option>';
    }).join('');
    const pickup = el('qbkPickup');
    pickup.value = todayISO();
    pickup.min = todayISO();
    ['qbkModel', 'qbkPickup', 'qbkDays'].forEach(id => el(id).addEventListener('change', updateBookPreview));
    el('qbkDaysMinus').addEventListener('click', () => { el('qbkDays').value = Math.max(1, (parseInt(el('qbkDays').value, 10) || 1) - 1); updateBookPreview(); });
    el('qbkDaysPlus').addEventListener('click', () => { el('qbkDays').value = Math.min(30, (parseInt(el('qbkDays').value, 10) || 1) + 1); updateBookPreview(); });
    updateBookPreview();

    el('quickBookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const s = selectedModel();
      const days = Math.min(30, Math.max(1, parseInt(el('qbkDays').value, 10)));
      const pickup = el('qbkPickup').value;
      const booking = {
        id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
        scooterId: s.id,
        scooterName: s.name,
        scooterImage: s.image,
        station: el('qbkStation').value,
        pickupDate: pickup,
        returnDate: addDays(pickup, days),
        totalAmount: '₹' + (s.pricePerDay * days),
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
      };
      bookings.unshift(booking);
      saveBookings(bookings);
      form.classList.remove('was-validated');
      normalize();
      renderAll();
      gotoTab('tab-rentals');
      toast('Booking Confirmed!', booking.scooterName + ' reserved for ' + fmtDate(booking.pickupDate) + '.', 'success');
    });
  };

  const gotoTab = (tabId) => {
    const trigger = document.querySelector('[data-bs-target="#' + tabId + '"]');
    if (trigger && window.bootstrap) new bootstrap.Tab(trigger).show();
  };

  const renderActiveRental = () => {
    const host = el('activeRentalHost');
    const b = getActive();
    if (!b) {
      host.innerHTML = `
        <div class="card border rounded-4 p-5 bg-white shadow-sm text-center">
          <i class="bi bi-inbox display-4 text-muted d-block mb-3"></i>
          <h6 class="fw-bold">No active rental right now</h6>
          <p class="text-muted small mb-3">Book a model and your live trip will appear here with its return deadline.</p>
          <button class="btn btn-primary mx-auto" data-goto-tab="tab-book"><i class="bi bi-calendar-plus me-1"></i> Book a Rental</button>
        </div>`;
      return;
    }

    const rate = priceOf(b.scooterId);
    const totalDays = daysBetween(b.pickupDate, b.returnDate);
    const elapsed = daysBetween(b.pickupDate, todayISO());
    const pct = Math.min(100, Math.round((elapsed / totalDays) * 100));
    const left = daysBetween(todayISO(), b.returnDate);
    const urgent = left <= 1;

    host.innerHTML = `
      <div class="card border rounded-4 overflow-hidden bg-white shadow-sm">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${b.scooterImage}" alt="${b.scooterName}" class="w-100 h-100 fleet-status-img">
          </div>
          <div class="col-md-8 p-4">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <div>
                <span class="badge bg-success-soft mb-1"><i class="bi bi-lightning-charge-fill me-1"></i> Live Trip #${b.id}</span>
                <h5 class="fw-bold mb-0">${b.scooterName}</h5>
              </div>
              <div class="text-end">
                <div class="small text-muted text-uppercase fw-bold">Return Deadline</div>
                <div class="fs-5 fw-bold ${urgent ? 'text-danger' : 'text-primary'}">${fmtDate(b.returnDate)} - 08:00 PM</div>
                <span class="badge ${urgent ? 'bg-danger-soft' : 'bg-primary-soft'}">${left === 0 ? 'Due today!' : left + ' day' + (left > 1 ? 's' : '') + ' remaining'}</span>
              </div>
            </div>
            <p class="text-muted small mb-2"><i class="bi bi-geo-alt me-1"></i> ${b.station || 'Downtown Hub (Station 1)'} &bull; Picked up ${fmtDate(b.pickupDate)}</p>
            <div class="progress mb-2" style="height: 8px;">
              <div class="progress-bar ${urgent ? 'bg-danger' : ''}" style="width: ${pct}%;" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <small class="text-muted">Day ${Math.min(elapsed + 1, totalDays)} of ${totalDays} &bull; Running total ${b.totalAmount}</small>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" data-extend="1"><i class="bi bi-plus-circle me-1"></i> Extend +1 Day (+${money(rate)})</button>
                <button class="btn btn-sm btn-outline-primary" data-extend="3"><i class="bi bi-plus-circle-fill me-1"></i> Extend +3 Days (+${money(rate * 3)})</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  };

  const docShell = (title, booking, inner) => {
    const rate = priceOf(booking.scooterId);
    const days = daysBetween(booking.pickupDate, booking.returnDate);
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title} ${booking.id} | Rent o Ride</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#1F2937;margin:0;padding:40px;background:#F8FAFC;}
  .doc{max-width:720px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:40px;}
  .brand{font-size:24px;font-weight:bold;color:#EA580C;letter-spacing:1px;}
  .brand span{color:#0EA5E9;}
  .muted{color:#6B7280;font-size:13px;}
  h1{font-size:22px;margin:24px 0 8px;}
  table{width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;}
  th,td{border:1px solid #E5E7EB;padding:10px 12px;text-align:left;}
  th{background:#FFF7ED;width:38%;}
  .total td{font-weight:bold;background:#FFEDD5;font-size:16px;}
  ol li{margin-bottom:8px;font-size:13px;color:#374151;}
  .sign{display:flex;gap:60px;margin-top:48px;}
  .sign div{flex:1;border-top:1px solid #9CA3AF;padding-top:6px;font-size:12px;color:#6B7280;}
  .foot{margin-top:32px;font-size:11px;color:#9CA3AF;text-align:center;}
</style>
</head>
<body>
<div class="doc">
  <div class="brand">RENT O <span>RIDE</span></div>
  <div class="muted">Scooter &amp; Moped Rental Service &bull; support@rentoride.com &bull; +1 (800) 555-MOTO</div>
  <h1>${title} - #${booking.id}</h1>
  <div class="muted">Issued ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
  <table>
    <tr><th>Scooter Model</th><td>${booking.scooterName}</td></tr>
    <tr><th>Pickup Station</th><td>${booking.station || 'Downtown Hub (Station 1)'}</td></tr>
    <tr><th>Pickup Date</th><td>${fmtDate(booking.pickupDate)}</td></tr>
    <tr><th>Return Deadline</th><td>${fmtDate(booking.returnDate)} - 08:00 PM</td></tr>
    <tr><th>Duration</th><td>${days} day${days > 1 ? 's' : ''}</td></tr>
    <tr><th>Daily Rate</th><td>₹${rate}.00</td></tr>
    ${inner}
  </table>
  <div class="foot">This document was generated automatically by the Rent o Ride customer portal. For questions contact support@rentoride.com.</div>
</div>
</body>
</html>`;
  };

  const receiptDoc = (b) => {
    const rate = priceOf(b.scooterId);
    const days = daysBetween(b.pickupDate, b.returnDate);
    const deposit = (FLEET.find(f => f.id === b.scooterId) || {}).deposit || 150;
    const inner = `
    <tr><th>Rental Charge</th><td>₹${rate * days}.00 (${days} x ₹${rate})</td></tr>
    <tr><th>Security Deposit</th><td>₹${deposit}.00 (refundable)</td></tr>
    <tr class="total"><th>Total Paid</th><td>${b.totalAmount}.00</td></tr>
    <tr><th>Status</th><td>${b.status}</td></tr>`;
    return docShell('Rental Receipt', b, inner);
  };

  const agreementDoc = (b) => {
    const inner = `
    <tr><th>Agreement Type</th><td>Short-Term Scooter Rental Agreement</td></tr>
    <tr><th>Renter</th><td>Alex Vance (Verified Rider)</td></tr>
    <tr class="total"><th>Agreed Total</th><td>${b.totalAmount}.00</td></tr>`;
    let html = docShell('Rental Agreement', b, inner);
    const clauses = `
    <h1 style="font-size:16px;margin-top:28px;">Key Terms</h1>
    <ol>
      <li>The renter agrees to operate the scooter in compliance with all local traffic laws and holds a valid license.</li>
      <li>Helmets must be worn at all times while the vehicle is in motion; passenger helmet required for a second rider.</li>
      <li>The vehicle must be returned by the deadline above to the same station, fueled/charged to pickup level, in undamaged condition.</li>
      <li>Late returns are billed at the daily rate plus a ₹150 administrative fee per commenced late day.</li>
      <li>The refundable security deposit is released within 5 business days after a satisfactory return inspection.</li>
      <li>Theft, off-road use, subletting, or riding under the influence voids insurance coverage and incurs full liability.</li>
    </ol>
    <div class="sign">
      <div>Renter Signature / Date</div>
      <div>Rent o Ride Representative / Date</div>
    </div>`;
    return html.replace('<div class="foot">', clauses + '<div class="foot">');
  };

  const downloadDoc = (bookingId, kind) => {
    const b = bookings.find(x => x.id === bookingId);
    if (!b) return;
    const html = kind === 'receipt' ? receiptDoc(b) : agreementDoc(b);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (kind === 'receipt' ? 'Receipt-' : 'Agreement-') + b.id + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast((kind === 'receipt' ? 'Receipt' : 'Agreement') + ' Downloaded', 'Saved as ' + a.download, 'info');
  };

  const renderPastRentals = () => {
    const body = el('pastRentalsBody');
    const past = bookings.filter(b => b.status === 'Completed');
    body.innerHTML = past.length
      ? past.map(b => `
        <tr>
          <td class="fw-bold">#${b.id}</td>
          <td><div class="d-flex align-items-center gap-2"><img src="${b.scooterImage}" alt="" width="44" height="34" style="object-fit:cover;border-radius:6px;"> ${b.scooterName}</div></td>
          <td>${fmtDate(b.pickupDate)} - ${fmtDate(b.returnDate)}</td>
          <td class="fw-bold">${b.totalAmount}</td>
          <td class="text-end">
            <div class="d-inline-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" data-doc="receipt" data-id="${b.id}"><i class="bi bi-download me-1"></i> Receipt</button>
              <button class="btn btn-sm btn-outline-secondary" data-doc="agreement" data-id="${b.id}"><i class="bi bi-file-earmark-text me-1"></i> Agreement</button>
            </div>
          </td>
        </tr>`).join('')
      : '<tr><td colspan="5" class="text-muted text-center py-4">No completed rentals yet - receipts appear here after your first trip.</td></tr>';
  };

  const renderAll = () => {
    bookings = loadBookings();
    normalize();
    bookings = loadBookings();
    renderStats();
    renderBanner();
    renderRecent();
    renderFleetGrid();
    renderActiveRental();
    renderPastRentals();
    updateBookPreview();
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('fleetAvailabilityGrid')) return;
    seedBookings();

    document.querySelectorAll('[data-dash-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        gotoTab(link.getAttribute('data-dash-tab'));
      });
    });

    document.addEventListener('click', (e) => {
      const gotoBtn = e.target.closest('[data-goto-tab]');
      if (gotoBtn) { gotoTab(gotoBtn.getAttribute('data-goto-tab')); return; }

      const bookBtn = e.target.closest('[data-book-model]');
      if (bookBtn && !bookBtn.disabled) {
        el('qbkModel').value = bookBtn.getAttribute('data-book-model');
        updateBookPreview();
        gotoTab('tab-book');
        return;
      }

      const extBtn = e.target.closest('[data-extend]');
      if (extBtn) {
        const b = getActive();
        if (!b) return;
        const days = parseInt(extBtn.getAttribute('data-extend'), 10);
        if (daysBetween(b.pickupDate, addDays(b.returnDate, days)) > 60) {
          toast('Extension Limit', 'Maximum total rental length is 60 days.', 'warning');
          return;
        }
        const cost = priceOf(b.scooterId) * days;
        b.returnDate = addDays(b.returnDate, days);
        b.totalAmount = '₹' + (parseFloat(String(b.totalAmount).replace(/[₹$]/g, '')) + cost);
        saveBookings(bookings);
        renderAll();
        toast('Rental Extended!', 'New return deadline: ' + fmtDate(b.returnDate) + ' 08:00 PM (+' + money(cost) + ').', 'success');
        return;
      }

      const docBtn = e.target.closest('[data-doc]');
      if (docBtn) downloadDoc(docBtn.getAttribute('data-id'), docBtn.getAttribute('data-doc'));
    });

    renderAll();
    initBookForm();
  });
})();
