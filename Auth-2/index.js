//Here We will writing am auth middlleware and pass it to our routes
const express = require("express")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

const app = express();
dotenv.config();

app.use(express.json())

const users = []

const PORT = process.env.PORT || 3000;
const jwtsecretkey = process.env.JWT_SECRET_KEY;

function logger(req, res, next) {
    console.log(req.method + "request came")
    next()
}

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    });

    console.log(users);

});

app.post('/signin', logger, (req, res) => {
    const username = req.body.username
    const password = req.body.password

    let foundUser = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i]
        }
    }

    if (!foundUser) {
        res.json({
            message: "Credentials Incorrect"
        })
        return
    } else {
        const token = jwt.sign({
            username: users[i].username
        }, jwtsecretkey);
        res.header("jwt", token);
        res.header("random", "rishabh");

        res.json({
            token: token
        })

    }

    res.json({
        message: "You are signed in"
    })
    console.log(users);
})

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, jwtsecretkey)

    if (decodedData.username) {
        req.username = decodedData.username
        next()
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get('/me', logger, auth, (req, res) => {
    //req = {status,heaeders....,username,password}
    const currUser = req.username;
    //const token = req.headers.token
    //const decodedData = jwt.verify(token,JWT_SECRET);
    //const currentUser = decodedData.username

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === currUser) {
            foundUser = users[i]
        }
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    })

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})