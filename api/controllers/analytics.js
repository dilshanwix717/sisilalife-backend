// const admin = require("firebase-admin");
// const db = admin.firestore();
const {
  CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE,
  CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE,
  SUBSCRIPTION_PLANS_MAP_BY_REGION,
} = require("../common/constants");
const { susilaLifeDB } = require("../common/firebaseInit");
const {
  getAllActiveSubscribersCountBySubscriptionPlan,
  fetchContentViewsDataByContentProvider,
} = require("../services/analyticsService");

/**
 * Get analytics data for a specific content provider with optional pagination support.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.getAnalyticsData = async (req, res, next) => {
  // Extract request parameters
  const contentProvider = req.query.contentProviderId;
  const lastDocumentId = req.body.lastDocumentId;
  const firstDocumentId = req.body.firstDocumentId;
  const goToPageDocumentId = req.body.goToPageDocumentId;
  const page = parseInt(req.query.page) === 0 ? 0 : 1;
  const limit = parseInt(req.query.limit) || 20;
  const collectionName = "analysis";
  const contentViewsCollectionName = "contentViews";
  let countsBySubscriptionPlanMap = {};
  let totalActiveSubscribersCount;
  let responseDocs = [];
  let dateKeysList = [];
  let revenueByDate = {};

  // Check if contentProvider is provided in the request
  if (!contentProvider) {
    res.status(404).json({
      status: "INVALID_CONTENT_PROVIDER",
    });
    return; // Exit early if contentProvider is missing
  }

  try {
    // Early fetch the subscribers count
    if (
      CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
        contentProvider
      ) ||
      CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
        contentProvider
      )
    ) {
      countsBySubscriptionPlanMap =
        await getAllActiveSubscribersCountBySubscriptionPlan();
      totalActiveSubscribersCount = Object.values(
        countsBySubscriptionPlanMap
      ).reduce((acc, val) => acc + val, 0);
    }

    // ! case 1 - Torana, Thina
    if (
      CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE.hasOwnProperty(
        contentProvider
      )
    ) {
      // Query Firestore to get content views data for the specified contentProvider
      const { data, dateKeys } = await fetchContentViewsDataByContentProvider(
        contentViewsCollectionName,
        contentProvider,
        true
      );
      responseDocs = data;
      dateKeysList = dateKeys;
    }
    // ! case 2 - Capital
    else if (
      CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
        contentProvider
      )
    ) {
      let finalMonthlyRevenue = 0;
      Object.keys(countsBySubscriptionPlanMap).map((subscriptionPlan) => {
        // ! if monthly and regional data is also available
        if (
          Object.keys(countsBySubscriptionPlanMap[subscriptionPlan]).length > 0
        ) {
          Object.keys(countsBySubscriptionPlanMap[subscriptionPlan]).map(
            (region) => {
              const subscriptionCount =
                countsBySubscriptionPlanMap[subscriptionPlan][region];
              const subscriptionAmount =
                SUBSCRIPTION_PLANS_MAP_BY_REGION[region][subscriptionPlan];

              finalMonthlyRevenue = 0.3 * subscriptionCount * 1;

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
      responseDocs = data;
      dateKeysList = dateKeys;

      // Respond with the processed data
      res.status(200).json({
        docs: responseDocs,
        finalMonthlyRevenue: finalMonthlyRevenue,
        dateKeysList: dateKeysList,
      });
      return;
    }
    // ! Case 3 -> Derana, M Center
    else if (
      CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE.hasOwnProperty(
        contentProvider
      )
    ) {
      let finalMonthlyRevenue = 0;
      // Query Firestore to get content views data for the specified contentProvider
      const { data, dateKeys } = await fetchContentViewsDataByContentProvider(
        contentViewsCollectionName,
        contentProvider
      );
      responseDocs = data;
      dateKeysList = dateKeys;

      finalMonthlyRevenue = totalActiveSubscribersCount * 60;

      // Respond with the processed data
      res.status(200).json({
        docs: responseDocs,
        finalMonthlyRevenue: finalMonthlyRevenue,
        dateKeysList: dateKeysList,
      });
      return;
    }

    // Respond with the processed data
    res.status(200).json({ docs: responseDocs, dateKeysList: dateKeysList });
  } catch (error) {
    // Handle errors gracefully by logging them and returning an error response
    console.error("Error getting documents:", error);
    res.status(500).json({
      status: "ERROR",
      error: error.message,
    });
  }
};
