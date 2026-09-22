import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import admin from "./controllers/admin.controller.js";
import login from "./controllers/login.controller.js";
import employee from "./controllers/employee.controller.js";
import leave from "./controllers/leave.controller.js";
import candidateController from "./controllers/candidate.controller.js";
import department from "./controllers/department.controller.js";
import postOnLinkedInController from "./controllers/linkedinPost.controller.js";
import feedback from "./controllers/feedback.controller.js";
import yearStart from "./services/yearStart.service.js";
import salaryAppraisal from "./controllers/salaryApprasial.controller.js";
import role from "./controllers/role.controller.js";
import multer from "multer";
import path from "path";
import cron from "node-cron";
import notification from "./controllers/notification.controller.js";
import holiday from "./controllers/holiday.controller.js";
import popupNotification from "./services/popupNotification.service.js";
import User from "./schemas/user.schema.js";
import eventController from "./services/event.service.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
// const corsOptions = {
//   origin: "*",
// };
const corsOptions = {
  origin: ["https://hr-portal.thefabcode.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName); // Set the filename for the uploaded file
  },
});

const upload = multer({ storage });

// Serve static files including uploaded documents
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  // Access the uploaded file through req.file
  const file = req.file;

  // Process the file as needed
  // For example, save it to a cloud storage service or do further processing

  // Send a response
  res.json({ message: "File uploaded successfully", filename: file.filename });
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/api/admin", admin);
app.use("/api/user", login);
app.use("/api/employee", employee);
app.use("/api/candidate", candidateController);
app.use("/api/leave", leave);
app.use("/api/department", department);
app.use("/api/feedback", feedback);
app.use("/api/salary", salaryAppraisal);
app.use("/api/notification", notification);
app.use("/api/holiday", holiday);
app.use("/api/role", role);
app.post("/api/linkedin/postOnLinkedIn", postOnLinkedInController);
app.use("/api/events", eventController);

// Add a simple GET endpoint
app.get("/health", (req, res) => {
  res.json({ message: "Serverless function is working fine!" });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

yearStart();
popupNotification();
cron.schedule("0 0 0 1 1,3,6,9,12 * *", async () => {
  const sandwichUpdate = await User.updateMany({ totalSandwich: 2 });
  console.log(
    "Update sandwich leave after 3 months every year",
    sandwichUpdate,
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Wrap the app with serverless-http
export const handler = serverless(app);
