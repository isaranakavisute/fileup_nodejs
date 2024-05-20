const buildApp = require('../src/app')
//TEST LOGIN
test('Login User', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const loginRequestBody = { email: "test5@dmail.com", password: "12345678" } //อีเมลและ password ถูกต้อง
    const loginRequestBody1 = { email: "test51@amail.com", password: "12345678" } //อีเมลไม่ถูกต้อง
    const loginRequestBody2 = { email: "test5@dmail.com", password: "1234567" } //password ไม่ถูกต้อง

    //อีเมลและ password ถูกต้อง
    const correct = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: loginRequestBody
    })

    expect(correct.statusCode).toBe(200)
    expect(correct.statusMessage).toBe('OK')

    //อีเมลไม่ถูกต้อง
    const emailInvalid = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: loginRequestBody1
    })

    expect(emailInvalid.statusCode).toBe(401)
    expect(emailInvalid.body).toBe('Invalid Email')

    //password ไม่ถูกต้อง
    const passwordInvalid = await app.inject({
        method: 'POST',
        url: 'http://localhost:4000/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        payload: loginRequestBody2
    })

    expect(passwordInvalid.statusCode).toBe(401)
    expect(passwordInvalid.body).toBe('Invalid Password')
})