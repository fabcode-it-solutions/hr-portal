import candidateService from "../services/candidate.service.js";
import express from "express";

const router = express.Router();

router.post("/addcandidate", async (req, res) => {
  try {
    const data = await candidateService.addCandidate(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "Error", error: err });
  }
});

router.get('/candidatesToNotify', async (req, res) => {
  try {
    const candidates = await candidateService.getCandidatesToNotify();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

export default router;
