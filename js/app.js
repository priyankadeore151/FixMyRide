// FixMyRide - Core Application Logic

const App = {
    state: {
        theme: localStorage.getItem('theme') || 'light',
        user: null,
        currentView: 'landing',
        vehicles: [],
        bookings: [],
        reviews: [
            { name: 'Rahul Sharma', rating: 5, comment: 'Fastest roadside assistance I\'ve ever used. The mechanic was expert and very polite!', date: '02 May 2026' },
            { name: 'Priya Patel', rating: 5, comment: 'Transparent pricing and great service. The doorstep visit saved me so much time.', date: '04 May 2026' },
            { name: 'Amit Verma', rating: 4, comment: 'General servicing was thorough. I highly recommend the Annual Maintenance Package.', date: '05 May 2026' }
        ]
    },

    init() {
        console.log("FixMyRide initializing...");
        this.cacheDOM();
        this.initTheme();
        this.bindEvents();
        this.initChat();
        this.initLang();
        this.route();
        lucide.createIcons();
    },

    initTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.state.theme);
        this.initTheme();
        this.render();
    },

    cacheDOM() {
        this.mainContent = document.getElementById('main-content');
        this.navActions = document.getElementById('nav-actions');
        this.sosButton = document.getElementById('sos-button');
    },

    bindEvents() {
        window.addEventListener('hashchange', () => this.route());
        this.sosButton.addEventListener('click', () => this.handleSOS());
    },

    route() {
        const hash = window.location.hash.replace('#', '') || 'landing';
        this.state.currentView = hash;
        this.render();
    },

    render() {
        this.updateNav();

        if (this.state.user && this.state.currentView !== 'landing') {
            this.sosButton.classList.remove('hidden');
            document.getElementById('chat-toggle').classList.remove('hidden');
        } else {
            this.sosButton.classList.add('hidden');
            document.getElementById('chat-toggle').classList.add('hidden');
            document.getElementById('chat-window').classList.add('hidden');
        }

        switch (this.state.currentView) {
            case 'landing': this.renderLanding(); break;
            case 'login': this.renderLogin(); break;
            case 'register': this.renderRegister(); break;
            case 'dashboard': this.renderDashboard(); break;
            case 'booking': this.renderBooking(); break;
            case 'vehicles': this.renderVehicles(); break;
            case 'tracking': this.renderTracking(); break;
            case 'mechanic-search': this.renderMechanicSearch(); break;
            case 'emergency': this.renderEmergency(); break;
            case 'estimate': this.renderEstimate(); break;
            case 'admin': this.renderAdmin(); break;
            case 'history': this.renderHistory(); break;
            case 'reviews': this.renderAllReviews(); break;
            case 'profile': this.renderProfile(); break;
            case 'payments': this.renderPayments(); break;
            case 'complaints': this.renderComplaints(); break;
            case 'forgot': this.renderForgot(); break;
            case 'invoice': this.renderInvoice(window.location.hash.split('=')[1]); break;
            default: this.renderLanding();
        }

        lucide.createIcons();
        window.scrollTo(0, 0);
    },

    updateNav() {
        const themeIcon = this.state.theme === 'light' ? 'moon' : 'sun';
        const toggleBtn = `
            <button onclick="App.toggleTheme()" class="btn btn-secondary" style="padding: 0.5rem; border-radius: 50%; min-width: 40px; justify-content: center;">
                <i data-lucide="${themeIcon}"></i>
            </button>
        `;

        if (this.state.user) {
            this.navActions.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    ${toggleBtn}
                    <a href="#admin" class="btn btn-secondary" style="border-color: var(--primary); color: var(--primary);">Admin</a>
                    <a href="#history" class="btn btn-secondary">History</a>
                    <a href="#profile" class="btn btn-secondary">Profile</a>
                    <a href="#dashboard" class="btn btn-secondary">Dashboard</a>
                    <button id="logout-btn" class="btn btn-secondary">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').onclick = () => this.logout();
        } else {
            this.navActions.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    ${toggleBtn}
                    <a href="#login" class="btn btn-secondary">Login</a>
                    <a href="#register" class="btn btn-primary">Get Started</a>
                </div>
            `;
        }
    },

    renderLanding() {
        this.mainContent.innerHTML = `
            <section class="hero fade-in">
                <div class="hero-container" style="display: block; text-align: center; max-width: 800px;">
                    <div>
                        <h1>Your Vehicle's Best Friend Anytime, Anywhere.</h1>
                        <p style="margin: 0 auto 2.5rem;">Book trusted mechanics online and get your vehicle repaired at your convenience.</p>
                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <a href="#booking" class="btn btn-primary">Book Service</a>
                            <a href="#mechanic-search" class="btn btn-secondary">Find Mechanic</a>
                            <a href="#estimate" class="btn" style="background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.4); display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="calculator"></i> Get Estimate
                            </a>
                            <a href="#emergency" class="btn" style="background: #dc2626; color: #fff; display: flex; align-items: center; gap: 0.5rem; animation: pulse 2s infinite;">
                                <i data-lucide="alert-triangle"></i> Emergency SOS
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" style="padding: 4rem 1rem;">
                <h2 style="text-align: center; margin-bottom: 3rem;">Our Expert Services</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <i data-lucide="settings" style="color: var(--primary);"></i>
                        <h4>Engine Repair</h4>
                        <p>Complete engine diagnostics and repair for all vehicle types.</p>
                    </div>
                    <div class="feature-card">
                        <i data-lucide="droplet" style="color: var(--primary);"></i>
                        <h4>Oil Change</h4>
                        <p>Fast and efficient oil change service to keep your engine running smooth.</p>
                    </div>
                    <div class="feature-card">
                        <i data-lucide="disc" style="color: var(--primary);"></i>
                        <h4>Tire Replacement</h4>
                        <p>Professional tire fitting and alignment services at your location.</p>
                    </div>
                </div>
            </section>

            <!-- 3. Premium Features & Memberships -->
            <section id="premium" style="padding: 3rem 1rem; border-top: 1px solid var(--glass-border);">
                <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">Premium Features & Memberships</h2>
                <div class="features-grid" style="max-width: 1200px; margin: 0 auto; gap: 1rem;">
                    <div class="feature-card" style="border-color: var(--secondary); padding: 1.25rem;">
                        <i data-lucide="shield-check" style="color: var(--secondary); width: 20px; height: 20px;"></i>
                        <h4 style="margin: 0.5rem 0 0.25rem;">Emergency Assistance</h4>
                        <p style="font-weight: 700; color: var(--secondary);">₹499 per request</p>
                    </div>
                    <div class="feature-card" style="border-color: var(--secondary); padding: 1.25rem;">
                        <i data-lucide="home" style="color: var(--secondary); width: 20px; height: 20px;"></i>
                        <h4 style="margin: 0.5rem 0 0.25rem;">Doorstep Visit</h4>
                        <p style="font-weight: 700; color: var(--secondary);">₹199 extra</p>
                    </div>
                    <div class="feature-card" style="border-color: var(--secondary); padding: 1.25rem;">
                        <i data-lucide="truck" style="color: var(--secondary); width: 20px; height: 20px;"></i>
                        <h4 style="margin: 0.5rem 0 0.25rem;">Pickup & Drop</h4>
                        <p style="font-weight: 700; color: var(--secondary);">₹299 extra</p>
                    </div>
                    <div class="feature-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%); padding: 1.25rem;">
                        <i data-lucide="gem" style="color: var(--primary); width: 20px; height: 20px;"></i>
                        <h4 style="margin: 0.5rem 0 0.25rem;">Premium Membership</h4>
                        <p style="font-weight: 700; color: var(--primary);">₹999/year</p>
                    </div>
                    <div class="feature-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%); padding: 1.25rem;">
                        <i data-lucide="award" style="color: var(--primary); width: 20px; height: 20px;"></i>
                        <h4 style="margin: 0.5rem 0 0.25rem;">Annual Maintenance</h4>
                        <p style="font-weight: 700; color: var(--primary);">₹4,999/year</p>
                    </div>
                </div>
            </section>

            <!-- 4. Customer Reviews -->
            <section style="padding: 6rem 1rem; text-align: center;">
                <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto 4rem;">
                    <h2 style="font-size: 2.5rem; margin: 0;">What Our Customers Say</h2>
                    <a href="#reviews" class="btn btn-secondary">View All Reviews</a>
                </div>
                <div class="features-grid" style="max-width: 1200px; margin: 0 auto;">
                    ${this.state.reviews.slice(0, 3).map(r => `
                        <div class="feature-card">
                            <div style="color: var(--primary); margin-bottom: 1rem; display: flex; gap: 2px;">
                                ${Array(r.rating).fill('★').join('')}
                            </div>
                            <p style="font-style: italic;">"${r.comment}"</p>
                            <h4 style="margin-top: 1rem;">- ${r.name}</h4>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${r.date}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
        lucide.createIcons();
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.login();
            };
        }
    },

    renderLogin() {
        this.mainContent.innerHTML = `
            <div class="login-container fade-in">
                <div class="login-card">
                    <div class="login-header">
                        <i data-lucide="wrench"></i>
                        <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Welcome Back</h2>
                        <p style="color: var(--text-muted);">Access your smart garage dashboard</p>
                    </div>
                    <form id="login-form">
                        <div class="input-group">
                            <i data-lucide="mail"></i>
                            <input type="email" placeholder="Email Address" required>
                        </div>
                        <div class="input-group">
                            <i data-lucide="lock"></i>
                            <input type="password" placeholder="Password" required>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; font-size: 0.875rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); cursor: pointer;">
                                <input type="checkbox"> Remember me
                            </label>
                            <a href="#forgot" style="color: var(--primary); text-decoration: none;">Forgot Password?</a>
                        </div>
                        <button type="submit" class="login-btn">
                            Sign In to FixMyRide
                        </button>
                    </form>
                    <p style="text-align: center; margin-top: 2rem; color: var(--text-muted); font-size: 0.875rem;">
                        Don't have an account? <a href="#register" style="color: var(--primary); text-decoration: none; font-weight: 700;">Join the community</a>
                    </p>
                </div>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('login-form').onsubmit = (e) => { e.preventDefault(); this.login(); };
    },

    renderRegister() {
        this.mainContent.innerHTML = `
            <div class="form-card fade-in">
                <h2 style="margin-bottom: 0.5rem;">Create Account</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Join FixMyRide for a smarter vehicle experience.</p>
                <form id="register-form">
                    <div class="form-group"><label>Full Name</label><input type="text" class="form-input" placeholder="John Doe" required></div>
                    <div class="form-group"><label>Email Address</label><input type="email" class="form-input" placeholder="name@example.com" required></div>
                    <div class="form-group"><label>Password</label><input type="password" class="form-input" placeholder="••••••••" required></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">Register</button>
                </form>
                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.875rem;">Already have an account? <a href="#login" style="color: var(--primary); text-decoration: none;">Login</a></p>
            </div>
        `;
        document.getElementById('register-form').onsubmit = (e) => { e.preventDefault(); this.login(); };
    },

    renderDashboard() {
        if (!this.state.user) { window.location.hash = 'login'; return; }
        this.mainContent.innerHTML = `
            <div class="fade-in">
                <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
                    <div>
                        <h1 style="font-size: 2.5rem;">Hello, ${this.state.user.name}</h1>
                        <p style="color: var(--text-muted)">Manage your fleet and upcoming services.</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#payments" class="btn btn-secondary"><i data-lucide="credit-card"></i> Payments</a>
                        <a href="#booking" class="btn btn-primary"><i data-lucide="plus"></i> New Booking</a>
                    </div>
                </header>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <section>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h2>My Vehicles</h2>
                            <a href="#vehicles" style="color: var(--primary); text-decoration: none; font-weight: 600;">View All</a>
                        </div>
                        <div id="vehicles-list" class="vehicles-grid">
                            ${this.state.vehicles.map(v => `
                                <div class="vehicle-card">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                                        <h3>${v.name}</h3><span class="vehicle-status">Healthy</span>
                                    </div>
                                    <p style="font-size: 0.875rem; color: var(--text-muted);">${v.model} • ${v.regNo}</p>
                                </div>
                            `).join('')}
                            <div onclick="window.location.hash='vehicles'" class="feature-card" style="border-style: dashed; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 150px; cursor: pointer;">
                                <i data-lucide="plus-circle" style="width: 32px; height: 32px; margin-bottom: 1rem; color: var(--text-muted)"></i>
                                <span style="color: var(--text-muted)">Add Vehicle</span>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 style="margin-bottom: 1.5rem;">Upcoming Bookings</h2>
                        <div id="bookings-list">
                            ${this.state.bookings.length === 0 ? `
                                <div style="text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius); color: var(--text-muted)">
                                    <i data-lucide="calendar-x" style="margin-bottom: 1rem;"></i><p>No active bookings</p>
                                </div>
                            ` : this.state.bookings.map(b => `
                                <div class="feature-card" style="margin-bottom: 1rem; border-left: 4px solid var(--primary);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <h4 style="color: var(--primary)">${b.service}</h4><span style="font-size: 0.75rem; font-weight: 700;">${b.status}</span>
                                    </div>
                                    <p style="font-size: 0.875rem; color: var(--text-muted);">${b.date} at ${b.time}</p>
                                    <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 0.875rem; font-weight: 600;">₹${b.cost}</span>
                                        <a href="#tracking" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Track</a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="feature-card" style="margin-top: 2rem; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%); border-color: var(--secondary);">
                            <div style="display: flex; gap: 1rem; align-items: flex-start;">
                                <i data-lucide="sparkles" style="color: var(--secondary);"></i>
                                <div>
                                    <h4 style="color: var(--secondary)">AI Recommendation</h4>
                                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Based on your last service, we recommend a **Wheel Alignment** check next month for better fuel efficiency.</p>
                                </div>
                            </div>
                        </div>

                        <div class="feature-card" style="margin-top: 1.5rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%); border-style: dashed;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="color: var(--primary)">Save 20%</h4>
                                    <p style="font-size: 0.75rem;">Use code **FIRSTFIX** on next service</p>
                                </div>
                                <i data-lucide="ticket" style="color: var(--primary)"></i>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    },

    renderVehicles() {
        this.mainContent.innerHTML = `
            <div class="fade-in">
                <header style="margin-bottom: 3rem;">
                    <a href="#dashboard" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Dashboard</a>
                    <h1>Vehicle Management</h1>
                </header>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
                    <section>
                        <h2 style="margin-bottom: 1.5rem;">Add New Vehicle</h2>
                        <form id="vehicle-form" class="feature-card">
                            <div class="form-group"><label>Vehicle Nickname</label><input type="text" class="form-input" id="v-name" required></div>
                            <div class="form-group"><label>Model Name</label><input type="text" class="form-input" id="v-model" required></div>
                            <div class="form-group"><label>Reg Number</label><input type="text" class="form-input" id="v-reg" required></div>
                            <div class="form-group"><label>Fuel Type</label><select class="form-input" id="v-fuel"><option>Petrol</option><option>Diesel</option><option>EV</option></select></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Add Vehicle</button>
                        </form>
                    </section>
                    <section>
                        <h2 style="margin-bottom: 1.5rem;">My Fleet</h2>
                        <div class="vehicles-grid">
                            ${this.state.vehicles.map(v => `
                                <div class="vehicle-card" style="width: 100%;">
                                    <h3>${v.name}</h3><p style="color: var(--text-muted)">${v.model}</p>
                                    <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%; color: var(--danger);" onclick="App.removeVehicle('${v.id}')">Remove</button>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </div>
        `;
        document.getElementById('vehicle-form').onsubmit = (e) => { e.preventDefault(); this.addVehicle(); };
    },

    addVehicle() {
        const v = { id: Date.now(), name: document.getElementById('v-name').value, model: document.getElementById('v-model').value, regNo: document.getElementById('v-reg').value, fuelType: document.getElementById('v-fuel').value };
        this.state.vehicles.push(v);
        this.renderVehicles();
    },

    removeVehicle(id) {
        this.state.vehicles = this.state.vehicles.filter(v => v.id != id);
        this.renderVehicles();
    },

    renderAdmin() {
        this.mainContent.innerHTML = `
            <div class="fade-in">
                <h1>Admin Dashboard</h1>
                <div class="features-grid" style="margin-top: 2rem;">
                    <div class="feature-card"><h3>1,284</h3><p>Total Users</p></div>
                    <div class="feature-card"><h3>452</h3><p>Active Mechanics</p></div>
                    <div class="feature-card"><h3>₹4.2L</h3><p>Revenue</p></div>
                </div>
            </div>
        `;
    },

    renderHistory() {
        this.mainContent.innerHTML = `
            <div class="fade-in">
                <header style="margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <a href="#dashboard" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Dashboard</a>
                        <h1>Service History</h1>
                    </div>
                    <a href="#payments" class="btn btn-secondary">Payment History</a>
                </header>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${this.state.bookings.length === 0 ? '<p style="color: var(--text-muted)">No services booked yet.</p>' : this.state.bookings.map(b => `
                        <div class="feature-card" style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3>${b.service}</h3>
                                <p>${b.date}</p>
                                ${b.rating ? `<div style="color: var(--primary); margin-top: 0.5rem; display: flex; gap: 2px;">${Array(b.rating).fill('<i data-lucide="star" style="width: 12px; height: 12px; fill: currentColor;"></i>').join('')}</div>` : ''}
                            </div>
                            <div style="text-align: right; display: flex; align-items: center; gap: 1rem;">
                                <p style="font-weight: 700;">₹${b.cost}</p>
                                ${!b.rating ? `<button onclick="App.renderRating('${b.id}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.75rem; border-color: var(--primary); color: var(--primary);">Rate Service</button>` : ''}
                                <a href="#invoice?id=${b.id}" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.75rem;">Invoice</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderRating(id) {
        const booking = this.state.bookings.find(b => b.id === id);
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 500px; margin: 4rem auto; text-align: center;">
                <div class="feature-card" style="padding: 3rem;">
                    <h2 style="margin-bottom: 1rem;">Rate Your Mechanic</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">How was your experience with the ${booking.service} on ${booking.date}?</p>
                    
                    <form id="rating-form">
                        <div class="star-rating" style="margin-bottom: 2rem;">
                            <input type="radio" id="star5" name="rating" value="5"><label for="star5">★</label>
                            <input type="radio" id="star4" name="rating" value="4"><label for="star4">★</label>
                            <input type="radio" id="star3" name="rating" value="3"><label for="star3">★</label>
                            <input type="radio" id="star2" name="rating" value="2"><label for="star2">★</label>
                            <input type="radio" id="star1" name="rating" value="1"><label for="star1">★</label>
                        </div>
                        <div class="form-group">
                            <textarea class="form-input" id="rating-comment" placeholder="Leave a review (optional)" style="height: 100px; resize: none;"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">Submit Review</button>
                        <button type="button" onclick="window.location.hash='history'" class="btn btn-secondary" style="width: 100%; justify-content: center; margin-top: 0.5rem; border: none;">Maybe Later</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('rating-form').onsubmit = (e) => {
            e.preventDefault();
            const rating = document.querySelector('input[name="rating"]:checked')?.value;
            if (!rating) { this.notify('Please select a star rating', 'info'); return; }

            booking.rating = parseInt(rating);
            booking.review = document.getElementById('rating-comment').value;

            // Add to global reviews
            this.state.reviews.unshift({
                name: this.state.user?.name || 'Anonymous',
                rating: booking.rating,
                comment: booking.review,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            });

            this.notify('Thank you for your feedback!', 'success');
            window.location.hash = 'history';
        };
    },

    renderAllReviews() {
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 1000px; margin: 0 auto;">
                <header style="margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <a href="#" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Home</a>
                        <h1>Customer Reviews</h1>
                    </div>
                    <div class="feature-card" style="padding: 1rem 2rem;">
                        <p style="font-size: 0.875rem;">Average Rating</p>
                        <h2 style="color: var(--primary)">4.9 / 5.0</h2>
                    </div>
                </header>
                
                <div style="display: grid; gap: 1.5rem;">
                    ${this.state.reviews.map(r => `
                        <div class="feature-card" style="display: flex; gap: 2rem; align-items: flex-start;">
                            <div style="width: 50px; height: 50px; background: var(--bg-surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); border: 2px solid var(--primary); flex-shrink: 0;">
                                ${r.name[0]}
                            </div>
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <h4 style="margin: 0;">${r.name}</h4>
                                    <span style="font-size: 0.875rem; color: var(--text-muted)">${r.date}</span>
                                </div>
                                <div style="color: var(--primary); margin-bottom: 0.75rem; display: flex; gap: 2px;">
                                    ${Array(r.rating).fill('★').join('')}
                                </div>
                                <p style="line-height: 1.6;">${r.comment}</p>
                            </div>
                        </div>
                    `).join('')}
                    <section class="feature-card">
                        <h3>Saved Payment Methods</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.05); border-radius: 10px;">
                                <div style="display: flex; gap: 1rem; align-items: center;">
                                    <i data-lucide="smartphone" style="color: #10b981;"></i>
                                    <div>
                                        <p style="font-weight: 600;">UPI ID</p>
                                        <p style="font-size: 0.75rem; color: var(--text-muted);">user@okaxis</p>
                                    </div>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">Primary</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.05); border-radius: 10px;">
                                <div style="display: flex; gap: 1rem; align-items: center;">
                                    <i data-lucide="credit-card" style="color: var(--secondary);"></i>
                                    <div>
                                        <p style="font-weight: 600;">Debit Card</p>
                                        <p style="font-size: 0.75rem; color: var(--text-muted);">•••• 4242</p>
                                    </div>
                                </div>
                                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.7rem;">Remove</button>
                            </div>
                            <button class="btn btn-secondary" style="width: 100%; border-style: dashed; justify-content: center;">+ Add New Method</button>
                        </div>
                    </section>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderProfile() {
        if (!this.state.user) return;
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 600px; margin: 0 auto;">
                <header style="margin-bottom: 3rem;">
                    <a href="#dashboard" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Dashboard</a>
                    <h1>User Profile</h1>
                </header>
                <div class="feature-card">
                    <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--glass-border);">
                        <div style="width: 80px; height: 80px; background: var(--bg-surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--primary); border: 2px solid var(--primary);">
                            ${this.state.user.name[0]}
                        </div>
                        <div>
                            <h2>${this.state.user.name}</h2>
                            <p style="color: var(--text-muted)">Member since May 2026</p>
                        </div>
                    </div>
                    <form id="profile-form">
                        <div class="form-group"><label>Full Name</label><input type="text" class="form-input" value="${this.state.user.name}"></div>
                        <div class="form-group"><label>Email Address</label><input type="email" class="form-input" value="${this.state.user.email}" disabled></div>
                        <div class="form-group"><label>Phone Number</label><input type="text" class="form-input" value="+91 98765 43210"></div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Update Profile</button>
                    </form>

                    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h3 style="margin-bottom: 1.5rem;">Membership & Packages</h3>
                        <div style="display: grid; gap: 1rem;">
                            <div class="feature-card" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);">
                                <div>
                                    <h4 style="color: var(--primary)">Premium Membership</h4>
                                    <p style="font-size: 0.75rem; color: var(--text-muted)">Get 10% off and priority support</p>
                                </div>
                                <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">₹999/year</button>
                            </div>
                            <div class="feature-card" style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4>Annual Maintenance</h4>
                                    <p style="font-size: 0.75rem; color: var(--text-muted)">4 Services + Unlimited SOS</p>
                                </div>
                                <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">₹4,999/year</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('profile-form').onsubmit = (e) => {
            e.preventDefault();
            this.notify('Profile updated successfully!', 'success');
        };
    },

    renderPayments() {
        this.mainContent.innerHTML = `
            <div class="fade-in">
                <header style="margin-bottom: 3rem;">
                    <a href="#dashboard" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Dashboard</a>
                    <h1>Payment History</h1>
                </header>
                <div class="feature-card" style="padding: 0; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                        <thead style="background: rgba(255,255,255,0.02); text-align: left; font-size: 0.875rem; color: var(--text-muted);">
                            <tr>
                                <th style="padding: 1.25rem;">Transaction ID</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th style="padding-right: 1.25rem;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.state.bookings.length === 0 ? `
                                <tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">No transactions found</td></tr>
                            ` : this.state.bookings.map(b => `
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 1.25rem;">TXN-${b.id.split('-')[1]}</td>
                                    <td>${b.service}</td>
                                    <td>${b.date}</td>
                                    <td>${b.paymentMethod || 'UPI'}</td>
                                    <td style="font-weight: 600;">₹${b.cost}</td>
                                    <td style="color: #10b981; font-weight: 700;">Success</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    renderComplaints() {
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 900px; margin: 0 auto;">
                <header style="margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <a href="#dashboard" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> Dashboard</a>
                        <h1>Help & Support</h1>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: 700; color: var(--secondary);">24/7 Helpline</p>
                        <p>+91 1800-FIX-RIDE</p>
                    </div>
                </header>
                
                <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem;">
                    <section class="feature-card">
                        <h3>Raise a Complaint</h3>
                        <form id="complaint-form" style="margin-top: 1.5rem;">
                            <div class="form-group"><label>Service ID (Optional)</label><input type="text" class="form-input" placeholder="e.g. BK-1234"></div>
                            <div class="form-group"><label>Issue Type</label><select class="form-input"><option>Service Quality</option><option>Delay</option><option>Billing Issue</option><option>Mechanic Behavior</option></select></div>
                            <div class="form-group"><label>Description</label><textarea class="form-input" style="height: 120px; resize: none;" placeholder="Please describe your issue in detail..."></textarea></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Complaint</button>
                        </form>
                    </section>
                    
                    <div>
                        <h3>Frequently Asked Questions</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
                            <div class="feature-card" style="padding: 1rem;">
                                <p><strong>How do I track my mechanic?</strong></p>
                                <p style="font-size: 0.875rem; color: var(--text-muted);">Go to Dashboard and click 'Track' on your active booking.</p>
                            </div>
                            <div class="feature-card" style="padding: 1rem;">
                                <p><strong>Refund Policy?</strong></p>
                                <p style="font-size: 0.875rem; color: var(--text-muted);">Refunds are processed within 5-7 business days for cancelled bookings.</p>
                            </div>
                            <div class="feature-card" style="padding: 1rem;">
                                <p><strong>Can I change my service date?</strong></p>
                                <p style="font-size: 0.875rem; color: var(--text-muted);">Yes, via the support chat before the mechanic is dispatched.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('complaint-form').onsubmit = (e) => {
            e.preventDefault();
            this.notify('Complaint submitted. We will contact you within 24 hours.', 'success');
            window.location.hash = 'dashboard';
        };
        lucide.createIcons();
    },

    renderForgot() {
        this.mainContent.innerHTML = `
            <div class="form-card fade-in">
                <h2>Reset Password</h2>
                <form id="forgot-form" style="margin-top: 2rem;">
                    <div class="form-group"><label>Email Address</label><input type="email" class="form-input" placeholder="name@example.com" required></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Send Reset Link</button>
                </form>
            </div>
        `;
        document.getElementById('forgot-form').onsubmit = (e) => { e.preventDefault(); this.notify('Reset link sent!', 'info'); };
    },

    renderInvoice(id) {
        const booking = this.state.bookings.find(b => b.id === id) || { service: 'Engine Service', date: '05 May 2026', cost: 1500 };
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 700px; margin: 0 auto;">
                <header style="margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <a href="#history" class="btn btn-secondary" style="margin-bottom: 1rem;"><i data-lucide="arrow-left"></i> History</a>
                        <h1>Invoice Details</h1>
                    </div>
                    <button class="btn btn-primary" onclick="window.print()"><i data-lucide="printer"></i> Print</button>
                </header>
                <div class="feature-card" style="padding: 3rem; background: white; color: #1e293b;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3rem;">
                        <div><h2 style="color: #1e293b;">FIXMYRIDE</h2><p style="color: #64748b;">Invoice ID: #INV-${id || '9281'}</p></div>
                        <div style="text-align: right;"><p><strong>Date:</strong> ${booking.date}</p></div>
                    </div>
                    <div style="margin-bottom: 3rem;">
                        <p style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem;">Billed To</p>
                        <p><strong>${this.state.user?.name || 'Guest User'}</strong></p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 3rem;">
                        <thead style="border-bottom: 2px solid #e2e8f0; text-align: left;">
                            <tr><th style="padding: 1rem 0;">Description</th><th style="text-align: right;">Amount</th></tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 1rem 0;">${booking.service}</td><td style="text-align: right;">₹${booking.cost}</td></tr>
                            <tr><td style="padding: 1rem 0;">Tax (18% GST)</td><td style="text-align: right;">₹${Math.round(booking.cost * 0.18)}</td></tr>
                        </tbody>
                        <tfoot>
                            <tr style="font-size: 1.25rem; font-weight: 700;"><td style="padding: 2rem 0;">Total</td><td style="text-align: right; color: var(--primary);">₹${Math.round(booking.cost * 1.18)}</td></tr>
                        </tfoot>
                    </table>
                    <div style="text-align: center; color: #64748b; font-size: 0.875rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
                        Thank you for choosing FixMyRide!
                    </div>
                </div>
            </div>
        `;
    },

    login() {
        this.state.user = { name: 'Alex Johnson', email: 'alex@example.com' };
        window.location.hash = 'dashboard';
        this.notify('Login successful!', 'success');
    },

    logout() {
        this.state.user = null;
        window.location.hash = 'landing';
    },

    handleSOS() {
        this.notify('Emergency signal sent!', 'danger');
        setTimeout(() => { window.location.hash = 'tracking'; }, 2000);
    },

    notify(msg, type) {
        const c = document.getElementById('notification-container');
        const n = document.createElement('div');
        n.className = `notification ${type} fade-in`;
        n.style.cssText = "display: flex; align-items: center; gap: 10px; border-left: 5px solid var(--primary);";
        n.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i> <span>${msg}</span>`;
        c.appendChild(n);
        lucide.createIcons();
        setTimeout(() => n.remove(), 4000);
    },

    initChat() {
        const toggle = document.getElementById('chat-toggle');
        const window = document.getElementById('chat-window');
        const close = document.getElementById('chat-close');
        const send = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');

        toggle.onclick = () => window.classList.toggle('hidden');
        close.onclick = () => window.classList.add('hidden');

        send.onclick = () => {
            if (!input.value.trim()) return;
            const msg = document.createElement('div');
            msg.className = 'msg user';
            msg.innerText = input.value;
            messages.appendChild(msg);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'msg bot';
                botMsg.innerText = "Thanks for your message! A mechanic will respond shortly.";
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        };
    },

    renderEmergency() {
        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 900px; margin: 2rem auto; padding: 1rem;">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 3rem;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: rgba(220, 38, 38, 0.15); border: 2px solid #dc2626; margin-bottom: 1.5rem; animation: pulse 2s infinite;">
                        <i data-lucide="alert-triangle" style="color: #dc2626; width: 40px; height: 40px;"></i>
                    </div>
                    <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Emergency Breakdown Assistance</h1>
                    <p style="color: var(--text-muted); font-size: 1.1rem;">We'll get you back on the road — fast. Average response time: <strong style="color: #dc2626;">12 minutes</strong>.</p>
                </div>

                <!-- SOS Button -->
                <div class="feature-card" style="text-align: center; padding: 3rem; border: 2px solid rgba(220, 38, 38, 0.3); background: rgba(220, 38, 38, 0.05); margin-bottom: 2rem;">
                    <h2 style="margin-bottom: 0.5rem;">🚨 Emergency SOS</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Press the button below to instantly alert the nearest available mechanic with your current GPS location.</p>
                    <button id="sos-trigger-btn" onclick="App.triggerEmergencySOS()" style="
                        background: #dc2626;
                        color: #fff;
                        border: none;
                        border-radius: 50%;
                        width: 160px;
                        height: 160px;
                        font-size: 1.4rem;
                        font-weight: 900;
                        cursor: pointer;
                        letter-spacing: 2px;
                        box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
                        animation: pulse 2s infinite;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                        SOS
                    </button>
                    <p style="margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted);">Your location will be shared automatically</p>
                </div>

                <!-- Roadside Assistance Request Form -->
                <div class="feature-card" style="padding: 2.5rem; margin-bottom: 2rem;">
                    <h3 style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                        <i data-lucide="truck" style="color: #dc2626;"></i>
                        Instant Roadside Assistance Request
                    </h3>
                    <form id="sos-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" class="form-input" placeholder="e.g. Rahul Sharma" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" class="form-input" placeholder="+91 98765 43210" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Current Location / Address</label>
                            <input type="text" class="form-input" placeholder="e.g. NH-48, Gurgaon near Toll Booth 3" required>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="form-group">
                                <label>Vehicle Type</label>
                                <select class="form-input">
                                    <option>Car</option>
                                    <option>Bike / Scooter</option>
                                    <option>SUV / MUV</option>
                                    <option>Truck / Commercial</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Problem Type</label>
                                <select class="form-input">
                                    <option>Flat Tyre</option>
                                    <option>Engine Breakdown</option>
                                    <option>Battery Dead</option>
                                    <option>Fuel Empty</option>
                                    <option>Accident / Damage</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Additional Details (optional)</label>
                            <textarea class="form-input" rows="3" placeholder="Describe your situation..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.25rem; font-size: 1.1rem; background: #dc2626; justify-content: center;">
                            <i data-lucide="send"></i> Send Emergency Request
                        </button>
                    </form>
                </div>

                <!-- Live Tracking Panel -->
                <div class="feature-card" style="padding: 2.5rem; margin-bottom: 2rem;">
                    <h3 style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                        <i data-lucide="map-pin" style="color: var(--primary);"></i>
                        Live Tracking of Assigned Mechanic
                    </h3>
                    <div id="tracking-status" style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Status Steps -->
                        <div class="track-step" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3);">
                            <div style="background: var(--primary); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="check-circle" style="color: #fff; width: 20px;"></i>
                            </div>
                            <div>
                                <p style="font-weight: 700; margin: 0;">SOS Signal Received</p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Your emergency request has been logged.</p>
                            </div>
                            <span style="margin-left: auto; font-size: 0.8rem; color: var(--text-muted);">12:01 PM</span>
                        </div>
                        <div class="track-step" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3);">
                            <div style="background: #f59e0b; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; animation: pulse 1.5s infinite;">
                                <i data-lucide="user" style="color: #fff; width: 20px;"></i>
                            </div>
                            <div>
                                <p style="font-weight: 700; margin: 0;">Mechanic Assigned — <span style="color: #f59e0b;">Rajesh Kumar</span></p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">⭐ 4.9 rating · ETA: <strong>~8 minutes</strong></p>
                            </div>
                            <span style="margin-left: auto; font-size: 0.8rem; color: var(--text-muted);">Now</span>
                        </div>
                        <div class="track-step" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); opacity: 0.5;">
                            <div style="background: var(--bg-surface); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="wrench" style="width: 20px;"></i>
                            </div>
                            <div>
                                <p style="font-weight: 700; margin: 0;">Mechanic Arrived</p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Waiting for mechanic to reach your location.</p>
                            </div>
                        </div>
                        <div class="track-step" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); opacity: 0.5;">
                            <div style="background: var(--bg-surface); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="check-square" style="width: 20px;"></i>
                            </div>
                            <div>
                                <p style="font-weight: 700; margin: 0;">Issue Resolved</p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Your vehicle is back in service.</p>
                            </div>
                        </div>
                    </div>
                    <a href="#tracking" class="btn btn-primary" style="margin-top: 2rem; width: 100%; justify-content: center;">
                        <i data-lucide="navigation"></i> Open Live Map Tracking
                    </a>
                </div>

                <!-- Emergency Contacts -->
                <div class="features-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div class="feature-card" style="text-align: center; padding: 1.5rem;">
                        <i data-lucide="phone-call" style="color: #dc2626; width: 28px; margin-bottom: 0.75rem;"></i>
                        <h4>24/7 Helpline</h4>
                        <p style="color: var(--primary); font-weight: 700; font-size: 1.1rem;">+91 1800-FIX-RIDE</p>
                    </div>
                    <div class="feature-card" style="text-align: center; padding: 1.5rem;">
                        <i data-lucide="clock" style="color: var(--primary); width: 28px; margin-bottom: 0.75rem;"></i>
                        <h4>Avg. Response Time</h4>
                        <p style="color: var(--primary); font-weight: 700; font-size: 1.1rem;">12 Minutes</p>
                    </div>
                    <div class="feature-card" style="text-align: center; padding: 1.5rem;">
                        <i data-lucide="shield-check" style="color: #22c55e; width: 28px; margin-bottom: 0.75rem;"></i>
                        <h4>Verified Mechanics</h4>
                        <p style="color: #22c55e; font-weight: 700; font-size: 1.1rem;">100% Certified</p>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('sos-form').onsubmit = (e) => {
            e.preventDefault();
            this.notify('🚨 Emergency request sent! Mechanic Rajesh Kumar is on the way (ETA: 8 min).', 'success');
        };
    },

    triggerEmergencySOS() {
        const btn = document.getElementById('sos-trigger-btn');
        if (btn) {
            btn.innerText = '✓ SENT';
            btn.style.background = '#22c55e';
            btn.style.animation = 'none';
        }
        this.notify('🚨 SOS Alert Sent! Nearest mechanic has been dispatched to your location.', 'danger');
    },

    renderPayments() {
        const paymentHistory = [
            { id: 'TXN-8821', service: 'Engine Repair', date: '05 May 2026', amount: '₹2,499', method: 'UPI', status: 'Success' },
            { id: 'TXN-8720', service: 'Oil Change', date: '28 Apr 2026', amount: '₹799', method: 'Debit Card', status: 'Success' },
            { id: 'TXN-8601', service: 'Tire Replacement', date: '15 Apr 2026', amount: '₹1,299', method: 'Wallet', status: 'Success' },
            { id: 'TXN-8499', service: 'Battery Service', date: '02 Apr 2026', amount: '₹599', method: 'Cash', status: 'Completed' },
            { id: 'TXN-8311', service: 'Car Washing', date: '20 Mar 2026', amount: '₹349', method: 'UPI', status: 'Success' },
        ];

        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 950px; margin: 2rem auto; padding: 1rem;">

                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
                    <div>
                        <h1 style="font-size: 2rem; margin-bottom: 0.25rem;">Online Payments</h1>
                        <p style="color: var(--text-muted);">Secure, fast and flexible payment options for all services</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); padding: 0.5rem 1rem; border-radius: 2rem;">
                        <i data-lucide="shield-check" style="color: #22c55e; width: 16px;"></i>
                        <span style="color: #22c55e; font-size: 0.875rem; font-weight: 600;">256-bit SSL Secured</span>
                    </div>
                </div>

                <!-- Amount Summary -->
                <div class="feature-card" style="padding: 2rem; margin-bottom: 2rem; background: linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(245,158,11,0.05) 100%); border-color: rgba(14,165,233,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.25rem;">Amount Due</p>
                            <h2 style="font-size: 3rem; margin: 0; color: var(--primary);">₹2,499</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Engine Repair — Booking #BK-1042</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Due by <strong>10 May 2026</strong></p>
                            <span style="background: rgba(245,158,11,0.15); color: #f59e0b; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 700;">PENDING</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Method Tabs -->
                <div class="feature-card" style="padding: 2.5rem; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1.5rem;">Choose Payment Method</h3>
                    <div id="payment-tabs" style="display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
                        <button onclick="App.switchPayTab('upi', this)" class="pay-tab active-tab" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;border:2px solid var(--primary);background:rgba(14,165,233,0.1);color:var(--primary);font-weight:700;cursor:pointer;">
                            📱 UPI
                        </button>
                        <button onclick="App.switchPayTab('card', this)" class="pay-tab" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);font-weight:600;cursor:pointer;">
                            💳 Debit / Credit Card
                        </button>
                        <button onclick="App.switchPayTab('wallet', this)" class="pay-tab" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);font-weight:600;cursor:pointer;">
                            👜 Wallets
                        </button>
                        <button onclick="App.switchPayTab('cash', this)" class="pay-tab" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);font-weight:600;cursor:pointer;">
                            💵 Cash on Service
                        </button>
                    </div>

                    <!-- UPI Panel -->
                    <div id="panel-upi" class="pay-panel">
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Pay securely using any UPI app — GPay, PhonePe, Paytm, BHIM and more.</p>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
                            ${['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => `
                                <div onclick="document.getElementById('upi-id').focus()" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 1rem; padding: 1.25rem; text-align: center; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--glass-border)'">
                                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${app === 'GPay' ? '🟦' : app === 'PhonePe' ? '🟣' : app === 'Paytm' ? '🔵' : '🟩'}</div>
                                    <p style="font-weight: 600; font-size: 0.875rem;">${app}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="form-group">
                            <label>Or Enter UPI ID</label>
                            <input id="upi-id" type="text" class="form-input" placeholder="yourname@upi" style="font-size: 1.1rem;">
                        </div>
                        <button onclick="App.processPayment('UPI')" class="btn btn-primary" style="width:100%;padding:1.25rem;font-size:1.1rem;justify-content:center;margin-top:1rem;">
                            <i data-lucide="zap"></i> Pay ₹2,499 via UPI
                        </button>
                    </div>

                    <!-- Card Panel -->
                    <div id="panel-card" class="pay-panel" style="display:none;">
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">We accept Visa, MasterCard, RuPay, and American Express.</p>
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="grid-column: span 1;">
                                <label>Cardholder Name</label>
                                <input type="text" class="form-input" placeholder="Full Name">
                            </div>
                            <div class="form-group">
                                <label>Expiry</label>
                                <input type="text" class="form-input" placeholder="MM / YY" maxlength="7">
                            </div>
                            <div class="form-group">
                                <label>CVV</label>
                                <input type="password" class="form-input" placeholder="• • •" maxlength="3">
                            </div>
                        </div>
                        <label style="display:flex;align-items:center;gap:0.5rem;color:var(--text-muted);font-size:0.875rem;margin-bottom:1rem;">
                            <input type="checkbox"> Save this card for future payments
                        </label>
                        <button onclick="App.processPayment('Debit/Credit Card')" class="btn btn-primary" style="width:100%;padding:1.25rem;font-size:1.1rem;justify-content:center;">
                            <i data-lucide="credit-card"></i> Pay ₹2,499
                        </button>
                    </div>

                    <!-- Wallet Panel -->
                    <div id="panel-wallet" class="pay-panel" style="display:none;">
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Choose your preferred digital wallet.</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                            ${[['Paytm Wallet', '🔵', '₹1,250 balance'], ['Amazon Pay', '🟠', '₹340 balance'], ['MobiKwik', '🟣', '₹0 balance'], ['Freecharge', '🟢', '₹89 balance']].map(([name, icon, bal]) => `
                                <div onclick="App.processPayment('${name}')" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 1rem; padding: 1.25rem; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--glass-border)'">
                                    <span style="font-size: 2rem;">${icon}</span>
                                    <div>
                                        <p style="font-weight: 700; margin: 0;">${name}</p>
                                        <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">${bal}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Cash Panel -->
                    <div id="panel-cash" class="pay-panel" style="display:none;">
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 4rem; margin-bottom: 1.5rem;">💵</div>
                            <h3 style="margin-bottom: 1rem;">Cash on Service</h3>
                            <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 2rem;">Pay in cash directly to the mechanic after service is completed. Our mechanics carry digital receipts and change.</p>
                            <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem;">
                                <p style="color: #22c55e; font-weight: 700; font-size: 1.1rem;">✓ No upfront payment required</p>
                                <p style="color: var(--text-muted); font-size: 0.875rem; margin: 0;">Amount due: ₹2,499 payable after service</p>
                            </div>
                            <button onclick="App.processPayment('Cash on Service')" class="btn btn-primary" style="width:100%;padding:1.25rem;font-size:1.1rem;justify-content:center;background:#22c55e;">
                                <i data-lucide="check-circle"></i> Confirm Cash on Service
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Payment History -->
                <div class="feature-card" style="padding: 2.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="margin: 0;">Payment History</h3>
                        <button class="btn btn-secondary" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                            <i data-lucide="download"></i> Download All
                        </button>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <th style="text-align: left; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Transaction ID</th>
                                    <th style="text-align: left; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Service</th>
                                    <th style="text-align: left; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Date</th>
                                    <th style="text-align: left; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Method</th>
                                    <th style="text-align: right; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Amount</th>
                                    <th style="text-align: center; padding: 0.75rem; color: var(--text-muted); font-weight: 600;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paymentHistory.map(tx => `
                                    <tr style="border-bottom: 1px solid var(--glass-border); transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding: 1rem 0.75rem; font-family: monospace; color: var(--primary);">${tx.id}</td>
                                        <td style="padding: 1rem 0.75rem; font-weight: 600;">${tx.service}</td>
                                        <td style="padding: 1rem 0.75rem; color: var(--text-muted);">${tx.date}</td>
                                        <td style="padding: 1rem 0.75rem;">
                                            <span style="background: rgba(14,165,233,0.1); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 600;">${tx.method}</span>
                                        </td>
                                        <td style="padding: 1rem 0.75rem; text-align: right; font-weight: 700; font-size: 1rem;">${tx.amount}</td>
                                        <td style="padding: 1rem 0.75rem; text-align: center;">
                                            <span style="background: rgba(34,197,94,0.1); color: #22c55e; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 700;">${tx.status}</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    switchPayTab(tab, el) {
        document.querySelectorAll('.pay-panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.pay-tab').forEach(t => {
            t.style.border = '1px solid var(--glass-border)';
            t.style.background = 'transparent';
            t.style.color = 'var(--text-muted)';
        });
        document.getElementById('panel-' + tab).style.display = 'block';
        el.style.border = '2px solid var(--primary)';
        el.style.background = 'rgba(14,165,233,0.1)';
        el.style.color = 'var(--primary)';
    },

    processPayment(method) {
        this.notify(`✅ Payment of ₹2,499 via ${method} processed successfully!`, 'success');
        setTimeout(() => { window.location.hash = 'history'; }, 2000);
    },

    renderEstimate() {
        const services = [
            { id: 'engine', name: 'Engine Repair', icon: 'settings', min: 1499, max: 4999, labor: 500, parts: 1200, time: '3–5 hrs' },
            { id: 'oil', name: 'Oil Change', icon: 'droplet', min: 699, max: 1299, labor: 200, parts: 450, time: '30–45 min' },
            { id: 'tire', name: 'Tire Replacement', icon: 'disc', min: 899, max: 2499, labor: 300, parts: 800, time: '45–60 min' },
            { id: 'battery', name: 'Battery Service', icon: 'battery-charging', min: 499, max: 3499, labor: 150, parts: 1800, time: '30–40 min' },
            { id: 'brake', name: 'Brake Overhaul', icon: 'alert-circle', min: 799, max: 2999, labor: 400, parts: 900, time: '1–2 hrs' },
            { id: 'ac', name: 'AC Service', icon: 'wind', min: 1299, max: 3999, labor: 600, parts: 1500, time: '2–3 hrs' },
            { id: 'wash', name: 'Car Washing', icon: 'droplets', min: 299, max: 799, labor: 200, parts: 50, time: '45–60 min' },
            { id: 'general', name: 'General Servicing', icon: 'wrench', min: 1199, max: 2999, labor: 700, parts: 1000, time: '3–4 hrs' },
        ];

        this.mainContent.innerHTML = `
            <div class="fade-in" style="max-width: 960px; margin: 2rem auto; padding: 1rem;">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Estimated Cost System</h1>
                    <p style="color: var(--text-muted); font-size: 1.1rem;">Transparent pricing before you confirm — no hidden charges, ever.</p>
                </div>

                <!-- Service Selector -->
                <div class="feature-card" style="padding: 2.5rem; margin-bottom: 2rem;">
                    <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                        <i data-lucide="list" style="color: var(--primary);"></i> Select a Service to Estimate
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        ${services.map(s => `
                            <div onclick="App.showEstimate('${s.id}')"
                                id="svc-${s.id}"
                                style="background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); border-radius: 1rem; padding: 1.25rem; cursor: pointer; text-align: center; transition: 0.2s;"
                                onmouseover="this.style.borderColor='var(--primary)'" onmouseout="if(!this.classList.contains('selected'))this.style.borderColor='var(--glass-border)'">
                                <i data-lucide="${s.icon}" style="color: var(--primary); width: 28px; height: 28px; margin-bottom: 0.75rem;"></i>
                                <p style="font-weight: 700; margin: 0 0 0.25rem;">${s.name}</p>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">₹${s.min.toLocaleString()} – ₹${s.max.toLocaleString()}</p>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Vehicle Details -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Vehicle Type</label>
                            <select class="form-input" id="est-vtype" onchange="App.recalcEstimate()">
                                <option value="1">Hatchback (Economy)</option>
                                <option value="1.2">Sedan (Mid-Range)</option>
                                <option value="1.5">SUV / MUV (Premium)</option>
                                <option value="2">Luxury Car</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Service Type</label>
                            <select class="form-input" id="est-stype" onchange="App.recalcEstimate()">
                                <option value="1">Standard</option>
                                <option value="1.3">Express (+30%)</option>
                                <option value="1.5">Doorstep (+50%)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Promo Code</label>
                            <input type="text" class="form-input" id="est-promo" placeholder="e.g. FMR10" oninput="App.recalcEstimate()">
                        </div>
                    </div>
                </div>

                <!-- Estimate Breakdown (hidden until service selected) -->
                <div id="estimate-panel" style="display: none;">
                    <div class="feature-card" style="padding: 2.5rem; margin-bottom: 2rem; border-color: rgba(14,165,233,0.3);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
                            <div>
                                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.25rem;">Estimated Total</p>
                                <h2 id="est-total" style="font-size: 3.5rem; margin: 0; color: var(--primary);">₹0</h2>
                                <p id="est-range" style="color: var(--text-muted); font-size: 0.875rem;">Range: ₹0 – ₹0</p>
                            </div>
                            <div style="text-align: right;">
                                <span id="est-time-badge" style="background: rgba(245,158,11,0.15); color: #f59e0b; padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">⏱ Est. Time: –</span>
                                <span style="background: rgba(34,197,94,0.1); color: #22c55e; padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 700;">✓ No Hidden Charges</span>
                            </div>
                        </div>

                        <!-- Cost Breakdown Table -->
                        <h4 style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 1px;">Cost Breakdown</h4>
                        <div id="breakdown-rows" style="border: 1px solid var(--glass-border); border-radius: 1rem; overflow: hidden;">
                            <!-- rows injected by JS -->
                        </div>
                    </div>

                    <!-- Transparency Notice -->
                    <div class="features-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        <div class="feature-card" style="padding: 1.5rem; text-align: center;">
                            <i data-lucide="eye" style="color: var(--primary); width: 28px; margin-bottom: 0.75rem;"></i>
                            <h4 style="margin-bottom: 0.25rem;">100% Transparent</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Itemised breakdown of parts, labor and taxes shown upfront.</p>
                        </div>
                        <div class="feature-card" style="padding: 1.5rem; text-align: center;">
                            <i data-lucide="shield-check" style="color: #22c55e; width: 28px; margin-bottom: 0.75rem;"></i>
                            <h4 style="margin-bottom: 0.25rem;">Price Lock</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Confirmed estimate is locked — you pay what we quote.</p>
                        </div>
                        <div class="feature-card" style="padding: 1.5rem; text-align: center;">
                            <i data-lucide="file-text" style="color: #f59e0b; width: 28px; margin-bottom: 0.75rem;"></i>
                            <h4 style="margin-bottom: 0.25rem;">Instant Invoice</h4>
                            <p style="font-size: 0.85rem; color: var(--text-muted);">Auto-generated PDF invoice emailed after service completion.</p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button onclick="App.generateInvoiceFromEstimate()" class="btn btn-primary" style="flex: 1; padding: 1.25rem; font-size: 1.1rem; justify-content: center;">
                            <i data-lucide="file-text"></i> Generate Detailed Invoice
                        </button>
                        <a href="#booking" class="btn btn-secondary" style="flex: 1; padding: 1.25rem; font-size: 1.1rem; justify-content: center;">
                            <i data-lucide="calendar"></i> Proceed to Booking
                        </a>
                        <a href="#payments" class="btn" style="flex: 1; padding: 1.25rem; font-size: 1.1rem; justify-content: center; background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.3);">
                            <i data-lucide="credit-card"></i> Pay Now
                        </a>
                    </div>
                </div>

            </div>
        `;
        lucide.createIcons();
    },

    _selectedService: null,

    showEstimate(id) {
        const services = {
            engine: { name: 'Engine Repair', icon: 'settings', min: 1499, max: 4999, labor: 500, parts: 1200, time: '3–5 hrs' },
            oil: { name: 'Oil Change', icon: 'droplet', min: 699, max: 1299, labor: 200, parts: 450, time: '30–45 min' },
            tire: { name: 'Tire Replacement', icon: 'disc', min: 899, max: 2499, labor: 300, parts: 800, time: '45–60 min' },
            battery: { name: 'Battery Service', icon: 'battery-charging', min: 499, max: 3499, labor: 150, parts: 1800, time: '30–40 min' },
            brake: { name: 'Brake Overhaul', icon: 'alert-circle', min: 799, max: 2999, labor: 400, parts: 900, time: '1–2 hrs' },
            ac: { name: 'AC Service', icon: 'wind', min: 1299, max: 3999, labor: 600, parts: 1500, time: '2–3 hrs' },
            wash: { name: 'Car Washing', icon: 'droplets', min: 299, max: 799, labor: 200, parts: 50, time: '45–60 min' },
            general: { name: 'General Servicing', icon: 'wrench', min: 1199, max: 2999, labor: 700, parts: 1000, time: '3–4 hrs' },
        };
        // Highlight selection
        document.querySelectorAll('[id^="svc-"]').forEach(el => {
            el.classList.remove('selected');
            el.style.borderColor = 'var(--glass-border)';
            el.style.background = 'rgba(255,255,255,0.04)';
        });
        const card = document.getElementById('svc-' + id);
        if (card) { card.classList.add('selected'); card.style.borderColor = 'var(--primary)'; card.style.background = 'rgba(14,165,233,0.1)'; }

        this._selectedService = { id, ...services[id] };
        document.getElementById('estimate-panel').style.display = 'block';
        this.recalcEstimate();
        document.getElementById('estimate-panel').scrollIntoView({ behavior: 'smooth' });
    },

    recalcEstimate() {
        const s = this._selectedService;
        if (!s) return;
        const vtypeMul = parseFloat(document.getElementById('est-vtype')?.value || 1);
        const stypeMul = parseFloat(document.getElementById('est-stype')?.value || 1);
        const promoCode = document.getElementById('est-promo')?.value?.trim().toUpperCase();
        const discount = (promoCode === 'FMR10') ? 0.10 : (promoCode === 'FMR20') ? 0.20 : 0;

        const labor = Math.round(s.labor * vtypeMul * stypeMul);
        const parts = Math.round(s.parts * vtypeMul);
        const gst = Math.round((labor + parts) * 0.18);
        let subtotal = labor + parts + gst;
        const discAmt = Math.round(subtotal * discount);
        const total = subtotal - discAmt;
        const minT = Math.round(s.min * vtypeMul * stypeMul * (1 - discount));
        const maxT = Math.round(s.max * vtypeMul * stypeMul * (1 - discount));

        document.getElementById('est-total').textContent = '₹' + total.toLocaleString('en-IN');
        document.getElementById('est-range').textContent = `Range: ₹${minT.toLocaleString('en-IN')} – ₹${maxT.toLocaleString('en-IN')}`;
        document.getElementById('est-time-badge').textContent = '⏱ Est. Time: ' + s.time;

        const rows = [
            ['Labor Charges', '₹' + labor.toLocaleString('en-IN'), ''],
            ['Parts & Materials', '₹' + parts.toLocaleString('en-IN'), ''],
            ['GST (18%)', '₹' + gst.toLocaleString('en-IN'), ''],
            ...(discAmt > 0 ? [['Promo Discount (' + promoCode + ')', '−₹' + discAmt.toLocaleString('en-IN'), 'discount']] : []),
            ['TOTAL', '₹' + total.toLocaleString('en-IN'), 'total'],
        ];

        document.getElementById('breakdown-rows').innerHTML = rows.map(([label, val, type]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--glass-border); ${type === 'total' ? 'background: rgba(14,165,233,0.08); font-weight: 800; font-size: 1.1rem;' : ''}">
                <span style="color: ${type === 'discount' ? '#22c55e' : type === 'total' ? 'var(--primary)' : 'var(--text-main)'};">${label}</span>
                <span style="font-weight: 700; color: ${type === 'discount' ? '#22c55e' : type === 'total' ? 'var(--primary)' : 'var(--text-main)'};">${val}</span>
            </div>
        `).join('');
        lucide.createIcons();
    },

    generateInvoiceFromEstimate() {
        const s = this._selectedService;
        if (!s) { this.notify('Please select a service first.', 'info'); return; }
        this.notify(`📄 Invoice generated for ${s.name}! Redirecting…`, 'success');
        setTimeout(() => { window.location.hash = 'invoice'; }, 1500);
    },

    initLang() {
        const select = document.getElementById('lang-select');
        if (select) {
            select.onchange = (e) => {
                this.notify(`Language changed to ${e.target.value.toUpperCase()}`, 'info');
            };
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
