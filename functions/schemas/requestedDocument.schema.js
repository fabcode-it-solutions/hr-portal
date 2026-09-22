import mongoose from "mongoose";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const documentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  experienceLetterDocment: {
    type: String,
  },

  salarySlipDoucment: {
    type: String,
  },

  otherDocumentsFile:{
    type: String
  },

  experienceLetter: {
    type: Boolean,
    default: false,
  },
  salarySlip: {
    type: Boolean,
    default: false,
  },
  otherDocuments: {
    type : Boolean,
    default: false
  }
  ,
  reason: {
    type: String,
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

const RequestedDocument = mongoose.model("RequestedDocument", documentSchema);

export default RequestedDocument;
