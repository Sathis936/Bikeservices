/**
 * Rent o Ride - Interactive Booking Engine & Fleet Filter
 */

(function () {
  'use strict';

  // Demo fleet data catalogue
  const FLEET_DATA = [
    {
      id: 'scooter-1',
      name: 'Vespa Primavera 150',
      category: 'City Scooters',
      type: 'classic',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 2,
      pricePerDay: 35,
      pricePerHour: 8,
      rating: 4.9,
      reviewsCount: 128,
      deposit: 150,
      image: 'assets/images/vispa.jpg',
      featured: true,
      available: true,
      topSpeed: '95 km/h',
      mileage: '40 km/l'
    },
    {
      id: 'scooter-2',
      name: 'Niu NQi GT Pro',
      category: 'Electric Scooters',
      type: 'electric',
      transmission: 'Automatic',
      fuel: 'Electric (EV)',
      seats: 2,
      pricePerDay: 42,
      pricePerHour: 9,
      rating: 4.8,
      reviewsCount: 94,
      deposit: 200,
      image: 'assets/images/niqi.jpg',
      featured: true,
      available: true,
      topSpeed: '80 km/h',
      mileage: '90 km Range'
    },
    {
      id: 'scooter-3',
      name: 'Honda PCX 160',
      category: 'Premium Scooters',
      type: 'premium',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 2,
      pricePerDay: 48,
      pricePerHour: 11,
      rating: 5.0,
      reviewsCount: 210,
      deposit: 200,
      image: 'assets/images/honda pcx 160.jpg',
      featured: true,
      available: true,
      topSpeed: '115 km/h',
      mileage: '45 km/l'
    },
    {
      id: 'scooter-4',
      name: 'Yamaha Aerox 155',
      category: 'Premium Scooters',
      type: 'premium',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 2,
      pricePerDay: 45,
      pricePerHour: 10,
      rating: 4.9,
      reviewsCount: 165,
      deposit: 180,
      image: 'assets/images/yamaha.jpg',
      featured: false,
      available: true,
      topSpeed: '120 km/h',
      mileage: '42 km/l'
    },
    {
      id: 'scooter-5',
      name: 'Super Soco CPx',
      category: 'Electric Scooters',
      type: 'electric',
      transmission: 'Automatic',
      fuel: 'Electric (EV)',
      seats: 2,
      pricePerDay: 50,
      pricePerHour: 12,
      rating: 4.9,
      reviewsCount: 88,
      deposit: 220,
      image: 'assets/images/Super Soco CPx.jpg',
      featured: true,
      available: true,
      topSpeed: '90 km/h',
      mileage: '140 km Dual Battery'
    },
    {
      id: 'scooter-6',
      name: 'Piaggio Liberty 125',
      category: 'City Scooters',
      type: 'city',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 2,
      pricePerDay: 30,
      pricePerHour: 7,
      rating: 4.7,
      reviewsCount: 142,
      deposit: 120,
      image: 'assets/images/Piaggio Liberty 125.jpg',
      featured: false,
      available: true,
      topSpeed: '90 km/h',
      mileage: '38 km/l'
    },
    {
      id: 'scooter-7',
      name: 'Honda ADV 160',
      category: 'Adventure Scooters',
      type: 'adventure',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 2,
      pricePerDay: 55,
      pricePerHour: 13,
      rating: 4.95,
      reviewsCount: 175,
      deposit: 250,
      image: 'assets/images/honda adv 160.jpg',
      featured: true,
      available: true,
      topSpeed: '115 km/h',
      mileage: '44 km/l'
    },
    {
      id: 'scooter-8',
      name: 'Kymco Agility Cargo 125',
      category: 'City Scooters',
      type: 'city',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 1,
      pricePerDay: 32,
      pricePerHour: 7,
      rating: 4.8,
      reviewsCount: 112,
      deposit: 120,
      image: 'assets/images/Kymco Agility Cargo 125.jpg',
      featured: false,
      available: true,
      topSpeed: '85 km/h',
      mileage: '36 km/l'
    }
  ];

  const SCOOTER_SPECS = {
    'scooter-1': { engine: '154.8 cc Euro 5', economy: '40.3 km/Liter', tank: '8.0 Liters' },
    'scooter-2': { motor: '3.5 kW Bosch', battery: '2× 48V 29Ah Li-ion', charge: '4.5 hrs' },
    'scooter-3': { engine: '157 cc eSP+', economy: '45.0 km/Liter', tank: '8.0 Liters' },
    'scooter-4': { engine: '155 cc Blue Core', economy: '42.0 km/Liter', tank: '5.5 Liters' },
    'scooter-5': { motor: '4.0 kW Peak', battery: '2× 45Ah Li-ion', charge: '6.0 hrs' },
    'scooter-6': { engine: '124.9 cc i-Get', economy: '47.6 km/Liter', tank: '7.0 Liters' },
    'scooter-7': { engine: '156.9 cc eSP+', economy: '44.5 km/Liter', tank: '7.2 Liters' },
    'scooter-8': { engine: '124.9 cc Euro 5', economy: '36.0 km/Liter', tank: '9.0 Liters' }
  };

  const WISHLIST_KEY = 'rentoride_wishlist';
  const BOOKINGS_KEY = 'rentoride_bookings';

  window.RentORideBooking = {
    fleet: FLEET_DATA,

    getWishlist: function () {
      try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || ['scooter-1', 'scooter-3'];
      } catch (e) {
        return ['scooter-1', 'scooter-3'];
      }
    },

    toggleWishlist: function (scooterId) {
      let list = this.getWishlist();
      const index = list.indexOf(scooterId);
      let added = false;
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(scooterId);
        added = true;
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      this.updateWishlistUI();
      if (window.RentORideToast) {
        window.RentORideToast.show(
          added ? 'Added to Wishlist' : 'Removed from Wishlist',
          added ? 'Vehicle saved to your wishlist.' : 'Vehicle removed from your wishlist.',
          added ? 'success' : 'info'
        );
      }
      return added;
    },

    updateWishlistUI: function () {
      const list = this.getWishlist();
      document.querySelectorAll('.wishlist-count-badge').forEach(b => {
        b.textContent = list.length;
      });
      document.querySelectorAll('[data-scooter-id]').forEach(el => {
        const id = el.getAttribute('data-scooter-id');
        const btn = el.querySelector('.wishlist-btn') || (el.classList.contains('wishlist-btn') ? el : null);
        if (btn) {
          if (list.includes(id)) {
            btn.classList.add('active');
            btn.querySelector('i')?.classList.replace('bi-heart', 'bi-heart-fill');
          } else {
            btn.classList.remove('active');
            btn.querySelector('i')?.classList.replace('bi-heart-fill', 'bi-heart');
          }
        }
      });
    },

    initCalculator: function () {
      const calcForm = document.getElementById('bookingCalculatorForm');
      if (!calcForm) return;

      const scooterSelect = document.getElementById('calcScooter');
      const pickupDate = document.getElementById('calcPickupDate');
      const returnDate = document.getElementById('calcReturnDate');
      const insuranceCheckbox = document.getElementById('calcInsurance');
      const helmetCheckbox = document.getElementById('calcHelmet');
      const deliveryCheckbox = document.getElementById('calcDelivery');
      const voucherInput = document.getElementById('calcVoucher');
      const applyVoucherBtn = document.getElementById('applyVoucherBtn');

      // Price output elements
      const daysCountEl = document.getElementById('calcDaysCount');
      const baseRateEl = document.getElementById('calcBaseRate');
      const addOnsTotalEl = document.getElementById('calcAddOns');
      const depositEl = document.getElementById('calcDeposit');
      const discountEl = document.getElementById('calcDiscount');
      const grandTotalEl = document.getElementById('calcGrandTotal');

      let discountPercent = 0;

      // Set default dates: today & +3 days
      const today = new Date();
      const after3Days = new Date();
      after3Days.setDate(today.getDate() + 3);

      const formatDate = (d) => d.toISOString().split('T')[0];
      if (pickupDate && !pickupDate.value) pickupDate.value = formatDate(today);
      if (returnDate && !returnDate.value) returnDate.value = formatDate(after3Days);

      const calculate = () => {
        const selectedId = scooterSelect ? scooterSelect.value : 'scooter-1';
        const scooter = FLEET_DATA.find(s => s.id === selectedId) || FLEET_DATA[0];

        let start = pickupDate ? new Date(pickupDate.value) : today;
        let end = returnDate ? new Date(returnDate.value) : after3Days;
        
        if (end <= start) {
          end = new Date(start);
          end.setDate(start.getDate() + 1);
          if (returnDate) returnDate.value = formatDate(end);
        }

        const diffTime = Math.abs(end - start);
        const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        const baseTotal = days * scooter.pricePerDay;
        let addOns = 0;
        if (insuranceCheckbox && insuranceCheckbox.checked) addOns += (10 * days);
        if (helmetCheckbox && helmetCheckbox.checked) addOns += (5 * days);
        if (deliveryCheckbox && deliveryCheckbox.checked) addOns += 15; // Flat delivery

        const subtotal = baseTotal + addOns;
        const discountAmount = Math.round(subtotal * (discountPercent / 100));
        const total = subtotal - discountAmount;

        if (daysCountEl) daysCountEl.textContent = days + (days === 1 ? ' Day' : ' Days');
        if (baseRateEl) baseRateEl.textContent = '₹' + baseTotal;
        if (addOnsTotalEl) addOnsTotalEl.textContent = '₹' + addOns;
        if (depositEl) depositEl.textContent = '₹' + scooter.deposit;
        if (discountEl) discountEl.textContent = '-₹' + discountAmount;
        if (grandTotalEl) grandTotalEl.textContent = '₹' + total;
      };

      calcForm.addEventListener('change', calculate);
      calcForm.addEventListener('input', calculate);

      if (applyVoucherBtn && voucherInput) {
        applyVoucherBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const code = voucherInput.value.trim().toUpperCase();
          if (code === 'WELCOME10') {
            discountPercent = 10;
            window.RentORideToast?.show('Coupon Applied', '10% Welcome Discount applied!', 'success');
          } else if (code === 'MOTO20') {
            discountPercent = 20;
            window.RentORideToast?.show('Promo Applied', '20% Special Discount applied!', 'success');
          } else if (code) {
            window.RentORideToast?.show('Invalid Code', 'The entered voucher is expired or invalid.', 'danger');
          }
          calculate();
        });
      }

      calculate();

      // Submit demo booking flow
      calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedId = scooterSelect ? scooterSelect.value : 'scooter-1';
        const scooter = FLEET_DATA.find(s => s.id === selectedId) || FLEET_DATA[0];
        
        const newBooking = {
          id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
          scooterId: scooter.id,
          scooterName: scooter.name,
          scooterImage: scooter.image,
          pickupDate: pickupDate ? pickupDate.value : formatDate(today),
          returnDate: returnDate ? returnDate.value : formatDate(after3Days),
          totalAmount: grandTotalEl ? grandTotalEl.textContent : '₹105',
          status: 'Confirmed',
          bookedAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        existing.unshift(newBooking);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(existing));

        window.RentORideToast?.show('Booking Confirmed!', 'Redirecting to your reservation details...', 'success');
        setTimeout(() => {
          window.location.href = 'booking-details.html';
        }, 1200);
      });
    },

    initDetailsPage: function () {
      const imgEl = document.getElementById('detailMainImg');
      if (!imgEl) return;

      const params = new URLSearchParams(window.location.search);
      const requestedId = params.get('id');
      const item = FLEET_DATA.find(s => s.id === requestedId) || FLEET_DATA[0];

      imgEl.src = item.image;
      imgEl.alt = item.name;
      document.title = item.name + ' | Scooter Details - Rent o Ride';

      const setText = (elId, value) => {
        const el = document.getElementById(elId);
        if (el) el.textContent = value;
      };
      setText('detailCrumb', item.name);
      setText('detailName', item.name);
      setText('detailBadge', item.category);
      setText('detailPrice', '₹' + item.pricePerDay);

      const availabilityEl = document.getElementById('detailAvailability');
      if (availabilityEl) {
        availabilityEl.innerHTML = '<i class="bi bi-check-circle me-1"></i> ' + (item.available ? 'Available Now' : 'On Request');
      }

      const ratingEl = document.getElementById('detailRating');
      if (ratingEl) {
        ratingEl.innerHTML = '<i class="bi bi-star-fill text-warning me-1"></i> ' + item.rating + ' (' + item.reviewsCount + ' Customer Reviews)';
      }

      const specsRow = document.getElementById('detailSpecs');
      if (specsRow) {
        specsRow.innerHTML = this.buildSpecPairs(item).map(pair => `
          <div class="col-sm-4 col-6">
            <div class="spec-tile shadow-sm">
              <small class="text-muted d-block mb-1">${pair[0]}</small>
              <strong class="text-dark">${pair[1]}</strong>
            </div>
          </div>`).join('');
      }

      const rateNoteEl = document.getElementById('calcRateNote');
      if (rateNoteEl) rateNoteEl.textContent = ' (₹' + item.pricePerDay + '/day)';

      const scooterInput = document.getElementById('calcScooter');
      if (scooterInput) scooterInput.value = item.id;
    },

    buildSpecPairs: function (item) {
      const extra = SCOOTER_SPECS[item.id] || {};
      const license = item.seats > 1 ? 'Standard Car / Moto' : 'Car / Moto License';
      if (item.fuel.includes('Electric')) {
        return [
          ['Motor Power', extra.motor || 'Electric Hub Motor'],
          ['Top Speed', item.topSpeed],
          ['Max Range', item.mileage],
          ['Battery Pack', extra.battery || 'Dual Li-ion'],
          ['Full Charge Time', extra.charge || '5.0 hrs'],
          ['Transmission', item.transmission]
        ];
      }
      return [
        ['Engine Displacement', extra.engine || '125 cc+ Euro 5'],
        ['Top Speed', item.topSpeed],
        ['Fuel Economy', item.mileage.replace('km/l', ' km/Liter')],
        ['Transmission', item.transmission + ' CVT'],
        ['Fuel Tank', extra.tank || '7.0 Liters'],
        ['Required License', license]
      ];
    },

    initFleetFilters: function () {
      const fleetGrid = document.getElementById('fleetGridContainer');
      if (!fleetGrid) return;

      const categoryCheckboxes = document.querySelectorAll('.filter-category');
      const fuelCheckboxes = document.querySelectorAll('.filter-fuel');
      const transmissionRadios = document.querySelectorAll('.filter-transmission');
      const priceRange = document.getElementById('filterPriceRange');
      const priceOutput = document.getElementById('filterPriceValue');
      const searchInput = document.getElementById('filterSearchInput');
      const sortSelect = document.getElementById('fleetSortSelect');
      const countEl = document.getElementById('fleetCountDisplay');

      const render = () => {
        const selectedCategories = Array.from(categoryCheckboxes).filter(c => c.checked).map(c => c.value);
        const selectedFuels = Array.from(fuelCheckboxes).filter(c => c.checked).map(c => c.value);
        const selectedTransmission = Array.from(transmissionRadios).find(r => r.checked)?.value || 'all';
        const maxPrice = priceRange ? parseInt(priceRange.value) : 100;
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        if (priceOutput && priceRange) {
          priceOutput.textContent = '₹' + priceRange.value + '/day';
        }

        let filtered = FLEET_DATA.filter(item => {
          if (selectedCategories.length > 0 && !selectedCategories.includes(item.category) && !selectedCategories.includes('all')) return false;
          if (selectedFuels.length > 0 && !selectedFuels.includes(item.fuel) && !selectedFuels.includes('all')) return false;
          if (selectedTransmission !== 'all' && item.transmission.toLowerCase() !== selectedTransmission.toLowerCase()) return false;
          if (item.pricePerDay > maxPrice) return false;
          if (query && !item.name.toLowerCase().includes(query) && !item.category.toLowerCase().includes(query)) return false;
          return true;
        });

        // Sorting
        const sortVal = sortSelect ? sortSelect.value : 'recommended';
        if (sortVal === 'price-low') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        if (sortVal === 'price-high') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        if (sortVal === 'rating') filtered.sort((a, b) => b.rating - a.rating);

        if (countEl) countEl.textContent = filtered.length;

        if (filtered.length === 0) {
          fleetGrid.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="bi bi-search display-4 text-muted mb-3 d-block"></i>
              <h4 class="fw-bold">No Scooters Match Your Filters</h4>
              <p class="text-muted">Try relaxing your search criteria or resetting filters.</p>
              <button class="btn btn-outline-primary mt-2" onclick="window.location.reload()">Reset Filters</button>
            </div>`;
          return;
        }

        fleetGrid.innerHTML = filtered.map(item => `
          <div class="col-lg-4 col-md-6 mb-4" data-scooter-id="${item.id}">
            <div class="scooter-card h-100">
              <div class="scooter-img-wrap">
                <span class="badge ${item.fuel.includes('Electric') ? 'bg-success-soft' : 'bg-primary-soft'} scooter-badge-top">
                  ${item.category}
                </span>
                <button type="button" class="wishlist-btn" title="Add to Wishlist" onclick="RentORideBooking.toggleWishlist('${item.id}')">
                  <i class="bi bi-heart"></i>
                </button>
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="scooter-card-body">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-muted small"><i class="bi bi-star-fill text-warning me-1"></i>${item.rating} (${item.reviewsCount})</span>
                  <span class="badge bg-light text-dark border">${item.transmission}</span>
                </div>
                <h5 class="fw-bold mb-2">${item.name}</h5>
                <div class="scooter-specs-grid">
                  <div class="spec-item"><i class="bi bi-speedometer2"></i> <span>${item.topSpeed}</span></div>
                  <div class="spec-item"><i class="bi bi-fuel-pump"></i> <span>${item.mileage}</span></div>
                  <div class="spec-item"><i class="bi bi-person"></i> <span>${item.seats} Seats</span></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-auto pt-2 flex-wrap gap-2">
                  <div class="scooter-price-wrap">
                    <span class="price-amount">₹${item.pricePerDay}</span>
                    <span class="price-unit">/ day</span>
                  </div>
                  <div class="d-flex gap-2 flex-shrink-0">
                    <a href="scooter-details.html?id=${item.id}" class="btn btn-sm btn-outline-primary px-3">Details</a>
                    <a href="scooter-details.html?id=${item.id}#book" class="btn btn-sm btn-primary px-3 text-nowrap">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        RentORideBooking.updateWishlistUI();
      };

      document.querySelectorAll('.filter-category, .filter-fuel, .filter-transmission').forEach(el => {
        el.addEventListener('change', render);
      });
      if (priceRange) priceRange.addEventListener('input', render);
      if (searchInput) searchInput.addEventListener('input', render);
      if (sortSelect) sortSelect.addEventListener('change', render);

      render();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.RentORideBooking.updateWishlistUI();
    window.RentORideBooking.initDetailsPage();
    window.RentORideBooking.initCalculator();
    window.RentORideBooking.initFleetFilters();
  });
})();
