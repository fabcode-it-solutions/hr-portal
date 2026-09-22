import Feedback from "../services/feedback.service.js";
import express from "express";
const router=express.Router();

router.post("/send",async(req,res)=>{
    try {
        const data = await Feedback.survey(req.body);
        res.status(200).json(data);
      } catch (err) {
        console.log(err)
        res.status(400).json("Error: ", err);
      }
})

export default router;