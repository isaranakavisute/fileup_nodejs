// paymentSchema.js
const getPaymentsSchema = {
  tags: ["Payment"],
  summary: "Get list of packages",
  description: "Get list of packages",
  headers: {
    type: "object",
    properties: {
      Authorization: {
        type: "string",
        description: "JWT token for authentication",
      },
    },
    required: ["Authorization"],
  },
  response: {
    200: {
      description: "Payments retrieved successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
            },
          },
        },
      },
      example: {
        status: "success",
        message: "Payments retrieved successfully",
        data: [
          {
            id: 1,
            name: "Package 1",
            price: 100,
            description: "This is package 1 description",
          },
          {
            id: 2,
            name: "Package 2",
            price: 200,
            description: "This is package 2 description",
          },
        ],
      },
    },
    401: {
      description: "Unauthorized",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "Unauthorized - Token required",
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        error: { type: "string" },
      },
      example: {
        status: "error",
        message: "Internal Server Error",
        error: "An unexpected error occurred",
      },
    },
  },
};

const getPaymentByIdSchema = {
  tags: ["Payment"],
  summary: "Get package by ID",
  description: "Get package by ID",
  headers: {
    type: "object",
    properties: {
      Authorization: {
        type: "string",
        description: "JWT token for authentication",
      },
    },
    required: ["Authorization"],
  },
  params: {
    type: "object",
    properties: {
      id: { type: "integer", description: "Package ID" },
    },
  },
  response: {
    200: {
      description: "Payment retrieved successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
          },
        },
      },
      example: {
        status: "success",
        message: "Payment retrieved successfully",
        data: {
          id: 1,
          name: "Package 1",
          price: 100,
          description: "This is package 1 description",
        },
      },
    },
    404: {
      description: "Not Found",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "Payment not found",
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        error: { type: "string" },
      },
      example: {
        status: "error",
        message: "Internal Server Error",
        error: "An unexpected error occurred",
      },
    },
  },
};

const createQRCodeSchema = {
  description: "Create QR Code for package payment",
  tags: ["Payment"],
  summary: "Create QR Code for payment",
  headers: {
    type: "object",
    properties: {
      Authorization: {
        type: "string",
        description: "JWT token for authentication",
      },
    },
    required: ["Authorization"],
  },
  body: {
    type: "object",
    required: ["userId", "packageId"],
    properties: {
      userId: { type: "string" },
      packageId: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        message: { type: "string" },
        qrCodeImage: { type: "string" },
        chargeId: { type: "string" },
      },
    },
    400: {
      description: "Failed to create QR Code payment",
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        error: { type: "string" },
        details: { type: "string" },
      },
    },
  },
};

const handleWebhookSchema = {
  description: "Handle Omise webhook events",
  tags: ["Payment"],
  summary: "Handle Omise webhook",
  body: {
    type: "object",
    properties: {
      id: { type: "string" },
      type: { type: "string" },
      object: { type: "string" },
      data: { type: "object" },
    },
  },
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    400: {
      description: "Unhandled event type",
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        error: { type: "string" },
        details: { type: "string" },
      },
    },
  },
};

module.exports = {
  getPaymentsSchema,
  getPaymentByIdSchema,
  createQRCodeSchema,
  handleWebhookSchema,
};
