import express from "express";
import Employee from "../services/employee.service.js";
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const employeeData = await Employee.employeeRegister(req.body);
    res.status(200).json(employeeData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.patch("/edit/:id", async (req, res) => {
  try {
      const _id = req.params.id.replace(":", "");
      const update = await Employee.employeeUpdate(_id, req.body);
      res.status(200).json(update);
  } catch (err) {
      console.log("err", err);
      res.status(400).json({ error: "Error" });
  }
});


router.patch("/update-image", async (req,res) => {
  const { email, userImg } = req.body;

  try {
    const updatedUser = await Employee.updateUserImageByEmail(email, userImg);
    res.status(200).json({ message: 'User image updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user image:', error.message);
    res.status(500).json({ error: 'Error updating user image' });
  }
});

router.patch("/eod/:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const { endDate } = req.body;
    const update = await Employee.updateEmployeeEndDateAndStatus(_id, endDate);
    res.status(200).json(update);
  } catch (err) {
    console.log("Error:", err);
    res.status(400).json({ error: err.message || "An error occurred" });
  }
});

router.delete("/delete:id", async (req, res) => {
  try {
    const _id = req.params.id.replace(":", "");
    const deleteData = await Employee.employeeDelete(_id);
    res.status(200).json(deleteData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.get("/employee-info", async (req, res) => {
  try {
    const employeeData = await Employee.employeeInfo(req.query);
 
    res.status(200).json(employeeData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.get("/user-info", async (req, res) => {
  try {
    const userData = await Employee.userInfo(req.query);
    res.status(200).json(userData);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});

router.get("/value", async (req, res) => {
  try {
    const num = await Employee.employeeNum(req.query);
    res.status(200).json(num);
  } catch (err) {
    console.log("err", err);
    res.status(400).json("Error: ", err);
  }
});
router.post("/update-password", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(200).json({ message: "Passwords do not match" });
    }

    await Employee.updatePassword(email, password);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
