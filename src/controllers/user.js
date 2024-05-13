const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const config = require('../config');
// const jwtDecode = require("jwt-decode");
const jwtDecode = require('jwt-decode')
const chalk = require('chalk')
const crypto = require('crypto');
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const forget = require('../config/forget')
const Mailgen = require("mailgen");



const base64UrlDecode = (base64Url) => {

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(base64, 'base64');
  return buffer.toString('utf8');
};


const canUploadFile = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // กำหนดให้เป็นช่วงต้นของวัน

  const dailyUpload = await prisma.dailyUpload.findUnique({
    where: { userId },
  });

  // ตรวจสอบการจำกัดจำนวนครั้งอัปโหลดต่อวัน
  if (dailyUpload && dailyUpload.uploads >= 5) { // สมมุติว่า 5 ครั้งต่อวัน
    return false; // ไม่ให้ทำการอัปโหลด
  }

  // ตรวจสอบวันหมดอายุของแพ็คเกจสมัครสมาชิก
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || subscription.isActive === false || new Date() > subscription.endDate) {
    return false; // ไม่ให้ทำการอัปโหลด
  }

  return true; // ให้ทำการอัปโหลดได้
};


const changePhoneNumber = async (request, reply) => {
  const { id } = request.params;
  const { newPhoneNumber } = request.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        mobilephone: newPhoneNumber,
      },
    });

    reply.code(200).send({
      status: 'success',
      message: 'User phone number changed successfully',
      data: updatedUser,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const changePassword = async (request, reply) => {
  try {

    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return reply.code(401).send({
        status: "error",
        message: "Unauthorized - Token required",
      });
    }


    const token = authorization.replace("Bearer ", "");
    let decodedToken;

    try {

      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return reply.code(401).send({
        status: "error",
        message: "Invalid Token",
      });
    }


    const userId = decodedToken.userId;


    const { newPassword } = request.body;


    const hashedPassword = await bcrypt.hash(newPassword, 10);


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    reply.code(200).send({
      status: 'success',
      message: 'Password changed successfully',
      data: updatedUser,
    });
  } catch (error) {
    // การจัดการข้อผิดพลาดทั่วไป
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const forgetVerify = async (request, reply) => {

  const { email } = request.body;
  try {
    // ตรวจสอบ email ของผู้ใช้มีอยู่ในระบบหรือไม่
    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
      select: {
        name: true,
        lastname: true,
      }
    });

    // ถ้าไม่มีให้แสดง error
    if (!checkEmail) {
      reply.status(404).send({ status: 'error', message: 'Email not found' });
      return;
    }

    // const randomString = randomstring.generate();
    const recoveryCode = crypto.randomBytes(16).toString('hex');
    const fullname = checkEmail.name + " " + checkEmail.lastname
    await prisma.user.update({
      where: { email: email },
      data: {
        token: recoveryCode,
      },
    })
    forgetPassword(fullname, email, recoveryCode, reply); // function ส่งแจ้งเตือนไปยัง email
  } catch (error) {
    console.error('Error Forget Password:', error);
    reply.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
}

// รีเซ็ตรหัสผ่านจากลิงค์ที่ส่งไปให้ทาง email
const resetPasswordByEmail = async (request, reply) => {

  const { token } = request.params
  const { newpassword, confirmnewpassword } = request.body;

  if (!validatePassword(newpassword, confirmnewpassword)) { // ตรวจสอบรหัสผ่าน
    reply.status(400).send({
      error: 'Invalid characters in password. Avoid using ";$^*.',
    });
    return;
  }

  try {

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    //ตรวจสอบว่า token ที่ส่งมาตรงกับ token ใน database หรือไม้
    await prisma.user.updateMany({
      where: { token: token },
      data: {
        password: hashedPassword,
        token: null,
      },
    });

    reply.code(200).send({
      status: 'success',
      message: 'update password successfully',
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      details: error.message,
    });
  }
}


const createUser = async (request, reply) => {
  const {
    name,
    password,
    email,
    logsRegister,
  } = request.body;

  if (!validateEmail(email)) { // ตรวจสอบอีเมล
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid email format.',
    });
  }

  if (!validatePassword(password)) { // ตรวจสอบรหัสผ่าน
    return reply.code(400).send({
      status: 'error',
      message: 'Password contains invalid characters. Avoid using ";$^*.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        logsRegister,
      },
    });

    reply.code(201).send({
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      details: error.message,
    });
  }
};



const deleteUserById = async (request, reply) => {
  const { id } = request.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedUser) {
      reply.status(404).send({ status: 'error', message: 'User not found' });
      return;
    }

    reply.send({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    reply.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET, // Secret key
    { expiresIn: '3h' } // เวลาหมดอายุของ token
  );

  return token;
};




const getMyProfile = async (request, reply) => {
  try {
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return reply.code(401).send({
        status: "error",
        message: "Unauthorized - Token required",
      });
    }

    const token = authorization.replace("Bearer ", "");
    const decodedToken = validateToken(token); // ถอดรหัสและตรวจสอบโทเค็น

    const userId = parseInt(decodedToken.userId); // ใช้ `userId` ที่ถอดรหัสได้

    // ค้นหาผู้ใช้และรวมข้อมูลธนาคาร
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        mobilephone: true,
        point: true,
        bankAccount: true, // ส่งกลับเลขบัญชีธนาคาร
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return reply.code(404).send({
        status: "error",
        message: "User not found",
      });
    }

    reply.code(200).send({
      status: "success",
      message: "User retrieved successfully",
      data: {
        ...user, // รวมข้อมูลที่ได้จาก select
        bank: user.bank ? {
          nameTh: user.bank.nameTh,
          nameEn: user.bank.nameEn,
        } : null, // ถ้าผู้ใช้ไม่มีธนาคาร
      },
    });
  } catch (error) {
    reply.code(500).send({
      status: "error",
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
};

const getUsers = async (request, reply) => {
  try {
    const users = await prisma.user.findMany();
    reply.code(200).send({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getUserById = async (request, reply) => {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      reply.code(404).send({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    reply.code(200).send({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


const loginUser = async (request, reply) => {
  const { email, password } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid username');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user);

    reply.send({ token });
  } catch (error) {
    console.error('Error during login:', error.message);
    reply.status(401).send('Invalid credentials');
  }
};

const registerUser = async (request, reply) => {
  const { password, name, lastname, mobilephone, email } = request.body;

  if (!validateEmail(email)) { // ตรวจสอบว่าอีเมลมีรูปแบบถูกต้อง
    reply.status(400).send({
      error: 'Invalid email format.',
    });
    return;
  }

  if (!validatePassword(password)) { // ตรวจสอบรหัสผ่าน
    reply.status(400).send({
      error: 'Invalid characters in password. Avoid using ";$^*.',
    });
    return;
  }

  // ตรวจสอบว่าอีเมลไม่ซ้ำ
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    reply.status(409).send({
      error: 'Email already exists', // ข้อความเมื่ออีเมลซ้ำ
    });
    return;
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        name,
        lastname,
        password: hashedPassword,
        mobilephone,
        email,
        username: email,
      },
    });
    reply.status(201).send({
      message: 'User registered successfully',
      userId: newUser.id, // ส่งคืน ID ของผู้ใช้ที่สร้างใหม่
    });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    reply.status(500).send({
      error: 'An error occurred during registration',
    });
  }
};


const resetPassword = async (request, reply) => {

  const token = request.headers.authorization?.split(' ')[1];

  if (!token) {
    return reply.code(401).send({
      status: 'error',
      message: 'Unauthorized: JWT not provided',
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;

    const { id } = request.params;

    // ตรวจสอบว่า ID ที่จะรีเซ็ตตรงกับ ID ใน JWT
    if (userIdFromToken !== parseInt(id)) {
      return reply.code(403).send({
        status: 'error',
        message: 'Forbidden: You are not allowed to reset another user\'s password',
      });
    }

    // สร้างรหัสผ่านใหม่
    const newPassword = crypto.randomBytes(8).toString('hex'); // สร้างรหัสผ่านสุ่มขนาด 16 ตัวอักษร
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        password: hashedPassword,
      },
    });

    reply.code(200).send({
      status: 'success',
      message: 'User password reset successfully',
      data: {
        user: updatedUser,
        newPassword: newPassword, // ส่งรหัสผ่านใหม่กลับไป
      },
    });
  } catch (error) {
    reply.code(500).send({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};



const logoutUser = async (request, reply) => {
  try {
    // รหัสผู้ใช้จากโทเค็น (วิธีการนี้ขึ้นอยู่กับว่าคุณเก็บข้อมูลโทเค็นอย่างไร)
    const userId = getUserIdFromToken(request.headers.authorization);

    if (!userId) {
      throw new Error('User not found');
    }


    await prisma.session.deleteMany({
      where: { userId },
    });

    reply.send({ message: 'Sign-out successful' });
  } catch (error) {
    console.error('Error during sign-out:', error.message);
    reply.status(500).send('Error during sign-out');
  }
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  const forbiddenCharacters = /[";^*$]/; // ตรวจสอบอักขระที่ไม่อนุญาต
  return !forbiddenCharacters.test(password);
};


const validateToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      throw new Error("Invalid token: Token is not a valid string");
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid token: Incorrect JWT structure");
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    if (Date.now() / 1000 > payload.exp) {
      throw new Error("Token has expired");
    }

    // console.log(chalk.blue("Decoded token payload:"), payload); 
    return payload;
  } catch (error) {
    console.error(chalk.red("Error decoding token:"), error);
    throw new Error("Invalid token");
  }
};


const updateUser = async (request, reply) => {
  try {
    const token = request.headers.authorization.split(" ")[1]; // ดึง Token จาก Header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ Token
    const userId = decodedToken.userId; // ดึง `userId` จาก Token

    // console.log("User ID from Token:", userId);

    const { name, lastname, mobilephone } = request.body;

    // console.log(chalk.red(request.body));
    console.log(chalk.red(JSON.stringify(request.body, null, 2)));
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        lastname,
        mobilephone,
      },
    });


    reply.code(200).send({
      status: "success",
      message: "User information updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "JsonWebTokenError") {
      return reply.code(401).send({
        status: "error",
        message: "Invalid Token",
      });
    }

    reply.code(500).send({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// เปลี่ยนรหัสผ่านทางลิงค์ที่ส่งไปทางอีเมล
const forgetPassword = async (fullname, email, token, reply) => {
  let config = {
    service: "gmail",
    auth: {
      user: forget.EMAIL,
      pass: forget.PASSWORD,
    },
  };
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Music Agent",
      link: "https://mailgen.js/",
    },
  });
  let response = {
    body: {
      name: " " + fullname,
      intro:
        '<p>Please click here to <a href="http://localhost:3000/forgetpassword/' +
        token +
        '"> Reset </a> your password.</a></p>',
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mail = MailGenerator.generate(response);

  let message = {
    from: forget.EMAIL,
    to: email,
    subject: "Reset Password!!!",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      reply.status(200).send({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      reply.status(400).send({ error });
    });
};

const uploadFile = async (request, reply) => {
  const { userId, fileData } = request.body;

  // เช็คว่าผู้ใช้สามารถอัปโหลดได้หรือไม่
  const canUpload = await canUploadFile(userId);

  if (!canUpload) {
    return reply.status(403).send({ error: 'Upload limit reached or subscription expired' });
  }

  // ถ้าสามารถอัปโหลดได้ ให้ดำเนินการ
  const newUpload = await prisma.digitalAsset.create({
    data: {
      title: fileData.title,
      description: fileData.description,
      fileUrl: fileData.fileUrl,
      fileType: fileData.fileType,
      uploadedById: userId,
    },
  });

  // อัปเดตจำนวนครั้งที่อัปโหลดต่อวัน
  await prisma.dailyUpload.upsert({
    where: { userId },
    update: {
      uploads: { increment: 1 }, // เพิ่มจำนวนครั้งที่อัปโหลด
    },
    create: {
      userId,
      uploads: 1, // ถ้ายังไม่มี, สร้างและตั้งเป็น 1
    },
  });

  reply.status(201).send({ message: 'File uploaded successfully', data: newUpload });
};





module.exports = {
  canUploadFile,
  changePassword,
  changePhoneNumber,
  createUser,
  deleteUserById,
  getMyProfile,
  getUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  uploadFile,
  forgetVerify,
  resetPasswordByEmail

};
