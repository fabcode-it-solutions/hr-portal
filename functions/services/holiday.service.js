import Holiday from "../schemas/holiday.schema.js";

const holidayService = {
  async createHolidays(date, holidayName) {
    try {
      const existingHoliday = await Holiday.findOne({ date });

      if (existingHoliday) {
        const err = new Error("Holiday with the same date already exists");
        err.status = 409;
        throw err;
      }

      const newHoliday = new Holiday({
        date,
        holidayName,
      });

      return await newHoliday.save();
    } catch (error) {
      throw new Error(`Could not create new Holiday: ${error.message}`);
    }
  },

  async getAllHolidays(year) {
    try {
      // 👇 DEFAULT: current year
      const selectedYear = year || new Date().getFullYear();

      const startDate = new Date(`${selectedYear}-01-01`);
      const endDate = new Date(`${selectedYear}-12-31`);

      return await Holiday.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: 1 });

    } catch (error) {
      throw new Error(`Could not retrieve holidays: ${error.message}`);
    }
  },
};

export default holidayService;
