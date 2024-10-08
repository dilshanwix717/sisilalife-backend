const cron = require("node-cron");
const {
    susilaLifeContentProviderDB: db, susilaLifeContentProviderDB, susilaLifeDB,
} = require("../common/firebaseInit");
const {PAYMENT_STATUS} = require("../common/constants");

const getRequestPayment = async (contentProviderID,selectedMonth) => {
    const revenueContentProviderRef = db.collection("revenue");
    const querySnapshot = await revenueContentProviderRef.get();

    const contentProvidersForRevenue = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        contentProvidersForRevenue.push({ id: doc.id, ...data });
    });

    return contentProvidersForRevenue;
};

async function executeGetRevenueDataByContentProvider(contentProviderID) {
    try {
        const revenueRef = susilaLifeContentProviderDB
            .collection("revenue")
            .doc(contentProviderID);
        const monthlyRevenueSubcollection = revenueRef.collection("monthlyRevenue");

        const querySnapshot = await monthlyRevenueSubcollection.get();

        const data = [];

        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                const docName = doc.id;
                const docData = doc.data();

                data.push({
                    name: docName,
                    data: docData
                });
            } else {
                console.error("Document not found:", doc.id);
            }
        });

        return data;
    } catch (error) {
        console.error("Error executing getRevenueDataByContentProvider", error);
        throw error;
    }
}

async function executeGetAllRevenueData() {
    try {
        const revenueRef = susilaLifeContentProviderDB.collection("revenue")

        const querySnapshot = await revenueRef.get();

        const data = [];

        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                // const docName = doc.id;
                const docData = doc.data();

                data.push({
                    // name: docName,
                    data: docData
                });
            } else {
                console.error("Document not found:", doc.id);
            }
        });
        return data;
    } catch (error) {
        console.error("Error executing executeGetAllRevenueData", error);
        throw error;
    }
}

async function executeGetAllNotificationData() {
    try {
        const notificationRef = susilaLifeContentProviderDB.collection("notifications")

        const querySnapshot = await notificationRef.get();

        const data = [];

        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                // const docName = doc.id;
                const docData = doc.data();

                data.push({
                    // name: docName,
                    data: docData
                });
            } else {
                console.error("Document not found:", doc.id);
            }
        });
        return data;
    } catch (error) {
        console.error("Error executing executeGetAllRevenueData", error);
        throw error;
    }
}

async function executeGetAllSubscriptionData() {
    try {
        const revenueRef = susilaLifeContentProviderDB.collection("subscriptionHistory")

        const querySnapshot = await revenueRef.get();

        const data = [];

        querySnapshot.forEach((doc) => {
            if (doc.exists) {
                // const docName = doc.id;
                const docData = doc.data();

                data.push({
                    // name: docName,
                    data: docData
                });
            } else {
                console.error("Document not found:", doc.id);
            }
        });
        return data;
    } catch (error) {
        console.error("Error executing getAllSubscriptionData", error);
        throw error;
    }
}


async function executeUpdateRequestPayment(contentProviderID, selectedMonth,contentProviderName){
    try {
        const currentDate = new Date();
        const revenueRef = susilaLifeContentProviderDB
            .collection("revenue")
            .doc(contentProviderID);

        const monthlyRevenueSubcollection = revenueRef.collection("monthlyRevenue");

        const currentMonthData = {
            paymentRequestStatus: PAYMENT_STATUS.REQUESTED,
            paymentRequestedDate: currentDate,
        };
        monthlyRevenueSubcollection
            .doc(selectedMonth)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // monthlyRevenueSubcollection
                    //     .doc(selectedMonth)
                    //     .update(currentMonthData)
                    //     .then(() => {
                    //         console.log("Document updated successfully.");
                    //     })
                    //     .catch((error) => {
                    //         console.error("Error creating document:", error);
                    //     });
                    const existingPaymentStatus = doc.data().paymentRequestStatus;
                    if (existingPaymentStatus !== PAYMENT_STATUS.REQUESTED) {
                        monthlyRevenueSubcollection
                            .doc(selectedMonth)
                            .update(currentMonthData)
                            .then(() => {
                                console.log("Document updated successfully.");
                                const adminNotificationsCollection = susilaLifeContentProviderDB.collection("adminNotifications");
                                const adminNotificationData = {
                                    contentProviderID: contentProviderID,
                                    selectedMonth: selectedMonth,
                                    paymentStatus: PAYMENT_STATUS.REQUESTED,
                                    timestamp: currentDate,
                                    message:`${contentProviderName} has requested for the payment of ${selectedMonth}`,
                                    isRead: false,
                                };

                                adminNotificationsCollection.add(adminNotificationData).then((adminNotificationDoc) => {
                                    console.log("Notification document added with ID:", adminNotificationDoc.id);
                                }).catch((error) => {
                                    console.error("Error adding admin notification document:", error);
                                });
                            })
                            .catch((error) => {
                                console.error("Error updating document:", error);
                            });
                    } else {
                        console.log("Payment request status for", selectedMonth, "is already 'Requested'.");
                    }
                } else {
                    console.log("Document for", selectedMonth, "does not exists.");
                }
            })
    } catch (error) {
        console.error("Error updating payment request status: ", error);
    }
}

async function executeChangePaymentRequestStatus(contentProviderID, selectedMonth,paymentStatus,referenceNo) {
  try {
    const currentDate = new Date();
    const revenueRef = susilaLifeContentProviderDB
      .collection("revenue")
      .doc(contentProviderID);

    const monthlyRevenueSubcollection = revenueRef.collection("monthlyRevenue");
      let currentMonthData;
    if (paymentStatus === 'Paid' || paymentStatus === 'Declined' ){
        currentMonthData = {
            paymentRequestStatus: paymentStatus,
            lastPaymentStatusChange: currentDate,
            referenceNumber: referenceNo,
        };
    } else {
        currentMonthData = {
            paymentRequestStatus: paymentStatus,
            lastPaymentStatusChange: currentDate,
        };
    }
    monthlyRevenueSubcollection
      .doc(selectedMonth)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const existingPaymentStatus = doc?.data()?.paymentRequestStatus;
          if (existingPaymentStatus !== paymentStatus) {
            monthlyRevenueSubcollection
              .doc(selectedMonth)
              .update(currentMonthData)
              .then(() => {
                console.log("Document updated successfully.");

                  const notificationsCollection = susilaLifeContentProviderDB.collection("notifications");

                  const notificationData = {
                      contentProviderID: contentProviderID,
                      selectedMonth: selectedMonth,
                      paymentStatus: paymentStatus,
                      referenceNumber: referenceNo,
                      timestamp: currentDate,
                      message:`${selectedMonth} month payment status has been changed to ${paymentStatus}`,
                      messageRead: false,
                  };

                  notificationsCollection.add(notificationData).then((notificationDoc) => {
                      console.log("Notification document added with ID:", notificationDoc.id);
                  }).catch((error) => {
                      console.error("Error adding notification document:", error);
                  });
              })
              .catch((error) => {
                console.error("Error updating document:", error);
              });
          }
        } else {
          console.log("Document for", selectedMonth, "does not exists.");
        }
      })
  } catch (error) {
    console.error("Error updating payment request status: ", error);
  }
}

async function executeGetRevenueAndContentProviderData() {
  try {
    const revenueRef = susilaLifeContentProviderDB.collection("revenue");
    const contentProviderRef = susilaLifeDB.collection("contentProvider");

    // Execute both queries concurrently using Promise.all
    const [revenueSnapshot, contentProviderSnapshot] = await Promise.all([
      revenueRef.get(),
      contentProviderRef.get()
    ]);

    // Process revenue data
    const revenueData = [];
    for (const revenueDoc of revenueSnapshot.docs) {
      const revenueDocData = revenueDoc.data();

      // Fetch data from the "monthlyRevenue" subcollection
      const monthlyRevenueRef = revenueRef.doc(revenueDoc.id).collection("monthlyRevenue");
      const monthlyRevenueSnapshot = await monthlyRevenueRef.get();

      const monthlyRevenueData = [];
      monthlyRevenueSnapshot.forEach((monthlyRevenueDoc) => {
        if (monthlyRevenueDoc.exists) {
          const monthlyRevenueDocData = monthlyRevenueDoc.data();
          monthlyRevenueData.push({
            id: monthlyRevenueDoc.id,
            data: monthlyRevenueDocData
          });
        } else {
          console.error("Document not found in monthlyRevenue subcollection:", monthlyRevenueDoc.id);
        }
      });

      revenueData.push({
        id: revenueDoc.id,
        revenueData: revenueDocData,
        monthlyRevenueData: monthlyRevenueData
      });
    }

    // Process contentProvider data
    const contentProviderData = [];
    contentProviderSnapshot.forEach((contentProviderDoc) => {
      if (contentProviderDoc.exists) {
        const contentProviderDocData = contentProviderDoc.data();
        contentProviderData.push({
          id: contentProviderDoc.id,
          data: contentProviderDocData
        });
      } else {
        console.error("Document not found in contentProvider collection:", contentProviderDoc.id);
      }
    });

    // Combine data based on matching document IDs
    const combinedData = [];
    revenueData.forEach((revenueItem) => {
      console.log('Attempts count')
      const matchingContentProvider = contentProviderData.find(
        (cpItem) => cpItem.id === revenueItem.id
      );

      if (matchingContentProvider) {
        combinedData.push({
          id: revenueItem.id,
          revenueData: revenueItem.revenueData,
          monthlyRevenueData: revenueItem.monthlyRevenueData,
          contentProviderData: matchingContentProvider.data
        });
      }
    });

    return combinedData;
  } catch (error) {
    console.error("Error executing executeGetRevenueAndContentProviderData", error);
    throw error;
  }
}


module.exports = { executeUpdateRequestPayment ,executeGetRevenueDataByContentProvider,executeGetAllRevenueData, executeGetAllSubscriptionData,executeGetRevenueAndContentProviderData, executeChangePaymentRequestStatus,executeGetAllNotificationData};
