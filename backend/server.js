const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());

let userBalance = 1000; 

app.post("/roll-dice", (req, res) => {
    const { betAmount, clientSeed } = req.body;

    if (betAmount > userBalance || betAmount <= 0) {
        return res.status(400).json({ message: "Invalid bet amount!" });
    }

    const serverSeed = crypto.randomBytes(16).toString("hex"); 
    const hash = crypto.createHash("sha256").update(serverSeed + clientSeed).digest("hex");
    const roll = (parseInt(hash.substring(0, 2), 16) % 6) + 1;

    userBalance = roll >= 4 ? userBalance + betAmount : userBalance - betAmount;

    res.json({ roll, userBalance, serverSeed, hash });
});


app.get("/balance", (req, res) => res.json({ userBalance }));

app.listen(5000, () => console.log("Server running on port 5000"));
