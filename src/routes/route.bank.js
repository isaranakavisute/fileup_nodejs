const controllers = require("../controllers");
const hooks = require("../hooks");
const multer = require("multer");
const bankSchema = require('../swagger/bank.schema')

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const bankRoute = (app) => {
    app.get("/banks", {
        schema: bankSchema.getBanksSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.bank.getBankAll,
    });

    app.get("/banks/:id", {
        schema: bankSchema.getBankByIdSchema,
        preHandler: [hooks.auth.validateToken],
        handler: controllers.bank.getBankByID,
    });
};

module.exports = {
    bankRoute,
};
