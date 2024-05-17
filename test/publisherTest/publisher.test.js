const publisher = require('../../src/controllers/publisher');
const fs = require('fs');

describe('userUploadFile', () => {
    it('should upload file to the database successfully', async () => {
        // Read the PNG file as a binary buffer
        const pngFilePath = 'C:\\Users\\soont\\OneDrive\\Desktop\\myFace.jpg';
        const pngBuffer = fs.readFileSync(pngFilePath);
        // Mock request and response objects
        const mockReq = {

            body: {
                id: 50, /// <--- CheckSum ID
                owner: 'mockOwner',
                content: pngBuffer
            } 
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            send: jest.fn()
        };

        // Mock pool.query to return a successful result
        const mockQueryResult = { rowCount: 1 };
        const mockPool = { query: jest.fn(() => mockQueryResult) };

        // Call the function with mock objects
        await publisher.userUploadFile(mockReq, mockRes);

        // Verify that the response is sent with status 201
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.send).toHaveBeenCalledWith('file added to database succesfully');
    });

    it('should handle database error', async () => {
        // Mock request and response objects
        const mockReq = { 
            body: {
                id: 'mockId',
                owner: 'mockOwner',
                content: 'mockContent'
            } 
        };
        const mockRes = {
            status: jest.fn(() => mockRes),
            send: jest.fn()
        };

        // Mock pool.query to throw an error
        const mockPool = { 
            query: jest.fn(() => { throw new Error('Database error'); }) 
        };

        // Call the function with mock objects
        await publisher.userUploadFile(mockReq, mockRes);

        // Verify that the response is sent with status 500
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith('Internal server error');
    });
});

describe('publishFile function', () => {
    it('should call distributeFile with correct arguments', async () => {
      const req = {
        body: {
          id: 10,
          priority: 'high'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
  
      // Mock the responses of getFileById and getEndpoints
      await publisher.publishFile(req, res);
    });
  
    // Add more test cases as needed
  });