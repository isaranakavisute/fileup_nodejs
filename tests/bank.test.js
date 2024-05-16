const buildApp = require('../src/app')

test('Get bank All', async () => {
    const appOptions = {
        logger: true,
    }
    const app = buildApp(appOptions);

    const result = await app.inject({
        method: 'GET',
        url: 'http://localhost:4000/banks'
    })

    // expect(result.body).toBe('OK')
    // console.log(result);
    // expect(result.body)
    expect(result.statusCode).toBe(200)
})
