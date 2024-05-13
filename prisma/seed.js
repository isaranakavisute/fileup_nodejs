// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const packageData = [
  {
    name: 'Basic',
    description: 'Basic package with limited uploads',
    price: 9.99,
    duration: 30,
    dailyUpload: 10,
    allUpload: 300,
  },
  {
    name: 'Premium',
    description: 'Premium package with more uploads',
    price: 19.99,
    duration: 90,
    dailyUpload: 30,
    allUpload: 900,
  },
  {
    name: 'Ultimate',
    description: 'Ultimate package with unlimited uploads',
    price: 29.99,
    duration: 365,
    dailyUpload: null,
    allUpload: null,
  },
];

async function seedPackages() {
  for (const pkg of packageData) {
    const existingPackage = await prisma.package.findUnique({
      where: { name: pkg.name }, // ฟิลด์ที่ไม่ซ้ำกัน
    });

    if (!existingPackage) {
      await prisma.package.create({
        data: pkg,
      });
    }
  }

  console.log("Packages have been seeded without duplication.");
}

const banksData = [
  
  { bankName: 'ธนาคารกรุงเทพ', bankFullName: 'BANGKOK BANK PUBLIC COMPANY LIMITED', bankShortName: 'BBL', icon: 'bbl_icon.png', background: 'bbl_background.jpg' },
  { bankName: 'ธนาคารกสิกรไทย', bankFullName: 'Kasikornbank Public Company Limited', bankShortName: 'KBank', icon: 'kbank_icon.png', background: 'kbank_background.jpg' },
  { bankName: 'ธนาคารกรุงไทย', bankFullName: 'Krungthai Bank Public Company Limited', bankShortName: 'KTB', icon: 'ktb_icon.png', background: 'ktb_background.jpg' },
  { bankName: 'ธนาคารทหารไทยธนชาต', bankFullName: 'TMBThanachart Bank Public Company Limited', bankShortName: 'TTB', icon: 'ttb_icon.png', background: 'ttb_background.jpg' },
  { bankName: 'ธนาคารไทยพาณิชย์', bankFullName: 'The Siam Commercial Bank Public Company Limited', bankShortName: 'SCB', icon: 'scb_icon.png', background: 'scb_background.jpg' },
  { bankName: 'ธนาคารกรุงศรีอยุธยา', bankFullName: 'Bank of Ayudhya Public Company Limited', bankShortName: 'BAY', icon: 'bay_icon.png', background: 'bay_background.jpg' },
  { bankName: 'ธนาคารเกียรตินาคินภัทร', bankFullName: 'KIATNAKIN PHATRA BANK PUBLIC COMPANY LIMITED', bankShortName: 'KKP', icon: 'kkp_icon.png', background: 'kkp_background.jpg' },
  { bankName: 'ธนาคารซีไอเอ็มบีไทย', bankFullName: 'CIMB Thai Bank Public Company Limited', bankShortName: 'CIMBT', icon: 'cimbt_icon.png', background: 'cimbt_background.jpg' },
  { bankName: 'ธนาคารทิสโก้', bankFullName: 'TISCO Bank Public Company Limited', bankShortName: 'TISCO', icon: 'tisco_icon.png', background: 'tisco_background.jpg' },
  { bankName: 'ธนาคารยูโอบี', bankFullName: 'United Overseas Bank Limited', bankShortName: 'UOB', icon: 'uob_icon.png', background: 'uob_background.jpg' },
  { bankName: 'ธนาคารไทยเครดิต', bankFullName: 'Thai Credit Retail Bank', bankShortName: 'TCRB', icon: 'tcrb_icon.png', background: 'tcrb_background.jpg' },
  { bankName: 'ธนาคารแลนด์ แอนด์ เฮ้าส์', bankFullName: 'Land and Houses Public Company Limited', bankShortName: 'LH Bank', icon: 'lh_bank_icon.png', background: 'lh_bank_background.jpg' },
  { bankName: 'ธนาคารออมสิน', bankFullName: 'GSBATHBK', bankShortName: 'GSBATHBK', icon: 'bot_icon.png', background: 'bot_background.jpg' },
];

async function seedBanks() {
  for (const bank of banksData) {
    const existingBank = await prisma.bank.findUnique({
      where: { shortName: bank.bankShortName }, // ฟิลด์เอกลักษณ์
    });

    if (!existingBank) {
      await prisma.bank.create({
        data: {
          nameTh: bank.bankName,
          nameEn: bank.bankFullName,
          shortName: bank.bankShortName,
          logo: bank.icon,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log("Banks have been seeded without duplication.");
}

// ฟังก์ชันสร้างหมายเลขโทรศัพท์มือถือแบบสุ่ม
const generateRandomMobilePhone = () => {
  const prefix = '08'; // ใช้เลขเริ่มต้นที่พบบ่อย
  const randomNumbers = Math.floor(10000000 + Math.random() * 90000000); // 8 ตัวเลขสุ่ม
  return `${prefix}${randomNumbers}`; // ประกอบเลขสุ่มกับ prefix
};

// ฟังก์ชันสุ่มนามสกุล
const randomLastnames = [
  'Smith',
  'Johnson',
  'Brown',
  'Williams',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
];

const generateRandomLastname = () => {
  const index = Math.floor(Math.random() * randomLastnames.length);
  return randomLastnames[index]; // เลือกนามสกุลแบบสุ่ม
};

const seedUsers = async () => {
  const userCount = 10; // จำนวนผู้ใช้ที่ต้องการสร้าง
  const password = '12345678'; // รหัสผ่านเดียวกันสำหรับผู้ใช้ทุกคน
  const hashedPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่าน

  for (let i = 1; i <= userCount; i++) {
    const email = `test${i}@dmail.com`; // อีเมลของผู้ใช้
    const username = email; // ใช้อีเมลเป็น username
    const name = `Test User ${i}`; // ชื่อผู้ใช้
    const mobilephone = generateRandomMobilePhone(); // หมายเลขโทรศัพท์มือถือสุ่ม
    const lastname = generateRandomLastname(); // นามสกุลสุ่ม

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      // สร้างผู้ใช้ใหม่ถ้าไม่ซ้ำ
      await prisma.user.create({
        data: {
          email,
          username, // ใช้อีเมลเป็น username
          name,
          lastname, // นามสกุลสุ่ม
          password: hashedPassword, // รหัสผ่านที่แฮชแล้ว
          mobilephone, // หมายเลขโทรศัพท์มือถือสุ่ม
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log('Users have been seeded without duplication.');
};
async function seed() {
  await seedPackages(); // ตรวจสอบและสร้างแพ็กเกจใหม่ถ้าไม่ซ้ำ
  await seedBanks();   // ตรวจสอบและสร้างธนาคารใหม่ถ้าไม่ซ้ำ
  await seedUsers();
}

seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
