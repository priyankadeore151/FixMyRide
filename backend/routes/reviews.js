const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add a review
router.post('/', async (req, res) => {
    try {
        const { user_id, mechanic_id, rating, comment } = req.body;

        if (!user_id || !mechanic_id || !rating) {
            return res.status(400).json({ message: 'User ID, Mechanic ID, and Rating are required' });
        }

        const [result] = await db.query(
            'INSERT INTO reviews (user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, mechanic_id, rating, comment || '']
        );

        res.status(201).json({ message: 'Review added successfully', reviewId: result.insertId });
    } catch (error) {
        console.error('Review Error:', error);
        res.status(500).json({ message: 'Server error adding review' });
    }
});

// Get reviews for a mechanic
router.get('/mechanic/:mechanicId', async (req, res) => {
    try {
        const [reviews] = await db.query(
            'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.mechanic_id = ? ORDER BY r.created_at DESC', 
            [req.params.mechanicId]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

module.exports = router;
