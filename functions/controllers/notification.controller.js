import express from "express";
const router = express.Router();
import Notification from "../services/notification.service.js";

router.post("/new", async (req, res) => {
  try {
    const data = await Notification.notificationAdd(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});


router.get("/all-notification", async (req,res) => {
  try {
    const notification = await Notification.getAllNotification(req.query.email);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get("/leave-notification", async (req,res) => {
  try {
    const notification = await Notification.leaveNotifications();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.put('/mark-as-seen/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { userEmail } = req.body;

  try {
    const notification = await Notification.markNotificationAsSeen(notificationId, userEmail);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as seen', error: error.message });
  }
});


router.post('/new-notificaton', async (req ,res) => {
  try {
    const { email } = req.body;

    // Call the service function to perform the required operation
    const result = await Notification.countAndSubtractEmail(email);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.put('/mark-as-seen-admin/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.markAdminNotification(notificationId);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as seen', error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const deleteData = await Notification.deleteNotification(req.body);
    res.status(200).json(deleteData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});
export default router;
