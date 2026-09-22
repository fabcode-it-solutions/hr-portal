import mongoose from "mongoose";
const schema = mongoose.Schema;

const candidateRequirement = new schema({
  name: {
    type: String,
    required: true,
  },

  interviewDate: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  timing: {
    type: String,
  },
  currentCtc: {
    type: String,
  },
  expectedSalary: {
    type: String,
    required: true,
  },
  modeOfInterview: {
    type: String,
    required: true,
  },
  interviewFeedBack: {
    type: String,
  },
  dateOfJoining: {
    type: String,
  },
  salaryOffered: {
    type: String,
  },
  status: {
    type : String
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

const candidateData = mongoose.model( "candidateRequirement", candidateRequirement
);
export default candidateData;
