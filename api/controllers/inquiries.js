const {
  executeGetAllInquiries,
  executeSendReplyToInquiry,
} = require("../services/inquiryService");

const { susilaLifeContentProviderDB } = require("../common/firebaseInit");

/**
 * Get a list of all inquiries with pagination support.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves with the list of inquiries or an error response.
 */
const getAllInquiries = async (req, res, next) => {
  // Extract query parameters from the HTTP request
  const page = parseInt(req.query.page) === 0 ? 0 : 1; // Get the page number from the query parameters
  const limit = parseInt(req.query.limit) || 20; // Get the limit from the query parameters
  const nextPageId = req.body.nextPageId || null; // Get the next page ID from the request body

  try {
    // Execute the function to retrieve all inquiries with pagination
    const data = await executeGetAllInquiries({
      pageSize: limit,
      nextPageId: nextPageId,
    });

    // Send a successful response with the retrieved data
    res.status(200).json(data);
  } catch (error) {
    // Handle errors gracefully by logging them and returning an error response
    console.error("Error getting documents:", error);
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

/**
 * Handle sending a reply to an inquiry.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the reply is sent.
 */
const sendReplyToInquiry = async (req, res, next) => {
  // Extract parameters from the HTTP request
  const id = req.query.id; // Get the inquiry ID from the query parameters
  const inquiryMessage = req.body.inquiryMessage; // Get the inquiry message from the request body
  const reply = req.body.reply; // Get the reply message from the request body
  const email = req.body.email;

  try {
    // Execute the function to send the reply to the inquiry
    const data = await executeSendReplyToInquiry({
      email: email,
      inquiryId: id,
      inquiryMessage: inquiryMessage,
      reply: reply,
    });

    // Send a successful response with the data
    res.status(200).json(data);
  } catch (error) {
    // Handle errors by logging and sending an error response
    console.error("Error Sending reply", error);
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

// const testRoute = async (req, res, next) => {
//   console.log(req);
//   const collectionRef = susilaLifeContentProviderDB.collection(
//     "subscriptionHistory"
//   );

//   collectionRef
//     .where("2023-11", "==", true)
//     .get()
//     .then((data) => {
//       console.log(data.size);
//       console.log(data);
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   res.status(200).json("Success");
// };

module.exports = {
  getAllInquiries,
  sendReplyToInquiry,
  // testRoute,
};
