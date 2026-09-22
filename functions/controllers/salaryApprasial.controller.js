import express from "express";
const router = express.Router();
import { upload } from "../utils/fileUpload.js";

import appraisalService from "../services/salaryApprasial.service.js";

router.post("/request-apprasial", async (req, res) => {
  try {
    const { email, expectedSalary, reason } = req.body;
    const newAppraisal = await appraisalService.createAppraisal(
      email,
      expectedSalary,
      reason,
    );
    res.status(201).json(newAppraisal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/perform-action", async (req, res) => {
  try {
    const { email, action, adminMessage, amountOffer } = req.body;
    const updatedAppraisal = await appraisalService.updateAppraisal({
      email,
      action,
      amountOffer,
      adminMessage,
    });

    res.json(updatedAppraisal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/request-documents", async (req, res) => {
  try {
    const { email, experienceLetter, reason, salarySlip, otherDocuments } =
      req.body;
    const documents = await appraisalService.requestDocuments(
      email,
      experienceLetter,
      reason,
      salarySlip,
      otherDocuments,
    );
    res.status(201).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/upload-experience-letter",
  upload.single("file"),
  async (req, res) => {
    try {
      const { email } = req.body;
      const filePath = req.file.path;

      await appraisalService.uploadExperienceLetter(email, filePath);

      res
        .status(200)
        .json({ message: "Experience letter document uploaded successfully" });
    } catch (error) {
      console.error("Error uploading experience letter document:", error);
      res
        .status(500)
        .json({ error: "Error uploading experience letter document" });
    }
  },
);

router.post("/upload-salary-slips", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;
    const filePath = req.file.path;

    await appraisalService.uploadSalarySlip(email, filePath);

    res
      .status(200)
      .json({ message: "Salary slip document uploaded successfully" });
  } catch (error) {
    console.error("Error uploading salary slip document:", error);
    res.status(500).json({ error: "Error uploading salary slip document" });
  }
});
router.post(
  "/upload-other-documents",
  upload.single("file"),
  async (req, res) => {
    try {
      const { email } = req.body;
      const filePath = req.file.path;

      await appraisalService.uploadOtherDocuments(email, filePath);

      res
        .status(200)
        .json({ message: "Salary slip document uploaded successfully" });
    } catch (error) {
      console.error("Error uploading salary slip document:", error);
      res.status(500).json({ error: "Error uploading salary slip document" });
    }
  },
);

router.get("/apprasial-list", async (req, res) => {
  try {
    const allAppraisals = await appraisalService.getAllAppraisals();
    res.status(200).json(allAppraisals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/requested-documents", async (req, res) => {
  try {
    const allRequestedDocuments =
      await appraisalService.getAllRequestedDocuments();
    res.status(200).json(allRequestedDocuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/get-appraisal", async (req, res) => {
  try {
    const { email } = req.body; // Retrieve email from the request body
    const appraisal = await appraisalService.getAppraisalByEmail(email);
    if (!appraisal) {
      return res.status(404).json({ message: "Appraisal not found" });
    }
    res.status(200).json(appraisal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/get-requested-documents", async (req, res) => {
  try {
    const { email } = req.body; // Retrieve email from the request body
    const requestedDocuments =
      await appraisalService.getRequestedDocumentsByEmail(email);
    if (!requestedDocuments) {
      return res.status(404).json({ message: "Requested Documents not found" });
    }
    res.status(200).json(requestedDocuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/current-salary", async (req, res) => {
  try {
    const { email } = req.body; // Retrieve email from the request body
    const currentSalary = await appraisalService.getCurrentSalaryByEmail(email);
    if (!currentSalary) {
      return res.status(404).json({ message: "Appraisal not found" });
    }
    res.status(200).json(currentSalary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
