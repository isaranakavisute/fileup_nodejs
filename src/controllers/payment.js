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


  const createQRCodeForPackage = async (request, reply) => {
    const { userId, packageId } = request.body;
  
    try {
      // ตรวจสอบผู้ใช้และแพ็กเกจ
      const user = await prisma.user.findUnique({ where: { id: userId } });
  
      if (!user) {
        return reply.status(400).send({ error: 'User not found' });
      }
  
      const package = await prisma.package.findUnique({ where: { id: packageId } });
  
      if (!package) {
        return reply.status(400).send({ error: 'Package not found' });
      }
  
      // ตรวจสอบว่าผู้ใช้มีแพ็กเกจที่ใช้งานอยู่หรือไม่
      const existingSubscription = await prisma.subscription.findUnique({ where: { userId } });
  
      if (existingSubscription && new Date() < existingSubscription.endDate) {
        return reply.status(400).send({ error: 'You already have an active package' });
      }
  
      const amount = Math.round(package.price * 100); // แปลงจากบาทเป็นสตางค์
      const returnUri = `${process.env.OMISE_RETURN_URI}/payment/success`;
  
      // สร้างการชำระเงินด้วย QR Code
      const charge = await omise.charges.create({
        amount,
        currency: 'thb',
        source: {
          type: 'promptpay', // ใช้ PromptPay สำหรับ QR Code
        },
        return_uri: returnUri,
      });
  
      if (charge.status === 'pending') {
        const qrCodeImage = charge.source.scannable_code.image.download_uri;
  
        // ส่งคืน QR Code ให้ผู้ใช้
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
    
    // ตรวจสอบว่ามี Event ID และเป็นเหตุการณ์ใหม่
    const eventId = event.id;
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      return reply.status(400).send({ error: 'Event already processed' });
    }

    // เพิ่มข้อมูล Event ID ลงในฐานข้อมูลเพื่อป้องกันการส่งซ้ำ
    await prisma.webhookEvent.create({
      data: { eventId },
    });

    // ตรวจสอบประเภทของเหตุการณ์
    if (event.object === 'event' && event.type === 'charge.complete') {
      const charge = event.data;

      if (charge.status === 'successful') {
        // ตรวจสอบว่ามี Transaction ID แล้วหรือไม่
        const existingTransaction = await prisma.transaction.findUnique({
          where: { transactionId: charge.id },
        });

        if (existingTransaction) {
          return reply.send({ message: 'Transaction already exists' });
        }

        // สร้าง Transaction ใหม่
        const newTransaction = await prisma.transaction.create({
          data: {
            transactionId: charge.id,
            amount: charge.amount / 100,
            type: 'deposit',
            description: charge.description || 'Omise Payment',
            walletId: 1,
          },
        });

        return reply.send({ message: 'Transaction created', newTransaction });
      }
    }

    return reply.status(400).send({ error: 'Unhandled event type' });

  } catch (err) {
    console.error('Error handling Omise webhook:', err);
    reply.status(500).send({ error: 'Internal Server Error', details: err.message });
  }
};

  
  module.exports = {
    createQRCodeForPackage,
    handleOmiseWebhook,
  };