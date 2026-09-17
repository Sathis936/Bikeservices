/**
 * Rent o Ride - Main JS
 * Initializes Navigation, Swiper Sliders, Countdown Timers, Counter Animations
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // 2. Testimonials Swiper
    if (document.querySelector('.testimonials-swiper') && window.Swiper) {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoHeight: false,
        grabCursor: true,
        observer: true,
        observeParents: true,
        watchOverflow: true,
        autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
        breakpoints: {
          576: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          992: { slidesPerView: 3, spaceBetween: 28 }
        }
      });
    }

    // 3. Scooter Gallery Swiper
    if (document.querySelector('.scooter-gallery-swiper') && window.Swiper) {
      new Swiper('.scooter-gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      });
    }

    // 4. Coming Soon Countdown Timer
    const countdownEl = document.getElementById('launchCountdown');
    if (countdownEl) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 28);

      const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = launchDate.getTime() - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('countDays');
        const hEl = document.getElementById('countHours');
        const mEl = document.getElementById('countMins');
        const sEl = document.getElementById('countSecs');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(mins).padStart(2, '0');
        if (sEl) sEl.textContent = String(secs).padStart(2, '0');
      };

      setInterval(updateCountdown, 1000);
      updateCountdown();
    }
  });
})();

/**
 * Rent o Ride - Blog Post Loader
 * Populates blog-details.html from the ?id= query parameter.
 */
(function () {
  'use strict';

  const BLOG_POSTS = [
    {
      id: 'blog-1',
      title: '10 Scenic Coastal Routes for Scooter Travel',
      crumb: '10 Scenic Coastal Routes',
      category: 'Travel Guide',
      date: 'Oct 12, 2026',
      readTime: '6 min read',
      image: 'assets/images/blog/blog-1.jpg',
      author: 'Alex Vance',
      avatar: 'assets/images/team/member-1.jpg',
      bio: 'Founder at Rent o Ride and veteran two-wheeled globetrotter.',
      lead: 'Few sensations compare to cruising along a sun-drenched coastal highway on a scooter. With the warm breeze on your face and the freedom to pull over wherever a secluded beach catches your eye, a two-wheeled getaway is unbeatable.',
      sections: [
        { h: '1. The Cliffside Ocean Boulevard', p: 'Spanning 34 kilometers from the South Marina past limestone coves, this route offers gentle rolling curves and panoramic views. Stop by the lighthouse café for freshly brewed espresso.' },
        { h: '2. Hidden Pine Bay Loop', p: 'Ideal for electric mopeds with quiet motors, this route winds through coastal pine forests where you can smell the sea salt and pine needles simultaneously.' }
      ],
      quote: '"Travelling on a scooter turns the journey itself into the destination. You aren\'t enclosed in a tin box; you are part of the scenery."'
    },
    {
      id: 'blog-2',
      title: 'Gas vs Electric Scooters: Which Rental is Right for You?',
      crumb: 'Gas vs Electric Scooters',
      category: 'EV Mobility',
      date: 'Sep 28, 2026',
      readTime: '8 min read',
      image: 'assets/images/blog/blog-2.jpg',
      author: 'Sophia Laurent',
      avatar: 'assets/images/team/member-2.jpg',
      bio: 'Fleet analyst at Rent o Ride specializing in EV adoption and charging infrastructure.',
      lead: 'Choosing between a familiar gasoline scooter and a modern electric model comes down to your route, your budget, and how you like to ride. Here is how the two stack up for rental customers.',
      sections: [
        { h: 'Range & Refueling', p: 'Gas models refuel in minutes and comfortably handle full-day coastal tours. Our electric fleet delivers 60–90 km per charge — perfect for city errands, brunch runs, and beach-hopping.' },
        { h: 'Cost & Comfort', p: 'Electric scooters cost roughly a third less per kilometer and run near-silent through residential streets, while gasoline models carry lower deposits and higher top speeds for highway stretches.' }
      ],
      quote: null
    },
    {
      id: 'blog-3',
      title: 'Essential Scooter Riding Safety Tips for Beginners',
      crumb: 'Riding Safety Tips',
      category: 'Safety Tips',
      date: 'Sep 15, 2026',
      readTime: '5 min read',
      image: 'assets/images/blog/blog-3.jpg',
      author: 'Marcus Chen',
      avatar: 'assets/images/team/member-3.jpg',
      bio: 'Certified riding instructor and safety trainer at Rent o Ride Academy.',
      lead: 'Your first hours on two wheels set the tone for the whole trip. Master these fundamentals early and every ride that follows will feel calmer, smoother, and safer.',
      sections: [
        { h: 'Brake Like a Pro', p: 'Always apply both levers together — front brake first, rear a split second later — and finish braking before you enter a corner, never inside it. Smooth inputs are what keep rubber side down on loose surfaces.' },
        { h: 'Cornering & Road Position', p: 'Look through the turn where you want to go, keep your weight centered, and ride where drivers can see you in their mirrors. On our routes, that means owning your lane instead of hugging the curb.' }
      ],
      quote: null
    },
    {
      id: 'blog-4',
      title: 'How Micro-Mobility is Revolutionizing Urban Commutes',
      crumb: 'Urban Micro-Mobility',
      category: 'Industry News',
      date: 'Aug 30, 2026',
      readTime: '7 min read',
      image: 'assets/images/blog/blog-4.jpg',
      author: 'Elena Rostova',
      avatar: 'assets/images/team/member-4.jpg',
      bio: 'Urban mobility researcher and contributing writer at Rent o Ride.',
      lead: 'Cities around the world are redesigning streets around light electric vehicles, and scooters sit at the center of that shift — cheaper than cars, faster than walking, and kind to crowded downtowns.',
      sections: [
        { h: 'Dedicated Lanes Are Multiplying', p: 'Protected micro-mobility lanes have expanded more than 40% in partner cities since 2024, cutting average cross-town commute times by nearly half compared to driving at peak hours.' },
        { h: 'Parking Hubs Replace Curb Chaos', p: 'New designated scooter corrals keep sidewalks clear and put rentals within a two-minute walk of most transit stations — one more reason point-to-point renting keeps growing.' }
      ],
      quote: null
    },
    {
      id: 'blog-5',
      title: 'Best Weekend Road Trips on a Maxi Scooter',
      crumb: 'Weekend Road Trips',
      category: 'Road Trips',
      date: 'Aug 14, 2026',
      readTime: '6 min read',
      image: 'assets/images/blog/blog-5.jpg',
      author: 'David Miller',
      avatar: 'assets/images/team/member-1.jpg',
      bio: 'Touring enthusiast and route scout who has logged 40,000 km on maxi scooters.',
      lead: 'A maxi scooter is the sweet spot between motorcycle tourer and city runabout: enough power for highway stretches, enough storage for an overnight bag, and effortless automatic gearing all day long.',
      sections: [
        { h: 'Pack Smart, Ride Far', p: 'The PCX 160 swallows a full-face helmet and a soft duffel under its seat. Add a tank bag for snacks and chargers, and you can leave the car behind without leaving anything behind.' },
        { h: 'Three Routes Worth Your Weekend', p: 'Start with the lakeside loop (180 km), graduate to the vineyard valleys run (240 km), then reward yourself with the sunset lighthouse circuit — best ridden Saturday evening, golden hour guaranteed.' }
      ],
      quote: null
    },
    {
      id: 'blog-6',
      title: 'Zero Emission Travel: Our Commitment to Green Cities',
      crumb: 'Zero Emission Travel',
      category: 'Sustainability',
      date: 'Jul 29, 2026',
      readTime: '4 min read',
      image: 'assets/images/blog/blog-6.jpg',
      author: 'Amina Yusuf',
      avatar: 'assets/images/team/member-2.jpg',
      bio: 'Sustainability lead coordinating Rent o Ride\'s fleet electrification program.',
      lead: 'Sustainability at Rent o Ride isn\'t a slogan on a poster — it is measured in kilowatt-hours, battery swaps, and tons of CO₂ that never entered the atmosphere.',
      sections: [
        { h: 'Electrifying the Fleet', p: 'Over 320 tons of carbon dioxide were offset across our electric moped fleet this year, and EVs now make up 40% of rentals — on track for half the fleet by next season.' },
        { h: 'Battery Swap, Not Landfill', p: 'Every pack in our swap network is refurbished or responsibly recycled at end of life, keeping rare-earth materials in circulation and out of the ground.' }
      ],
      quote: null
    }
  ];

  const SERVICES_DATA = {
    'daily': {
      title: 'Daily Scooter & Moped Rental',
      crumb: 'Daily Scooter Rental',
      image: 'assets/images/scooters/scooter-1.jpg',
      lead: 'Our daily scooter rental is the most popular choice for travelers wanting to discover hidden gems without hailing expensive taxis or waiting for packed buses.',
      price: '₹30/day',
      deposit: 'From ₹120'
    },
    'hourly': {
      title: 'Hourly Hop & Short-Term Rental',
      crumb: 'Hourly Rental',
      image: 'assets/images/scooters/scooter-6.jpg',
      lead: 'Flexible short-term rental by the hour for running quick errands, brunch trips, lunch meetings, or quick scenic sunset coastal rides.',
      price: '₹8/hour',
      deposit: 'From ₹80'
    },
    'weekly': {
      title: 'Weekly Pass & Extended Road Trips',
      crumb: 'Weekly Rental',
      image: 'assets/images/scooters/scooter-4.jpg',
      lead: 'Save up to 25% on 7-day bookings with unlimited mileage on select models, free roadside swaps, and doorstep delivery.',
      price: '₹190/week',
      deposit: 'From ₹150'
    },
    'monthly': {
      title: 'Monthly Long-Term Scooter Lease',
      crumb: 'Monthly Long-Term',
      image: 'assets/images/scooters/scooter-3.jpg',
      lead: 'Comprehensive monthly lease with zero ownership hassle, complimentary periodic maintenance, and free replacement vehicles.',
      price: '₹490/month',
      deposit: 'From ₹200'
    },
    'corporate': {
      title: 'Corporate Fleet & Hotel Partner Rentals',
      crumb: 'Corporate Fleet Rental',
      image: 'assets/images/services/corporate-fleet.jpg',
      lead: 'Customized fleet packages for resorts, tour operators, business retreats, and real estate inspection agents with dedicated billing.',
      price: 'Custom Corporate Rates',
      deposit: 'Corporate B2B Terms'
    },
    'airport': {
      title: 'Airport Terminal Pickup & Express Drop',
      crumb: 'Airport Pickup & Drop',
      image: 'assets/images/services/airport-pickup.jpg',
      lead: 'Pick up your scooter right outside arrival gates at designated rental parking bays with express digital lock unlock and helmet ready.',
      price: '₹35/day + Airport Surcharge',
      deposit: 'From ₹150'
    },
    'delivery': {
      title: 'Doorstep Delivery & Hotel Drop-Off',
      crumb: 'Doorstep Delivery',
      image: 'assets/images/scooters/scooter-8.jpg',
      lead: 'Have your reserved scooter delivered and collected directly from your hotel, apartment, or Airbnb accommodation with zero transit wait.',
      price: 'Flat ₹15 Delivery Fee',
      deposit: 'Standard Deposit'
    },
    'ev': {
      title: '100% Electric Scooter EV Fleet',
      crumb: 'Electric EV Fleet',
      image: 'assets/images/scooters/scooter-5.jpg',
      lead: 'Zero-emission smart dual-battery electric scooters with access to 18 rapid battery swap stations across the metropolitan region.',
      price: '₹42/day',
      deposit: 'From ₹200'
    },
    'cargo': {
      title: 'Delivery & Cargo Moped Solutions',
      crumb: 'Delivery & Cargo Mopeds',
      image: 'assets/images/Kymco Agility Cargo 125.jpg',
      lead: 'Equipped with heavy-duty rear luggage racks and reinforced suspension built specifically for couriers, delivery drivers, and food couriers.',
      price: '₹32/day',
      deposit: 'From ₹120'
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Blog Details Post Loader
    const imgEl = document.getElementById('postImg');
    if (imgEl) {
      const params = new URLSearchParams(window.location.search);
      const post = BLOG_POSTS.find(p => p.id === params.get('id')) || BLOG_POSTS[0];

      imgEl.src = post.image;
      imgEl.alt = post.title;
      document.title = post.title + ' | Rent o Ride Blog';

      const setText = (elId, value) => {
        const el = document.getElementById(elId);
        if (el) el.textContent = value;
      };
      setText('postCrumb', post.crumb);
      setText('postBadge', post.category);
      setText('postDate', post.date);
      setText('postReadTime', post.readTime);
      setText('postTitle', post.title);

      let body = '<p class="lead text-muted">' + post.lead + '</p>';
      post.sections.forEach(s => {
        body += '<h4 class="fw-bold mt-4 mb-3">' + s.h + '</h4><p class="text-muted">' + s.p + '</p>';
      });
      if (post.quote) {
        body += '<div class="p-4 bg-light border-start border-primary border-4 rounded-3 my-4 fst-italic text-dark">' + post.quote + '</div>';
      }
      const bodyEl = document.getElementById('postBody');
      if (bodyEl) bodyEl.innerHTML = body;

      const avatarEl = document.getElementById('authorAvatar');
      if (avatarEl) { avatarEl.src = post.avatar; avatarEl.alt = post.author; }
      setText('authorName', post.author);
      setText('authorBio', post.bio);
    }

    // 2. Dynamic Service Details Loader
    const serviceImgEl = document.getElementById('serviceImg');
    if (serviceImgEl) {
      const params = new URLSearchParams(window.location.search);
      const sKey = params.get('service') || 'daily';
      const sData = SERVICES_DATA[sKey] || SERVICES_DATA['daily'];

      serviceImgEl.src = sData.image;
      serviceImgEl.alt = sData.title;

      const setTxt = (id, val) => {
        const d = document.getElementById(id);
        if (d) d.textContent = val;
      };
      setTxt('serviceTitle', sData.title);
      setTxt('serviceCrumb', sData.crumb);
      setTxt('serviceLead', sData.lead);
      setTxt('servicePrice', sData.price);
      setTxt('serviceDeposit', sData.deposit);
      document.title = sData.title + ' | Rent o Ride Services';
    }
  });
})();
