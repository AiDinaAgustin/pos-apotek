const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    }
});

const generatePDF = (data) => {
    const doc = new PDFDocument();
    doc.fontSize(16).text("Slip Gaji", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Nama Pegawai: ${data.name}`);
    doc.text(`Nomor Pegawai: ${data.userId}`);
    doc.text(`Gaji Pokok: Rp ${data.gajiPokok}`);
    doc.text(`Tunjangan Pokok: Rp ${data.tunjanganRokok}`);
    doc.text("...");
    doc.end();
    return doc;
};

exports.sendSlipGaji = async (data, email) => {
    const pdfDoc = generatePDF(data);
    const mailOptions = {
        from: {
            name: "SLIP GAJI KARYAWAN",
            address: process.env.USER
        },
        to: email,
        subject: "Slip Gaji",
        text: "Berikut adalah slip gaji Anda.",
        attachments: [
            {
                filename: 'SlipGaji.pdf',
                content: pdfDoc,
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
