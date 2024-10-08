const admin = require("firebase-admin");
const credentials = require("../../susila-life-test-firebase-adminsdk-3eph5-f70f6ab24a.json");
const cron = require("node-cron");
const {
  susilaLifeDB: db,
  susilaLifeContentProviderDB: db2,
} = require("../common/firebaseInit");
// const firstFirebaseApp = admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// });

// const admin2 = require("firebase-admin");
// const credentials2 = require("../  -firebase-adminsdk-qh35i-3f042d0fb5.json");
// const secondFirebaseApp = admin2.initializeApp({
//     credential: admin2.credential.cert(credentials2),
// }, 'Content-Provider-Test1');

// const db = admin.firestore();
// const db2 = secondFirebaseApp.firestore();
// let dailyCount = 0;

cron.schedule("0 0 * * *", async function () {
  try {
    const snapshot = await db.collection("content").get();
    const docs = snapshot.docs;
    console.log("content count", docs.length);
    let count = 0;
    for (const doc of docs) {
      const data = doc.data();
      const newData = {
        id: data.id,
        viewsCount: data.viewsCount ? data.viewsCount : 0,
        contentProvider: data.contentProvider ? data.contentProvider : null,
        category: data.category,
        musicType: data.musicType ? data.musicType : null,
        subcategory: data.subcategory,
        musicVideoSeries: data.musicVideoSeries ? data.musicVideoSeries : null,
        title: data.title ? data.title : null,
        episode: data.episode ? data.episode : null,
        isMusicVideoSeries: data.isMusicVideoSeries
          ? data.isMusicVideoSeries
          : null,
      };
      if (newData.id) {
        //database1
        const existingDoc = db.collection("analysis").doc(newData.id);
        const documentData = await existingDoc.get();
        console.log("existing data ====> ", documentData.id);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const startViewCount = documentData.exists
          ? documentData.data().viewsCount
          : 0;
        const endViewCount = newData.viewsCount;
        const totalViewCountForTheDay = endViewCount - startViewCount;
        const TotalViewCountUptoNow = startViewCount + totalViewCountForTheDay;
        const updateData = {
          Start: startViewCount,
          End: endViewCount,
          TotalPerDay: totalViewCountForTheDay,
          TotalViewCountUptoNow: TotalViewCountUptoNow,
        };

        //database2
        const existingDoc2 = db2.collection("analysis").doc(newData.id);
        const documentData2 = await existingDoc2.get();
        console.log("existing data ====> ", documentData2.id);
        // const year = new Date().getFullYear();
        // const month = new Date().getMonth() + 1;
        // const date = new Date().getDate();
        const startViewCount2 = documentData2.exists
          ? documentData2.data().viewsCount
          : 0;
        const endViewCount2 = newData.viewsCount;
        const totalViewCountForTheDay2 = endViewCount2 - startViewCount2;
        const TotalViewCountUptoNow2 =
          startViewCount2 + totalViewCountForTheDay2;
        const updateData2 = {
          Start: startViewCount2,
          End: endViewCount2,
          TotalPerDay: totalViewCountForTheDay2,
          TotalViewCountUptoNow: TotalViewCountUptoNow2,
        };

        // if (documentData.exists) {
        //     await db.collection('analysis').doc(newData.id).update({
        //         timestamp: admin.firestore.FieldValue.serverTimestamp(),
        //         viewsCount: newData.viewsCount ? newData.viewsCount : null,
        //         [`${year}-${month}-${date}`]: updateData
        //     });
        // }
        if (documentData2.exists) {
          await db2
            .collection("analysis")
            .doc(newData.id)
            .update({
              timestamp: admin2.firestore.FieldValue.serverTimestamp(),
              viewsCount: newData.viewsCount ? newData.viewsCount : 0,
              [`${year}-${month}`]: updateData2,
            });
        } else {
          // Create a new document
          // await db.collection('analysis').doc(newData.id).set({
          //     timestamp: admin.firestore.FieldValue.serverTimestamp(),
          //     id: newData.id,
          //     viewsCount: newData.viewsCount ? newData.viewsCount : null,
          //     thisMonth:new Date().getMonth(),
          //     [`${year}-${month}-${date}`]: updateData,
          //     contentProvider:newData.contentProvider ? newData.contentProvider : null,
          //     category: newData.category,
          //     musicType: newData.musicType ? newData.musicType : null,
          //     subcategory: newData.subcategory,
          //     musicVideoSeries : newData.musicVideoSeries ? newData.musicVideoSeries : null,
          //     title:newData.title ? newData.title : null,
          //     episode: newData.episode ? newData.episode : null,
          //     isMusicVideoSeries:data.isMusicVideoSeries ? data.isMusicVideoSeries : null,
          // });

          await db2
            .collection("analysis")
            .doc(newData.id)
            .set({
              timestamp: admin2.firestore.FieldValue.serverTimestamp(),
              id: newData.id,
              viewsCount: newData.viewsCount ? newData.viewsCount : 0,
              thisMonth: new Date().getMonth(),
              [`${year}-${month}`]: updateData2,
              contentProvider: newData.contentProvider
                ? newData.contentProvider
                : null,
              category: newData.category,
              musicType: newData.musicType ? newData.musicType : null,
              subcategory: newData.subcategory,
              musicVideoSeries: newData.musicVideoSeries
                ? newData.musicVideoSeries
                : null,
              title: newData.title ? newData.title : null,
              episode: newData.episode ? newData.episode : null,
              isMusicVideoSeries: data.isMusicVideoSeries
                ? data.isMusicVideoSeries
                : null,
            });

          console.log("Count number==>", count);
        }
        count = count + 1;
      } else {
        console.error("Invalid document ID");
      }
    }
    console.log("Count number==>", count);
    console.log("Documents successfully updated!");
    dailyCount = dailyCount + 1;
  } catch (error) {
    console.error("Error updating documents: ", error);
  }
  console.log("Day Count ==>", dailyCount);
});

exports.UpdateViewCounts = async (req, res, next) => {
  try {
    const snapshot = await db.collection("content").get();
    const docs = snapshot.docs;
    console.log("content count", docs.length);
    let count = 0;
    for (const doc of docs) {
      const data = doc.data();
      const newData = {
        id: data.id,
        viewsCount: data.viewsCount ? data.viewsCount : 0,
        contentProvider: data.contentProvider ? data.contentProvider : null,
        category: data.category,
        musicType: data.musicType ? data.musicType : null,
        subcategory: data.subcategory,
        musicVideoSeries: data.musicVideoSeries ? data.musicVideoSeries : null,
        title: data.title ? data.title : null,
        episode: data.episode ? data.episode : null,
        isMusicVideoSeries: data.isMusicVideoSeries
          ? data.isMusicVideoSeries
          : null,
      };
      if (newData.id) {
        //database1
        const existingDoc = db.collection("analysis").doc(newData.id);
        const documentData = await existingDoc.get();
        console.log("existing data ====> ", documentData.id);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const startViewCount = documentData.exists
          ? documentData.data().viewsCount
          : 0;
        const endViewCount = newData.viewsCount;
        const totalViewCountForTheDay = endViewCount - startViewCount;
        const TotalViewCountUptoNow = startViewCount + totalViewCountForTheDay;
        const updateData = {
          Start: startViewCount,
          End: endViewCount,
          TotalPerDay: totalViewCountForTheDay,
          TotalViewCountUptoNow: TotalViewCountUptoNow,
        };

        //database2
        const existingDoc2 = db2.collection("analysis").doc(newData.id);
        const documentData2 = await existingDoc2.get();
        console.log("existing data ====> ", documentData2.id);
        // const year = new Date().getFullYear();
        // const month = new Date().getMonth() + 1;
        // const date = new Date().getDate();
        const startViewCount2 = documentData2.exists
          ? documentData2.data().viewsCount
          : 0;
        const endViewCount2 = newData.viewsCount;
        const totalViewCountForTheDay2 = endViewCount2 - startViewCount2;
        const TotalViewCountUptoNow2 =
          startViewCount2 + totalViewCountForTheDay2;
        const updateData2 = {
          Start: startViewCount2,
          End: endViewCount2,
          TotalPerDay: totalViewCountForTheDay2,
          TotalViewCountUptoNow: TotalViewCountUptoNow2,
        };

        // if (documentData.exists) {
        //     await db.collection('analysis').doc(newData.id).update({
        //         timestamp: admin.firestore.FieldValue.serverTimestamp(),
        //         viewsCount: newData.viewsCount ? newData.viewsCount : null,
        //         [`${year}-${month}-${date}`]: updateData
        //     });
        // }
        if (documentData2.exists) {
          await db2
            .collection("analysis")
            .doc(newData.id)
            .update({
              timestamp: admin2.firestore.FieldValue.serverTimestamp(),
              viewsCount: newData.viewsCount ? newData.viewsCount : 0,
              [`${year}-${month}`]: updateData2,
            });
        } else {
          // Create a new document
          // await db.collection('analysis').doc(newData.id).set({
          //     timestamp: admin.firestore.FieldValue.serverTimestamp(),
          //     id: newData.id,
          //     viewsCount: newData.viewsCount ? newData.viewsCount : null,
          //     thisMonth:new Date().getMonth(),
          //     [`${year}-${month}-${date}`]: updateData,
          //     contentProvider:newData.contentProvider ? newData.contentProvider : null,
          //     category: newData.category,
          //     musicType: newData.musicType ? newData.musicType : null,
          //     subcategory: newData.subcategory,
          //     musicVideoSeries : newData.musicVideoSeries ? newData.musicVideoSeries : null,
          //     title:newData.title ? newData.title : null,
          //     episode: newData.episode ? newData.episode : null,
          //     isMusicVideoSeries:data.isMusicVideoSeries ? data.isMusicVideoSeries : null,
          // });

          await db2
            .collection("analysis")
            .doc(newData.id)
            .set({
              timestamp: admin2.firestore.FieldValue.serverTimestamp(),
              id: newData.id,
              viewsCount: newData.viewsCount ? newData.viewsCount : 0,
              thisMonth: new Date().getMonth(),
              [`${year}-${month}`]: updateData2,
              contentProvider: newData.contentProvider
                ? newData.contentProvider
                : null,
              category: newData.category,
              musicType: newData.musicType ? newData.musicType : null,
              subcategory: newData.subcategory,
              musicVideoSeries: newData.musicVideoSeries
                ? newData.musicVideoSeries
                : null,
              title: newData.title ? newData.title : null,
              episode: newData.episode ? newData.episode : null,
              isMusicVideoSeries: data.isMusicVideoSeries
                ? data.isMusicVideoSeries
                : null,
            });

          console.log("Count number==>", count);
        }
        count = count + 1;
      } else {
        console.error("Invalid document ID");
      }
    }
    console.log("Count number==>", count);
    console.log("Documents successfully updated!");
    dailyCount = dailyCount + 1;
  } catch (error) {
    console.error("Error updating documents: ", error);
  }
  console.log("Day Count ==>", dailyCount);
};