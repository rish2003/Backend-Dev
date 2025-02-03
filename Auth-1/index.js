
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())

dotenv.config();

let PORT = process.env.PORT || 5000;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const users = []

app.post("/signup", (req, res) => {
    const username = req.body.username
    const password = req.body.password

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
    const username = req.body.username;
    const password = req.body.password;

    let FindUser = users.find(user => user.username === username && user.password === password);

    if (FindUser) {
        const token = jwt.sign(
            {
                username: username,
                password: password
            },
            jwtSecretKey, // Use correct variable
            { expiresIn: "1h" }
        );

        res.json({ token });
    } else {
        res.status(403).send({ message: "Invalid username or password" });
    }
    console.log(users)
});

app.get('/me', (req, res) => {
    const token = req.headers.token //jwt
    const decodedInformation = jwt.verify(token, jwtSecretKey); // {username: "rishabh@gmail.com"}
    const unAuthDecodedinfo = jwt.decode(token,); // {username: "rishabh@gmail.com"}
    const username = decodedInformation.username

    let FindUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            FindUser = users[i]
        }
    }

    if (FindUser) {
        res.json({
            username: FindUser.username,
            password: FindUser.password
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