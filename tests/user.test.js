const buildApp = require('../src/app')

// TEST LOGIN
// test('Login User', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const loginRequestBody = { email: "test1@dmail.com", password: "12345678" } //อีเมลและ password ถูกต้อง
//     const loginRequestBody1 = { email: "test1@amail.com", password: "12345678" } //อีเมลไม่ถูกต้อง
//     const loginRequestBody2 = { email: "test1@dmail.com", password: "1234567" } //password ไม่ถูกต้อง

//     //อีเมลและ password ถูกต้อง
//     const correct = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users/login',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: loginRequestBody
//     })

//     expect(correct.statusCode).toBe(200)
//     expect(correct.statusMessage).toBe('OK')

//     //อีเมลไม่ถูกต้อง
//     const emailInvalid = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users/login',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: loginRequestBody1
//     })

//     expect(emailInvalid.statusCode).toBe(401)
//     expect(emailInvalid.body).toBe('Invalid Email')

//     //password ไม่ถูกต้อง
//     const passwordInvalid = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users/login',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: loginRequestBody2
//     })

//     expect(passwordInvalid.statusCode).toBe(401)
//     expect(passwordInvalid.body).toBe('Invalid Password')
// })


// //สมัคร user
// test('Register User', async () => {
//     // expect.assertions(2)
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const registerUser = { firstName: "Test11", lastName: "Lastname", email: "test11@gmail.com", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
//     const wrongEmailFormat = { firstName: "Test11", lastName: "Lastname", email: "test12@gmail", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
//     const wrongPasswordFormat = { firstName: "Test11", lastName: "Lastname", email: "test12@gmail.com", password: "12345678*", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
//     const duplicateEmail = { firstName: "Test11", lastName: "Lastname", email: "test11@gmail.com", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง

//ข้อมูลทั้งหมดถูกต้อง
// const success = await app.inject({
//     method: 'POST',
//     url: 'http://localhost:4000/users',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     payload: registerUser
// })

// expect(success.statusCode).toBe(201)
// expect(success.statusMessage).toBe('Created')

//     //รูปแบบอีเมลไม่ถูกต้อง
//     const failedEmailFormat = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: wrongEmailFormat
//     })

//     expect(failedEmailFormat.statusCode).toBe(400)
//     expect(failedEmailFormat.body).toBe(`{"error":"Invalid email format."}`)

//     // password ผิด format
//     const failedPasswordFormat = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: wrongPasswordFormat
//     })

//     expect(failedPasswordFormat.statusCode).toBe(400)
//     expect(failedPasswordFormat.body).toBe(`{"error":"Invalid characters in password. Avoid using \\\";$^*."}`)

//     //อีเมลซ้ำ
//     const failDuplicateEmail = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         payload: duplicateEmail
//     })

//     expect(failDuplicateEmail.statusCode).toBe(409)
//     expect(failDuplicateEmail.body).toBe(`{"error":"Email already exists"}`)

// })


// // ดึงข้อมูลส่วนตัวของตัวเองจาก Database
// test('Test getMyProfile', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const getMyProfile = await app.inject({
//         method: 'GET',
//         url: 'http://localhost:4000/profile',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         }

//     })

//     expect(getMyProfile.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
//     expect(getMyProfile.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
// })

// // ดึงข้อมูล user จาก ID
// test('Test getUserById', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const getUserById = await app.inject({
//         method: 'GET',
//         url: 'http://localhost:4000/users/1',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         }

//     })

//     expect(getUserById.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
//     expect(getUserById.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
// })

// test('Test updateUser', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const updateUserData = { name: "anupong", lastname: "sutlek", mobilephone: "0917076980" }

//     const updateUser = await app.inject({
//         method: 'PATCH',
//         url: 'http://localhost:4000/users/profile',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         },
//         payload: updateUserData

//     })

//     expect(updateUser.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
//     expect(updateUser.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
// })

// // ดึงข้อมูลส่วนตัวของตัวเองจาก Database
// test('Test getMyProfile', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const getMyProfile = await app.inject({
//         method: 'GET',
//         url: 'http://localhost:4000/profile',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         }

//     })

//     expect(getMyProfile.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
//     expect(getMyProfile.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
// })


//! ยังไม่เสร็จ ติด error
// // เช็คอีเมลว่ามีในระบบหรือไม่ ถ้ามีให้ส่งลิงค์เปลี่ยนรหัสไปใน email user
// test('Test forgetVerify', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);
//     const haveEmail = { email: "test1@dmail.com" }
//     const noEmail = { email: "test1@mail.com" }

//     const haveEmailInDB = await app.inject({
//         method: 'POST',
//         url: 'http://localhost:4000/users/forget-password',
//         payload: haveEmail

//     })

//     expect(haveEmailInDB.statusCode).toBe(200)
//     // expect(haveEmailInDB.body).toBe(`{"status":"error","message":"Email not found"}`)
//     console.log(haveEmailInDB);

//     // const noEmailInDB = await app.inject({
//     //     method: 'POST',
//     //     url: 'http://localhost:4000/users/forget-password',
//     //     payload: noEmail

//     // })

//     // expect(noEmailInDB.statusCode).toBe(404)
//     // expect(noEmailInDB.body).toBe(`{"status":"error","message":"Email not found"}`)
// })


//* user เพิ่มบัญชีธนาคาร
test('Test updateUserBankAccount', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const updateUserBankAccount = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504965", password: "12345678" }
    const passwordInvalid = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504965", password: "1234567" }

    const updateBankAccount = await app.inject({
        method: 'PATCH',
        url: 'http://localhost:4000/users/addbankaccount',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: updateUserBankAccount

    })

    expect(updateBankAccount.statusCode).toBe(200)
    expect(updateBankAccount.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่

    const updateBankAccountPasswordInvalid = await app.inject({
        method: 'PATCH',
        url: 'http://localhost:4000/users/addbankaccount',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: passwordInvalid

    })

    expect(updateBankAccountPasswordInvalid.statusCode).toBe(401)
    expect(updateBankAccountPasswordInvalid.body).toBe('Invalid Password')
})

//user แก้ไขบัญชีธนาคาร
// test('Test editUserBankAccount', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);

//     const editUserBankAccount = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504911", password: "12345678" }
//     const passwordInvalid = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504922", password: "1234567" }

//     const editBankAccount = await app.inject({
//         method: 'PATCH',
//         url: 'http://localhost:4000/users/editbankaccount',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         },
//         payload: editUserBankAccount

//     })

//     expect(editBankAccount.statusCode).toBe(200)
//     expect(editBankAccount.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่

//     const editBankAccountPasswordInvalid = await app.inject({
//         method: 'PATCH',
//         url: 'http://localhost:4000/users/editbankaccount',
//         headers: {
//             Authorization: process.env.TOKEN_TEST
//         },
//         payload: passwordInvalid

//     })

//     expect(editBankAccountPasswordInvalid.statusCode).toBe(401)
//     expect(editBankAccountPasswordInvalid.body).toBe('Invalid Password')
// })