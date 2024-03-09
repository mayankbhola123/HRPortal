// CRUD for candidates

import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5432;

// Configure body-parser middleware
app.use(bodyParser.json());

// Connect to PostgreSQL database
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to execute a SQL query
const executeQuery = async (query, params = []) => {
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    await client.release();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Re-throw the error for handling by middleware
  }
};

// Route handlers

// Get all candidates
app.get('/candidates', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM candidates');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving candidates' });
  }
});

// Get a single candidate by ID
app.get('/candidates/:id', async (req, res) => {
  const candidateId = req.params.id;
  try {
    const result = await executeQuery('SELECT * FROM candidates WHERE candidate_id = $1', [candidateId]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Candidate not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving candidate' });
  }
});

// Create a new candidate
app.post('/candidates', async (req, res) => {
  const { name, email, phone, currentStatus, expectedSalary, skills } = req.body;
  // Validation logic (ensure required fields are present)
  if (!name || !email || !currentStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const insertCandidate = await executeQuery('INSERT INTO candidates (name, email, phone, current_status, expected_salary) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, email, phone, currentStatus, expectedSalary]);
    const newCandidate = insertCandidate.rows[0];
    // Logic to handle skill associations (insert into Candidate_Skills table)
    res.status(201).json(newCandidate);
  } catch (error) {
    // Handle potential duplicate emails or other database errors
    res.status(500).json({ message: 'Error creating candidate' });
  }
});

// Update a candidate
app.put('/candidates/:id', async (req, res) => {
  const candidateId = req.params.id;
  const { name, email, phone, currentStatus, expectedSalary, skills } = req.body;
  // Validation logic
  if (!name || !email || !currentStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const updateCandidate = await executeQuery('UPDATE candidates SET name = $1, email = $2, phone = $3, current_status = $4, expected_salary = $5 WHERE candidate_id = $6 RETURNING *', [name, email, phone, currentStatus, expectedSalary, candidateId]);
    if (updateCandidate.rows.length === 0) {
      res.status(404).json({ message: 'Candidate not found' });
    } else {
      res.json(updateCandidate.rows[0]);
    }
  } catch (error) {
    // Handle potential database errors
    res.status(500).json({ message: 'Error updating candidate' });
  }
});

// Delete a candidate
app.delete('/candidates/:id', async (req, res) => {
 const candidateId = req.params.id;
 try {
   const deleteCandidate = await executeQuery('DELETE FROM candidates WHERE candidate_id = $1', [candidateId]);
   res.json({ message: 'Candidate deleted successfully' });
 } catch (error) {
   console.error('Error deleting candidate:', error);
   res.status(500).json({ message: 'Error deleting candidate' });
 }
});
