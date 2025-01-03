const { sendSlipGaji } = require("../services/emailService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.sendSlipGajiEmail = async (req, res) => {
    const { namaStaff, nomorStaff, gajiPokok, tunjanganRokok, email } = req.body;

    const slipData = { 
        name: namaStaff, 
        userId: nomorStaff, 
        gajiPokok, 
        tunjanganRokok 
    };

    try {
        await sendSlipGaji(slipData, email);

        await prisma.notification.create({
            data: {
                userId: nomorStaff, // Use nomorStaff as userId
                message: `Slip gaji Anda untuk bulan ini telah dikirim.`,
            },
        });

        res.status(200).json({ message: "Slip gaji dan notifikasi berhasil dikirim" });
    } catch (error) {
        console.error('Failed to send slip gaji or create notification:', error);
        res.status(500).json({ error: "Failed to send slip gaji" });
    }
};