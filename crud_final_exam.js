require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================
// DATABASE CONNECTION
// ======================================================

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

// ======================================================
// CONNECT DATABASE
// ======================================================

db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to Aiven MySQL');

        // ======================================================
        // CREATE TABLE AUTOMATICALLY
        // ======================================================

        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id VARCHAR(50),
            full_name VARCHAR(100),
            course VARCHAR(100),
            year_level VARCHAR(20),
            email VARCHAR(100)
        )
        `;

        db.query(createTableQuery, (err) => {
            if (err) {
                console.log('Table creation error:', err);
            } else {
                console.log('Students table ready');
            }
        });
    }
});

// ======================================================
// CREATE STUDENT
// ======================================================

app.post('/students', (req, res) => {

    const {
        student_id,
        full_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_id, full_name, course, year_level, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            full_name,
            course,
            year_level,
            email
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                res.status(500).json({
                    message: 'Failed to add student'
                });

            } else {

                res.json({
                    message: 'Student added successfully'
                });
            }
        }
    );
});

// ======================================================
// READ ALL STUDENTS
// ======================================================

app.get('/students', (req, res) => {

    const sql = 'SELECT * FROM students ORDER BY id DESC';

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                message: 'Failed to fetch students'
            });

        } else {

            res.json(results);
        }
    });
});

// ======================================================
// UPDATE STUDENT
// ======================================================

app.put('/students/:id', (req, res) => {

    const id = req.params.id;

    const {
        student_id,
        full_name,
        course,
        year_level,
        email
    } = req.body;

    const sql = `
        UPDATE students
        SET
            student_id = ?,
            full_name = ?,
            course = ?,
            year_level = ?,
            email = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_id,
            full_name,
            course,
            year_level,
            email,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                res.status(500).json({
                    message: 'Failed to update student'
                });

            } else {

                res.json({
                    message: 'Student updated successfully'
                });
            }
        }
    );
});

// ======================================================
// DELETE STUDENT
// ======================================================

app.delete('/students/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).json({
                message: 'Failed to delete student'
            });

        } else {

            res.json({
                message: 'Student deleted successfully'
            });
        }
    });
});

// ======================================================
// DEFAULT ROUTE
// ======================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});