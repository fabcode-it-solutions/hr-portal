import cron from "node-cron";
import User from "../schemas/user.schema.js";
import Notification from "../schemas/popup.schema.js";

async function createAndSaveNotification(title, text,email,type) {
  const data = new Notification({ title, text, email ,type, seenAdmin: false});
  return await data.save();
}

async function popupNotification() {
  try {
    cron.schedule('0 10 * * *', async () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const userData = await User.find();

    for (const element of userData) {
      const { dob, joinDate, firstName,email } = element;

      // Check birthday
      if (
        dob &&
        dob.getDate() === currentDate.getDate() &&
        dob.getMonth() === currentDate.getMonth()
      ) {
        await createAndSaveNotification(
          `Happy Birthday, ${firstName}!`,
          "Today is your birthday.",
          email,
          "birthday"
        );
      } else if (dob) {
        const nextBirthday = new Date(
          currentDate.getFullYear(),
          dob.getMonth(),
          dob.getDate()
        );

        const daysUntilBirthday = Math.ceil(
          (nextBirthday - currentDate) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilBirthday > 0 && daysUntilBirthday <= 2) {
          const message =
            daysUntilBirthday === 1
              ? `${firstName}'s birthday is tomorrow!`
              : `${firstName}'s birthday is in two days!`;

          await createAndSaveNotification(
            message,
            `After ${daysUntilBirthday} days ${firstName}'s birthday.`,
            email,
            "birthday"
          );
        }
      }

      // Check anniversary
      if (
        joinDate &&
        joinDate.getDate() === currentDate.getDate() &&
        joinDate.getMonth() === currentDate.getMonth()
      ) {
        await createAndSaveNotification(
          `Congrats, ${firstName} on there work anniversary!`,
          `Today is ${firstName}'s work anniversary.`,
          email,
          "anniversary"
        );
      } else if (joinDate) {
        const nextAnniversary = new Date(
          currentDate.getFullYear(),
          joinDate.getMonth(),
          joinDate.getDate()
        );

        const daysUntilAnniversary = Math.ceil(
          (nextAnniversary - currentDate) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilAnniversary > 0 && daysUntilAnniversary <= 2) {
          const message =
            daysUntilAnniversary === 1
              ? `${firstName}'s work anniversary is tomorrow!`
              : `${firstName}'s work anniversary is in two days!`;

          await createAndSaveNotification(
            message,
            `After ${daysUntilAnniversary} days ${firstName}'s work anniversary.`,
            email,
            "anniversary"
          );
        }
      }
    }
})
  } catch (err) {
    console.log("Error", err);
  }
}




export default popupNotification;
