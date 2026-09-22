import express from "express";
import eventController from "../services/event.service";
const router = express.Router();

router.get("/upcoming",eventController);

export default router;