import Notification from "../schemas/notification.schema.js";
import leaveNotification from "../schemas/leaveNotification.schema.js";
import Employee from "../schemas/user.schema.js";
import popupNotifications from "../schemas/popup.schema.js";

async function notificationAdd(data) {
  try {
    const { title, text } = data;
    if (!title || !text) {
      return { message: "Please provide required fields" };
    }
    const Data = new Notification({
      title,
      text,
    });
    const savedData = await Data.save();
    return { message: "New Notification", savedData };
  } catch (err) {
    console.log(err);
    return { message: "Error", err };
  }
}

async function getAllNotification(email) {
  try {
    const query = {
      email,
      action: { $in: ["approve", "reject"] },
    };

    const allNotifications = await Notification.find().sort({ createdAt: -1 });
    const notification = await leaveNotification.find(query);
    const combinedNotifications = [...allNotifications, ...notification];
    combinedNotifications.sort((a, b) => b.createdAt - a.createdAt);
    return combinedNotifications;
  } catch (error) {
    throw new Error(`Could not retrieve holidays: ${error.message}`);
  }
}

async function leaveNotifications() {
  try {

    const notification = await leaveNotification.find().sort({ createdAt: -1 });
    const allNotifications = await Notification.find().sort({ createdAt: -1 });
    const popupNotification = await popupNotifications.aggregate([
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
          _id: 1,
          title: 1,
          text: 1,
          type: 1,
          email: 1,
          seenAdmin: 1,
          updatedAt: 1,
          createdAt: 1,
          userImg: "$userData.userImg",
        },
      },
      {
        $sort: { "createdAt": -1 },
      },
    ]);
    const combinedNotifications = [
      ...allNotifications,
      ...notification,
      ...popupNotification,
    ];

    combinedNotifications.sort((a, b) => b.createdAt - a.createdAt);
    return combinedNotifications;

  } catch (error) {
    console.log("error", error);
    return { message: "Error", error };
  }
}

async function markNotificationAsSeen(notificationId, userEmail) {
  try {
    const notification = await Notification.findById(notificationId);
    const leaveNotifications = await leaveNotification.findById(notificationId);

    if (leaveNotifications) {
      leaveNotifications.userSeen = true;
      leaveNotifications.save();
      return leaveNotifications;
    } else if (notification) {
      if (!notification.seen) {
        notification.seen = true;
        notification.email.push(userEmail);
        await notification.save();
      } else if (!notification.email.includes(userEmail)) {
        notification.email.push(userEmail);
        await notification.save();
      }
      return notification;
    } else {
      throw new Error("Notification not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error marking notification as seen: " + error.message);
  }
}

async function markAdminNotification(notificationId) {
  const leaveNotifications = await leaveNotification.findById(notificationId);
  const popupNotification = await popupNotifications.findById(notificationId);

  if (leaveNotifications) {

    leaveNotifications.seenAdmin = true;
    await leaveNotifications.save();
    return { message: "Notification is viewed by admin" };
  } else if (popupNotification) {
    popupNotification.seenAdmin = true;
    await popupNotification.save();
    return { message: "Notification is viewed by admin" };
  } else {
    throw new Error("Notification not found");
  }
}

async function countAndSubtractEmail(email) {
  try {
    const user = await Employee.find({ email });
    if (user[0].userType === 1) {
      const totalCount = await Notification.countDocuments();
      const emailCount = await Notification.countDocuments({ email: email });
      const totalleaveNotification = await leaveNotification.countDocuments({
        email,
        userSeen: { $in: [false, true] },
      });
      const seenCount = await leaveNotification.countDocuments({
        email,
        userSeen: true,
      });

      const result =
        totalCount - emailCount + (totalleaveNotification - seenCount);
      return {
        newNotifiation: result,
      };
    } else if (user[0].userType === 0) {
      const totalCount = await leaveNotification.countDocuments();
      const totalPopup = await popupNotifications.countDocuments({
        seenAdmin: { $in: [false, true] },
      });
      const emailCount = await leaveNotification.countDocuments({
        seenAdmin: true,
      });
      const popupNotification = await popupNotifications.countDocuments({
        seenAdmin: true,
      });
      const result = totalCount - emailCount + (totalPopup - popupNotification);
      return {
        newNotifiation: result,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function deleteNotification(query) {
  try {
    const { notificationId } = query;

    if (!notificationId){
       return { message: "Please provide product ID." };
    }

    // Use notificationId directly in the MongoDB query
    const foundInPopup = await popupNotifications.find({ _id: { $in: notificationId } });
    const foundInNotification = await Notification.find({ _id: { $in: notificationId } });
    const foundInLeave = await leaveNotification.find({ _id: { $in: notificationId } });
  console.log(foundInPopup,foundInLeave,foundInNotification)

    if (foundInPopup.length > 0 || foundInNotification.length> 0 || foundInLeave.length> 0) {
      // Delete notifications from the DB.
      await popupNotifications.deleteMany({ _id: { $in: notificationId } });
      await Notification.deleteMany({ _id: { $in: notificationId } });
      await leaveNotification.deleteMany({ _id: { $in: notificationId } });
      console.log("Notifications from the DB deleted successfully.");
      return {message:"Notifications from the DB deleted successfully."}
    
    } else {
      console.log("Notifications not found in the database.");
      return {message:"Notifications not found in the database."}
    }
  }catch(err){
    console.log("Error",err)
  }
}
export default {
  notificationAdd,
  getAllNotification,
  markNotificationAsSeen,
  markAdminNotification,
  countAndSubtractEmail,
  leaveNotifications,
  deleteNotification
};
