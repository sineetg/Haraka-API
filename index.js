// Express setup?
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./db'); // your PostgreSQL connection

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


// Endpoint to register a new user
app.post('/register', async (req, res) => {
  const { user_name, email, phone_number, password, role_id } = req.body;

  try {
    // 1. Check if email or phone already exists
    const existingUser = await pool.query(
      'SELECT * FROM user_tb WHERE email = $1 OR phone_number = $2',
      [email, phone_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email or phone number already exists' });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert new user
    const newUser = await pool.query(
      `INSERT INTO user_tb (user_name, email, phone_number, password, role_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_name, email, phone_number, hashedPassword, role_id]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

