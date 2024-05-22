const controllers = require("../controllers");
const multer = require("multer");
const bankSchema = require('../swagger/bank.schema')

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const bankRoute = (app) => {
    app.get("/banks", {
        schema: bankSchema.getBanksSchema,
        handler: controllers.bank.getBankAll,
    });

    app.get("/banks/:id", {
        schema: bankSchema.getBankByIdSchema,
        handler: controllers.bank.getBankByID,
    });
};

module.exports = {
    bankRoute,
};
