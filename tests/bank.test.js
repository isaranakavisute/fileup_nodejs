const buildApp = require('../src/app')

//ค้นหา bank ทั้งหมดใน database
test('Test Get Bank All', async () => {
    expect.assertions(2)
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const bank = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/banks'
    })

    expect(bank.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(bank.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})

//ค้นหา bank ใน database ตาม ID
test('Test Get Bank By ID', async () => {
    expect.assertions(2)
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const bank = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/banks/1'
    })

    expect(bank.statusCode).toBe(200) //ตรวจสอบว่า reply.code = 200 หรือไม่
    expect(bank.statusMessage).toBe('OK') //ตรวจสอบว่า statusMessage = OK หรือไม่
})
