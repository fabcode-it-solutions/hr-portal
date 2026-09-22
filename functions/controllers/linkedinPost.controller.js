import express from "express";
const router = express.Router();
import linkdinPostService from "../services/linkdinPost.service.js";

router.post("/postOnLinkedIn", async (req, res) => {
  try {
    const { data } = req.body;
    const response = await linkdinPostService.postOnLinkedIn(data);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
