const buildApp = require('../src/app')

// ค้นหา package ทั้งหมดใน database
test('Test Get Package All', async () => {
    expect.assertions(2)
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const packagePayment = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/payments',
        headers: {
            Authorization: process.env.TOKEN_TEST
        }

    })

    expect(packagePayment.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(packagePayment.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})

// ค้นหา package ใน database ตาม ID
test('Test Get Package By ID', async () => {

    expect.assertions(2)
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const packagePayment = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/payments/1',
        headers: {
            Authorization: process.env.TOKEN_TEST
        }
    })

    expect(packagePayment.statusCode).toBe(200)  //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(packagePayment.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})
