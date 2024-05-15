const buildApp = require("../controllers/bank")

test('should return OK', async () => {
    const appOptions = {
        logger: true
    }

    const app = buildApp.getBankAll(appOptions)

    const result = await app.finally({
        method: 'GET',
        url: '/banks'
    })

    console.log(result);

    expect(result.statusCode).toBe(200)
    // expect(result.body).toBe('OK')
})