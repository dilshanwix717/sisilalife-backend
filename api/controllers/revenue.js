const {
    executeUpdateRequestPayment,
    executeGetRevenueDataByContentProvider, executeGetAllRevenueData, executeGetAllSubscriptionData,
  executeGetRevenueAndContentProviderData, executeChangePaymentRequestStatus, executeGetAllNotificationData
} = require("../services/revenueService");
const { scheduleRevenueCalculationFunc} = require("../Schedules/revenueCalculation");


// const getRevenueDataByContentProvider = async (req,res,next) => {
//     const contentProviderID = req.body.contentProviderID
//     const selectedMonth = req.body.selectedMonth
//     try{
//         const data = await executeGetRevenueDataByContentProvider(
//          contentProviderID,
//          selectedMonth
//         );
//         res.status(200).json(data);
//         console.log(req.body)
//     }
//     catch (error) {
//         // Handle errors gracefully by logging them and returning an error response
//         console.error("Error getting documents:", error);
//         res.status(500).json({
//             status: "500",
//             error: error.message,
//         });
//     }
// }

const getRevenueDataByContentProvider = async (req,res,next) => {
    const contentProviderID = req.body.contentProviderID
    try {
        const data = await executeGetRevenueDataByContentProvider(
            contentProviderID,
        );
        res.status(200).json(data);
        console.log(req.body)
    }
    catch (error) {
        // Handle errors gracefully by logging them and returning an error response
        console.error("Error getting documents:", error);
        res.status(500).json({
            status: "500",
            error: error.message,
        });
    }
}

const getAllRevenueData = async  (req,res,next) => {
    try {
        const data = await executeGetAllRevenueData();
        res.status(200).json(data);
        console.log(req.body)
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status:"500",
            error: error.message,
        });
    }
}

const getAllNotificationData = async  (req,res,next) => {
    try {
        const data = await executeGetAllNotificationData();
        res.status(200).json(data);
        console.log(req.body)
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status:"500",
            error: error.message,
        });
    }
}

const getAllSubscriptionHistory = async  (req,res,next) => {
    try {
        const data = await executeGetAllSubscriptionData();
        res.status(200).json(data);
        console.log(req.body)
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status:"500",
            error: error.message,
        });
    }
}

const getRevenueAndContentProviderData = async  (req,res,next) => {
  // const contentProviderID = req.body.contentProviderID
  try {
    const data = await executeGetRevenueAndContentProviderData();
    console.log('res data revenue =====> ', data)
    res.status(200).json(data);
    console.log(req.body)
  } catch (error) {
    console.error("Error getting documents:", error);
    res.status(500).json({
      status:"500",
      error: error.message,
    });
  }
}

const updateRequestPayment = async (req, res, next) => {
    const contentProviderID = req.body.contentProviderID
    const selectedMonth = req.body.selectedMonth
    const contentProviderName = req.body.contentProviderName
    try {
        const data = await executeUpdateRequestPayment(
            contentProviderID,
            selectedMonth,
            contentProviderName
        );

        res.status(200).json(data);
        console.log(req.body)
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status: "500",
            error: error.message,
        });
    }
};

const changeRequestPaymentStatus = async (req, res, next) => {
  const contentProviderID = req.body.contentProviderID
  const selectedMonth = req.body.selectedMonth
  const paymentStatus = req.body.paymentStatus
  const referenceNo = req.body.referenceNo
  try {
    const data = await executeChangePaymentRequestStatus(
      contentProviderID,
      selectedMonth,
      paymentStatus,
      referenceNo
    );
    res.status(200).json({message: 'SUCCESS'});
    console.log(req.body)
  } catch (error) {
    console.error("Error getting documents:", error);
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

const scheduleRevenueCalculator = async (req, res, next) => {
  try {
      await scheduleRevenueCalculationFunc().then((val) => {
          res.status(200).json({
              message: "success"
          })
      })
  } catch (error) {
      res.status(500).json({
          status: "500",
          error: error.message,
      });
  }
};


// module.exports = getAllInquiries;

module.exports = {
    updateRequestPayment,
    getRevenueDataByContentProvider,
    getAllRevenueData,
    getAllSubscriptionHistory,
    scheduleRevenueCalculator,
    getRevenueAndContentProviderData,
    getAllNotificationData,
    changeRequestPaymentStatus
};
