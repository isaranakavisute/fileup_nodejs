// prisma/seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  // Roles data
  const rolesData = [
    { roleNameTh: 'เจ้าของ',roleNameEn: 'Owner',levelStaff: 99 },
    { roleNameTh: 'หัวหน้างาน',roleNameEn: 'Leader',levelStaff: 88 },
    { roleNameTh: 'Operator',roleNameEn: 'Operator',levelStaff: 2 },
    { roleNameTh: 'มาร์เกตติ้ง',roleNameEn: 'Marketing',levelStaff: 1 },
  ];

// Insert roles data into the database with checking for duplicates
for (const roleData of rolesData) {
    const existingRole = await prisma.staffRole.findFirst({
      where: { roleName: roleData.roleName },
    });
  
    if (!existingRole) {
      await prisma.staffRole.create({
        data: roleData,
      });
  
      console.log(`Role '${roleData.roleName}' inserted successfully`);
    } else {
      console.log(`Role '${roleData.roleName}' already exists`);
    }
  }

  // Sample data
const withdrawTypesData = [
    { withdrawName: 'ถอน' },
    { withdrawName: 'โอนมือถอน' },
    { withdrawName: 'ลดเครดิต' },
  ];
  

    // Insert withdraw types data into the database
    for (const withdrawTypeData of withdrawTypesData) {
      const existingWithdrawType = await prisma.withdrawType.findFirst({
        where: { withdrawName: withdrawTypeData.withdrawName },
      });
  
      if (!existingWithdrawType) {
        // If the withdraw type does not exist, create a new one
        await prisma.withdrawType.create({
          data: withdrawTypeData,
        });
  
        console.log(`Withdraw type '${withdrawTypeData.withdrawName}' inserted successfully`);
      } else {
        // If the withdraw type already exists, log a message (or handle it as needed)
        console.log(`Withdraw type '${withdrawTypeData.withdrawName}' already exists`);
      }
    }


  const depositTypesData = [
    { DepositName: 'ฝาก' },
    { DepositName: 'โอนมือฝาก' },
    { DepositName: 'คอมมิชชั่น' },
    { DepositName: 'คืนยอดเสีย' },
    { DepositName: 'ฟรีเครดิต' },
    { DepositName: 'เพิ่มเครดิต' },
  ];

   // Insert deposit types data into the database
   for (const depositTypeData of depositTypesData) {
    // Check if the deposit type with the same name already exists
    const existingDepositType = await prisma.depositType.findFirst({
      where: { DepositName: depositTypeData.DepositName },
    });

    if (!existingDepositType) {
      // If the deposit type does not exist, create a new one
      await prisma.depositType.create({
        data: depositTypeData,
      });

      console.log(`Deposit type '${depositTypeData.DepositName}' inserted successfully`);
    } else {
      // If the deposit type already exists, log a message (or handle it as needed)
      console.log(`Deposit type '${depositTypeData.DepositName}' already exists`);
    }
  }

  const banksData = [
  { bankName: 'Bank of Thailand', bankFullName: 'BOT', bankShortName: 'BOT', icon: 'bot_icon.png', background: 'bot_background.jpg' },
  { bankName: 'BANGKOK BANK PUBLIC COMPANY LIMITED', bankFullName: 'BANGKOK BANK PUBLIC COMPANY LIMITED', bankShortName: 'BBL', icon: 'bbl_icon.png', background: 'bbl_background.jpg' },
  { bankName: 'Kasikornbank Public Company Limited', bankFullName: 'Kasikornbank Public Company Limited', bankShortName: 'KBank', icon: 'kbank_icon.png', background: 'kbank_background.jpg' },
  { bankName: 'Krungthai Bank Public Company Limited', bankFullName: 'Krungthai Bank Public Company Limited', bankShortName: 'KTB', icon: 'ktb_icon.png', background: 'ktb_background.jpg' },
  { bankName: 'TMBThanachart Bank Public Company Limited', bankFullName: 'TMBThanachart Bank Public Company Limited', bankShortName: 'TTB', icon: 'ttb_icon.png', background: 'ttb_background.jpg' },
  { bankName: 'The Siam Commercial Bank Public Company Limited', bankFullName: 'The Siam Commercial Bank Public Company Limited', bankShortName: 'SCB', icon: 'scb_icon.png', background: 'scb_background.jpg' },
  { bankName: 'Bank of Ayudhya Public Company Limited', bankFullName: 'Bank of Ayudhya Public Company Limited', bankShortName: 'BAY', icon: 'bay_icon.png', background: 'bay_background.jpg' },
  { bankName: 'KIATNAKIN PHATRA BANK PUBLIC COMPANY LIMITED', bankFullName: 'KIATNAKIN PHATRA BANK PUBLIC COMPANY LIMITED', bankShortName: 'KKP', icon: 'kkp_icon.png', background: 'kkp_background.jpg' },
  { bankName: 'CIMB Thai Bank Public Company Limited', bankFullName: 'CIMB Thai Bank Public Company Limited', bankShortName: 'CIMBT', icon: 'cimbt_icon.png', background: 'cimbt_background.jpg' },
  { bankName: 'TISCO Bank Public Company Limited', bankFullName: 'TISCO Bank Public Company Limited', bankShortName: 'TISCO', icon: 'tisco_icon.png', background: 'tisco_background.jpg' },
  { bankName: 'United Overseas Bank Limited', bankFullName: 'United Overseas Bank Limited', bankShortName: 'UOB', icon: 'uob_icon.png', background: 'uob_background.jpg' },
  { bankName: 'Thai Credit Retail Bank', bankFullName: 'Thai Credit Retail Bank', bankShortName: 'TCRB', icon: 'tcrb_icon.png', background: 'tcrb_background.jpg' },
  { bankName: 'Land and Houses Public Company Limited', bankFullName: 'Land and Houses Public Company Limited', bankShortName: 'LH Bank', icon: 'lh_bank_icon.png', background: 'lh_bank_background.jpg' },
  { bankName: 'Industrial and Commercial Bank of China (Thai) Public Company Limited', bankFullName: 'Industrial and Commercial Bank of China (Thai) Public Company Limited', bankShortName: 'ICBC', icon: 'icbc_icon.png', background: 'icbc_background.jpg' },
  // เพิ่มข้อมูลธนาคารที่ไม่ซ้ำซ้อนต่อจากนี้...
];


  for (const bankData of banksData) {
    const existingBank = await prisma.bank.findFirst({
      where: { OR: [{ bankName: bankData.bankName }, { bankShortName: bankData.bankShortName }] },
    });

    if (!existingBank) {
      // ถ้าธนาคารยังไม่มีในฐานข้อมูล
      await prisma.bank.create({ data: bankData });
      console.log(`Bank '${bankData.bankName}' inserted successfully`);
    } else {
      // ถ้าธนาคารมีอยู่แล้ว
      console.log(`Bank '${bankData.bankName}' already exists`);
    }
  }

  const agentPercentsData = [
    { agentPercent: 85.00 },
    { agentPercent: 90.00 },
    { agentPercent: 95.00 },
    { agentPercent: 100.00 },
  ];

  for (const agentPercentData of agentPercentsData) {
    const existingAgentPercent = await prisma.agentPercent.findFirst({
      where: { agentPercent: agentPercentData.agentPercent },
    });

    if (!existingAgentPercent) {
      await prisma.agentPercent.create({
        data: agentPercentData,
      });

      console.log(`AgentPercent ${agentPercentData.agentPercent} inserted successfully`);
    } else {
      console.log(`AgentPercent ${agentPercentData.agentPercent} already exists`);
    }

}


const themes = [
    { themeName: 'Default', image: 'default-image-url', imagePreview: 'default-preview-url', order: 1 },
    { themeName: 'Dark', image: 'dark-image-url', imagePreview: 'dark-preview-url', order: 2 },
    { themeName: 'Light', image: 'light-image-url', imagePreview: 'light-preview-url', order: 3 },
  ];


for (const theme of themes) {
    // Check if the themeName already exists
    const existingTheme = await prisma.theme.findFirst({
      where: { themeName: theme.themeName },
    });

    if (!existingTheme) {
      // If it doesn't exist, create the theme
      const createdTheme = await prisma.theme.create({
        data: theme,
      });

      // Log the created theme
      console.log(`Created theme: ${JSON.stringify(createdTheme)}`);
    } else {
      // Log that the theme already exists
      console.log(`Theme '${theme.themeName}' already exists`);
    }
  }

  const PartnerMarketingChanel = [
    { chanelName: 'Google', remark: ' Google' },
    { chanelName: 'Facebook', remark: 'Facebook' },
    { chanelName: 'เพื่อนแนะนำ', remark: 'เพื่อนแนะนำ' },
    { chanelName: 'อื่นๆ', remark: 'อื่นๆ'},
  ];

  for (const data of PartnerMarketingChanel) {
    const existingChanel = await prisma.marketingChanel.findFirst({
      where: { chanelName: data.chanelName },
    });

    if (existingChanel) {
      console.log(`Channel with name ${data.chanelName} already exists.`);
    } else {
      const createdChanel = await prisma.marketingChanel.create({ data });
      console.log(`Channel with name ${createdChanel.chanelName} created successfully.`);
  
    }
  }

  const depositMethods = [
    { methodName: 'ปิด' },
    { methodName: 'สุ่ม' },
    { methodName: 'วน' },
    { methodName: 'จับคู่' },
  ];

  for (const methodData of depositMethods) {
    // Check if the method name already exists
    const existingMethod = await prisma.depositMethod.findFirst({
      where: {
        methodName: methodData.methodName,
      },
    });

    if (!existingMethod) {
      // If the method name doesn't exist, create a new record
      const createdMethod = await prisma.depositMethod.create({
        data: methodData,
      });

      console.log(`Deposit method "${createdMethod.methodName}" created successfully`);
    } else {
      console.log(`Deposit method "${methodData.methodName}" already exists`);
    }
  }






  console.log('Seed data insertion complete');
}


seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
