const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all mechanics
router.get('/', async (req, res) => {
    try {
        const [mechanics] = await db.query('SELECT id, name, phone, specialization, rating, is_available FROM mechanics');
        res.json(mechanics);
    } catch (error) {
        console.error('Fetch Mechanics Error:', error);
        res.status(500).json({ message: 'Server error fetching mechanics' });
    }
});

// Get mechanic by ID
router.get('/:id', async (req, res) => {
    try {
        const [mechanics] = await db.query('SELECT id, name, phone, specialization, rating, is_available FROM mechanics WHERE id = ?', [req.params.id]);
        if (mechanics.length === 0) {
            return res.status(404).json({ message: 'Mechanic not found' });
        }
        res.json(mechanics[0]);
    } catch (error) {
        console.error('Fetch Mechanic Error:', error);
        res.status(500).json({ message: 'Server error fetching mechanic' });
    }
});

module.exports = router;
