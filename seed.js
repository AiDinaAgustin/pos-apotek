const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function main() {
  const outlets = [
    {
      id: "OUTL0001",
      name: "Bandung",
      address: "123 Main St",
      phone: "1234567890",
      email: "bandung@example.com",
      created_at: new Date("2023-01-15"),
    },
    {
      id: "OUTL0002",
      name: "Jakarta",
      address: "456 Elm St",
      phone: "0987654321",
      email: "jakarta@example.com",
      created_at: new Date("2023-02-15"),
    },
    {
      id: "OUTL0003",
      name: "Surabaya",
      address: "789 Oak St",
      phone: "2233445566",
      email: "surabaya@example.com",
      created_at: new Date("2023-03-15"),
    },
    {
      id: "OUTL0004",
      name: "Purbalingga",
      address: "Jl Serayu no 104, Mrebet, Purbalingga",
      phone: "085895421884",
      email: "jawashop@gmail.com",
      created_at: new Date("2023-03-15"),
    },
  ];

  const items = [
    {
      id: "ITM0011",
      name: "Paracetamol",
      description: "Pain reliever and a fever reducer",
      price: 100,
      unit: "tablet",
      stock: 50,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-01-15"),
    },
    {
      id: "ITM0012",
      name: "Ibuprofen",
      description: "Nonsteroidal anti-inflammatory drug",
      price: 200,
      unit: "tablet",
      stock: 30,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-02-15"),
    },
    {
      id: "ITM0013",
      name: "Amoxicillin",
      description: "Antibiotic used to treat bacterial infections",
      price: 300,
      unit: "kapsul",
      stock: 40,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-03-15"),
    },
    {
      id: "ITM0014",
      name: "Cetirizine",
      description: "Antihistamine used to relieve allergy symptoms",
      price: 400,
      unit: "tablet",
      stock: 20,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-04-15"),
    },
    {
      id: "ITM0015",
      name: "Loratadine",
      description: "Antihistamine used to treat allergies",
      price: 500,
      unit: "tablet",
      stock: 10,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-05-15"),
    },
    {
      id: "ITM0016",
      name: "Metformin",
      description: "Medication used to treat type 2 diabetes",
      price: 600,
      unit: "tablet",
      stock: 60,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-06-15"),
    },
    {
      id: "ITM0017",
      name: "Amlodipine",
      description: "Medication used to treat high blood pressure",
      price: 700,
      unit: "tablet",
      stock: 70,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-07-15"),
    },
    {
      id: "ITM0018",
      name: "Simvastatin",
      description: "Medication used to control high cholesterol",
      price: 800,
      unit: "tablet",
      stock: 80,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-08-15"),
    },
    {
      id: "ITM0019",
      name: "Omeprazole",
      description: "Medication used to treat gastroesophageal reflux disease",
      price: 900,
      unit: "kapsul",
      stock: 90,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-09-15"),
    },
    {
      id: "ITM0020",
      name: "Azithromycin",
      description: "Antibiotic used to treat various types of infections",
      price: 1000,
      unit: "tablet",
      stock: 100,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-10-15"),
    },
    {
      id: "ITM0021",
      name: "Doxycycline",
      description: "Antibiotic used to treat bacterial infections",
      price: 1100,
      unit: "kapsul",
      stock: 110,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-11-15"),
    },
    {
      id: "ITM0022",
      name: "Hydrochlorothiazide",
      description: "Diuretic medication used to treat high blood pressure",
      price: 1200,
      unit: "tablet",
      stock: 120,
      outlet_id: "OUTL0002",
      created_at: new Date("2023-12-15"),
    },
  ];

  const users = [
    {
      id: "USR0024",
      name: "Dina",
      email: "dina@example.com",
      password: await bcrypt.hash("password1", 10),
      role: "ADMIN",
      outlet_id: null,
      created_at: new Date("2023-01-15"),
    },
    {
      id: "USR0025",
      name: "Yunif",
      email: "yunif@example.com",
      password: await bcrypt.hash("password2", 10),
      role: "STAFF",
      outlet_id: "OUTL0002",
      created_at: new Date("2023-02-15"),
    },
    {
      id: "USR0026",
      name: "Jiad",
      email: "jiad@example.com",
      password: await bcrypt.hash("password3", 10),
      role: "KASIR",
      outlet_id: "OUTL0002",
      created_at: new Date("2023-03-15"),
    },
    {
      id: "USR0027",
      name: "Advie",
      email: "advie@example.com",
      password: await bcrypt.hash("password4", 10),
      role: "STAFF",
      outlet_id: "OUTL0001",
      created_at: new Date("2023-04-15"),
    },
  ];

  // const orders = [
  //   { id: 'ORD0001', outlet_id: 'OUTL0001', user_id: 'USR0025', amount: 1000, total_payment: 1200, status: 'success', created_at: new Date('2024-10-03') },
  //   { id: 'ORD0002', outlet_id: 'OUTL0002', user_id: 'USR0026', amount: 2000, total_payment: 2400, status: 'success', created_at: new Date('2024-10-03') },
  //   { id: 'ORD0003', outlet_id: 'OUTL0003', user_id: 'USR0027', amount: 3000, total_payment: 3600, status: 'rejected', created_at: new Date('2024-10-03') },
  //   { id: 'ORD0004', outlet_id: 'OUTL0002', user_id: 'USR0025', amount: 4000, total_payment: 4800, status: 'success', created_at: new Date('2024-10-03') },
  //   { id: 'ORD0005', outlet_id: 'OUTL0002', user_id: 'USR0026', amount: 5000, total_payment: 6000, status: 'on_process', created_at: new Date('2024-10-03') }
  // ];

  // const orderDetails = [
  //   { id: 'ORDD0001', order_id: 'ORD0001', item_id: 'ITM0011', price: 100, quantity: 10, total_price: 1000, created_at: new Date('2024-10-03') },
  //   { id: 'ORDD0002', order_id: 'ORD0002', item_id: 'ITM0012', price: 200, quantity: 10, total_price: 2000, created_at: new Date('2024-10-03') },
  //   { id: 'ORDD0003', order_id: 'ORD0003', item_id: 'ITM0013', price: 300, quantity: 10, total_price: 3000, created_at: new Date('2024-10-03') },
  //   { id: 'ORDD0004', order_id: 'ORD0004', item_id: 'ITM0014', price: 400, quantity: 10, total_price: 4000, created_at: new Date('2024-10-03') },
  //   { id: 'ORDD0005', order_id: 'ORD0005', item_id: 'ITM0015', price: 500, quantity: 10, total_price: 5000, created_at: new Date('2024-10-03') }
  // ];

  // const itemReceptions = [
  //   {
  //     id: "REC0001",
  //     user_id: "USR0025",
  //     outlet_id: "OUTL0001",
  //     kode_po: "PO0001",
  //     date_po: new Date("2023-01-15"),
  //     created_at: new Date("2023-01-15"),
  //   },
  //   {
  //     id: "REC0002",
  //     user_id: "USR0026",
  //     outlet_id: "OUTL0002",
  //     kode_po: "PO0002",
  //     date_po: new Date("2023-02-15"),
  //     created_at: new Date("2023-02-15"),
  //   },
  //   {
  //     id: "REC0003",
  //     user_id: "USR0027",
  //     outlet_id: "OUTL0003",
  //     kode_po: "PO0003",
  //     date_po: new Date("2023-03-15"),
  //     created_at: new Date("2023-03-15"),
  //   },
  //   {
  //     id: "REC0004",
  //     user_id: "USR0025",
  //     outlet_id: "OUTL0001",
  //     kode_po: "PO0004",
  //     date_po: new Date("2023-04-15"),
  //     created_at: new Date("2023-04-15"),
  //   },
  //   {
  //     id: "REC0005",
  //     user_id: "USR0026",
  //     outlet_id: "OUTL0002",
  //     kode_po: "PO0005",
  //     date_po: new Date("2023-05-15"),
  //     created_at: new Date("2023-05-15"),
  //   },
  // ];

  // const itemReceptionDetails = [
  //   {
  //     id: "RECD0001",
  //     item_id: "ITM0011",
  //     receptions_id: "REC0001",
  //     quantity: 10,
  //     created_at: new Date("2023-01-15"),
  //   },
  //   {
  //     id: "RECD0002",
  //     item_id: "ITM0012",
  //     receptions_id: "REC0002",
  //     quantity: 20,
  //     created_at: new Date("2023-02-15"),
  //   },
  //   {
  //     id: "RECD0003",
  //     item_id: "ITM0013",
  //     receptions_id: "REC0003",
  //     quantity: 30,
  //     created_at: new Date("2023-03-15"),
  //   },
  //   {
  //     id: "RECD0004",
  //     item_id: "ITM0014",
  //     receptions_id: "REC0004",
  //     quantity: 40,
  //     created_at: new Date("2023-04-15"),
  //   },
  //   {
  //     id: "RECD0005",
  //     item_id: "ITM0015",
  //     receptions_id: "REC0005",
  //     quantity: 50,
  //     created_at: new Date("2023-05-15"),
  //   },
  // ];

  for (const outlet of outlets) {
    await prisma.outlets.upsert({
      where: { id: outlet.id },
      update: {},
      create: outlet,
    });
  }

  for (const item of items) {
    await prisma.items.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });

    await prisma.stock_cards.create({
      data: {
        id: uuidv4(),
        item_id: item.id,
        outlet_id: item.outlet_id,
        transaction_type: "initial_stock",
        transaction_id: item.id,
        stock_in: item.stock,
        stock_out: 0,
        current_stock: item.stock, // Initialize current_stock with the initial stock
        created_at: item.created_at,
      },
    });
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  // for (const order of orders) {
  //   await prisma.orders.upsert({
  //     where: { id: order.id },
  //     update: {},
  //     create: order,
  //   });

  //   const orderDetailsForOrder = orderDetails.filter(
  //     (od) => od.order_id === order.id
  //   );
  //   for (const orderDetail of orderDetailsForOrder) {
  //     await prisma.stock_cards.create({
  //       data: {
  //         id: uuidv4(),
  //         item_id: orderDetail.item_id,
  //         outlet_id: order.outlet_id,
  //         transaction_type: "sale",
  //         transaction_id: order.id,
  //         stock_in: 0,
  //         stock_out: orderDetail.quantity,
  //         current_stock: 0, // Placeholder, will be updated later
  //         created_at: orderDetail.created_at,
  //       },
  //     });
  //   }
  // }

  // for (const orderDetail of orderDetails) {
  //   await prisma.order_details.upsert({
  //     where: { id: orderDetail.id },
  //     update: {},
  //     create: orderDetail,
  //   });
  // }

  // for (const itemReception of itemReceptions) {
  //   await prisma.item_receptions.upsert({
  //     where: { id: itemReception.id },
  //     update: {},
  //     create: itemReception,
  //   });

  //   const itemReceptionDetailsForReception = itemReceptionDetails.filter(
  //     (ird) => ird.receptions_id === itemReception.id
  //   );
  //   for (const itemReceptionDetail of itemReceptionDetailsForReception) {
  //     await prisma.stock_cards.create({
  //       data: {
  //         id: uuidv4(),
  //         item_id: itemReceptionDetail.item_id,
  //         outlet_id: itemReception.outlet_id,
  //         transaction_type: "receipt",
  //         transaction_id: itemReception.id,
  //         stock_in: itemReceptionDetail.quantity,
  //         stock_out: 0,
  //         current_stock: 0, // Placeholder, will be updated later
  //         created_at: itemReceptionDetail.created_at,
  //       },
  //     });
  //   }
  // }

  // for (const itemReceptionDetail of itemReceptionDetails) {
  //   await prisma.item_reception_details.upsert({
  //     where: { id: itemReceptionDetail.id },
  //     update: {},
  //     create: itemReceptionDetail,
  //   });
  // }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
