import mongoose from "mongoose";
const schema = mongoose.Schema;

const surveyData = new schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
  },
  environment: {
    type: Number,
    required: true,
  },
  leadership: {
    type: Number,
    required: true,
  },
  health: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  growth: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feedback = mongoose.model("survey", surveyData);
export default feedback;
