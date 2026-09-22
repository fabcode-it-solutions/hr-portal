import Leave from "../schemas/leave.schema.js";
import Employee from "../schemas/user.schema.js";
import leaveNotification from "../schemas/leaveNotification.schema.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
import { createTransporter } from "../utils/emailService.js";



//Request for leave
async function leaveRequest(leaveData) {
  try {
    const {
      email,
      duration,
      type,
      fromDate,
      toDate,
      reason,
      date,
      toTime,
      fromTime,
      typeOfHoliday,
    } = leaveData;
    const user = await Employee.findOne({ email });
    const { firstName, lastName, designation, department } = user;
    const currentDate = new Date();
    let Timef, Timet;
    const name = firstName + " " + lastName;

function createISTDate(time) {
  const [h, m] = time.split(":");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T${h}:${m}:00.000+05:30`;
}



    if (fromTime !== undefined && toTime !== undefined) {
      // Timef = new Date(
      //   `${currentDate.toISOString().split("T")[0]}T${fromTime}:00Z`
      // );
      // Timet = new Date(
      //   `${currentDate.toISOString().split("T")[0]}T${toTime}:00Z`
      // );
      Timef = createISTDate(fromTime);
      Timet = createISTDate(toTime);
      
    }

    let sandwich;
    if (duration === "0" || duration === "8") {
      if (fromDate !== undefined && toDate !== undefined) {
        const fromStr = new Date(fromDate);
        const toStr = new Date(toDate);
        const isSandwichLeave = fromStr.getDay() === 5 && toStr.getDay() === 1;
        if (isSandwichLeave) {
          sandwich = true;
        }
      } else {
        const sanDate = new Date(date);
        const isSandwichLeave =
          sanDate.getDay() === 5 || sanDate.getDay() === 1;
        if (isSandwichLeave) {
          sandwich = true;
        }
      }
    }
    const employee = new Leave({
      name,
      email,
      designation,
      department,
      duration,
      type,
      fromDate,
      toDate,
      date,
      fromTime: Timef,
      toTime: Timet,
      reason,
      sandwich,
      typeOfHoliday
    });
    const response = await sendEmail(
      email,
      name,
      designation,
      department,
      duration,
      type,
      fromDate,
      toDate,
      reason,
      date,
      toTime,
      fromTime,
      typeOfHoliday
    );

    if (response === "send") {
      const requestData = await employee.save();
      const title = `${email}\n${type}`;
      const notification = new leaveNotification({
        _id: requestData._id,
        title,
        text: reason,
        email,
      });
      await notification.save();
      return { message: "Request send to admin", requestData };
    } else {
      return { message: "Email not send", response };
    }
  } catch (err) {
    console.log(err);
    return { message: "Error", err };
  }
}

//leave requests Data for admin (Pending,approve,reject)
async function requestData(data) {
  try {
    const action = data;

    const requests = await Leave.aggregate([
      {
        $match: { action: action },
      },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          leaveData: "$$ROOT",
          totalLeave: "$userData.totalLeave",
          totalSandwich: "$userData.totalSandwich",
        },
      },
      {
        $sort: { "leaveData.createdAt": -1 },
      },
    ]);

    return { message: "User Information", requests };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

async function sendEmail(
  email,
  name,
  designation,
  department,
  duration,
  type,
  fromDate,
  toDate,
  reason,
  date,
  toTime,
  fromTime,
  typeOfHoliday
) {
  try {
    function convertToAMPM(timeString) {
      const [hours, minutes] = timeString.split(":");
      let formattedHours = parseInt(hours, 10);
      const ampm = formattedHours >= 12 ? "PM" : "AM";

      formattedHours = formattedHours % 12;
      formattedHours = formattedHours === 0 ? 12 : formattedHours;

      return `${formattedHours}:${minutes} ${ampm}`;
    }

    function formatDate(inputDate) {
      const date = new Date(inputDate);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }


const transporter = await createTransporter();
                                              
    const info = await transporter.sendMail({
     from: `${name} ${email}`,
      to:'thefabcodehr@gmail.com',
      subject: `Leave Request for ${
        duration === "0"
          ? "More than day"
          : duration === "1"
          ? "Short day"
          : duration === "4"
          ? "Half Day"
          : duration === "8"
          ? "Full Day"
          : "Unknown Duration"
      }`,
      html: `<p>
      <strong>Subject:</strong> ${type}<br>
      Dear Sir,<br><br>
      
      I hope this email finds you well. I am writing to request a leave of absence
       ${
         toTime && fromTime
           ? `from <strong>${convertToAMPM(
               fromTime
             )}</strong> to <strong>${convertToAMPM(toTime)}</strong>`
           : ""
       }
        ${date ? `on <strong>${formatDate(date)}</strong>` : ""}  
           ${
             fromDate && toDate
               ? `from <strong>${formatDate(fromDate)}</strong> to <strong>${formatDate(toDate)}</strong>`
               : ""
           } due to (${reason}) .<br><br>
      
      I have completed my current tasks and will ensure a smooth handover. I am willing to assist in any way to minimize disruption.<br><br>
      
      If needed, I can provide additional information or documentation. The requested duration is <strong>
      ${
        duration === "0"
          ? "More than day"
          : duration === "1"
          ? "Short Leave"
          : duration === "4"
          ? "Half Day"
          : duration === "8"
          ? "Full Day"
          : "Unknown Duration"
      }</strong>.<br><br>
      
      Name: ${name}<br>
      Department: ${department}<br>
      Designation: ${designation}<br>
        ${typeOfHoliday ? `Type of Holiday: ${typeOfHoliday}<br>` : ''}
        </p>
        `,
    });
console.log(info)
    console.log("Message sent:", info.messageId);
    return "send";
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

async function employeeLeave(email) {
  try {
    const userData = await Leave.find({ email }).sort({ createdAt: -1 });
    return { message: "user leaveinfo", userData };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

async function leaveDelete(id) {
  try {
    const Deleted = await Leave.findByIdAndDelete({ _id: id });
    if (!Deleted) {
      return { message: "Data not found" };
    } else {
      return { message: "Data Deleted Succesfully", Deleted };
    }
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error", error };
  }
}


export default {
  leaveRequest,
  requestData,
  employeeLeave,
  leaveDelete
};
