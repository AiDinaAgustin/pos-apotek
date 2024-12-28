const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const prisma = require("../db");

router.post('/send-slip-gaji', emailController.sendSlipGajiEmail);
router.put('/notifications/:id/read', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
});



module.exports = router;