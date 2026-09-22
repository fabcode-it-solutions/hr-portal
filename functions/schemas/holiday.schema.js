import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  holidayName: {
    type: String,
    required: true,
  },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
