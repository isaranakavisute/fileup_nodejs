const controllers = require('./controllers')
const hooks = require('./hooks')
const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

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
  app.post('/users/logout', { preHandler: [hooks.auth.validateToken] }, controllers.user.logoutUser); // ออกจากระบบ.
  app.post('/users/upload', { preHandler: [hooks.auth.validateToken] }, upload.single('file'), controllers.publisher.userUploadFile);
  app.post('/users/publish', { preHandler: [hooks.auth.validateToken] }, upload.single('file'), controllers.publisher.publishFile);
  app.delete('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById); // ลบผู้ใช้ตาม ID
};


const paymentRoute = (app) => {
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