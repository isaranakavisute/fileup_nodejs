// prisma/seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  await prisma.package.createMany({
    data: [
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
        dailyUpload: null, // Unlimited
        allUpload: null,  // Unlimited
      },
    ],
  });

  console.log('Packages have been seeded!');
}


seed()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
