// FixMyRide - GPS-Based Mechanic Search & Tracking

const Maps = {
    mechanics: [
        { id: 1, name: 'Rajesh Kumar', specialty: 'Engine Expert', rating: 4.9, reviews: 234, distance: 1.2, eta: 8, lat: 28.6145, lng: 77.2090, available: true, avatar: 'R', phone: '+91 98765 43210', price: '₹499/hr' },
        { id: 2, name: 'Suresh Patel', specialty: 'Tyre & Brake Specialist', rating: 4.7, reviews: 189, distance: 2.4, eta: 14, lat: 28.6200, lng: 77.2150, available: true, avatar: 'S', phone: '+91 87654 32109', price: '₹399/hr' },
        { id: 3, name: 'Amit Garage', specialty: 'Full Service Center', rating: 4.8, reviews: 412, distance: 3.1, eta: 18, lat: 28.6080, lng: 77.2200, available: true, avatar: 'A', phone: '+91 76543 21098', price: '₹599/hr' },
        { id: 4, name: 'Vikram Auto Works', specialty: 'AC & Electrical', rating: 4.6, reviews: 156, distance: 4.5, eta: 22, lat: 28.6250, lng: 77.1980, available: false, avatar: 'V', phone: '+91 65432 10987', price: '₹449/hr' },
        { id: 5, name: 'Deepak Motors', specialty: 'Transmission & Clutch', rating: 4.5, reviews: 98, distance: 5.8, eta: 28, lat: 28.6020, lng: 77.2300, available: true, avatar: 'D', phone: '+91 54321 09876', price: '₹549/hr' },
        { id: 6, name: 'Quick Fix Garage', specialty: 'Battery & Electrical', rating: 4.4, reviews: 67, distance: 6.2, eta: 32, lat: 28.6300, lng: 77.2050, available: true, avatar: 'Q', phone: '+91 43210 98765', price: '₹349/hr' }
    ],

    state: {
        selectedMechanic: null,
        isTracking: false,
        userPos: { x: 55, y: 45 },
        filter: 'all',
        trackingProgress: 0
    },

    // --- Mechanic Search Page ---
    renderSearch() {
        const container = document.getElementById('main-content');
        const filtered = this.getFiltered();

        container.innerHTML = `
            <div class="fade-in">
                <header class="mapsearch-header">
                    <div>
                        <a href="#dashboard" class="btn btn-secondary" style="margin-bottom:1rem"><i data-lucide="arrow-left"></i> Dashboard</a>
                        <h1 style="font-size:2.5rem">Find Nearby Mechanics</h1>
                        <p style="color:var(--text-muted)">GPS-powered search — showing mechanics near your location</p>
                    </div>
                    <div class="mapsearch-location-badge">
                        <div class="mapsearch-loc-dot"></div>
                        <div>
                            <p style="font-weight:700;margin:0">📍 Your Location</p>
                            <p style="font-size:0.8rem;color:var(--text-muted);margin:0">Connaught Place, New Delhi</p>
                        </div>
                    </div>
                </header>

                <!-- Map + Sidebar -->
                <div class="mapsearch-layout">
                    <!-- Interactive Map -->
                    <div class="mapsearch-map" id="gps-map">
                        <div class="mapsearch-grid-overlay"></div>
                        <!-- Roads -->
                        <svg class="mapsearch-roads">
                            <path d="M 0 200 H 900" stroke="rgba(255,255,255,0.06)" stroke-width="30" fill="none"/>
                            <path d="M 0 350 H 900" stroke="rgba(255,255,255,0.06)" stroke-width="25" fill="none"/>
                            <path d="M 300 0 V 600" stroke="rgba(255,255,255,0.06)" stroke-width="25" fill="none"/>
                            <path d="M 550 0 V 600" stroke="rgba(255,255,255,0.06)" stroke-width="20" fill="none"/>
                            <path d="M 150 100 Q 300 200 500 180 T 800 300" stroke="rgba(255,255,255,0.04)" stroke-width="35" fill="none"/>
                        </svg>
                        <!-- User marker -->
                        <div class="mapsearch-user-pin" style="left:${this.state.userPos.x}%;top:${this.state.userPos.y}%">
                            <div class="mapsearch-user-ring"></div>
                            <div class="mapsearch-user-dot"></div>
                            <span class="mapsearch-user-label">You</span>
                        </div>
                        <!-- Mechanic markers -->
                        ${this.mechanics.map((m, i) => {
                            const positions = [
                                {x:25,y:30},{x:72,y:22},{x:18,y:68},{x:80,y:60},{x:40,y:78},{x:68,y:75}
                            ];
                            const p = positions[i] || {x:50,y:50};
                            return `
                            <div class="mapsearch-mech-pin ${m.available ? '' : 'unavailable'}"
                                 style="left:${p.x}%;top:${p.y}%"
                                 onclick="Maps.selectMechanic(${m.id})"
                                 id="mpin-${m.id}">
                                <div class="mapsearch-mech-icon">${m.avatar}</div>
                                <div class="mapsearch-mech-tooltip">
                                    <strong>${m.name}</strong><br>
                                    <span>${m.distance} km • ${m.eta} min</span>
                                </div>
                            </div>`;
                        }).join('')}
                        <!-- Radius circles -->
                        <div class="mapsearch-radius r1" style="left:${this.state.userPos.x}%;top:${this.state.userPos.y}%"></div>
                        <div class="mapsearch-radius r2" style="left:${this.state.userPos.x}%;top:${this.state.userPos.y}%"></div>
                    </div>

                    <!-- Sidebar -->
                    <div class="mapsearch-sidebar">
                        <!-- Filters -->
                        <div class="mapsearch-filters">
                            <button class="mapsearch-filter-btn ${this.state.filter==='all'?'active':''}" onclick="Maps.setFilter('all')">All</button>
                            <button class="mapsearch-filter-btn ${this.state.filter==='available'?'active':''}" onclick="Maps.setFilter('available')">Available</button>
                            <button class="mapsearch-filter-btn ${this.state.filter==='nearest'?'active':''}" onclick="Maps.setFilter('nearest')">Nearest</button>
                            <button class="mapsearch-filter-btn ${this.state.filter==='top'?'active':''}" onclick="Maps.setFilter('top')">Top Rated</button>
                        </div>
                        <h3 style="margin-bottom:1rem">${filtered.length} Mechanics Found</h3>
                        <div class="mapsearch-list">
                            ${filtered.map(m => `
                                <div class="mapsearch-card ${this.state.selectedMechanic===m.id?'selected':''}" onclick="Maps.selectMechanic(${m.id})" id="mcard-${m.id}">
                                    <div class="mapsearch-card-top">
                                        <div class="mapsearch-avatar" style="background:${m.available?'var(--primary)':'#64748b'}">${m.avatar}</div>
                                        <div style="flex:1">
                                            <h4 style="margin:0">${m.name}</h4>
                                            <p style="font-size:0.8rem;color:var(--text-muted);margin:0">${m.specialty}</p>
                                        </div>
                                        <span class="mapsearch-status ${m.available?'online':'offline'}">${m.available?'Online':'Busy'}</span>
                                    </div>
                                    <div class="mapsearch-card-stats">
                                        <span>⭐ ${m.rating} (${m.reviews})</span>
                                        <span>📍 ${m.distance} km</span>
                                        <span>⏱ ${m.eta} min</span>
                                    </div>
                                    <div class="mapsearch-card-bottom">
                                        <span style="font-weight:700;color:var(--primary)">${m.price}</span>
                                        ${m.available ? `<button class="btn btn-primary" style="padding:0.4rem 1rem;font-size:0.8rem" onclick="event.stopPropagation();Maps.requestMechanic(${m.id})">Request</button>` : `<span style="font-size:0.8rem;color:var(--text-muted)">Unavailable</span>`}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    getFiltered() {
        let list = [...this.mechanics];
        if (this.state.filter === 'available') list = list.filter(m => m.available);
        if (this.state.filter === 'nearest') list.sort((a,b) => a.distance - b.distance);
        if (this.state.filter === 'top') list.sort((a,b) => b.rating - a.rating);
        return list;
    },

    setFilter(f) {
        this.state.filter = f;
        this.renderSearch();
    },

    selectMechanic(id) {
        this.state.selectedMechanic = id;
        // Highlight card
        document.querySelectorAll('.mapsearch-card').forEach(c => c.classList.remove('selected'));
        const card = document.getElementById('mcard-' + id);
        if (card) card.classList.add('selected');
        // Highlight pin
        document.querySelectorAll('.mapsearch-mech-pin').forEach(p => p.classList.remove('active'));
        const pin = document.getElementById('mpin-' + id);
        if (pin) pin.classList.add('active');
    },

    requestMechanic(id) {
        const m = this.mechanics.find(x => x.id === id);
        if (!m) return;
        this.state.selectedMechanic = id;
        App.notify(`🔧 ${m.name} has been requested! ETA: ${m.eta} minutes`, 'success');
        setTimeout(() => {
            this.state.isTracking = true;
            this.state.trackingProgress = 0;
            this.renderLiveTracking(m);
        }, 1500);
    },

    // --- Live Tracking Page ---
    renderLiveTracking(mechanic) {
        const m = mechanic || this.mechanics.find(x => x.id === this.state.selectedMechanic) || this.mechanics[0];
        const container = document.getElementById('main-content');

        container.innerHTML = `
            <div class="fade-in">
                <header style="margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
                    <div>
                        <a href="#mechanic-search" class="btn btn-secondary" style="margin-bottom:1rem"><i data-lucide="arrow-left"></i> Back to Search</a>
                        <h1>Live Tracking</h1>
                        <p style="color:var(--text-muted)">${m.name} is on the way to your location</p>
                    </div>
                    <div class="mapsearch-eta-badge">
                        <div class="mapsearch-eta-pulse"></div>
                        <span style="font-weight:800;font-size:1.2rem">ETA: <span id="live-eta">${m.eta}</span> Min</span>
                    </div>
                </header>

                <div class="mapsearch-tracking-layout">
                    <!-- Map -->
                    <div class="mapsearch-map" id="tracking-map" style="height:500px">
                        <div class="mapsearch-grid-overlay"></div>
                        <svg class="mapsearch-roads">
                            <path d="M 80 420 L 250 420 L 450 220 L 800 220" stroke="rgba(255,255,255,0.08)" stroke-width="35" fill="none" stroke-linecap="round"/>
                            <path id="route-path" d="M 80 420 L 250 420 L 450 220 L 800 220" stroke="var(--primary)" stroke-width="3" fill="none" stroke-dasharray="8,8" stroke-linecap="round">
                                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite"/>
                            </path>
                        </svg>
                        <!-- User -->
                        <div class="mapsearch-user-pin" style="left:80%;top:40%">
                            <div class="mapsearch-user-ring"></div>
                            <div class="mapsearch-user-dot"></div>
                            <span class="mapsearch-user-label">You</span>
                        </div>
                        <!-- Mechanic moving -->
                        <div id="tracking-mech" class="mapsearch-tracking-mech" style="left:8%;top:82%">
                            <div class="mapsearch-mech-icon moving">${m.avatar}</div>
                            <span class="mapsearch-mech-name-tag">${m.name}</span>
                        </div>
                        <!-- Distance overlay -->
                        <div class="mapsearch-dist-overlay" id="dist-overlay">
                            <i data-lucide="navigation" style="width:14px"></i>
                            <span id="live-distance">${m.distance} km away</span>
                        </div>
                    </div>

                    <!-- Info Panel -->
                    <div class="mapsearch-info-panel">
                        <div class="feature-card">
                            <h3 style="margin-bottom:1.5rem">Mechanic Details</h3>
                            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
                                <div class="mapsearch-avatar lg" style="background:var(--primary)">${m.avatar}</div>
                                <div>
                                    <p style="font-weight:700;font-size:1.1rem;margin:0">${m.name}</p>
                                    <p style="font-size:0.8rem;color:var(--text-muted);margin:0">${m.specialty}</p>
                                    <p style="font-size:0.8rem;color:var(--primary);margin:0.25rem 0 0">⭐ ${m.rating} (${m.reviews} reviews)</p>
                                </div>
                            </div>
                            <div class="mapsearch-info-stats">
                                <div class="mapsearch-info-stat">
                                    <span class="mapsearch-info-stat-label">Distance</span>
                                    <span class="mapsearch-info-stat-value" id="info-dist">${m.distance} km</span>
                                </div>
                                <div class="mapsearch-info-stat">
                                    <span class="mapsearch-info-stat-label">ETA</span>
                                    <span class="mapsearch-info-stat-value" id="info-eta">${m.eta} min</span>
                                </div>
                                <div class="mapsearch-info-stat">
                                    <span class="mapsearch-info-stat-label">Rate</span>
                                    <span class="mapsearch-info-stat-value">${m.price}</span>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem" onclick="window.location.href='tel:${m.phone}'"><i data-lucide="phone"></i> Call Mechanic</button>
                            <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:0.75rem" onclick="document.getElementById('chat-toggle').click()"><i data-lucide="message-square"></i> Chat</button>
                        </div>

                        <!-- Progress Steps -->
                        <div class="feature-card" style="margin-top:1.5rem">
                            <h3 style="margin-bottom:1rem">Tracking Status</h3>
                            <div class="mapsearch-steps">
                                <div class="mapsearch-step done" id="step-1">
                                    <div class="mapsearch-step-dot done"></div>
                                    <div><p style="font-weight:700;margin:0">Request Confirmed</p><p style="font-size:0.75rem;color:var(--text-muted);margin:0">Mechanic accepted your request</p></div>
                                </div>
                                <div class="mapsearch-step active" id="step-2">
                                    <div class="mapsearch-step-dot active"></div>
                                    <div><p style="font-weight:700;margin:0">On the Way</p><p style="font-size:0.75rem;color:var(--text-muted);margin:0">Mechanic is heading to you</p></div>
                                </div>
                                <div class="mapsearch-step" id="step-3">
                                    <div class="mapsearch-step-dot"></div>
                                    <div><p style="font-weight:700;margin:0">Arrived</p><p style="font-size:0.75rem;color:var(--text-muted);margin:0">Waiting for arrival</p></div>
                                </div>
                                <div class="mapsearch-step" id="step-4">
                                    <div class="mapsearch-step-dot"></div>
                                    <div><p style="font-weight:700;margin:0">Service Started</p><p style="font-size:0.75rem;color:var(--text-muted);margin:0">Repair in progress</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
        this.startTrackingSimulation(m);
    },

    startTrackingSimulation(m) {
        let progress = 8;
        const marker = document.getElementById('tracking-mech');
        if (!marker) return;

        const interval = setInterval(() => {
            if (progress >= 78) {
                clearInterval(interval);
                // Arrived
                const s3 = document.getElementById('step-3');
                if (s3) { s3.classList.add('done'); s3.querySelector('.mapsearch-step-dot').classList.add('done'); }
                const s2 = document.getElementById('step-2');
                if (s2) { s2.classList.remove('active'); s2.classList.add('done'); s2.querySelector('.mapsearch-step-dot').classList.remove('active'); s2.querySelector('.mapsearch-step-dot').classList.add('done'); }
                const etaEl = document.getElementById('live-eta');
                if (etaEl) etaEl.textContent = '0';
                const distEl = document.getElementById('live-distance');
                if (distEl) distEl.textContent = 'Arrived!';
                const infoDist = document.getElementById('info-dist');
                if (infoDist) infoDist.textContent = '0 km';
                const infoEta = document.getElementById('info-eta');
                if (infoEta) infoEta.textContent = '0 min';
                App.notify('🎉 ' + m.name + ' has arrived at your location!', 'success');
                return;
            }
            progress += 1;
            // Move marker along route
            if (progress < 30) {
                marker.style.left = progress + '%';
                marker.style.top = '82%';
            } else if (progress < 55) {
                marker.style.left = (progress + 5) + '%';
                marker.style.top = (82 - (progress - 30) * 1.7) + '%';
            } else {
                marker.style.left = (progress + 5) + '%';
                marker.style.top = '40%';
            }
            // Update ETA and distance
            const remaining = Math.max(0, Math.round(m.eta * (1 - (progress - 8) / 70)));
            const dist = Math.max(0, (m.distance * (1 - (progress - 8) / 70)).toFixed(1));
            const etaEl = document.getElementById('live-eta');
            if (etaEl) etaEl.textContent = remaining;
            const distEl = document.getElementById('live-distance');
            if (distEl) distEl.textContent = dist + ' km away';
            const infoDist = document.getElementById('info-dist');
            if (infoDist) infoDist.textContent = dist + ' km';
            const infoEta = document.getElementById('info-eta');
            if (infoEta) infoEta.textContent = remaining + ' min';
        }, 800);
    },

    // Old tracking entry point
    init() {
        this.renderLiveTracking(this.mechanics[0]);
    }
};

// Expose to App router
App.renderMechanicSearch = () => Maps.renderSearch();
App.renderTracking = () => Maps.init();
