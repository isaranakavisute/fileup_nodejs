exports.getBanksSchema = {
  description: "Retrieve all banks",
  tags: ["Bank"],
  summary: "Get all banks",
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              nameTh: { type: "string" },
              nameEn: { type: "string" },
              shortName: { type: "string" },
              logo: { type: "string" },
              status: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
    404: {
      description: "Banks not found",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        details: { type: "string" },
      },
    },
  },
};

exports.getBankByIdSchema = {
  description: "Retrieve a bank by ID",
  tags: ["Bank"],
  summary: "Get bank by ID",
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            nameTh: { type: "string" },
            nameEn: { type: "string" },
            shortName: { type: "string" },
            logo: { type: "string" },
            status: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
    404: {
      description: "Bank not found",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal Server Error",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        details: { type: "string" },
      },
    },
  },
};