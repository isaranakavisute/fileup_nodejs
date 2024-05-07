const controllers = require('./controllers')
const hooks = require('./hooks')

const userRoute = (app) => {
  app.get('/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.getMyProfile); // ดึงข้อมูลโปรไฟล์ของผู้ใช้เอง
  app.get('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.getUserById); // ดึงข้อมูลผู้ใช้ตาม ID
  app.post('/users', controllers.user.createUser); // สร้างผู้ใช้ใหม่
  app.patch('/users/profile', { preHandler: [hooks.auth.validateToken] }, controllers.user.updateUser); // อัปเดตข้อมูลโปรไฟล์
  app.patch('/users/change-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePassword); // เปลี่ยนรหัสผ่าน
  app.patch('/users/:id/change-phonenumber', { preHandler: [hooks.auth.validateToken] }, controllers.user.changePhoneNumber); // เปลี่ยนหมายเลขโทรศัพท์
  app.patch('/users/:id/reset-password', { preHandler: [hooks.auth.validateToken] }, controllers.user.resetPassword); // รีเซ็ตรหัสผ่าน
  app.post('/users/login', controllers.user.loginUser); // เข้าสู่ระบบ
  app.post('/users/logout', { preHandler: [hooks.auth.validateToken] }, controllers.user.logoutUser); // ออกจากระบบ
  app.delete('/users/:id', { preHandler: [hooks.auth.validateToken] }, controllers.user.deleteUserById); // ลบผู้ใช้ตาม ID
};


  const paymentRoute = (app) => {
    app.post('/customers', { preHandler: [hooks.auth.validateToken] }, controllers.payment.createCustomerWithCard); //สร้างลูกค้าพร้อมบัตรเครดิต
    app.post('/packages/purchase', { preHandler: [hooks.auth.validateToken] }, controllers.payment.subscriptionPackage); //ซื้อแพ็กเกจ:
    // app.get('/customers', { preHandler: [hooks.auth.validateToken] }, controllers.payment.listAllCustomers); // ดึงรายชื่อลูกค้าทั้งหมด:
    // app.get('/customers/:customerId', { preHandler: [hooks.auth.validateToken] }, controllers.payment.retrieveCustomer); //ดึงข้อมูลลูกค้ารายบุคคล:
    // app.put('/customers/:customerId', { preHandler: [hooks.auth.validateToken] }, controllers.payment.updateCustomer); // อัปเดตข้อมูลลูกค้า:
};

module.exports ={
    userRoute,
    paymentRoute,
}