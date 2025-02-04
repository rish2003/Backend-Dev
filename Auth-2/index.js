const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();

app.use(express.json());

const users = [];

const PORT = process.env.PORT || 3000;
const jwtsecretkey = process.env.JWT_SECRET_KEY;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

function logger(req, res, next) {
    console.log(req.method + " " + req.url + " request came");
    next();
}

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "You are signed up"
    });

    console.log(users);
});

app.post('/signin', logger, (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find(user => user.username === username && user.password === password);

    if (!foundUser) {
        return res.status(401).json({
            message: "Credentials Incorrect"
        });
    }

    const token = jwt.sign({ username: foundUser.username }, jwtsecretkey, { expiresIn: "1h" });
    res.json({
        token: token
    });
});

function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {
        const decodedData = jwt.verify(token, jwtsecretkey);
        req.username = decodedData.username;
        next();
    } catch (error) {
        res.status(400).json({
            message: "Invalid token."
        });
    }
}

app.get('/me', logger, auth, (req, res) => {
    const currUser = req.username;

    const foundUser = users.find(user => user.username === currUser);

    if (!foundUser) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});