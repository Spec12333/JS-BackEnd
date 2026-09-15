const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readData, writeData } = require("../utils/fileDB");
const idGenerator = require("../utils/idGenerator");

const { JWT_SECRET } = require('../config/env');
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  }

  const users = await readData("users.json");
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ error: "Username must be unique" });
  }

  const newUser = {
    id: idGenerator(),
    username: username,
    passwordHash: await bcrypt.hash(password, 10),
    role: "customer",
  };

  users.push(newUser);
  await writeData("users.json", users);

  res
    .status(201)
    .json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = await readData("users.json");

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const passwordCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({token})
});

module.exports = router;