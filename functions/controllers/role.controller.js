import express from "express";
import Role from "../services/role.service.js";
const router = express();

router.post("/add", async (req, res) => {
  try {
    const data = await Role.addData(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json("Error:", error);
  }
});

router.patch("/edit/:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const updatedData = await Role.updateData(_id, req.body);
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json("Error", error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const deletedData = await Role.deleteData(_id);
    res.status(200).json(deletedData);
  } catch (error) {
    res.status(400).json("Error", error);
  }
});

router.get("/data", async (req, res) => {
  try {
    const data = await Role.getData();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json("Error", error);
  }
});
export default router;
