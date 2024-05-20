const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const config = require('../config');
// const jwtDecode = require("jwt-decode");
const jwtDecode = require('jwt-decode')
const chalk = require('chalk')


const omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

//ดึงข้อมูล package ทั้งหมด
const getPakage = async (request, reply) => {
  try {
    const payments = await prisma.package.findMany();
    reply.code(200).send({
      status: 'success',
      message: 'Payments retrieved successfully',
      data: payments,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

//ดึงข้อมูล package ตามไอดี
const getPakageById = async (request, reply) => {

  const { id } = request.params;

  try {
    const payment = await prisma.package.findUnique({
      where: { id: parseInt(id) },
    });

    if (!payment) {
      reply.code(404).send({
        status: 'error',
        message: 'Payment not found',
      });
      return;
    }

    reply.code(200).send({
      status: 'success',
      message: 'Payment retrieved successfully',
      data: payment,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


const createWalletIfNotExist = async (userId) => {
  // ตรวจสอบว่ามี `Wallet` สำหรับ `userId` หรือไม่
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    // สร้าง `Wallet` ใหม่ หากไม่พบ
    wallet = await prisma.wallet.create({
      data: {
        userId,
        balance: 0, // ตั้งค่าเริ่มต้น
      },
    });

    console.log("Created new wallet for user:", wallet);
  }

  return wallet; // คืนค่า `Wallet` ที่สร้าง
};

const createQRCodeForPackage = async (request, reply) => {
  const { userId, packageId } = request.body;

  try {
    const packagePayment = await prisma.package.findUnique({ where: { id: packageId } });
    // reply.status(200).send({ packagePayment })

    // ตรวจสอบหรือสร้าง `Wallet`
    const wallet = await createWalletIfNotExist(userId);
    const amount = Math.round(packagePayment.price * 100); // แปลงจากบาทเป็นสตางค์
    const returnUri = `${process.env.OMISE_RETURN_URL}/payment/success`;

    const charge = await omise.charges.create({
      amount,
      currency: 'thb',
      source: { type: 'promptpay' },
      return_uri: returnUri,
    });


    if (charge.status === 'pending') {
      await prisma.transaction.create({
        data: {
          transactionId: charge.id,
          amount: packagePayment.price, // ในหน่วยบาท
          type: "purchase",
          walletId: wallet.id,
          balanceBefore: wallet.balance, // ควรเป็นยอดเงินเริ่มต้น
          description: `Payment for package:${packagePayment.name}`,
          status: "PENDING", // กำหนดสถานะเริ่มต้น
        },
      });

      const qrCodeImage = charge.source.scannable_code.image.download_uri;
      return reply.send({
        message: 'QR Code created successfully',
        qrCodeImage,
        chargeId: charge.id,
      });
    }

    return reply.status(400).send({ error: 'Failed to create QR Code payment' });

  } catch (err) {
    console.error('Error creating QR Code for package:', err);
    reply.status(500).send({ error: 'Internal Server Error', details: err.message });
  }
};



const handleOmiseWebhook = async (request, reply) => {
  try {
    const event = request.body;
    const eventId = event.id;

    // บันทึก WebhookEvent
    await prisma.webhookEvent.create({
      data: {
        eventId,
        eventType: event.type,
        receivedAt: new Date(),
      },
    });


    if (event.object === 'event' && event.type === 'charge.complete') {
      const charge = event.data;

      if (charge.status === 'successful') {
        const transaction = await prisma.transaction.findUnique({
          where: { transactionId: charge.id },
        });

        if (transaction) {
          // อัปเดตสถานะเป็น "success"
          await prisma.transaction.update({
            where: { transactionId: charge.id },
            data: {
              status: "SUCCESS", // เปลี่ยนสถานะ
            },
          });

          return reply.send({ message: 'Transaction updated to success' });
        }
      }
    }

    return reply.status(400).send({ error: 'Unhandled event type' });

  } catch (err) {
    console.error('Error handling Omise webhook:', err);
    reply.status(500).send({ error: 'Internal Server Error', details: err.message });
  }
};




// const saveTransaction = async (userId, chargeId, amount, description) => {
//   try {
//     // เรียกฟังก์ชันเพื่อสร้าง Wallet หากไม่มี
//     const wallet = await createWalletIfNotExist(userId);

//     const balanceBefore = wallet.balance; // ยอดเงินก่อนทำธุรกรรม

//     // สร้าง Transaction ใหม่
//     const newTransaction = await prisma.transaction.create({
//       data: {
//         transactionId: chargeId,
//         amount,
//         type: "purchase",
//         description,
//         walletId: wallet.id, // ใช้ `wallet.id`
//         balanceBefore,
//       },
//     });

//     console.log("Transaction created successfully:", newTransaction);

//   } catch (err) {
//     console.error("Error creating transaction:", err);
//     throw err; // ส่งต่อข้อผิดพลาด
//   }
// };

module.exports = {
  createWalletIfNotExist,
  createQRCodeForPackage,
  handleOmiseWebhook,
  getPakage,
  getPakageById,
};