import mongoose from "mongoose";
const schema = mongoose.Schema;

const appraisal = new schema({
  email: {
    type: String,
    required: true,
  },
  expectedSalary: {
    type: Number,
    required: true,
  },
  amountOffer: {
    type: String,
  },
  reason: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["approved", "rejected", "hold"],
    default: "hold",
  },
  adminMessage: {
    type: String,
    default: "",
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
const salaryApprasial = mongoose.model("appraisalSchema", appraisal);
export default salaryApprasial;
