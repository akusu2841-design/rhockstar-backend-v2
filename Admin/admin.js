const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET = "rhockstar_secret";

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ user: "admin" }, SECRET);
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid login" });
});

module.exports = router;
