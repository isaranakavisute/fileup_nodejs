const jwt = require('jsonwebtoken');
const config = require('../config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const validateToken = async (request, reply) => {
    console.log("----------------------Request received----------------------:", request.headers); // บันทึกข้อมูล request ทั้งหมด
    console.log("======================Request body:   ======================", request.body);
    console.log(process.env.JWT_SECRET)
    try {
        const { authorization } = request.headers;

        if (!authorization) {
            reply.code(401).send({ error: 'Missing authorization header' });
            return;
        }

        const token = authorization.split(' ')[1];

        if (!token) {
            reply.code(401).send({ error: 'Missing token' });
            return;
        }

        await jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ Token

    } catch (error) {
        console.error("Token validation error:", error);
        reply.code(401).send({ error: 'Invalid token xxxx' }); // ส่งสถานะ 401 หาก Token ไม่ถูกต้อง
        return;
    }
};

module.exports = {
  validateToken
};
