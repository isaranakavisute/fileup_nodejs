const controllers = require('./controllers')
const hooks = require('./hooks')

const userRoute = (app) => {
<<<<<<< HEAD
  app.get('/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.getMyProfile); // ดึงข้อมูลโปรไฟล์ของผู้ใช้เอง
  app.get('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.getUserById); // ดึงข้อมูลผู้ใช้ตาม ID
  app.post('/users', controllers.user.registerUser); // สร้างผู้ใช้ใหม่
  app.patch('/users/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUser); // อัปเดตข้อมูลโปรไฟล์
  app.patch('/users/change-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePassword); // เปลี่ยนรหัสผ่าน
  app.patch('/users/:id/change-phonenumber', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePhoneNumber); // เปลี่ยนหมายเลขโทรศัพท์.
  app.patch('/users/:id/reset-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.resetPassword); // รีเซ็ตรหัสผ่าน.
  app.post('/users/forget-password', controllers.user.forgetVerify); //ลืมรหัสผ่าน
  app.post('/users/forgetpassword/:keyResetPassword', controllers.user.resetPasswordByEmail); //เปลี่ยนรหัสผ่านลิงค์ที่ส่งไปยัง Email.
  app.patch('/users/addbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUserBankAccount); //เพิ่มบัญชีธนาคาร
  app.patch('/users/editbankaccount', { preHandler: [hooks.auth.validateToken] }, controllers.user.editUserBankAccount); //แก้ไขบัญชีธนาคาร
  app.post('/users/login', controllers.user.loginUser); // เข้าสู่ระบบ
  app.post('/users/logout', { preHandler: [hooks.auth.validateToken] }, controllers.user.logoutUser); // ออกจากระบบ
  app.delete('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById); // ลบผู้ใช้ตาม ID
=======
  app.get('/me', {
    preHandler: [hooks.auth.validateToken],
    schema: {
      tags: ['User'],
      summary: 'Get user profile',
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
      tags: ['User'], 
      summary: 'Search user by ID',
      description: 'Get user by ID', 
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
      summary: 'Register new user',
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
      summary: 'Update user profile',
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
      tags: ['User'], 
      summary: 'Change user password',
      description: 'Change user password', 
      // security: [{ bearerAuth: [] }], 
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
      tags: ['User'], 
      summary: 'Change user phone number',
      description: 'Change user phone number', 
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
      summary: 'Reset user password',
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
      summary: 'Send reset password via email',
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
  app.post('/users/forgetpassword/:keyResetPassword', {
    schema: {
      description: 'Reset user password by key',
      tags: ['User'],
      summary: 'Reset password by key',
      params: {
        type: 'object',
        properties: {
          keyResetPassword: { type: 'string' }
        },
        required: ['keyResetPassword']
      },
      body: {
        type: 'object',
        properties: {
          newpassword: { type: 'string' },
          confirmnewpassword: { type: 'string' }
        },
        required: ['newpassword', 'confirmnewpassword']
      },
      response: {
        200: {
          description: 'Password reset successfully',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Invalid characters in password',
          type: 'object',
          properties: {
            error: { type: 'string' }
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
    handler: controllers.user.resetPasswordByEmail
  }); //เปลี่ยนรหัสผ่านลิงค์ที่ส่งไปยัง Email.




  app.post('/users/addbankaccount', {
    preHandler: [hooks.auth.validateToken],
    schema: {
      description: 'Add or update user bank account',
      tags: ['User'],
      summary: 'Add bank account',
      // security: [{ Bearer: [] }],
      body: {
        type: 'object',
        properties: {
          bankid: { type: 'number' },
          bankaccountname: { type: 'string' },
          bankaccount: { type: 'string' }
        },
        required: ['bankid', 'bankaccountname', 'bankaccount']
      },
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
          description: 'Bank account added successfully',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                bankId: { type: 'number' },
                bankAccount: { type: 'string' },
                bankAccountName: { type: 'string' }
              }
            }
          }
        },
        401: {
          description: 'Invalid Token',
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
            error: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.user.updateUserBankAccount
  }); //เพิ่มบัญชีธนาคาร


  app.post('/users/editbankaccount', {
    preHandler: [hooks.auth.validateToken],
    schema: {
      description: 'Edit user bank account',
      tags: ['User'],
      summary: 'Edit bank account',
     // security: [{ Bearer: [] }],
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
      body: {
        type: 'object',
        properties: {
          bankid: { type: 'number' },
          bankaccountname: { type: 'string' },
          bankaccount: { type: 'string' }
        },
        required: ['bankid', 'bankaccountname', 'bankaccount']
      },
      response: {
        200: {
          description: 'Bank account updated successfully',
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                bankId: { type: 'number' },
                bankAccount: { type: 'string' },
                bankAccountName: { type: 'string' }
              }
            }
          }
        },
        401: {
          description: 'Invalid Token',
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
            error: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.user.editUserBankAccount
  }); //แก้ไขบัญชีธนาคาร


  app.post('/users/login', {
    schema: {
      tags: ['User'],
      summary: 'User login',
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
      tags: ['User'], 
      summary: 'Logout user and revoke access token',
      description: 'Logout user and revoke access token', 
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
  
  app.delete('/users/:id',  {
    preHandler: [hooks.auth.validateToken],
    schema: {
      description: 'Delete a user by ID',
      tags: ['User'],
      summary: 'Delete user by ID',
      summary: 'Delete user by ID',
      // security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
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
            message: { type: 'string' }
          }
        },
        404: {
          description: 'User not found',
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
            message: { type: 'string' }
          }
        }
      }
    },
    handler: controllers.user.deleteUserById
  }); // ลบผู้ใช้ตาม ID
>>>>>>> 26257add481767671e545a722a9fb6aafcc38641
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


  app.post('/payment/qr-code',  {
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
  

  app.post('/payment/webhook',{
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
  app.get('/banks',  {
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