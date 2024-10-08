// Define a map of revenue multipliers for different content providers and categories
const CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE = {
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

// const CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT = {
//   derana: [],
//   "m-center": [],
// };

const CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE = {
  hufFAfM5IDYJmNsYXgY9: {}, // Capital
};

const subscriptionPlans = {
  Monthly: 3,
  "3 Months": 9,
  "6 Months": 18,
  Annual: 36,
};

const SUBSCRIPTION_PLANS_MAP_BY_REGION = {
  Other: subscriptionPlans,
  Australia: subscriptionPlans,
  USA: subscriptionPlans,
  Europe: {
    Monthly: 5,
    "3 Months": 15,
    "6 Months": 30,
    Annual: 60,
  },
};

const PAYMENT_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  APPROVED: "Approved",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  EXPIRED: "Expired",
  ON_HOLD: "On Hold",
  UNDER_REVIEW: "Under Review",
  SCHEDULED: "Scheduled",
  REQUESTED: "Requested",
};

const CategoryIDS = {
  cookeryId : 'GuwGfbcCbwjgtP08b9b1',
  documentaryId : 'NcrWKJaojseTRlRKzdBP',
  currentAffairId : '7xoO9JdoF3rhyRgLVvPK',
  standUpComedyId : 'dUIJHXjgPUp6946pKAd1',
  stageDramaId : 'iB9ehHcq4bF1uHS8E5V1',
  comedyId : 'xn9Mfm6zveaAwBo4JKR4',
  podcastId : 'kZLJRf5HDz8q2C2VDYM0',
  travelId : 'aRQJjvmpgMa0XVNFOrxb',
  teledramaId : 'ORcK1FRasajrrq4gpesR',
  moviesId : '7a3FIJr6wB8UubJgSQkC',
  businessId : 'I2KVNpzu9ByruCEw8xOQ',
  musicId : 'IKmmQc3s6Njhk483tyF6',
  realityShowId : 'dbZ4bxMncb1go7d2xlZt',
  discussionId :'TGTqQXv24eTb2G1w5EmL',
  webSeriesId : '36SErmCtUbHN29JoByFZ',
};

module.exports = {
  CONTENT_PROVIDER_REVENUE_MAP_PER_MOVIE_OR_EPISODE,
  CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT_AND_PERCENTAGE,
  SUBSCRIPTION_PLANS_MAP_BY_REGION,
  PAYMENT_STATUS,
  CategoryIDS,
  // CONTENT_PROVIDER_REVENUE_MAP_BY_SUBSCRIBERS_COUNT,
};
