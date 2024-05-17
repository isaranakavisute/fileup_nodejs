const axios = require('axios');
const { Pool } = require('pg');

// Create a pool instance for database connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: '',
  port: 5432 // default PostgreSQL port
});

const userUploadFile = async (req, res) => {
    const {id, owner, content} = req.body;
    try {
      // Insert file metadata into the database
      await pool.query('INSERT INTO files (id, owner, content, ispublish) VALUES ($1, $2, $3, $4)', [
        id,
        owner, 
        content,
        false]);
      console.log('File uploaded and metadata added to the database');
      res.status(201).send('file added to database succesfully');
    } catch (error) {
      //console.error('Error uploading file to database:', error);
      res.status(500).send('Internal server error');
    }
};

// Endpoint to publish incoming file from user after succesfully write to database.
const publishFile = async (req, res) => {
  const {id, priority} = req.body;
  const file = await getFileById(id);
  const endpoints = await getEndpoints(priority);
  const result = await distributeFile(file, endpoints);
  res.status(200).send(result);
};

// get file from Database by Id.
const getFileById = async (id) => {
    try {
      // Query file by Id from the database
      const result = await pool.query('SELECT content FROM files WHERE ispublish = false AND id = $1', [id]);
      return result.rows;
    } catch (err) {
      console.error('Error querying files:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};


// endpoints table:
// - url
// - header
// - priority
// get endpoints from Database by priority.
const getEndpoints = async (priority) => {
  try{
    // Query Endpoints by priority from the database
    let query = 'SELECT url, header FROM endpoints';
    let filter;
    switch (priority) {
        case 'low':
            filter = 'low';
            query += ' WHERE priority = $1';
            break;
        case 'medium':
            filter = 'high';
            query += ' WHERE priority != $1';
            break;
        case 'high':
            const result = await pool.query(query);
            return result.rows;
    }
    const result = await pool.query(query, [filter]);
    return result.rows;
  } catch (err) {
    console.error('Error querying endpoints:', err);
  }
};

// publish a file to all designated endpoints return ration of succesrate.
async function distributeFile(file, endpoints) {
  let successfulRequests = 0;
  let failedRequests = 0;

  try {
    await Promise.all(endpoints.map(async ({ url, header }) => {
      try {
        //const res = await axios.post(url, file, { headers: header });
        console.log(`File uploaded successfully to ${url}`);
        successfulRequests++;
      } catch (error) {
        console.error(`Error uploading file to ${url}:`, error);
        failedRequests++;
      }
    }));
    console.log(endpoints);
  } catch (err) {
    console.error('Error distributing file:', err);
  }

  const totalRequests = successfulRequests + failedRequests;
  const successRatio = successfulRequests / totalRequests;
  const failRatio = failedRequests / totalRequests;

  return { successRatio, failRatio };
}

module.exports = {
  userUploadFile,
  publishFile
};
