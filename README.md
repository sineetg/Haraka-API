# Haraka-API

Haraka-API is a Node.js RESTful API built with Express and PostgreSQL for managing users and roles. It includes secure user registration with password hashing using bcrypt.

## Table of Contents

- [Features](#features)  
- [Technologies](#technologies)  
- [Installation](#installation)  
- [Database Setup](#database-setup)  
- [Running the Server](#running-the-server)  
- [API Endpoints](#api-endpoints)  
- [Example Requests](#example-requests)  
- [License](#license)  

## Features

- User registration with validation  
- Password hashing using bcrypt  
- PostgreSQL integration  
- Fetch users and roles  

## Technologies

- Node.js  
- Express.js  
- PostgreSQL  
- bcrypt  
- body-parser  

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sineetg/Haraka-API.git
cd Haraka-API
```

2. Install dependencies:

```
npm install
```

## Database Setup

1. Create a PostgreSQL database:

```
CREATE DATABASE harakapay;
```

2. Create required tables:

```
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE user_tb (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES role(role_id)
);
```

3. Update your ```db.js``` file with your PostgreSQL connection details.

## Running the Server

Start the server:

```
node index.js
```

The server will run on ```http://localhost:3000```.

## API Endpoints

### Register User

 **- POST** ```/register```
 
 **- Request Body** (JSON)**:**

```json
{
  "user_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "0912345678",
  "password": "mypassword",
  "role_id": 1
}
```

 **- Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "user_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "0912345678",
    "role_id": 1
  }
}
```

### Get All Users

 **- GET** ```/users```
 
 **- Response:** Returns a list of all users in the database.

### Get All Roles

 **- GET** ```/roles```

 **- Response:** Returns a list of all roles in the database.

## Example Requests

You can use Postman, curl, or any HTTP client to test the API endpoints.

## License

This project is licensed under the MIT License.
