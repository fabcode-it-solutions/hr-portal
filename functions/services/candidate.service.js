import candidateData from "../schemas/candidateRequirement.schema.js";

const candidateService = {
  async addCandidate(candidateInformation) {
    try {
      const {
        interviewDate,
        contactNumber,
        expectedSalary,
        modeOfInterview,
        timing,
        currentCtc,
      } = candidateInformation;

      // Check for required fields
      if (
        !interviewDate ||
        !contactNumber ||
        !expectedSalary ||
        !timing ||
        !currentCtc ||
        !modeOfInterview
      ) {
        return { message: "Please provide required fields" };
      }

      const newCandidate = await candidateData.create(candidateInformation);
      return { message: "Candidate added successfully", newCandidate };
    } catch (error) {
      console.log(error);
      return { message: "Error", error };
    }
  },

  async getCandidatesToNotify() {
    try {
      const currentDate = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

      const candidates = await candidateData.find({
        status: 'hired',
        dateOfJoining: {
          $gte: currentDate.toISOString().split('T')[0], 
          $lte: sevenDaysLater.toISOString().split('T')[0],
        },
      });

      return candidates;
    } catch (error) {
      throw new Error('Error fetching candidates:', error);
    }
  },

}


export default candidateService;
