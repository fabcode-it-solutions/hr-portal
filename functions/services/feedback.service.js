
import Feedback from "../schemas/feedback.schema.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function survey(data) {
  try {
    const { email, environment, leadership, health, salary, growth } = data;
    if (
      !email ||
      !environment ||
      !leadership ||
      !health ||
      !salary ||
      !growth
    ) {
      return { message: "Please provide required fields" };
    }
    const FeedbackData = new Feedback({
      email,
      environment,
      leadership,
      health,
      salary,
      growth,
    });
    const savedData = await FeedbackData.save();
    return { message: "Survey and Feedback data saved Sucessfully", savedData };
  } catch (err) {
    console.log(err);
    return { message: "Error", err };
  }

  // cron.schedule('1 * * * * *', function() {
  //     console.log('running a task every minute');
  //   });
}

export default { survey };
