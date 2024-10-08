const {
  SUBSCRIPTION_PLANS_MAP_BY_REGION,
  PAYMENT_STATUS,
} = require("../common/constants");
const { susilaLifeContentProviderDB } = require("../common/firebaseInit");
const {
  getAllActiveSubscribersCountBySubscriptionPlan,
  fetchContentViewsDataByContentProvider,
} = require("../services/analyticsService");

const REVENUE_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE = {
  hufFAfM5IDYJmNsYXgY9: {},
};

const REVENUE_BY_PER_MOVIE_OR_EPISODE = {
  // Torana
  NpZoGLUTQMkt3jwN3jV0: {
    Movies: 60,
    Teledrama: 10,
  },
  // Thina
  DI5YeTqMad4yS0jrkpTt: {
    Movies: 60,
    Teledrama: 10,
  },
};

/**
 * Calculate revenue based on subscriber counts and subscription plan percentages.
 * @param {Object} countsBySubscriptionPlanMap - A map containing subscriber counts by subscription plan and region.
 * @param {string} contentViewsCollectionName - The name of the content views collection.
 * @param {string} contentProvider - The content provider for which revenue is calculated.
 * @param {Array} responseDocs - An array to store response documents (optional).
 * @param {Array} dateKeysList - An array to store date keys (optional).
 * @returns {Object} An object containing response documents, date keys, and the final monthly revenue.
 */
async function revenueBasedOnSubscribersCountAndPercentage(
  countsBySubscriptionPlanMap,
  contentViewsCollectionName,
  contentProvider,
  responseDocs = [],
  dateKeysList = []
) {
  let finalMonthlyRevenue = 0;

  // Loop through subscription plans and regions
  Object.keys(countsBySubscriptionPlanMap).forEach((subscriptionPlan) => {
    // Check if data is available for the subscription plan
    if (Object.keys(countsBySubscriptionPlanMap[subscriptionPlan]).length > 0) {
      Object.keys(countsBySubscriptionPlanMap[subscriptionPlan]).forEach(
        (region) => {
          const subscriptionCount =
            countsBySubscriptionPlanMap[subscriptionPlan][region];
          const subscriptionAmount =
            SUBSCRIPTION_PLANS_MAP_BY_REGION[region][subscriptionPlan];

          // Calculate final monthly revenue
          finalMonthlyRevenue = 0.3 * subscriptionCount * 1;

          // Log revenue details
          console.log(
            `Plan: ${subscriptionPlan}   |   Region: ${region}   |   Subscription Amount: ${subscriptionAmount}   |   Subscribers Count: ${subscriptionCount}   |   Revenue(per month): $${
              Math.round(finalMonthlyRevenue * 100) / 100
            }`
          );
        }
      );
    }
  });

  // Query Firestore to get content views data for the specified contentProvider
  const { data, dateKeys } = await fetchContentViewsDataByContentProvider(
    contentViewsCollectionName,
    contentProvider
  );

  // Update response documents and date keys
  responseDocs = data;
  dateKeysList = dateKeys;

  // Return response with response documents, date keys, and final monthly revenue
  return { responseDocs, dateKeysList, finalMonthlyRevenue };
}

/**
 * Save monthly revenue data for a content provider.
 * @param {string} contentProviderId - The unique identifier for the content provider.
 * @param {string} currentMonth - The current month in the format "YYYY-MM".
 * @param {number} revenue - The monthly revenue amount.
 */
async function saveRevenue(contentProviderId, currentMonth, revenue) {
  try {
    // Calculate the current date
    const currentDate = new Date();

    // Create a reference to the content provider document
    const revenueRef = susilaLifeContentProviderDB
      .collection("revenue")
      .doc(contentProviderId);

    // Define the monthly revenue subcollection
    const monthlyRevenueSubcollection = revenueRef.collection("monthlyRevenue");

    // Define the data for the current month
    const currentMonthData = {
      revenue: revenue,
      createdDate: currentDate,
      lastUpdated: currentDate,
      paymentRequestStatus: PAYMENT_STATUS.PENDING, // Define PAYMENT_STATUS as needed
      paymentRequestedDate: "",
      referenceNumber: "",
      remarks: "",
      reveiwedBy: "",
      approvedBy: "",
      paidOutAmount: 0,
      pendingAmount: revenue,
    };

    // Use .set() to create or update the document for the current month within the subcollection
    monthlyRevenueSubcollection
      .doc(currentMonth)
      .get()
      .then((doc) => {
        const rootLevelFields = {
          createdAt: currentDate,
          lastUpdated: currentDate,
          lastUpdatedMonth: currentMonth,
        };
        if (doc.exists) {
          console.log("Document for", currentMonth, "already exists.");
        } else {
          monthlyRevenueSubcollection
            .doc(currentMonth)
            .set(currentMonthData, { merge: false })
            .then(() => {
              console.log("Document created successfully.");
              revenueRef.set(rootLevelFields, { merge: true }).then(() => {
                console.log("Added timestamps.");
              });
            })
            .catch((error) => {
              console.error("Error creating document:", error);
            });
        }
      })
      .catch((error) => {});
  } catch (error) {
    console.error("Error creating/updating revenue record:", error);
  }
}

/**
 * Get the last updated revenue month for a specific content provider.
 * @param {Object} options - Options object.
 * @param {string} options.contentProviderId - The unique identifier for the content provider.
 * @returns {Object} An object indicating success and the last updated revenue month.
 *                  - If successful, it returns { success: true, lastUpdatedMonth }.
 *                  - If unsuccessful, it returns { success: false, lastUpdatedMonth: undefined }.
 */
async function getLastUpdatedRevenueMonthForContentProvider({
  contentProviderId,
}) {
  try {
    // Create a reference to the 'revenue' document for the specified content provider.
    const revenueRef = susilaLifeContentProviderDB
      .collection("revenue")
      .doc(contentProviderId);

    // Fetch the document data.
    const value = await revenueRef.get();
    const data = value.data();

    // Extract the last updated month, or set it to undefined if not available.
    const lastUpdatedMonth = data?.lastUpdatedMonth || undefined;

    // Return a success response with the last updated month if available.
    return lastUpdatedMonth
      ? { success: true, lastUpdatedMonth }
      : { success: false, lastUpdatedMonth: undefined };
  } catch (error) {
    // Handle errors and log them.
    console.error("Error fetching last updated revenue month:", error);

    // Return a failure response with lastUpdatedMonth set to undefined.
    return { success: false, lastUpdatedMonth: undefined };
  }
}

async function calculateRevenueByContentProviderId(contentProviderId) {
  // return;

  const contentViewsCollectionName = "contentViews";
  const currentDateMonth = new Date().toISOString().slice(0, 7);

  //   await getLastUpdatedRevenueMonthForContentProvider({
  //     contentProviderId: contentProviderId,
  //   });

  // fetching all the subscribers count
  let countsBySubscriptionPlanMap = {};
  let totalActiveSubscribersCount;
  if (
    REVENUE_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
      contentProviderId
    )
  ) {
    countsBySubscriptionPlanMap =
      await getAllActiveSubscribersCountBySubscriptionPlan();
    totalActiveSubscribersCount = Object.values(
      countsBySubscriptionPlanMap
    ).reduce((acc, val) => acc + val, 0);
  }

  // // ! case 1 - Torana, Thina
  if (REVENUE_BY_PER_MOVIE_OR_EPISODE.hasOwnProperty(contentProviderId)) {

    console.log("Inside of the torana provider ===> ", contentProviderId)
    // Query Firestore to get content views data for the specified contentProvider
    const { data } = await fetchContentViewsDataByContentProvider(
      contentViewsCollectionName,
      contentProviderId,
      true
    );

    const revenueByDateTotalMap = {}; // {2023-10: 360, 2023-09: 360, 2023-08: 60}

    if (data && data.length > 0) {
      data.forEach((item) => {
        const revenueByDate = item.revenueByDate;

        for (const date in revenueByDate) {
          if (revenueByDateTotalMap[date]) {
            revenueByDateTotalMap[date] += revenueByDate[date];
          } else {
            revenueByDateTotalMap[date] = revenueByDate[date];
          }
        }
      });
    }

    const sortedEntries = Object.entries(revenueByDateTotalMap).sort(
      ([key1], [key2]) => key1.localeCompare(key2)
    );

    console.log("sorted entries ====> ", sortedEntries)

    for (const [currentItemDate, value] of sortedEntries) {
      if (currentItemDate <= currentDateMonth) {
        console.log("inside of the revenue cals")
        await saveRevenue(contentProviderId, currentItemDate, value);
      }
    }
  }

  // ! case 2 - Capital
  if (
    REVENUE_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
      contentProviderId
    )
  ) {
    // write the new code here to claculate and save the monlty revenue for each content provider based on active subscriptions
    const currentDate = new Date();
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const collectionRef = susilaLifeContentProviderDB.collection(
      "subscriptionHistory"
    );

    collectionRef
      .where(currentDate.toISOString().slice(0, 7), "==", true)
      .get()
      .then(async (data) => {
        console.log(data);
        if (data.size > 0) {
          const finalMonthlyRevenue = 0.3 * data.size * 1;
          await saveRevenue(
            contentProviderId,
            currentDate.toISOString().slice(0, 7),
            finalMonthlyRevenue
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(currentDate);

    // console.log(contentProviderId);
    // const { finalMonthlyRevenue } =
    //   await revenueBasedOnSubscribersCountAndPercentage(
    //     countsBySubscriptionPlanMap,
    //     contentViewsCollectionName,
    //     contentProviderId
    //   );

    // save the finalMonthlyRevenue
    if (currentDate.getDate() === lastDayOfMonth)
      await saveRevenue(
        contentProviderId,
        currentDate.toISOString().slice(0, 7),
        finalMonthlyRevenue
      );
  }

  // For derana and m-entertainment the develpemtn is pending - no data in the contentProvider collection
}

module.exports = { calculateRevenueByContentProviderId };
