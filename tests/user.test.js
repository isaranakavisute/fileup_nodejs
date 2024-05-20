const buildApp = require('../src/app')

// ดึงข้อมูลส่วนตัวของตัวเองจาก Database
test('Test getMyProfile', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const getMyProfile = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/me',
        headers: {
            Authorization: process.env.TOKEN_TEST
        }

    })

    expect(getMyProfile.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(getMyProfile.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})

// ดึงข้อมูล user จาก ID
test('Test getUserById', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const getUserById = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/users/1',
        headers: {
            Authorization: process.env.TOKEN_TEST
        }

    })

    expect(getUserById.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(getUserById.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})

test('Test updateUser', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const updateUserData = { name: "anupong", lastname: "sutlek", mobilephone: "0917076980", password: "12345678" }

    const updateUser = await app.inject({
        method: 'PATCH',
        url: 'http://localhost:4000/users/profile',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: updateUserData

    })

    expect(updateUser.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(updateUser.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})


// เช็คอีเมลว่ามีในระบบหรือไม่ ถ้ามีให้ส่งลิงค์เปลี่ยนรหัสไปใน email user
test('Test forgetVerify', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);
    const haveEmail = { email: "test1@dmail.com" }
    const noEmail = { email: "test1@mail.com" }

    const haveEmailInDB = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/forget-password',
        payload: haveEmail

    })

    expect(haveEmailInDB.statusCode).toBe(200)
    expect(haveEmailInDB.body).toBe(`{"msg":"you should receive an email"}`)

    const noEmailInDB = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/forget-password',
        payload: noEmail
    })

    expect(noEmailInDB.statusCode).toBe(404)
    expect(noEmailInDB.body).toBe(`{"status":"error","message":"Email not found"}`)
})


// test('Test resetPasswordByEmail', async () => {
//     const appOptions = {
//         logger: true,
//     }
//     const app = buildApp(appOptions);
//     const passwordCorrect = { password: "01234567", newpassword: "01234567" }
//     const wrongPaswordFormat = { password: "1234567;", newpassword: "1234567;" }

//     // const resetPasswordSuccess = await app.inject({
//     //     method: 'POST',
//     //     url: `http://localhost:4000/users/forgetpassword/${process.env.KEY_RESET_PASSWORD}`,
//     //     payload: passwordCorrect

//     // })

//     // expect(resetPasswordSuccess.statusCode).toBe(200)
//     // expect(resetPasswordSuccess.body).toBe(`{"status":"success","message":"update password successfully"}`)

//     const resetPasswordFailed = await app.inject({
//         method: 'POST',
//         url: `http://localhost:4000/users/forgetpassword/${process.env.KEY_RESET_PASSWORD}`,
//         payload: wrongPaswordFormat
//     })

//     expect(resetPasswordFailed.statusCode).toBe(400)
//     expect(resetPasswordFailed.body).toBe(`{"error":"Invalid characters in password. Avoid using \\";$^*."}`)
// })




// //* user เพิ่มบัญชีธนาคาร
test('Test updateUserBankAccount', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const updateUserBankAccount = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504965", password: "12345678" }
    const passwordInvalid = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504965", password: "1234567" }

    const updateBankAccount = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/addbankaccount',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: updateUserBankAccount

    })

    expect(updateBankAccount.statusCode).toBe(200)
    expect(updateBankAccount.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่

    const updateBankAccountPasswordInvalid = await app.inject({
        method: 'POST',
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
test('Test editUserBankAccount', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const editUserBankAccount = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504911", password: "12345678" }
    const passwordInvalid = { bankid: 13, bankaccountname: "อนุพงศ์ สูตรเลข", bankaccount: "020283504922", password: "1234567" }

    const editBankAccount = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/editbankaccount',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: editUserBankAccount

    })

    expect(editBankAccount.statusCode).toBe(200)
    expect(editBankAccount.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่

    const editBankAccountPasswordInvalid = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/editbankaccount',
        headers: {
            Authorization: process.env.TOKEN_TEST
        },
        payload: passwordInvalid

    })

    expect(editBankAccountPasswordInvalid.statusCode).toBe(401)
    expect(editBankAccountPasswordInvalid.body).toBe('Invalid Password')
})