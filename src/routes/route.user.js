const controllers = require("../controllers");
const hooks = require("../hooks");
const multer = require("multer");
const userSchema = require('../swagger/user.schema');
var formidable = require('formidable');
var path = require('path')

const fastify_multer = require('fastify-multer'); // or import multer from 'fastify-multer'
const fastify_multer_storage = fastify_multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploaded_files/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
  })
const uploaded_files = fastify_multer({ storage: fastify_multer_storage });

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const userRoute = (app) => {

    app.get('/', (req, res) => {
        res.send('API is up')
        
      }); //for testing deployment

    app.get('/frontend_uploadfile', (req, res) => {
        res.view("src/views/uploadpage.liquid");
      }); //for testing file upload(html)

    app.post('/fileupload', { preHandler: uploaded_files.single('filetoupload') } ,(req, res) => { res.send(req.file); }); //for file upload

    app.get("/me", {
        preHandler: [hooks.auth.validateToken],
        schema: userSchema.getUserProfileSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.user.getMyProfile,
    });
    // ดึงข้อมูลโปรไฟล์ของผู้ใช้เอง

    app.get("/users/:id", {
        schema: userSchema.getUserByIdSchema,
        handler: controllers.user.getUserById, // ระบุฟังก์ชันการดึงข้อมูลผู้ใช้ตาม ID
    }); // ดึงข้อมูลผู้ใช้ตาม ID

    app.post("/users", {
        schema: userSchema.registerUserSchema,
        handler: controllers.user.registerUser,
    }); // สร้างผู้ใช้ใหม่

    app.patch("/users/profile", {
        schema: userSchema.updateUserProfileSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.user.updateUser,
    }); // อัปเดตข้อมูลโปรไฟล์

    app.patch("/users/change-password", {
        schema: userSchema.changePasswordSchema,
        preHandler: [hooks.auth.validateToken], // Assuming you have a validateToken hook
        handler: controllers.user.changePassword,
    }); // เปลี่ยนรหัสผ่าน

    app.patch("/users/change-phonenumber", {
        schema: userSchema.changePhoneNumberSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.user.changePhoneNumber, // ระบุฟังก์ชันการเปลี่ยนหมายเลขโทรศัพท์ของผู้ใช้
    }); // เปลี่ยนหมายเลขโทรศัพท์.

    app.patch("/users/:id/reset-password", {
        schema: userSchema.resetPasswordSchema,
        preHandler: [hooks.auth.validateToken], // Assuming you have a validateToken hook
        handler: controllers.user.resetPassword,
    });
    // รีเซ็ตรหัสผ่าน.

    app.post("/users/forget-password", {
        schema: userSchema.checkEmailSchema,
        handler: controllers.user.forgetVerify,
    }); //เช็คว่าอีเมลมีอยู่ในระบบหรือไม่ ถ้ามีจะส่่ง message reset password ไปยัง email

    app.post("/users/forgetpassword/:keyResetPassword", {
        schema: userSchema.resetPasswordฺBySendEmsilSchema,
        handler: controllers.user.resetPasswordByEmail,
    }); //เปลี่ยนรหัสผ่านลิงค์ที่ส่งไปยัง Email.

    app.post("/users/addbankaccount", {
        preHandler: [hooks.auth.validateToken],
        schema: userSchema.addBankAccountSchema,
        handler: controllers.user.updateUserBankAccount,
    }); //เพิ่มบัญชีธนาคาร

    app.post("/users/editbankaccount", {
        preHandler: [hooks.auth.validateToken],
        schema: userSchema.editBankAccountSchema,
        handler: controllers.user.editUserBankAccount,
    }); //แก้ไขบัญชีธนาคาร

    app.post("/users/login", {
        schema: userSchema.loginSchema,
        handler: controllers.user.loginUser,
    }); // เข้าสู่ระบบ

    app.post("/users/logout", {
        schema: userSchema.logoutSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.user.logoutUser, // ระบุฟังก์ชันการออกจากระบบผู้ใช้
    }); // ออกจากระบบ

    app.delete("/users/:id", {
        preHandler: [hooks.auth.validateToken],
        schema: userSchema.deleteUserSchema,
        handler: controllers.user.deleteUserById,
    }); // ลบผู้ใช้ตาม ID
};

module.exports = {
    userRoute,
};
