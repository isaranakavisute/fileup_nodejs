const buildApp = require('../src/app')
// สมัคร user
test('Register User', async () => {
    // expect.assertions(2)
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const registerUser = { firstName: "Test11", lastName: "Lastname", email: "test25@gmail.com", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
    const wrongEmailFormat = { firstName: "Test11", lastName: "Lastname", email: "test25@gmail", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
    const wrongPasswordFormat = { firstName: "Test11", lastName: "Lastname", email: "test25@gmail.com", password: "12345678*", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง
    const duplicateEmail = { firstName: "Test11", lastName: "Lastname", email: "test25@gmail.com", password: "12345678", mobilephone: "0888888888" } //ข้อมูลทั้งหมดถูกต้อง

    //ข้อมูลทั้งหมดถูกต้อง
    const success = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: registerUser
    })

    expect(success.statusCode).toBe(201)
    expect(success.statusMessage).toBe('Created')

    //รูปแบบอีเมลไม่ถูกต้อง
    const failedEmailFormat = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: wrongEmailFormat
    })

    expect(failedEmailFormat.statusCode).toBe(400)
    expect(failedEmailFormat.body).toBe(`{"error":"Invalid email format."}`)

    // password ผิด format
    const failedPasswordFormat = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: wrongPasswordFormat
    })

    expect(failedPasswordFormat.statusCode).toBe(400)
    expect(failedPasswordFormat.body).toBe(`{"error":"Invalid characters in password. Avoid using \\\";$^*."}`)

    //อีเมลซ้ำ
    const failDuplicateEmail = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: duplicateEmail
    })

    expect(failDuplicateEmail.statusCode).toBe(409)
    expect(failDuplicateEmail.body).toBe(`{"error":"Email already exists"}`)

})