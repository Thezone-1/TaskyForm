import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ping endpoint to check server status
app.get('/ping', (req, res) => {
    res.json(true);
});

// Endpoint to submit data
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        res.status(400).send('All fields are required.');
        return;
    }

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        const db = JSON.parse(data);
        db.submissions.push({ name, email, phone, github_link, stopwatch_time });

        fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
            if (err) {
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('Submission saved');
        });
    });
});

// Endpoint to read all submissions
app.get('/read', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        const db = JSON.parse(data);
        res.json(db.submissions);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
