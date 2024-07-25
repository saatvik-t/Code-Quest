const express = require('express');
const dotenv = require('dotenv');
const { DBConnection } = require("./database/db.js");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

DBConnection();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World !");
});

app.post("/register", async (req, res) => {
    try{
        // Check if all the data has been given by the user
        const { firstname, lastname, email, password } = req.body;
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("Insufficient Information !");
        }
        // Check if there is an existing user with the given email
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).send("User already exists with the given email");
        }
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 15);
        // Saving the user in the database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password : hashedPassword,
        });
        // Generate a token for the user and send it
        const token = jwt.sign({id : user._id, email}, process.env.SECRET_KEY, {
            expiresIn : '1h',
        });
        user.token = token;
        user.password = undefined;
        res.status(200).json({message : 'You have successfully registered', user});
    }catch(error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        // Get the data from the user
        const {email, password } = req.body;
        if(!(email && password)) {
            return res.status(400).send("Insufficient Information");
        }
        // Check for the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found!");
        }
        // Password matching
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(404).send("Password is incorrect");
        }
        // Generating the JWT
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;
        // Storing the JWT (important)
        /* Which is the best option to store JWT ? (a) Local Storage (b) Session (c) Cookie
        A JWT needs to be stored in a safe place within the user's browser.
        (a) If JWT is stored in the local storage, then it can be accessed by any script in that page. This is a bad practice as attackers may get access to the token.
        (b) If JWT is stored in the session, then any of the 3rd party scripts that are included in the page may access the token.
        (c) To keep the token secure, it needs to be stored in a httpOnly cookie, as it is a special cookie that is sent only in the HTTP requests to the server.
            Also, it is inaccessible to the javascript code running in the browser. */
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, //only manipulate by server not by client/user
        };

        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in !",
            success: true,
            token,
        });
    } catch(error) {
        console.log(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server is listening on Port ' + process.env.PORT);
});