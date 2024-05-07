const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const config = require('../config');
// const jwtDecode = require("jwt-decode");
const jwtDecode = require('jwt-decode')
const chalk = require('chalk')



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
        phonenumber: newPhoneNumber,
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
    console.log(chalk.blue("Token received:"), token); 

    let decodedToken;
    try {
      decodedToken = validateToken(token); // ถอดรหัสและตรวจสอบโทเค็น
    } catch (error) {
      console.error(chalk.red("Error validating token:"), error);
      return reply.code(401).send({
        status: "error",
        message: "Unauthorized - Invalid token",
      });
    }

    console.log(chalk.green("Decoded Token:"), decodedToken); // แสดงรายละเอียดโทเค็น

    const userId = decodedToken.userId; // ใช้ `userId` ที่ถอดรหัสได้เพื่อค้นหาผู้ใช้
    // หรือใช้ข้อมูลอื่น ๆ จาก `decodedToken`
    const email = decodedToken.email; // ตัวอย่างการใช้ข้อมูลอื่นจากโทเค็น

    // ค้นหาผู้ใช้จาก `userId` หรือข้อมูลอื่น
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        mobilephone: true,
        point: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) { // เมื่อไม่พบผู้ใช้
      console.error(chalk.red("User not found for ID:"), userId); 
      return reply.code(404).send({
        status: "error",
        message: "User not found",
      });
    }

    reply.code(200).send({
      status: "success",
      message: "User retrieved successfully",
      data: user, // ส่งข้อมูลผู้ใช้กลับไป
    });
  } catch (error) {
    console.error(chalk.red("Error in getMyProfile:"), error); // บันทึกข้อผิดพลาด
    reply.code(500).send({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
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
  const { password, name, lastName, mobilephone, email } = request.body;

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
        lastName,
        password: hashedPassword,
        mobilephone,
        email,
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
  const { id } = request.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        password: null, // Reset password logic, implement a secure password reset mechanism
      },
    });

    reply.code(200).send({
      status: 'success',
      message: 'User password reset successfully',
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
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\.[^\s@]+$/; // ตรวจสอบรูปแบบอีเมล
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
  uploadFile

};
