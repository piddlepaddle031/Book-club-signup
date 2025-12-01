const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'bookclub-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize default slots
const defaultSlots = [
    { id: 1, date: '2026-01-28', time: '7:00 PM', member: null, book: null },
    { id: 2, date: '2026-02-25', time: '7:00 PM', member: null, book: null },
    { id: 3, date: '2026-03-25', time: '7:00 PM', member: null, book: null },
    { id: 4, date: '2026-04-22', time: '7:00 PM', member: null, book: null },
    { id: 5, date: '2026-05-27', time: '7:00 PM', member: null, book: null },
    { id: 6, date: '2026-06-24', time: '7:00 PM', member: null, book: null },
    { id: 7, date: '2026-09-23', time: '7:00 PM', member: null, book: null },
    { id: 8, date: '2026-10-27', time: '7:00 PM', member: null, book: null },
    { id: 9, date: '2026-11-18', time: '7:00 PM', member: null, book: null },
];

// Load data from file
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default slots
        return defaultSlots;
    }
}

// Save data to file
async function saveData(slots) {
    await fs.writeFile(DATA_FILE, JSON.stringify(slots, null, 2));
}

// API Routes

// Get all slots
app.get('/api/slots', async (req, res) => {
    try {
        const slots = await loadData();
        res.json(slots);
    } catch (error) {
        console.error('Error loading slots:', error);
        res.status(500).json({ error: 'Failed to load slots' });
    }
});

// Update slots
app.post('/api/slots', async (req, res) => {
    try {
        const slots = req.body;
        await saveData(slots);
        res.json({ success: true, slots });
    } catch (error) {
        console.error('Error saving slots:', error);
        res.status(500).json({ error: 'Failed to save slots' });
    }
});

// Reset slots to default
app.post('/api/reset', async (req, res) => {
    try {
        await saveData(defaultSlots);
        res.json({ success: true, slots: defaultSlots });
    } catch (error) {
        console.error('Error resetting slots:', error);
        res.status(500).json({ error: 'Failed to reset slots' });
    }
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Book Club server running on http://localhost:${PORT}`);
});
