import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.json(true);
});

app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

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

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string);

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        const db = JSON.parse(data);
        if (index >= 0 && index < db.submissions.length) {
            res.json(db.submissions[index]);
        } else {
            res.status(404).send('Submission not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
