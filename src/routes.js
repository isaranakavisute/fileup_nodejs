const controllers = require('./controllers')
const hooks = require('./hooks')

const userRoute = (app) => {
  app.get('/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.getMyProfile); // ดึงข้อมูลโปรไฟล์ของผู้ใช้เอง
  app.get('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.getUserById); // ดึงข้อมูลผู้ใช้ตาม ID
  app.post('/users', controllers.user.registerUser); // สร้างผู้ใช้ใหม่
  app.patch('/users/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUser); // อัปเดตข้อมูลโปรไฟล์
  app.patch('/users/change-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePassword); // เปลี่ยนรหัสผ่าน
  app.patch('/users/:id/change-phonenumber', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePhoneNumber); // เปลี่ยนหมายเลขโทรศัพท์.
  app.patch('/users/:id/reset-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.resetPassword); // รีเซ็ตรหัสผ่าน.
  app.post('/users/forget-password', controllers.user.forgetVerify); //ลืมรหัสผ่าน
  app.post('/users/forgetpassword/:keyResetPassword', controllers.user.resetPasswordByEmail); //เปลี่ยนรหัสผ่านลิงค์ที่ส่งไปยัง Email.
  app.post('/users/addbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUserBankAccount); //เพิ่มบัญชีธนาคาร
  app.post('/users/editbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.editUserBankAccount); //แก้ไขบัญชีธนาคาร
  app.post('/users/login', controllers.user.loginUser); // เข้าสู่ระบบ
  app.post('/users/logout', { preHandler: [hooks.auth.validateToken] }, controllers.user.logoutUser); // ออกจากระบบ
  app.delete('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById); // ลบผู้ใช้ตาม ID
};


const paymentRoute = (app) => {
  app.get('/payments', {
    schema: {
      tags: ['Payment'],
      summary: 'Get list of packages',
      description: 'Get list of packages',
      // security: [{ bearerAuth: [] }], // ระบุความปลอดภัยของการใช้งานโดยการใช้โทเค็น Bearer
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      response: {
        200: {
          description: 'Payments retrieved successfully', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  // เพิ่ม properties อื่น ๆ ตามที่มีอยู่ในข้อมูล package
                  // ตัวอย่าง: name, price, description
                },
              },
            },
          },
          example: {
            status: 'success',
            message: 'Payments retrieved successfully',
            data: [
              {
                id: 1,
                name: 'Package 1',
                price: 100,
                description: 'This is package 1 description',
              },
              {
                id: 2,
                name: 'Package 2',
                price: 200,
                description: 'This is package 2 description',
              },
              // เพิ่ม package อื่น ๆ ตามต้องการ
            ],
          },
        },
        401: {
          description: 'Unauthorized', // เพิ่มคำอธิบายสำหรับการตอบกลับที่ไม่ได้รับอนุญาต
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Unauthorized - Token required',
          },
        },
        500: {
          description: 'Internal Server Error', // เพิ่มคำอธิบายสำหรับการตอบกลับที่เกิดข้อผิดพลาดบริการภายใน
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Internal Server Error',
            error: 'An unexpected error occurred',
          },
        },
      },
    },
    preHandler: [hooks.auth.validateToken],
    handler: controllers.payment.getPakage, // ระบุฟังก์ชันการดึงรายการ package
  });//ดึงข้อมูล package ทั้งหมด



  app.get('/payments/:id', {
    schema: {
      tags: ['Payment'],
      summary: 'Get package by ID',
      description: 'Get package by ID',
      // security: [{ bearerAuth: [] }], // ระบุความปลอดภัยของการใช้งานโดยการใช้โทเค็น Bearer
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Package ID' },
        },
      },
      response: {
        200: {
          description: 'Payment retrieved successfully', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                // เพิ่ม properties อื่น ๆ ตามที่มีอยู่ในข้อมูล package
                // ตัวอย่าง: name, price, description
              },
            },
          },
          example: {
            status: 'success',
            message: 'Payment retrieved successfully',
            data: {
              id: 1,
              name: 'Package 1',
              price: 100,
              description: 'This is package 1 description',
            },
          },
        },
        404: {
          description: 'Not Found', // เพิ่มคำอธิบายสำหรับการตอบกลับเมื่อไม่พบข้อมูล
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Payment not found',
          },
        },
        500: {
          description: 'Internal Server Error', // เพิ่มคำอธิบายสำหรับการตอบกลับที่เกิดข้อผิดพลาดบริการภายใน
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Internal Server Error',
            error: 'An unexpected error occurred',
          },
        },
      },
    },
    preHandler: [hooks.auth.validateToken],
    handler: controllers.payment.getPakageById, // ระบุฟังก์ชันการดึงข้อมูล package โดยใช้ ID
  });//ดึงข้อมูล package ตามไอดี


  app.post('/payment/qr-code', {
    preHandler: [hooks.auth.validateToken],
    schema: {
      description: 'Create QR Code for package payment',
      tags: ['Payment'],
      summary: 'Create QR Code for payment',
      summary: 'Create QR Code for payment',
      // security: [{ Bearer: [] }],
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        required: ['userId', 'packageId'],
        properties: {
          userId: { type: 'string' },
          packageId: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            message: { type: 'string' },
            qrCodeImage: { type: 'string' },
            chargeId: { type: 'string' }
          }
        },
        400: {
          description: 'Failed to create QR Code payment',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.payment.createQRCodeForPackage
  });


  app.post('/payment/webhook', {
    schema: {
      description: 'Handle Omise webhook events',
      tags: ['Payment'],
      summary: 'Handle Omise webhook',
      summary: 'Handle Omise webhook',
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          object: { type: 'string' },
          data: { type: 'object' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Unhandled event type',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.payment.handleOmiseWebhook
  });


};

const bankRoute = (app) => {
  app.get('/banks', {
    schema: {
      description: 'Retrieve all banks',
      tags: ['Setting'],
      summary: 'Get all banks',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  nameTh: { type: 'string' },
                  nameEn: { type: 'string' },
                  shortName: { type: 'string' },
                  logo: { type: 'string' },
                  status: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        },
        404: {
          description: 'Banks not found',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.bank.getBankAll
  });



  app.get('/banks/:id', {
    schema: {
      description: 'Retrieve a bank by ID',
      tags: ['Setting'],
      summary: 'Get bank by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                nameTh: { type: 'string' },
                nameEn: { type: 'string' },
                shortName: { type: 'string' },
                logo: { type: 'string' },
                status: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            }
          }
        },
        404: {
          description: 'Bank not found',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.bank.getBankByID
  });
}

module.exports = {
  userRoute,
  paymentRoute,
  bankRoute,
}