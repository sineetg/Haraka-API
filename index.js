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



// LOGIN: email OR phone_number + password
app.post('/login', async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    // basic validation
    if ((!email && !phone_number) || !password) {
      return res.status(400).json({ message: 'email or phone_number AND password are required' });
    }

    // figure out which identifier to use
    const identifierField = email ? 'email' : 'phone_number';
    const identifierValue = email || phone_number;

    // fetch the user (include password hash for comparison)
    const { rows } = await pool.query(
      `SELECT user_id, user_name, email, phone_number, password, role_id
       FROM user_tb
       WHERE ${identifierField} = $1
       LIMIT 1`,
      [identifierValue]
    );

    // if no user -> generic message (don’t leak which part failed)
    if (rows.length === 0) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const user = rows[0];

    // compare password with stored hash
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    // success — never send the password back
    const { password: _omit, ...safeUser } = user;
    return res.status(200).json({ message: 'login successful', user: safeUser });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'server error' });
  }
});



// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_tb');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
