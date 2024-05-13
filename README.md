1. npm install --legacy-peer-deps (install dependencies)

2. สร้างฐานข้อมูล  MySQL (Xampp)

3. สร้างไฟล์ .env และนำโค้ดวางลงด้านล่างไปวางใน ไฟล์ .env และ setup DATABASE_URL ให้ตรงกับ MySQL ที่สร้าง

DATABASE_URL="mysql://username:password@localhost:3306/username"

JWT_SECRET = "musicsdfsdfsdu834ur5"

4. npx prisma migrate dev (migrate data)

5. node prisma\seed.js (seed data)

6. yarn run dev (start server)
