const controllers = require("../controllers");
const hooks = require("../hooks");
const multer = require("multer");
const paymentSchema = require('../swagger/payment.schema')

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


const paymentRoute = (app) => {
    app.get("/payments", {
        schema: paymentSchema.getPaymentsSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.payment.getPakage, // ระบุฟังก์ชันการดึงรายการ package
    }); //ดึงข้อมูล package ทั้งหมด

    app.get("/payments/:id", {
        schema: paymentSchema.getPaymentByIdSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.payment.getPakageById, // ระบุฟังก์ชันการดึงข้อมูล package โดยใช้ ID
    }); //ดึงข้อมูล package ตามไอดี

    app.post("/payment/qr-code", {
        preHandler: [hooks.auth.validateToken],
        schema: paymentSchema.createQRCodeSchema,
        handler: controllers.payment.createQRCodeForPackage,
    });

    app.post("/payment/webhook", {
        schema: paymentSchema.handleWebhookSchema,
        handler: controllers.payment.handleOmiseWebhook,
    });
};


module.exports = {
    paymentRoute,
};
