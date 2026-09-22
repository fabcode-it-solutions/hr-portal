import appraisalSchema from "../schemas/appraisalSchema.js";
import User from "../schemas/user.schema.js";
import RequestedDocument from "../schemas/requestedDocument.schema.js";

const appraisalService = {
  async createAppraisal(email, expectedSalary, reason, action) {
    try {
      const existingApprasial = await appraisalSchema.findOne({ email });
      if (existingApprasial) {
        await appraisalSchema.findOneAndDelete({ email });
      }

      const newAppraisal = new appraisalSchema({
        email,
        expectedSalary,
        reason,
        action,
      });

      const savedAppraisal = await newAppraisal.save();
      return savedAppraisal;
    } catch (error) {
      throw new Error(`Could not create appraisal: ${error.message}`);
    }
  },

  async updateAppraisal({
    email,
    action,
    amountOffer,
    adminMessage,
    createdAt,
  }) {
    try {
      const updatedAppraisal = await appraisalSchema.findOneAndUpdate(
        { email },

        { action, createdAt, amountOffer, adminMessage, updatedAt: Date.now() },
        { new: true },
      );
      await User.findOneAndUpdate(
        { email },
        { salary: amountOffer },
        { new: true },
      );
      if (!updatedAppraisal) {
        throw new Error("Appraisal not found");
      }

      return updatedAppraisal;
    } catch (error) {
      throw new Error(`Could not update appraisal: ${error.message}`);
    }
  },

  async requestDocuments(
    email,
    experienceLetter,
    reason,
    salarySlip,
    otherDocuments,
  ) {
    try {
      const existingDocument = await RequestedDocument.findOne({ email });

      if (existingDocument) {
        await RequestedDocument.findOneAndDelete({ email });
      }

      const newDocument = new RequestedDocument({
        email,
        experienceLetter,
        reason,
        salarySlip,
        otherDocuments,
      });

      // Save the new document
      const savedDocument = await newDocument.save();
      return savedDocument;
    } catch (error) {
      throw new Error(`Could not create document: ${error.message}`);
    }
  },

  async uploadExperienceLetter(email, filePath) {
    try {
      await RequestedDocument.findOneAndUpdate(
        { email },
        { experienceLetterDocment: filePath, experienceLetter: true },
        { new: true },
      );
    } catch (error) {
      throw new Error("Error uploading experience letter document");
    }
  },

  async uploadOtherDocuments(email, filePath) {
    try {
      await RequestedDocument.findOneAndUpdate(
        { email },
        { otherDocumentsFile: filePath, otherDocuments: true },
        { new: true },
      );
    } catch (error) {
      throw new Error("Error uploading other document");
    }
  },

  async uploadSalarySlip(email, filePath) {
    try {
      await RequestedDocument.findOneAndUpdate(
        { email },
        { salarySlipDoucment: filePath, salarySlip: true },
        { new: true },
      );
    } catch (error) {
      throw new Error("Error uploading salary slip document");
    }
  },

  async getAllRequestedDocuments() {
    try {
      const allRequestedDocuments = await RequestedDocument.find().sort({
        createdAt: -1,
      });
      return allRequestedDocuments;
    } catch (error) {
      throw new Error(`Could not fetch appraisals: ${error.message}`);
    }
  },

  async getRequestedDocumentsByEmail(email) {
    try {
      const requestDocuments = await RequestedDocument.findOne({
        email: email,
      });
      return requestDocuments;
    } catch (error) {
      throw new Error(`Could not fetch requested documents: ${error.message}`);
    }
  },

  async getAllAppraisals() {
    try {
      const allAppraisals = await appraisalSchema
        .find()
        .sort({ createdAt: -1 });
      return allAppraisals;
    } catch (error) {
      throw new Error(`Could not fetch appraisals: ${error.message}`);
    }
  },

  async getCurrentSalaryByEmail(email) {
    try {
      const currentSalary = await User.findOne(
        { email: email },
        { salary: 1, _id: 0 },
      );
      return currentSalary ? { salary: currentSalary.salary } : null;
    } catch (error) {
      throw new Error(`Could not find appraisal action: ${error.message}`);
    }
  },

  async getAppraisalByEmail(email) {
    try {
      const appraisalData = await appraisalSchema.find({ email: email });
      return appraisalData.length > 0 ? appraisalData : null;
    } catch (error) {
      throw new Error(`Could not find appraisal data: ${error.message}`);
    }
  },
};

export default appraisalService;
