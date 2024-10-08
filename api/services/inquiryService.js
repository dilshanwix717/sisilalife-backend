const {
  susilaLifeDB,
  susilaLifeFirebaseApp,
} = require("../common/firebaseInit");
const { sendInquiryReplyEmail } = require("../utils/email");

const paginateData = async ({
  db,
  collectionName,
  pageSize,
  startAfterDocId,
  endBeforeDocId,
}) => {
  let query = db.collection(collectionName);

  // Apply a WHERE clause if a document ID is provided
  if (startAfterDocId) {
    query = query.startAfter(startAfterDocId);
  } else if (endBeforeDocId) {
    query = query.endBefore(endBeforeDocId);
  }

  // Query for the next page of data
  const snapshot = await query.limit(pageSize).get();

  const data = [];
  snapshot.forEach((doc) => {
    const docData = doc.data();
    // Optionally, add the document ID to the data
    docData.id = doc.id;
    data.push(docData);
  });

  // Determine if there is a next page
  let nextPage = null;
  if (snapshot.size === pageSize) {
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    nextPage = lastDoc.id;
  }

  // Determine if there is a previous page
  let prevPage = null;
  if (startAfterDocId) {
    prevPage = startAfterDocId;
  } else if (endBeforeDocId) {
    prevPage = endBeforeDocId;
  }

  return { data, nextPage, prevPage };
};

// // useage of the above function
// (async () => {
//     const pageSize = 10;
//     const nextPage = null; // Provide the last document ID of the previous page if applicable
//     const prevPage = null; // Provide the first document ID of the previous page if applicable

//     try {
//       const { data, nextPage, prevPage } = await paginateData(
//         "yourCollection",
//         pageSize,
//         nextPage,
//         prevPage
//       );

//       // Use the retrieved data
//       console.log("Data:", data);

//       // Handle pagination navigation (nextPage and prevPage)
//       console.log("Next Page:", nextPage);
//       console.log("Previous Page:", prevPage);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   })();
/**
 * Execute the process of retrieving a list of inquiries with pagination support.
 *
 * @param {Object} params - The parameters for the operation.
 * @param {number} params.pageSize - The number of items per page (default is 5).
 * @param {string|null} params.nextPageId - The ID of the last document from the previous page (if applicable).
 * @param {string|null} params.previousPageId - The ID of the first document from the previous page (if applicable).
 * @returns {Promise<Object>} - A Promise that resolves with an object containing the retrieved data, next page ID, and previous page ID.
 */
const executeGetAllInquiries = async ({
  pageSize = 5,
  nextPageId,
  previousPageId,
}) => {
  const nP = nextPageId; // Provide the last document ID of the previous page if applicable
  const pP = previousPageId; // Provide the first document ID of the previous page if applicable

  try {
    // Execute the function to paginate data and retrieve inquiries
    const { data, nextPage, prevPage } = await paginateData({
      db: susilaLifeDB,
      collectionName: "inquiry",
      pageSize: pageSize,
      startAfterDocId: nP,
      endBeforeDocId: pP,
    });

    return { data, nextPage, prevPage }; // Return the retrieved data and pagination information
  } catch (error) {
    console.error("Error executing getAllInquiries:", error);
    return {}; // Return an empty object in case of an error
  }
};

/**
 * Execute the process of sending a reply to an inquiry and updating the corresponding document.
 *
 * @param {Object} params - The parameters for the operation.
 * @param {string} params.inquiryId - The ID of the inquiry document.
 * @param {string} params.inquiryMessage - The inquiry message.
 * @param {string} params.reply - The reply message.
 * @returns {Promise<boolean>} - A Promise that resolves with `true` on success or `false` on failure.
 */
const executeSendReplyToInquiry = async ({
  email,
  inquiryId,
  inquiryMessage,
  reply,
}) => {
  try {
    // Get a reference to the inquiry document
    const inquiryRef = susilaLifeDB.collection("inquiry").doc(inquiryId);

    // Send an email notification with the inquiry message and reply
    await sendInquiryReplyEmail(email, inquiryMessage, reply);

    // Update the document with the reply field
    await inquiryRef.update({ reply: reply });

    console.log("Document successfully updated with reply:", reply);

    return true; // Operation completed successfully
  } catch (error) {
    console.error("Error executing sendReplyToInquiry:", error);
    return false; // Operation failed
  }
};

module.exports = { executeGetAllInquiries, executeSendReplyToInquiry };
