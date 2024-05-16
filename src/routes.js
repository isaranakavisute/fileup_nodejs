const controllers = require('./controllers')
const hooks = require('./hooks')

const userRoute = (app) => {
  app.get('/profile', {
    preHandler: [hooks.auth.validateToken],
    schema: {
      tags: ['User'],
      description: 'Get user profile',
      headers: {
        type: 'object',
        properties: {
          authorization: { type: 'string', description: 'Bearer token' },
        },
        required: ['authorization'],
        example: {
          authorization: 'Bearer your_jwt_token_here',
        },
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
                id: { type: 'integer' },
                email: { type: 'string' },
                name: { type: 'string' },
                lastname: { type: 'string' },
                mobilephone: { type: 'string' },
                point: { type: 'integer' },
                bankAccount: { type: 'string' },
                bankId: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                bank: {
                  type: 'object',
                  properties: {
                    nameTh: { type: 'string' },
                    nameEn: { type: 'string' },
                  },
                },
              },
            },
          },
          example: {
            status: 'success',
            message: 'User retrieved successfully',
            data: {
              id: 1,
              email: 'user@example.com',
              name: 'John',
              lastname: 'Doe',
              mobilephone: '1234567890',
              point: 100,
              bankAccount: '123-456-7890',
              bankId: 1,
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
              bank: {
                nameTh: 'ธนาคารตัวอย่าง',
                nameEn: 'Example Bank',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized response',
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
        404: {
          description: 'User not found response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'User not found',
          },
        },
        500: {
          description: 'Internal Server Error response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Internal Server Error',
            details: 'Error details here',
          },
        },
      },
    },
    preHandler: [hooks.auth.validateToken],
    handler: controllers.user.getMyProfile,
  });
 // ดึงข้อมูลโปรไฟล์ของผู้ใช้เอง
  app.get('/users/:id', {
    schema: {
      tags: ['User'], // ระบุหมวดหมู่ของเส้นทาง
      description: 'Get user by ID', // เพิ่มคำอธิบายเส้นทาง
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
          id: { type: 'integer', description: 'User ID to retrieve' },
        },
      },
      response: {
        200: {
          description: 'User retrieved successfully', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                lastname: { type: 'string' },
                mobilephone: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          example: {
            status: 'success',
            message: 'User retrieved successfully',
            data: {
              id: 1,
              name: 'John',
              lastname: 'Doe',
              mobilephone: '1234567890',
              email: 'johndoe@example.com',
              createdAt: '2024-05-16T09:30:00Z',
              updatedAt: '2024-05-16T10:30:00Z',
            },
          },
        },
        404: {
          description: 'User not found', // เพิ่มคำอธิบายสำหรับการตอบกลับเมื่อไม่พบผู้ใช้
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'User not found',
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
    handler: controllers.user.getUserById, // ระบุฟังก์ชันการดึงข้อมูลผู้ใช้ตาม ID
  }); // ดึงข้อมูลผู้ใช้ตาม ID


  app.post('/users', {
    schema: {
      tags: ['User'],
      description: 'Register a new user',
      body: {
        type: 'object',
        required: ['firstName', 'lastName', 'username', 'password'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
        },
        example: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe@example.com',
          password: 'securePassword123!',
        },
      },
      response: {
        201: {
          description: 'Successful registration response',
          type: 'object',
          properties: {
            message: { type: 'string' },
            userId: { type: 'integer' },
          },
          example: {
            message: 'User registered successfully',
            userId: 1,
          },
        },
        400: {
          description: 'Invalid input response',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          example: {
            error: 'Invalid email format.',
          },
        },
        409: {
          description: 'Email already exists response',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          example: {
            error: 'Email already exists',
          },
        },
        500: {
          description: 'Internal Server Error response',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          example: {
            error: 'An error occurred during registration',
          },
        },
      },
    },
    handler: controllers.user.registerUser,
  }); // สร้างผู้ใช้ใหม่



  app.patch('/users/profile', {
    schema: {
      tags: ['User'],
      description: 'Update user profile',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          lastname: { type: 'string' },
          mobilephone: { type: 'string' },
        },
        example: {
          name: 'John',
          lastname: 'Doe',
          mobilephone: '1234567890',
        },
      },
      response: {
        200: {
          description: 'User information updated successfully',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                lastname: { type: 'string' },
                mobilephone: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          example: {
            status: 'success',
            message: 'User information updated successfully',
            data: {
              id: 1,
              name: 'John',
              lastname: 'Doe',
              mobilephone: '1234567890',
              email: 'johndoe@example.com',
              createdAt: '2024-05-16T09:30:00Z',
              updatedAt: '2024-05-16T10:30:00Z',
            },
          },
        },
        401: {
          description: 'Invalid Token',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Invalid Token',
          },
        },
        500: {
          description: 'Internal Server Error',
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
    handler: controllers.user.updateUser,
  }); // อัปเดตข้อมูลโปรไฟล์



  app.patch('/users/change-password', {  
    schema: {
      tags: ['User'], // ระบุหมวดหมู่ของเส้นทาง
      description: 'Change user password', // เพิ่มคำอธิบายเส้นทาง
      // security: [{ bearerAuth: [] }], // ระบุว่าการเข้าถึงต้องใช้ Bearer token
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        properties: {
          newPassword: { type: 'string', description: 'New password to set' },
        },
        required: ['newPassword'],
        example: {
          newPassword: 'newSecurePassword123!',
        },
      },
      response: {
        200: {
          description: 'Password changed successfully', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                lastname: { type: 'string' },
                mobilephone: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          example: {
            status: 'success',
            message: 'Password changed successfully',
            data: {
              id: 1,
              name: 'John',
              lastname: 'Doe',
              mobilephone: '1234567890',
              email: 'johndoe@example.com',
              createdAt: '2024-05-16T09:30:00Z',
              updatedAt: '2024-05-16T10:30:00Z',
            },
          },
        },
        401: {
          description: 'Invalid Token', // เพิ่มคำอธิบายสำหรับการตอบกลับที่ไม่ได้รับอนุญาต
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Invalid Token',
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
  preHandler: [hooks.auth.validateToken], // Assuming you have a validateToken hook
  handler: controllers.user.changePassword,
}); // เปลี่ยนรหัสผ่าน



  app.patch('/users/:id/change-phonenumber', {
    schema: {
      tags: ['User'], // ระบุหมวดหมู่ของเส้นทาง
      description: 'Change user phone number', // เพิ่มคำอธิบายเส้นทาง
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
          id: { type: 'integer', description: 'User ID' },
        },
      },
      body: {
        type: 'object',
        properties: {
          newPhoneNumber: { type: 'string', description: 'New phone number to set' },
        },
        required: ['newPhoneNumber'],
        example: {
          newPhoneNumber: '01234567890',
        },
      },
      response: {
        200: {
          description: 'User phone number changed successfully', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                lastname: { type: 'string' },
                mobilephone: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          example: {
            status: 'success',
            message: 'User phone number changed successfully',
            data: {
              id: 1,
              name: 'John',
              lastname: 'Doe',
              mobilephone: '01234567890',
              email: 'johndoe@example.com',
              createdAt: '2024-05-16T09:30:00Z',
              updatedAt: '2024-05-16T10:30:00Z',
            },
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
    handler: controllers.user.changePhoneNumber, // ระบุฟังก์ชันการเปลี่ยนหมายเลขโทรศัพท์ของผู้ใช้
  }); // เปลี่ยนหมายเลขโทรศัพท์.



  app.patch('/users/:id/reset-password', {
    schema: {
      tags: ['User'],
      description: 'Reset user password',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', description: 'User ID' },
        },
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token in the format Bearer <token>' },
        },
        required: ['Authorization'],
      },
      response: {
        200: {
          description: 'Successful password reset response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' }, // สามารถระบุ schema ของ user ได้เพิ่มเติมตามโครงสร้าง user
                newPassword: { type: 'string' },
              },
            },
          },
          example: {
            status: 'success',
            message: 'User password reset successfully',
            data: {
              user: {
                id: 1,
                email: 'user@example.com',
                name: 'John',
                lastname: 'Doe',
                // ... other user fields
              },
              newPassword: 'newRandomPassword123',
            },
          },
        },
        401: {
          description: 'Unauthorized: JWT not provided',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Unauthorized: JWT not provided',
          },
        },
        403: {
          description: 'Forbidden: Not allowed to reset another user\'s password',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Forbidden: You are not allowed to reset another user\'s password',
          },
        },
        500: {
          description: 'Internal Server Error',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
          example: {
            status: 'error',
            message: 'Internal Server Error',
            error: 'Detailed error message',
          },
        },
      },
    },
    preHandler: [hooks.auth.validateToken], // Assuming you have a validateToken hook
    handler: controllers.user.resetPassword,
  });
 // รีเซ็ตรหัสผ่าน.


  app.post('/users/forget-password', {
    schema: {
      tags: ['User'],
      description: 'Send reset password via email',
      body: {
        type: 'object',
        required: ['fullname', 'email', 'keyResetPassword'],
        properties: {
          fullname: { type: 'string' },
          email: { type: 'string', format: 'email' },
          keyResetPassword: { type: 'string' },
        },
        example: {
          fullname: 'John Doe',
          email: 'johndoe@example.com',
          keyResetPassword: 'randomkey123',
        },
      },
      response: {
        200: {
          description: 'Email sent successfully',
          type: 'object',
          properties: {
            msg: { type: 'string' },
          },
          example: {
            msg: 'you should receive an email',
          },
        },
        400: {
          description: 'Error sending email',
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
          example: {
            error: 'Email could not be sent',
          },
        },
      },
    },
    handler: controllers.user.forgetVerify
  });  //ลืมรหัสผ่าน
  app.post('/users/forgetpassword/:keyResetPassword', controllers.user.resetPasswordByEmail); //เปลี่ยนรหัสผ่านลิงค์ที่ส่งไปยัง Email.
  app.post('/users/addbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUserBankAccount); //เพิ่มบัญชีธนาคาร
  app.post('/users/editbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.editUserBankAccount); //แก้ไขบัญชีธนาคาร
  app.post('/users/login', {
    schema: {
      tags: ['User'],
      description: 'User login',
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
        example: {
          username: 'test5@dmail.com',
          password: '1234',
        },
      },
      response: {
        200: {
          description: 'Successful login response',
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
          example: {
            token: 'your_jwt_token_here',
          },
        },
        401: {
          description: 'Invalid credentials response',
          type: 'string',
          example: 'Invalid credentials',
        },
      },
    },
    handler: controllers.user.loginUser,
  }); // เข้าสู่ระบบ
  app.post('/users/logout', {
    schema: {
      tags: ['User'], // ระบุหมวดหมู่ของเส้นทาง
      description: 'Logout user and revoke access token', // เพิ่มคำอธิบายเส้นทาง
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string', description: 'JWT token for authentication' },
        },
        required: ['Authorization'],
      },
      response: {
        200: {
          description: 'Sign-out successful', // เพิ่มคำอธิบายสำหรับการตอบกลับสำเร็จ
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Sign-out successful',
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
          type: 'string',
          example: 'Error during sign-out',
        },
      },
    },
    preHandler: [hooks.auth.validateToken], 
    handler: controllers.user.logoutUser, // ระบุฟังก์ชันการออกจากระบบผู้ใช้
  }); // ออกจากระบบ
  
  app.delete('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById); // ลบผู้ใช้ตาม ID
};


const paymentRoute = (app) => {
  app.get('/payments', { preHandler: [hooks.auth.validateToken] }, controllers.payment.getPakage); //ดึงข้อมูล package ทั้งหมด
  app.get('/payments/:id', { preHandler: [hooks.auth.validateToken] }, controllers.payment.getPakageById); //ดึงข้อมูล package ตามไอดี
  app.post('/payment/qr-code', { preHandler: [hooks.auth.validateToken] }, controllers.payment.createQRCodeForPackage);
  app.post('/payment/webhook', controllers.payment.handleOmiseWebhook);
};

const bankRoute = (app) => {
  app.get('/banks', controllers.bank.getBankAll);
  app.get('/banks/:id', controllers.bank.getBankByID);
}

module.exports = {
  userRoute,
  paymentRoute,
  bankRoute,
}