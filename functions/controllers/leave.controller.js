import express from "express";
import Leave from "../services/leave.service.js";
import Action from "../services/pendingLeave.service.js"
const router = express.Router();

router.post('/request', async (req, res) => {
  try {
    const response = await Leave.leaveRequest(req.body);
    res.status(200).json(response);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/all-request", async (req, res) => {
  try {
    const requests = await Leave.requestData(req.query.action)
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

router.get("/employee", async (req, res) => {
  try {
    const requests = await Leave.employeeLeave(req.query.email);
    res.status(200).json(requests);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

router.patch("/admin-action:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const data = await Action.leaveResponse(_id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

router.delete("/delete:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const deleteData = await Leave.leaveDelete(_id);
    res.status(200).json(deleteData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

export default router;
