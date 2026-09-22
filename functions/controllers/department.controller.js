import Department from "../services/department.service.js";
import express from "express";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const data = await Department.departmentDetail(req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json("Error: ", err);
  }
});

router.get("/data", async (req, res) => {
  try {
    const userData = await Department.allData();
    res.status(200).json(userData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.patch("/edit:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const update = await Department.departmentUpdate( _id, req.body );
    res.status(200).json(update);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.delete("/delete:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const deleteData = await Department.departmentDelete(_id);
    res.status(200).json(deleteData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

export default router;
