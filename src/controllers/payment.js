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


// ฟังก์ชันสำหรับสร้างลูกค้าบน omise พร้อมบัตรเครดิต
const createCustomerWithCard = async (request, reply) => {
  const { email, name, cardNumber, expirationMonth, expirationYear, securityCode } = request.body;

  try {
    // สร้าง Omise token จากข้อมูลบัตรเครดิต
    const token = await omise.tokens.create({
      card: {
        name,
        number: cardNumber,
        expiration_month: expirationMonth,
        expiration_year: expirationYear,
        security_code: securityCode,
      },
    });

    // สร้างลูกค้าใน Omise
    const customer = await omise.customers.create({
      email,
      description: `Customer: ${name}`,
      card: token.id,
    });

    // อัปเดตข้อมูล Omise Customer ID ใน Prisma User
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        omiseCustomerId: customer.id,
      },
    });

    reply.send({ customer, updatedUser });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

  
  // ฟังก์ชันสำหรับดึงรายชื่อลูกค้าทั้งหมด
  // const listAllCustomers = async (request, reply) => {
  //   try {
  //     const customers = await omise.customers.list();
  //     reply.send({ customers });
  //   } catch (err) {
  //     reply.status(500).send({ error: err.message });
  //   }
  // };



  // const purchasePackage = async (request, reply) => {
  //   const { userId, packageId } = request.body;
  
  //   try {
  //     const user = await prisma.user.findUnique({ where: { id: userId } });
  
  //     if (!user || !user.omiseCustomerId) {
  //       return reply.status(400).send({ error: 'User does not have an Omise customer ID' });
  //     }
  
  //     const customerId = user.omiseCustomerId;
  
  //     const package = await prisma.package.findUnique({ where: { id: packageId } });
  
  //     if (!package) {
  //       return reply.status(404).send({ error: 'Package not found' });
  //     }
  
  //     // สร้างการชำระเงิน
  //     const charge = await omise.charges.create({
  //       amount: package.price * 100,
  //       currency: 'THB',
  //       customer: customerId,
  //     });
  
  //     if (charge.status !== 'successful') {
  //       throw new Error('Charge failed');
  //     }
  
  //     // ตรวจสอบการสมัครสมาชิกที่มีอยู่
  //     const existingSubscription = await prisma.subscription.findUnique({ where: { userId } });
  
  //     let newEndDate;
  
  //     if (existingSubscription) {
  //       // เพิ่มวันหมดอายุด้วยระยะเวลาของแพ็กเกจใหม่
  //       newEndDate = new Date(existingSubscription.endDate);
  //       newEndDate.setDate(newEndDate.getDate() + package.duration);
  //     } else {
  //       // สร้างการสมัครสมาชิกใหม่
  //       newEndDate = new Date();
  //       newEndDate.setDate(newEndDate.getDate() + package.duration);
  
  //       await prisma.subscription.create({
  //         data: {
  //           userId,
  //           packageId,
  //           startDate: new Date(),
  //           endDate: newEndDate,
  //           isActive: true,
  //         },
  //       });
  //     }
  
  //     // เพิ่มธุรกรรม
  //     await prisma.transaction.create({
  //       data: {
  //         transactionId: charge.id,
  //         amount: package.price,
  //         type: 'purchase',
  //         description: `Purchase package ${package.name}`,
  //         walletId: userId,
  //       },
  //     });
  
  //     reply.send({ message: 'Package purchased successfully', charge });
  //   } catch (err) {
  //     console.error('Error during package purchase:', err);
  //     reply.status(500).send({ error: 'Internal Server Error', details: err.message });
  //   }
  // };
  

  // ฟังก์ชันสำหรับสมัครสมาชิกแพ็กเกจ
const subscriptionPackage = async (request, reply) => {
  const { userId, packageId, cardTokenId } = request.body;

  try {
    // ดึงข้อมูลผู้ใช้และแพ็กเกจจากฐานข้อมูล
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    const package = await prismaClient.package.findUnique({ where: { id: packageId } });

    if (!user) {
      return reply.status(400).send({ error: 'User not found' });
    }
    
    if (!package) {
      return reply.status(400).send({ error: 'Package not found' });
    }

    // สร้างลูกค้า Omise หากยังไม่มี
    let customerId = user.omiseCustomerId;

    if (!customerId) {
      const token = await omise.tokens.retrieve(cardTokenId);

      const customer = await omise.customers.create({
        email: user.email,
        description: `Customer: ${user.name} (id: ${userId})`,
        card: token.id,
      });

      customerId = customer.id;

      // อัปเดตข้อมูล Omise Customer ID ในฐานข้อมูลผู้ใช้
      await prismaClient.user.update({
        where: { id: userId },
        data: {
          omiseCustomerId: customerId,
        },
      });
    }

    // สร้างการชำระเงิน
    const charge = await omise.charges.create({
      amount: package.price * 100, // แปลงจากหน่วยบาทเป็นหน่วยสตางค์
      currency: 'thb',
      customer: customerId,
    });

    if (charge.status !== 'successful') {
      return reply.status(400).send({ error: 'Charge failed', details: charge });
    }

    // ตรวจสอบหรือสร้างการสมัครสมาชิก
    const existingSubscription = await prismaClient.subscription.findUnique({ where: { userId } });

    let newEndDate;

    if (existingSubscription) {
      // ขยายวันหมดอายุจากการสมัครสมาชิกที่มีอยู่
      newEndDate = new Date(existingSubscription.endDate);
      newEndDate.setDate(newEndDate.getDate() + package.duration);
    } else {
      // สร้างการสมัครสมาชิกใหม่
      newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + package.duration);

      await prismaClient.subscription.create({
        data: {
          userId,
          packageId,
          startDate: new Date(),
          endDate: newEndDate,
          isActive: true,
        },
      });
    }

    // สร้างธุรกรรมเพื่อบันทึกการชำระเงิน
    await prismaClient.transaction.create({
      data: {
        transactionId: charge.id,
        amount: package.price,
        type: 'subscription',
        description: `Subscription package ${package.name}`,
        walletId: userId,
      },
    });

    reply.send({ message: 'Subscription created successfully', charge, newEndDate });

  } catch (err) {
    console.error('Error during subscription:', err);
    reply.status(500).send({ error: 'Internal Server Error', details: err.message });
  }
};

  
  

  
  
  // ฟังก์ชันสำหรับดึงข้อมูลลูกค้ารายบุคคล
  // const retrieveCustomer = async (request, reply) => {
  //   const { customerId } = request.params;
  
  //   try {
  //     const customer = await omise.customers.retrieve(customerId);
  //     reply.send({ customer });
  //   } catch (err) {
  //     reply.status(500).send({ error: err.message });
  //   }
  // };
  
  // ฟังก์ชันสำหรับอัปเดตข้อมูลลูกค้า
  // const updateCustomer = async (request, reply) => {
  //   const { customerId } = request.params;
  //   const { email, description } = request.body;
  
  //   try {
  //     const updatedCustomer = await omise.customers.update(customerId, {
  //       email,
  //       description,
  //     });
  
  //     reply.send({ updatedCustomer });
  //   } catch (err) {
  //     reply.status(500).send({ error: err.message });
  //   }
  // };


  
  module.exports = {
    createCustomerWithCard,
    // listAllCustomers,
    // purchasePackage,
    subscriptionPackage,
    // retrieveCustomer,
    // updateCustomer,
  };