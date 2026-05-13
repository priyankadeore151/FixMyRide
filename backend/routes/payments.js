const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create payment record
router.post('/', async (req, res) => {
    try {
        const { booking_id, amount, payment_method, status } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json({ message: 'Booking ID and amount are required' });
        }

        const [result] = await db.query(
            'INSERT INTO payments (booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
            [booking_id, amount, payment_method || 'Cash', status || 'Pending']
        );

        res.status(201).json({ message: 'Payment recorded successfully', paymentId: result.insertId });
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ message: 'Server error creating payment record' });
    }
});

// Get payment by booking ID
router.get('/booking/:bookingId', async (req, res) => {
    try {
        const [payments] = await db.query('SELECT * FROM payments WHERE booking_id = ?', [req.params.bookingId]);
        res.json(payments);
    } catch (error) {
        console.error('Fetch Payments Error:', error);
        res.status(500).json({ message: 'Server error fetching payments' });
    }
});

module.exports = router;
