
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const app = express();

dotenv.config();

let PORT = process.env.PORT || 5000;

const users = []

app.post("/signup", (req, res) => {
    const { username, password } = req.body

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed in"
    })

    console.log(users)

});

app.post("/signin", (req, res) => {
    const { username, password } = req.body
    let FindUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            FindUser = user[i]
        }
    }

    if (FindUser) {
        const token = jwt.sign({
            username: username,
            password: password,
            firstname,
            lastname,
            courses: []
        }, JWT_SECRET_KEY);

        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid usernameor password"
        })
    }
    console.log(users)

});

app.get('/me', (req, res) => {
    const token = req.headers.token //jwt
    const decodedInformation = jwt.verify(token, JWT_SECRET_KEY); // {username: "rishabh@gmail.com"}
    const unAuthDecodedinfo = jwt.decode(token,); // {username: "rishabh@gmail.com"}
    const username = decodedInformation.username

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    } else {
        res.json({
            message: "token invalid"
        })
    }
})


app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});