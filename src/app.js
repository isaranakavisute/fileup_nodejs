const fastify = require('fastify');
const cors = require('fastify-cors');
const paymentRoute = require('./routes/route.payment');
const userRoute = require('./routes/route.user');
const bankRoute = require('./routes/route.bank')
const fastifySwagger = require('fastify-swagger');

const buildApp = (options) => {
  const app = fastify(options);

  // เพิ่มการลงทะเบียนสำหรับ CORS
  app.register(cors, {
    origin: '*',  // เปิดใช้งานสำหรับทุกโดเมน
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // รองรับวิธีการ HTTP ต่างๆ
    credentials: true, // อนุญาตให้ใช้ credentials เช่น cookies
  });

  app.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Music Agent',
        description: 'Music API Service',
        version: '1.0.0',
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        jwt: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });

  userRoute.userRoute(app); // กำหนดเส้นทางสำหรับผู้ใช้
  paymentRoute.paymentRoute(app)
  bankRoute.bankRoute(app) //กำหนดเส้นทางสำหรับ bank

  return app;
}

module.exports = buildApp;
