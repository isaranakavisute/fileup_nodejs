// schema.js

const getUserProfileSchema = {
  tags: ["User"],
  summary: "Get user profile",
  description: "Get user profile",
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string", description: "Bearer token" },
    },
    required: ["authorization"],
    example: {
      authorization: "Bearer your_jwt_token_here",
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
            id: { type: "integer" },
            email: { type: "string" },
            name: { type: "string" },
            lastname: { type: "string" },
            mobilephone: { type: "string" },
            point: { type: "integer" },
            bankAccount: { type: "string" },
            bankId: { type: "integer" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            bank: {
              type: "object",
              properties: {
                nameTh: { type: "string" },
                nameEn: { type: "string" },
              },
            },
          },
        },
      },
      example: {
        status: "success",
        message: "User retrieved successfully",
        data: {
          id: 1,
          email: "user@example.com",
          name: "John",
          lastname: "Doe",
          mobilephone: "1234567890",
          point: 100,
          bankAccount: "123-456-7890",
          bankId: 1,
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
          bank: {
            nameTh: "ธนาคารตัวอย่าง",
            nameEn: "Example Bank",
          },
        },
      },
    },
    401: {
      description: "Unauthorized response",
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
    404: {
      description: "User not found response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "User not found",
      },
    },
    500: {
      description: "Internal Server Error response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        details: { type: "string" },
      },
      example: {
        status: "error",
        message: "Internal Server Error",
        details: "Error details here",
      },
    },
  },
};

const getUserByIdSchema = {
  tags: ["User"],
  summary: "Search user by ID",
  description: "Get user by ID",
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
      id: { type: "integer", description: "User ID to retrieve" },
    },
  },
  response: {
    200: {
      description: "User retrieved successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            lastname: { type: "string" },
            mobilephone: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      example: {
        status: "success",
        message: "User retrieved successfully",
        data: {
          id: 1,
          name: "John",
          lastname: "Doe",
          mobilephone: "1234567890",
          email: "johndoe@example.com",
          createdAt: "2024-05-16T09:30:00Z",
          updatedAt: "2024-05-16T10:30:00Z",
        },
      },
    },
    404: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "User not found",
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

const registerUserSchema = {
  tags: ["User"],
  summary: "Register new user",
  description: "Register a new user",
  body: {
    type: "object",
    required: ["firstName", "lastName", "email", "password", "mobilephone"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      mobilephone: { type: "string" },
    },
    example: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "securePassword123!",
      mobilephone: "0917076980",
    },
  },
  response: {
    201: {
      description: "Successful registration response",
      type: "object",
      properties: {
        message: { type: "string" },
        userId: { type: "integer" },
      },
      example: {
        message: "User registered successfully",
        userId: 1,
      },
    },
    400: {
      description: "Invalid input response",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      example: {
        error: "Invalid email format.",
      },
    },
    409: {
      description: "Email already exists response",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      example: {
        error: "Email already exists",
      },
    },
    500: {
      description: "Internal Server Error response",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      example: {
        error: "An error occurred during registration",
      },
    },
  },
};

const updateUserProfileSchema = {
  tags: ["User"],
  summary: "Update user profile",
  description: "Update user profile",
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
    properties: {
      name: { type: "string" },
      lastname: { type: "string" },
      mobilephone: { type: "string" },
      password: { type: "string" },
    },
    example: {
      name: "John",
      lastname: "Doe",
      mobilephone: "1234567890",
      password: "12345678",
    },
  },
  response: {
    200: {
      description: "User information updated successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            lastname: { type: "string" },
            mobilephone: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      example: {
        status: "success",
        message: "User information updated successfully",
        data: {
          id: 1,
          name: "John",
          lastname: "Doe",
          mobilephone: "1234567890",
          email: "johndoe@example.com",
          createdAt: "2024-05-16T09:30:00Z",
          updatedAt: "2024-05-16T10:30:00Z",
        },
      },
    },
    401: {
      description: "Invalid Token",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "Invalid Token",
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

const changePasswordSchema = {
  tags: ["User"],
  summary: "Change user password",
  description: "Change user password",
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
    properties: {
      newPassword: { type: "string", description: "New password to set" },
      password: { type: "string", description: "Current password" },
    },
    required: ["newPassword", "password"],
    example: {
      newPassword: "newSecurePassword123!",
      password: "12345678",
    },
  },
  response: {
    200: {
      description: "Password changed successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            lastname: { type: "string" },
            mobilephone: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      example: {
        status: "success",
        message: "Password changed successfully",
        data: {
          id: 1,
          name: "John",
          lastname: "Doe",
          mobilephone: "1234567890",
          email: "johndoe@example.com",
          createdAt: "2024-05-16T09:30:00Z",
          updatedAt: "2024-05-16T10:30:00Z",
        },
      },
    },
    401: {
      description: "Invalid Token",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "Invalid Token",
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

const changePhoneNumberSchema = {
  tags: ["User"],
  summary: "Change user phone number",
  description: "Change user phone number",
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
      id: { type: "integer", description: "User ID" },
    },
  },
  body: {
    type: "object",
    properties: {
      newPhoneNumber: {
        type: "string",
        description: "New phone number to set",
      },
      password: { type: "string", description: "Current password" },
    },
    required: ["newPhoneNumber", "password"],
    example: {
      newPhoneNumber: "01234567890",
      password: "12345678",
    },
  },
  response: {
    200: {
      description: "User phone number changed successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            lastname: { type: "string" },
            mobilephone: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      example: {
        status: "success",
        message: "User phone number changed successfully",
        data: {
          id: 1,
          name: "John",
          lastname: "Doe",
          mobilephone: "01234567890",
          email: "johndoe@example.com",
          createdAt: "2024-05-16T09:30:00Z",
          updatedAt: "2024-05-16T10:30:00Z",
        },
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

// schema.js

const resetPasswordSchema = {
  tags: ["User"],
  summary: "Reset user password",
  description: "Reset user password",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", description: "User ID" },
    },
  },
  headers: {
    type: "object",
    properties: {
      Authorization: {
        type: "string",
        description: "JWT token in the format Bearer <token>",
      },
    },
    required: ["Authorization"],
  },
  response: {
    200: {
      description: "Successful password reset response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            user: { type: "object" }, // Additional user schema can be specified here
            newPassword: { type: "string" },
          },
        },
      },
      example: {
        status: "success",
        message: "User password reset successfully",
        data: {
          user: {
            id: 1,
            email: "user@example.com",
            name: "John",
            lastname: "Doe",
            // ... other user fields
          },
          newPassword: "newRandomPassword123",
        },
      },
    },
    401: {
      description: "Unauthorized: JWT not provided",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message: "Unauthorized: JWT not provided",
      },
    },
    403: {
      description: "Forbidden: Not allowed to reset another user's password",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
      example: {
        status: "error",
        message:
          "Forbidden: You are not allowed to reset another user's password",
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
        error: "Detailed error message",
      },
    },
  },
};

const userSchema = {
  tags: ["User"],
  summary: "Send reset password via email",
  description: "Send reset password via email",
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
    },
    example: {
      email: "johndoe@example.com",
    },
  },
  response: {
    200: {
      description: "Email sent successfully",
      type: "object",
      properties: {
        msg: { type: "string" },
      },
      example: {
        msg: "you should receive an email",
      },
    },
    400: {
      description: "Error sending email",
      type: "object",
      properties: {
        error: { type: "string" },
      },
      example: {
        error: "Email could not be sent",
      },
    },
  },
};

const resetPasswordฺBySendEmsilSchema = {
  description: "Reset user password by key",
  tags: ["User"],
  summary: "Reset password by key",
  params: {
    type: "object",
    properties: {
      keyResetPassword: { type: "string" },
    },
    required: ["keyResetPassword"],
  },
  body: {
    type: "object",
    properties: {
      newpassword: { type: "string" },
      confirmnewpassword: { type: "string" },
    },
    required: ["newpassword", "confirmnewpassword"],
  },
  response: {
    200: {
      description: "Password reset successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
    },
    400: {
      description: "Invalid characters in password",
      type: "object",
      properties: {
        error: { type: "string" },
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

const addBankAccountSchema = {
  description: "Add or update user bank account",
  tags: ["User"],
  summary: "Add bank account",
  body: {
    type: "object",
    properties: {
      bankid: { type: "number" },
      bankaccountname: { type: "string" },
      bankaccount: { type: "string" },
      password: { type: "string" },
    },
    required: ["bankid", "bankaccountname", "bankaccount", "password"],
  },
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string", description: "Bearer token" },
    },
    required: ["authorization"],
    example: {
      authorization: "Bearer your_jwt_token_here",
    },
  },
  response: {
    200: {
      description: "Bank account added successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            bankId: { type: "number" },
            bankAccount: { type: "string" },
            bankAccountName: { type: "string" },
          },
        },
      },
    },
    401: {
      description: "Invalid Token",
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
        error: { type: "string" },
      },
    },
  },
};

const editBankAccountSchema = {
  description: "Edit user bank account",
  tags: ["User"],
  summary: "Edit bank account",
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string", description: "Bearer token" },
    },
    required: ["authorization"],
    example: {
      authorization: "Bearer your_jwt_token_here",
    },
  },
  body: {
    type: "object",
    properties: {
      bankid: { type: "number" },
      bankaccountname: { type: "string" },
      bankaccount: { type: "string" },
      password: { type: "string" },
    },
    required: ["bankid", "bankaccountname", "bankaccount", "password"],
  },
  response: {
    200: {
      description: "Bank account updated successfully",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            bankId: { type: "number" },
            bankAccount: { type: "string" },
            bankAccountName: { type: "string" },
          },
        },
      },
    },
    401: {
      description: "Invalid Token",
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
        error: { type: "string" },
      },
    },
  },
};

const loginSchema = {
  tags: ["User"],
  summary: "User login",
  description: "User login",
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    example: {
      email: "test5@dmail.com",
      password: "1234",
    },
  },
  response: {
    200: {
      description: "Successful login response",
      type: "object",
      properties: {
        token: { type: "string" },
      },
      example: {
        token: "your_jwt_token_here",
      },
    },
    401: {
      description: "Invalid credentials response",
      type: "string",
      example: "Invalid credentials",
    },
  },
};

const logoutSchema = {
  tags: ["User"],
  summary: "Logout user and revoke access token",
  description: "Logout user and revoke access token",
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
      description: "Sign-out successful",
      type: "object",
      properties: {
        message: { type: "string" },
      },
      example: {
        message: "Sign-out successful",
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
      type: "string",
      example: "Error during sign-out",
    },
  },
};

const deleteUserSchema = {
  description: "Delete a user by ID",
  tags: ["User"],
  summary: "Delete user by ID",
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
  },
  headers: {
    type: "object",
    properties: {
      authorization: { type: "string", description: "Bearer token" },
    },
    required: ["authorization"],
    example: {
      authorization: "Bearer your_jwt_token_here",
    },
  },
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        status: { type: "string" },
        message: { type: "string" },
      },
    },
    404: {
      description: "User not found",
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
      },
    },
  },
};

//   module.exports = {
//     getUserProfileSchema,
//   };
