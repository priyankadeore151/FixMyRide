const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a service booking
router.post('/', async (req, res) => {
    try {
        const { user_id, mechanic_id, service_type, location_lat, location_lng, description } = req.body;

        if (!user_id || !service_type) {
            return res.status(400).json({ message: 'Missing required booking fields' });
        }

        const [result] = await db.query(
            'INSERT INTO bookings (user_id, mechanic_id, service_type, location_lat, location_lng, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, mechanic_id || null, service_type, location_lat || null, location_lng || null, description || '', 'Pending']
        );

        res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
    } catch (error) {
        console.error('Booking Creation Error:', error);
        res.status(500).json({ message: 'Server error creating booking' });
    }
});

// Get all bookings (optional filtering by user_id or mechanic_id)
router.get('/', async (req, res) => {
    try {
        const { user_id, mechanic_id } = req.query;
        let query = 'SELECT * FROM bookings';
        let queryParams = [];

        if (user_id) {
            query += ' WHERE user_id = ?';
            queryParams.push(user_id);
        } else if (mechanic_id) {
            query += ' WHERE mechanic_id = ?';
            queryParams.push(mechanic_id);
        }

        query += ' ORDER BY created_at DESC';

        const [bookings] = await db.query(query, queryParams);
        res.json(bookings);
    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, bookingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ message: 'Server error updating booking status' });
    }
});

module.exports = router;
