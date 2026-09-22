// linkedinService.js
import axios from "axios";

async function postOnLinkedIn(data) {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.linkedin.com/v2/ugcPosts",
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINKEDINTOKEN}`, // Replace with your LinkedIn access token
        // Add other required headers here
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default { postOnLinkedIn };
