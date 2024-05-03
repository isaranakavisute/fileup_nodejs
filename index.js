const buildApp = require('./src/app');
const config = require('./src/config');


const startApp = async () => {
  const appOptions = {
    logger: true,
  }

  const app = buildApp(appOptions);

  try {
    // ใช้ optionsObject แทนการระบุ arguments ใน method listen
    await app.listen({
      port: config.port,
      hostname: config.hostname
    });
    console.log(`--------- app running on port ${config.port} ---------`);
    
  } catch (error) {
    console.error(error);
  }
}

startApp();