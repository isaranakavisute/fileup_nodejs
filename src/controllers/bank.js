const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getBankAll = async (request, reply) => {
    try {

        // ค้นหาบัญชีธนาคารทั้งหมด
        const bank = await prisma.bank.findMany({
            select: {
                id: true,
                nameTh: true,
                nameEn: true,
                shortName: true,
                logo: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!bank) {
            return reply.code(404).send({
                status: "error",
                message: "Bank not found",
            });
        }

        reply.code(200).send(
            {
                status: "success",
                message: "Bank retrieved successfully",
                data: bank
            });
    } catch (error) {
        reply.code(500).send({
            status: "error",
            message: "Internal Server Error",
            details: error.message,
        });
    }
};

const getBankByID = async (request, reply) => {

    const { id } = request.params
    try {

        // ค้นหาบัญชีธนาคารตามไอดี
        const bank = await prisma.bank.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nameTh: true,
                nameEn: true,
                shortName: true,
                logo: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!bank) {
            return reply.code(404).send({
                status: "error",
                message: "Bank not found",
            });
        }

        reply.code(200).send(
            {
                status: "success",
                message: "Bank retrieved successfully",
                data: bank
            });
    } catch (error) {
        reply.code(500).send({
            status: "error",
            message: "Internal Server Error",
            details: error.message,
        });
    }
};

module.exports = {

    getBankAll,
    getBankByID

};