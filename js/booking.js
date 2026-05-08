// FixMyRide - Booking Logic

const Booking = {
    services: [
        { id: 'engine', name: 'Engine Repair', basePrice: 1499, range: '₹1,499 – ₹4,999', icon: 'settings' },
        { id: 'oil', name: 'Oil Change', basePrice: 699, range: '₹699 – ₹1,299', icon: 'droplet' },
        { id: 'tire', name: 'Tire Replacement', basePrice: 899, range: '₹899 – ₹2,499', icon: 'disc' },
        { id: 'battery', name: 'Battery Service', basePrice: 499, range: '₹499 – ₹3,499', icon: 'battery-charging' },
        { id: 'wash', name: 'General Washing', basePrice: 299, range: '₹299 – ₹799', icon: 'waves' },
        { id: 'service', name: 'General Servicing', basePrice: 1199, range: '₹1,199 – ₹2,999', icon: 'clipboard-list' }
    ],

    state: {
        step: 1,
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        estimatedCost: 0
    },

    init() {
        // This is called when the booking view is rendered
        this.state.step = 1;
        this.renderStep();
    },

    renderStep() {
        const container = document.getElementById('main-content');
        
        switch(this.state.step) {
            case 1:
                this.renderServiceSelection(container);
                break;
            case 2:
                this.renderDateTimeSelection(container);
                break;
            case 3:
                this.renderPaymentSelection(container);
                break;
            case 4:
                this.renderPaymentGateway(container);
                break;
            case 5:
                this.renderConfirmation(container);
                break;
        }
        
        lucide.createIcons();
    },

    renderServiceSelection(container) {
        container.innerHTML = `
            <div class="fade-in">
                <h1 style="margin-bottom: 2rem;">Select Service</h1>
                <div class="features-grid">
                    ${this.services.map(s => `
                        <div class="feature-card service-card ${this.state.selectedService?.id === s.id ? 'active' : ''}" 
                             onclick="Booking.selectService('${s.id}')"
                             style="cursor: pointer; padding: 0; overflow: hidden;">
                            <div style="height: 120px; overflow: hidden;">
                                <img src="assets/images/service-thumb.png" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: var(--transition);" class="service-img">
                            </div>
                            <div style="padding: 1.5rem;">
                                <div class="feature-icon" style="margin-bottom: 1rem;"><i data-lucide="${s.icon}"></i></div>
                                <h3>${s.name}</h3>
                                <p>${s.range}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 3rem; display: flex; justify-content: flex-end;">
                    <button class="btn btn-primary" onclick="Booking.nextStep()" ${!this.state.selectedService ? 'disabled' : ''}>
                        Next: Schedule <i data-lucide="arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    },

    renderDateTimeSelection(container) {
        container.innerHTML = `
            <div class="fade-in" style="max-width: 600px; margin: 0 auto;">
                <button class="btn btn-secondary" onclick="Booking.prevStep()" style="margin-bottom: 2rem;">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h1 style="margin-bottom: 2rem;">Schedule Appointment</h1>
                
                <div class="form-card" style="max-width: 100%; margin: 0;">
                    <div class="form-group">
                        <label>Select Date</label>
                        <input type="date" class="form-input" id="booking-date" 
                               min="${new Date().toISOString().split('T')[0]}"
                               value="${this.state.selectedDate || ''}">
                    </div>
                    <div class="form-group">
                        <label>Preferred Time Slot</label>
                        <select class="form-input" id="booking-time">
                            <option value="">Select a slot</option>
                            <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                            <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                            <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                            <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Premium Add-ons</label>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
                            <label style="display: flex; justify-content: space-between; cursor: pointer; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 8px;">
                                <span><input type="checkbox" id="addon-doorstep" onchange="Booking.updateAddons()"> Doorstep Visit</span>
                                <span style="color: var(--secondary)">+₹199</span>
                            </label>
                            <label style="display: flex; justify-content: space-between; cursor: pointer; background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 8px;">
                                <span><input type="checkbox" id="addon-pickup" onchange="Booking.updateAddons()"> Pickup & Drop</span>
                                <span style="color: var(--secondary)">+₹299</span>
                            </label>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1.5rem;" onclick="Booking.confirmDetails()">
                        Next: Payment
                    </button>
                </div>
            </div>
        `;
        
        if (this.state.selectedTime) {
            document.getElementById('booking-time').value = this.state.selectedTime;
        }
    },

    renderPaymentSelection(container) {
        container.innerHTML = `
            <div class="fade-in" style="max-width: 600px; margin: 0 auto;">
                <button class="btn btn-secondary" onclick="Booking.prevStep()" style="margin-bottom: 2rem;">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h1 style="margin-bottom: 2rem;">Select Payment Method</h1>
                
                <div class="features-grid" style="grid-template-columns: 1fr; gap: 1rem;">
                    <div class="feature-card payment-method ${this.state.paymentMethod === 'UPI' ? 'active' : ''}" onclick="Booking.selectPayment('UPI')">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i data-lucide="smartphone"></i>
                            <div><strong>UPI</strong><p style="font-size: 0.75rem; color: var(--text-muted)">Google Pay, PhonePe, Paytm</p></div>
                        </div>
                    </div>
                    <div class="feature-card payment-method ${this.state.paymentMethod === 'CARD' ? 'active' : ''}" onclick="Booking.selectPayment('CARD')">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i data-lucide="credit-card"></i>
                            <div><strong>Debit/Credit Card</strong><p style="font-size: 0.75rem; color: var(--text-muted)">Visa, Mastercard, RuPay</p></div>
                        </div>
                    </div>
                    <div class="feature-card payment-method ${this.state.paymentMethod === 'WALLET' ? 'active' : ''}" onclick="Booking.selectPayment('WALLET')">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i data-lucide="wallet"></i>
                            <div><strong>Wallets</strong><p style="font-size: 0.75rem; color: var(--text-muted)">Amazon Pay, Mobikwik</p></div>
                        </div>
                    </div>
                    <div class="feature-card payment-method ${this.state.paymentMethod === 'CASH' ? 'active' : ''}" onclick="Booking.selectPayment('CASH')">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <i data-lucide="banknote"></i>
                            <div><strong>Cash on Service</strong><p style="font-size: 0.75rem; color: var(--text-muted)">Pay after work completion</p></div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 2rem;" 
                        onclick="Booking.nextStep()" ${!this.state.paymentMethod ? 'disabled' : ''}>
                    Next: Confirmation
                </button>
            </div>
        `;
    },

    renderPaymentGateway(container) {
        let paymentContent = '';
        const method = this.state.paymentMethod;

        if (method === 'CASH') {
            this.state.step = 5;
            this.renderStep();
            return;
        }

        switch(method) {
            case 'UPI':
                paymentContent = `
                    <div style="text-align: center;">
                        <div style="background: white; padding: 1.5rem; display: inline-block; border-radius: 12px; margin-bottom: 1.5rem;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=fixmyride@upi&pn=FixMyRide&am=${this.state.estimatedCost}" style="width: 200px; height: 200px;">
                        </div>
                        <p>Scan this QR using any UPI App</p>
                        <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="Booking.simulateScanner()">
                            <i data-lucide="scan"></i> Simulate Phone Scan
                        </button>
                        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1rem;">OR</p>
                        <div class="form-group" style="margin-top: 1rem;">
                            <input type="text" class="form-input" placeholder="Enter UPI ID (e.g. user@okaxis)">
                        </div>
                    </div>
                `;
                break;
            case 'CARD':
                paymentContent = `
                    <div style="display: grid; gap: 1rem;">
                        <div class="form-group"><label>Card Number</label><input type="text" class="form-input" placeholder="4242 4242 4242 4242"></div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group"><label>Expiry</label><input type="text" class="form-input" placeholder="MM/YY"></div>
                            <div class="form-group"><label>CVV</label><input type="password" class="form-input" placeholder="•••"></div>
                        </div>
                        <div class="form-group"><label>Cardholder Name</label><input type="text" class="form-input" placeholder="John Doe"></div>
                    </div>
                `;
                break;
            case 'WALLET':
                paymentContent = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;"><i data-lucide="wallet"></i></div>
                        <p>You will be redirected to your wallet provider to authorize the payment of <strong>₹${this.state.estimatedCost}</strong>.</p>
                    </div>
                `;
                break;
        }

        container.innerHTML = `
            <div class="fade-in" style="max-width: 500px; margin: 0 auto;">
                <h1 style="margin-bottom: 2rem; text-align: center;">Secure Payment</h1>
                <div class="feature-card" style="padding: 2rem; border-color: var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <span>Paying for ${this.state.selectedService.name}</span>
                        <strong style="font-size: 1.25rem;">₹${this.state.estimatedCost}</strong>
                    </div>
                    
                    ${paymentContent}

                    <div style="margin-top: 2rem;">
                        <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="Booking.processPayment()">
                            <i data-lucide="lock" style="width: 16px; height: 16px;"></i> Pay Now
                        </button>
                        <button class="btn btn-secondary" style="width: 100%; justify-content: center; margin-top: 0.5rem; border: none;" onclick="Booking.prevStep()">
                            Cancel
                        </button>
                    </div>
                    
                    <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 1.5rem; opacity: 0.5;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="15">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/640px-UPI-Logo.png" height="15">
                    </div>
                </div>
            </div>
        `;
    },

    processPayment() {
        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="loader" style="width: 20px; height: 20px; border-width: 2px;"></div> Processing...';
        
        setTimeout(() => {
            App.notify('Payment successful!', 'success');
            this.state.step = 5;
            this.renderStep();
        }, 2000);
    },

    simulateScanner() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 1000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: white; font-family: sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="width: 250px; height: 250px; border: 2px solid var(--primary); position: relative; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; animation: scanAnim 2s infinite linear;"></div>
                <div style="width: 100%; height: 100%; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="qr-code" style="width: 100px; height: 100px; opacity: 0.3;"></i>
                </div>
            </div>
            <p style="margin-top: 2rem; font-weight: 600; font-size: 1.25rem;">Scanning UPI QR...</p>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">Align QR code within the frame</p>
            <button class="btn btn-secondary" onclick="this.parentElement.remove()" style="margin-top: 3rem; background: transparent; border-color: white;">Cancel</button>
            <style>
                @keyframes scanAnim {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            </style>
        `;
        
        document.body.appendChild(overlay);
        lucide.createIcons();

        setTimeout(() => {
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <i data-lucide="check-circle" style="width: 80px; height: 80px; color: #10b981; margin-bottom: 1.5rem;"></i>
                    <h2>QR Detected</h2>
                    <p style="margin-top: 1rem;">FixMyRide Official Merchant<br><strong>₹${this.state.estimatedCost}</strong></p>
                    <button class="btn btn-primary" style="margin-top: 2rem; width: 200px; justify-content: center;">Pay Now</button>
                </div>
            `;
            lucide.createIcons();
            
            overlay.querySelector('.btn-primary').onclick = () => {
                overlay.remove();
                this.processPayment();
            };
        }, 3000);
    },

    renderConfirmation(container) {
        container.innerHTML = `
            <div class="fade-in" style="max-width: 600px; margin: 0 auto;">
                <h1 style="margin-bottom: 2rem;">Confirm Booking</h1>
                
                <div class="feature-card" style="padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border);">
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Service</p>
                            <h3 style="color: var(--primary)">${this.state.selectedService.name}</h3>
                        </div>
                        <div style="text-align: right;">
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Estimated Cost</p>
                            <h3>₹${this.state.estimatedCost}</h3>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 2rem; margin-bottom: 2rem;">
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Date</p>
                            <p style="font-weight: 600;">${this.state.selectedDate}</p>
                        </div>
                        <div>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Payment Method</p>
                            <p style="font-weight: 600;">${this.state.paymentMethod}</p>
                        </div>
                    </div>

                    <div style="background: rgba(245, 158, 11, 0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <p style="font-size: 0.875rem;"><i data-lucide="info" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 0.5rem;"></i> Final price may vary based on vehicle condition and parts required.</p>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="Booking.prevStep()">Back</button>
                        <button class="btn btn-primary" style="flex: 2; justify-content: center;" onclick="Booking.finishBooking()">Confirm & Pay</button>
                    </div>
                </div>
            </div>
        `;
    },

    // Handlers
    selectService(id) {
        this.state.selectedService = this.services.find(s => s.id === id);
        this.state.estimatedCost = this.state.selectedService.basePrice;
        this.renderStep();
    },

    nextStep() {
        this.state.step++;
        this.renderStep();
    },

    prevStep() {
        this.state.step--;
        this.renderStep();
    },

    confirmDetails() {
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        
        if (!date || !time) {
            App.notify('Please select both date and time', 'info');
            return;
        }
        
        this.state.selectedDate = date;
        this.state.selectedTime = time;
        this.state.step = 3;
        this.renderStep();
    },

    selectPayment(method) {
        this.state.paymentMethod = method;
        this.renderStep();
    },

    finishBooking() {
        App.notify('Booking successful! A mechanic will be assigned shortly.', 'success');
        App.state.bookings.push({
            id: 'BK-' + Math.floor(Math.random() * 10000),
            service: this.state.selectedService.name,
            date: this.state.selectedDate,
            time: this.state.selectedTime,
            cost: this.state.estimatedCost,
            paymentMethod: this.state.paymentMethod,
            status: this.state.paymentMethod === 'CASH' ? 'Requested' : 'Paid'
        });
        window.location.hash = 'dashboard';
    },

    updateAddons() {
        let total = this.state.selectedService.basePrice;
        if (document.getElementById('addon-doorstep')?.checked) total += 199;
        if (document.getElementById('addon-pickup')?.checked) total += 299;
        this.state.estimatedCost = total;
    }
};

// Expose to App
App.renderBooking = () => Booking.init();
