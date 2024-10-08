const {
  CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE,
  CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE,
  SUBSCRIPTION_PLANS_MAP_BY_REGION,
} = require("../common/constants");
const { susilaLifeDB } = require("../common/firebaseInit");

/**
 * Fetches content views data for a specific content provider.
 * @param {string} contentViewsCollectionName - The name of the collection containing content views data.
 * @param {string} contentProvider - The content provider's identifier.
 * @param {boolean} isAppendRevenue - Indicates whether to calculate and append revenue data.
 * @returns {Array} - An array of content views data with optional revenue information.
 */
async function fetchContentViewsDataByContentProvider(
  contentViewsCollectionName,
  contentProvider,
  isAppendRevenue
) {
  let responseDocs = [];

  // Query the database to fetch content views data for the specified content provider
  const snapshot = await susilaLifeDB
    .collection(contentViewsCollectionName)
    .where("contentProvider", "==", contentProvider)
    .get();

  // Process each document in the snapshot
  responseDocs = snapshot.docs.map((doc) => {
    const data = doc.data();
    const category = data["category"];
    const viewsCount = calculateViewsCount(data);
    const { dateCounts, totalViewCount, revenueByDate } =
      calculateViewsCountByDate(data);

    let revenue = 0;

    if (isAppendRevenue) {
      // Calculate revenue for each record
      revenue = calculateRevenueByCategoryAndViewsCount(
        contentProvider,
        category,
        viewsCount
      );
    }

    const dateKeys = filterDateKeysByPattern(data);

    return {
      id: doc.id,
      ...data,
      viewsCounts: totalViewCount,
      revenue: revenue,
      dateKeys: dateKeys,
      dateCounts: dateCounts,
      revenueByDate: revenueByDate,
      // totalCount: totalCount,
    };
  });

  const uniqueDateKeys = [
    ...new Set(responseDocs.flatMap((item) => item.dateKeys)),
  ];

  return { data: responseDocs, dateKeys: uniqueDateKeys };
}

/**
 * Calculates the total views count from a data object.
 * @param {Object} data - The data object containing views data.
 * @returns {number} - The total views count.
 */
function calculateViewsCount(data) {
  return Object.keys(data).reduce((count, key) => {
    // Check if the key represents a date (e.g., "2023-08", "2023-07")
    if (/^\d{4}-\d{2}$/.test(key)) {
      // Count the number of elements in the list associated with this key
      count += data[key].length;
    }
    return count;
  }, 0);
}

/**
 * Calculate the views count by date and the total views count for a data object.
 * @param {Object} data - The data object containing date keys and associated lists.
 * @returns {Object} - An object with two properties:
 *   - dateCounts: A map with date keys as keys and views counts by date as values.
 *   - totalViewCount: The total views count across all dates.
 */
function calculateViewsCountByDate(data) {
  // Initialize an empty object to store the views count for each date.
  const dateCounts = {};
  const revenueByDate = {};

  // Initialize a variable to keep track of the total views count.
  let totalViewCount = 0;

  // Iterate through the keys of the data object.
  Object.keys(data).forEach((key) => {
    // Check if the key represents a date in the "YYYY-MM" format.
    if (/^\d{4}-\d{2}$/.test(key)) {
      // Calculate the views count by counting the number of elements in the list.
      const viewsCount = data[key].length;

      // Store the views count for the date in the dateCounts object.
      dateCounts[key] = viewsCount;

      // Add the views count to the total count.
      totalViewCount += viewsCount;

      const revenue = calculateRevenueByCategoryAndViewsCount(
        data.contentProvider,
        data.category,
        viewsCount
      );
      revenueByDate[key] = revenue;
    }
  });

  // Return an object with both the views counts by date and the total count.
  return {
    dateCounts,
    totalViewCount,
    revenueByDate,
  };
}

/**
 * Calculate revenue based on content provider, category, and views count.
 *
 * @param {string} contentProvider - The ID of the content provider.
 * @param {string} category - The category of the content (e.g., "Movies" or "Teledrama").
 * @param {number} viewsCount - The number of views for the content.
 * @returns {object} - An object containing the calculated revenue.
 */
function calculateRevenueByCategoryAndViewsCount(
  contentProvider,
  category,
  viewsCount
) {
  let revenue = 0;

  // Check if the content provider and category exist in the revenue map
  if (
    CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE.hasOwnProperty(
      contentProvider
    ) &&
    CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE[
      contentProvider
    ].hasOwnProperty(category)
  ) {
    // // Calculate revenue using the multiplier from the map
    const revenueMultiplier =
      CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE[contentProvider][
        category
      ];
    revenue = viewsCount * revenueMultiplier;
  }

  // Return the calculated revenue as an object
  return revenue;
}

/**
 * Fetches the count of active subscribers by subscription plan and region.
 * @returns {Promise} A promise that resolves to an object containing counts
 *                    by subscription plan and region.
 */
const getAllActiveSubscribersCountBySubscriptionPlan = async () => {
  const usersCollection = susilaLifeDB.collection("users"); // Assuming susilaLifeDB is defined elsewhere

  // Object to store the counts for each subscription plan and region
  const countsBySubscriptionPlanAndRegion = {};

  try {
    const subscriptionPlans = ["Monthly", "3 Months", "6 Months", "Annual"]; // Add more plans as needed

    // Create a promise for each subscription plan count
    const countPromises = subscriptionPlans.map(async (plan) => {
      try {
        // Query users where subscription[0].status === true and subscriptionPlan matches
        const querySnapshot = await usersCollection
          .where("subscriptionInfo.status", "==", true)
          .where("subscriptionInfo.subscriptionPlan", "==", plan)
          .get();

        // Initialize counts for this subscription plan
        const countsByRegion = {};

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const region = userData.region; // Assuming region is a field in your user data

          if (region) {
            // Increment count for the region
            countsByRegion[region] = (countsByRegion[region] || 0) + 1;
          }
        });

        countsBySubscriptionPlanAndRegion[plan] = countsByRegion;
      } catch (error) {
        console.error(`Error counting users for ${plan}:`, error);
      }
    });

    // Wait for all countPromises to complete
    await Promise.all(countPromises)
      .then(() => {
        console.log(
          "Counts by Subscription Plan and Region:",
          countsBySubscriptionPlanAndRegion
        );
        return countsBySubscriptionPlanAndRegion;
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });
  } catch (error) {
    console.error("Error:", error);
  }

  return countsBySubscriptionPlanAndRegion; // Return the counts by subscription plan and region
};

/**
 * Filters keys of an object to select only those that match the YYYY-MM pattern.
 * @param {Object} data - The object containing keys to filter.
 * @returns {Array} - An array of keys that match the YYYY-MM pattern.
 */
function filterDateKeysByPattern(data) {
  // Get all keys of the input object, then filter them based on the YYYY-MM pattern.
  return Object.keys(data).filter((key) => key.match(/^\d{4}-\d{2}$/));
}

module.exports = {
  fetchContentViewsDataByContentProvider,
  calculateViewsCount,
  calculateViewsCountByDate,
  calculateRevenueByCategoryAndViewsCount,
  getAllActiveSubscribersCountBySubscriptionPlan,
  filterDateKeysByPattern,
};
