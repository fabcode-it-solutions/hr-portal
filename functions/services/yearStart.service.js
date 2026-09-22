import User from "../schemas/user.schema.js";

async function yearStart() {
  try {
    const newYear = await data();
    const today = new Date();
    const todayComponents = {
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate(),
    };
    const newYearComponents = {
      year: newYear.getFullYear(),
      month: newYear.getMonth(),
      date: newYear.getDate(),
    };
    if (
      todayComponents.year === newYearComponents.year &&
      todayComponents.month === newYearComponents.month &&
      todayComponents.date === newYearComponents.date
    ) {
      const leaveUpdate= await User.updateMany({totalLeave:15});
      console.log("All Employees Leaves updated Sucessfully",leaveUpdate)
    }

  } catch (err) {
    console.log("Error in yearStart.service",err);
  }
}

async function data() {
  return new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1));
}
 
export default yearStart;