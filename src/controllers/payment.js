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


// ฟังก์ชันสำหรับสร้างลูกค้าพร้อมบัตรเครดิต
const createCustomerWithCard = async (request, reply) => {
    const { email, name, cardNumber, expirationMonth, expirationYear, securityCode } = request.body;
  
    try {
      const token = await omise.tokens.create({
        card: {
          name,
          number: cardNumber,
          expiration_month: expirationMonth,
          expiration_year: expirationYear,
          security_code: securityCode,
        },
      });
  
      const customer = await omise.customers.create({
        email,
        description: `Customer: ${name}`,
        card: token.id,
      });
  
      reply.send({ customer });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  };
  
  // ฟังก์ชันสำหรับดึงรายชื่อลูกค้าทั้งหมด
  const listAllCustomers = async (request, reply) => {
    try {
      const customers = await omise.customers.list();
      reply.send({ customers });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  };



const purchasePackage = async (request, reply) => {
  const { customerId, packageId } = request.body;

  try {
    // ตรวจสอบว่าลูกค้าลงทะเบียนกับ Omise แล้วหรือไม่
    const customer = await omise.customers.retrieve(customerId);

    if (!customer) {
      return reply.status(400).send({ error: 'Customer not registered with Omise' });
    }

    // ดึงข้อมูลแพ็กเกจจากฐานข้อมูล
    const package = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!package) {
      return reply.status(404).send({ error: 'Package not found' });
    }

    // ตัดเงินสำหรับการซื้อแพ็กเกจ
    const charge = await omise.charges.create({
      amount: package.price, // ใช้ราคาของแพ็กเกจ
      currency: 'THB', // สกุลเงิน
      customer: customer.id, // ID ของลูกค้าจาก Omise
      description: `Purchase package ${package.name}`,
    });

    if (charge.status === 'successful') {
      console.log('Charge successful:', charge);

      // ตรวจสอบการสมัครสมาชิกที่มีอยู่
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: customerId },
      });

      if (existingSubscription) {
        // อัปเดตการสมัครสมาชิกที่มีอยู่
        const newEndDate = new Date(); 
        newEndDate.setDate(newEndDate.getDate() + package.duration); // ปรับตามระยะเวลาของแพ็กเกจ

        const updatedSubscription = await prisma.subscription.update({
          where: { userId: customerId },
          data: {
            packageId: package.id, // อัปเดต packageId
            startDate: new Date(),
            endDate: newEndDate,
            isActive: true,
          },
        });

        console.log('Subscription updated:', updatedSubscription);
      } else {
        // สร้างการสมัครสมาชิกใหม่
        const newSubscription = await prisma.subscription.create({
          data: {
            userId: customerId,
            packageId: package.id, // ระบุ packageId
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + package.duration)), // ปรับตามแพ็กเกจ
          },
        });

        console.log('Subscription created:', newSubscription);
      }

      // เพิ่มรายการธุรกรรม
      await prisma.transaction.create({
        data: {
          transactionId: charge.id,
          amount: package.price,
          type: 'purchase',
          description: `Purchase package ${package.name}`,
          walletId: customerId,
        },
      });

      reply.send({ message: 'Package purchased successfully', charge });
    } else {
      reply.status(500).send({ error: 'Charge failed' });
    }
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: err.message });
  }
};

  
  
  // ฟังก์ชันสำหรับดึงข้อมูลลูกค้ารายบุคคล
  const retrieveCustomer = async (request, reply) => {
    const { customerId } = request.params;
  
    try {
      const customer = await omise.customers.retrieve(customerId);
      reply.send({ customer });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  };
  
  // ฟังก์ชันสำหรับอัปเดตข้อมูลลูกค้า
  const updateCustomer = async (request, reply) => {
    const { customerId } = request.params;
    const { email, description } = request.body;
  
    try {
      const updatedCustomer = await omise.customers.update(customerId, {
        email,
        description,
      });
  
      reply.send({ updatedCustomer });
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  };


  
  module.exports = {
    createCustomerWithCard,
    listAllCustomers,
    purchasePackage,
    retrieveCustomer,
    updateCustomer,
  };