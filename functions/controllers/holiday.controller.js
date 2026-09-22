import express from "express";
const router = express.Router();
import holidayService from "../services/holiday.service.js";


router.post("/create-holiday", async (req, res) => {
  try {
    const { date, holidayName } = req.body;
    const newHoliday = await holidayService.createHolidays(date, holidayName);
    res.status(201).json(newHoliday);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

  router.get("/holidays", async (req, res) => {
    try {
       const year = req.query.year; 

    const holidays = await holidayService.getAllHolidays(year);
        res.status(200).json(holidays);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });

export default router;
