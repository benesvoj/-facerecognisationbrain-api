const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const {port, database} = require('./config');

// controllers
const register = require("./controlers/register");
const signin = require("./controlers/signin");
const profile = require('./controlers/profile');
const image = require('./controlers/image');

const app = express();
const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: database,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

app.get('/', (req, res) => {
    res.send('it is working');
});

app.post('/signin', signin.handleSignIn(db, bcrypt, saltRounds));

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt, saltRounds)
});

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
});

app.put('/image', (req, res) => {
    image.handleImageGet(req, res, db)
});

app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res)
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});