import Leave from "../schemas/leave.schema.js";
import Employee from "../schemas/user.schema.js";
import leaveNotification from "../schemas/leaveNotification.schema.js";
import { createTransporter } from "../utils/emailService.js";

//Employee Leave Request action (approve/reject)
async function leaveResponse(_id, data) {
  const { action, rejectReason, approveReason, sandwich, day } = data;
  try {
    const updatedData = await Leave.findByIdAndUpdate(
      { _id },
      { action, rejectReason, approveReason, sandwich },
      { new: true }
    );
    const reason = updatedData.reason;
    let message;
    if (action === "approve") {
      message = approveReason;
    } else {
      message = rejectReason;
    }
    const leaveData = await leaveNotification.findByIdAndUpdate(
      { _id: updatedData._id },
      {
        action,
        message,
        userSeen: false,
      }
    );
    console.log(leaveData);

    if (action === "reject") {
  const email = updatedData.email;
  const userData = await Employee.findOne({ email });

  await sendRejectionEmail(
    email,
    userData?.firstName + " " + userData?.lastName,
    rejectReason,
    updatedData.type,
    updatedData.duration,
    updatedData.fromDate,
    updatedData.toDate,
    updatedData.date
  );
}

    if (updatedData.action === "approve") {
      const email = updatedData.email;
      const data = await Leave.findOne({ _id: updatedData._id });
      const { fromDate, toDate, duration, date, sandwich } = data;
      const leaveDuration = await DurationToLeave(fromDate, toDate, date);
      const userData = await Employee.findOne({ email });
      const { totalSandwich } = userData;
      let days = 0;

      if (duration >= "4" && duration < "8") {
        days = 0.5;
      } else if (duration === "8") {
        days = 1;
      } else if (duration === "0" && !sandwich) {
        days = leaveDuration.days;
      } else {
        days = 0;
      }

      if (sandwich && totalSandwich <= 1) {
        if (day) {
          days = Number(day);
        } else if (duration === "8") {
          days = 3;
        } else if (duration === "0") {
          days = 4;
        }
      } else if (sandwich && totalSandwich === 2) {
        if (day) {
          days = Number(day);
        } else {
          days = 0;
          //days = 1;
        }
      }

      const pipline = [
        { $match: { email } },
        {
          $project: {
            Leave: {
              $subtract: ["$totalLeave", days],
            },
            Sandwich: {
              $cond: [
                { $eq: [sandwich, true] },
                { $subtract: ["$totalSandwich", 1] },
                "$totalSandwich",
              ],
            },
            IsSandwichTrue: { $eq: [sandwich, true] },
          },
        },
      ];
      try {
        const result = await Employee.aggregate(pipline);

        if (result && result[0]) {
          const leaveResult = await Employee.updateOne(
            { email },
            { totalLeave: result[0].Leave, totalSandwich: result[0].Sandwich }
          );
        }
      } catch (error) {
        console.error("Error updating aggregated data:", error);
      }
    }


    return { message: "Action", updatedData };
  } catch (error) {
    console.log("error", error);
    return { message: "error", error };
  }
}

async function DurationToLeave(fromDate, toDate) {
  if (fromDate !== undefined && toDate !== undefined) {
    const timeDifference = toDate - fromDate;

    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return { days: daysDifference };
  }
}

export default { leaveResponse };

async function sendRejectionEmail(email, name, rejectReason, leaveType, duration, fromDate, toDate, date) {
  try {
    const transporter = await createTransporter();

    const formatDate = (inputDate) => {
      const d = new Date(inputDate);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    await transporter.sendMail({
      from: `"HR Portal" <${process.env.EMAIL}>`,
      to: email,
      subject: `Leave Request Rejected`,
      html: `<p>
        Dear ${name},<br><br>
        Your leave request for <strong>${leaveType}</strong> 
        ${fromDate && toDate ? `from ${formatDate(fromDate)} to ${formatDate(toDate)}` : ""}
        ${date ? `on ${formatDate(date)}` : ""}
        has been <strong>rejected</strong>.<br><br>
        <strong>Reason:</strong> ${rejectReason}<br><br>
        Regards,<br>HR Team
      </p>`,
    });

    console.log(`Rejection email sent to ${email}`);
  } catch (err) {
    console.error("Error sending rejection email:", err);
  }
}
