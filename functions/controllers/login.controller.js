import express from "express";
const router = express.Router();
import Login from "../services/userLogin.service.js";

router.post("/login", async (req, res) => {
  try {
    const login = await Login.userLogin(req.body);
    res.status(200).json(login);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

export default router;
