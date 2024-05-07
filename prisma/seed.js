// prisma/seed.js

const { PrismaClient } = require('@prisma/client');

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

async function seed() {
  await seedPackages(); // ตรวจสอบและสร้างแพ็กเกจใหม่ถ้าไม่ซ้ำ
  await seedBanks();   // ตรวจสอบและสร้างธนาคารใหม่ถ้าไม่ซ้ำ
}

seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
