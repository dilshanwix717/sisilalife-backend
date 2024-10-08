// const admin = require("firebase-admin");
// const credentials = require("../../susila-life-test-firebase-adminsdk-3eph5-f70f6ab24a.json");

// const firstApp = admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// }, 'first-app');
const {
  susilaLifeDB: db,
  susilaLifeContentProviderDB: db2,
  susilaLifeContentProviderDBAdmin: admin2,
} = require("../common/firebaseInit");
const susilaLifeContentProviderDBAdmin = require("firebase-admin");

// const db = firstApp.firestore();

// const admin2 = require("firebase-admin");
// const credentials2 = require("../../content-provider-test1-firebase-adminsdk-qh35i-3f042d0fb5.json");
// const secondFirebaseApp = admin2.initializeApp(
//   {
//     credential: admin2.credential.cert(credentials2),
//   },
//   "Content-Provider-Test2"
// );

// const db2 = secondFirebaseApp.firestore();

async function createPromoCodesForPool(agent, plan, bulk) {
  console.error("agent ==>", agent);
  console.error("plan ==>", plan);
  console.error("bulk ==>", bulk);

  const referralArray = [];
  const referralCollection = db2.collection("promocode");

  referralCollection
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        // Extract the data from each document and add it to the array
        referralArray.push(doc.data());
      });

      // Use the referralArray as needed here
      // console.log(referralArray);
    })
    .catch((error) => {
      console.error("Error retrieving referral data:", error);
    });

  let tempArray = [];
  let tempRefAgent =
    agent === "Susila Production"
      ? "2"
      : agent === "Trico Global Network"
      ? "1"
      : agent === "Influences"
      ? "3"
      : agent === "Other"
      ? "4"
      : agent === "Anjali"
      ? "5"
      : "6";
  let tempRefPlan =
    plan === "Monthly"
      ? "1"
      : plan === "3 Months"
      ? "2"
      : plan === "6 Months"
      ? "3"
      : "4";
  console.log("temp ref ===", tempRefAgent + " " + tempRefPlan);

  const getUUID = () => {
    let temRefPin =
      tempRefAgent +
      tempRefPlan +
      "xxxxxx".replace(/[xy]/g, (c) => {
        const piece = (Math.random() * 6) | 0;
        const elem = c === "x" ? piece : (piece & 0x3) | 0x8;
        return elem.toString(6);
      });
    return temRefPin;
  };

  for (let i = 0; i < bulk; i++) {
    let tempUUID = getUUID();
    referralArray.forEach((element) => {
      if (element.code == tempUUID) {
        tempUUID = getUUID();
        tempArray.push(tempUUID);
        return;
      }
    });
    tempArray.push(tempUUID);
  }
  // console.log(tempArray)

  const batch = db2.batch();
  tempArray.forEach((existingNumber) => {
    const docData = {
      createAt: admin2.firestore.Timestamp.fromDate(new Date()),
      id: referralCollection.doc().id,
      code: existingNumber,
      usd:
        plan === "Monthly"
          ? 4
          : plan === "3 Months"
          ? 12
          : plan === "6 Months"
          ? 20
          : 40,
      plan: plan,
      agent: agent,
      used: false,
      codeIssued: false,
    };

    const referralRef = referralCollection.doc(docData.id);
    batch.set(referralRef, docData);
  });

  batch
    .commit()
    .then(() => {
      // console.log('Data saved to Firestore');
    })
    .catch((error) => {
      console.error("Error saving data to Firestore:", error);
    });
}

async function getPromoCodeData(agent, plan, bulk) {
  const promocodeCollectionRef = db2.collection("promocode");
  const referralCollectionRef = db.collection("referral");
  // const referralCollectionRef = db.collection('test_referral');

  return promocodeCollectionRef
    .where("agent", "==", agent)
    .where("plan", "==", plan)
    .limit(bulk)
    .get()
    .then((querySnapshot) => {
      const promocodeArray = [];

      querySnapshot.forEach((doc) => {
        promocodeArray.push(doc.data());

        const docData = {
          createAt: admin2.firestore.Timestamp.fromDate(new Date()),
          id: doc.data().id,
          code: doc.data().code,
          usd:
            plan === "Monthly"
              ? 4
              : plan === "3 Months"
              ? 12
              : plan === "6 Months"
              ? 20
              : 40,
          plan: doc.data().plan,
          agent: doc.data().agent,
          used: false,
          codeIssued: true,
        };
        referralCollectionRef.add(docData);
      });
      // console.error('getting promocodes: ', promocodeArray);
      return promocodeArray;
    })
    .catch((error) => {
      console.error("Error getting promocodes: ", error);
      return [];
    });
}

async function deleteDocument(
  documentId,
  agent,
  plan,
  salesAgent,
  transactionId
) {
  const collectionRef = db2.collection("promocode");
  const documentRef = collectionRef.doc(documentId);

  let deletedData; // To store the deleted document data before deletion

  // Get the document data before deletion
  return documentRef
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        deletedData = docSnapshot.data();
        return documentRef.delete();
      } else {
        throw new Error(`Document with ID ${documentId} does not exist.`);
      }
    })
    .then(() => {
      const activityCollectionRef = db2.collection("activity");
      const transactionCollectionRef = db2.collection("transactions");

      const transactionData = {
        agent: agent,
        salesAgent: salesAgent,
        plan: plan,
        createAt: new Date().toISOString(),
        promocodes: deletedData.code,
        transactionId: transactionId,
      };

      const activityData = {
        agent: agent,
        salesAgent: salesAgent,
        plan: plan,
        deletedTime: new Date().toISOString(),
        deletedDocument: deletedData,
        transactionId: transactionId,
      };

      transactionCollectionRef.add(transactionData);

      return activityCollectionRef.add(activityData);
    })
    .then(() => {
      console.log("Document successfully deleted.");
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
}

async function deletePromocodes(plan, agent, bulk, salesAgent, transactionId) {
  let promoCodePromises = [];
  console.log("Added to the pool bulk", bulk);

  return getPromoCodeData(agent, plan, bulk)
    .then((promocodes) => {
      // console.log('promo value ===> ', promocodes);
      const deletePromises = [];

      promocodes.forEach((promocode) => {
        promoCodePromises.push(promocode.code);
        const documentId = promocode.id; // Assuming the promocode document has an 'id' field
        const deletePromise = deleteDocument(
          documentId,
          agent,
          plan,
          salesAgent,
          transactionId
        );
        deletePromises.push(deletePromise);
      });

      return Promise.all(deletePromises);
    })
    .then(() => {
      const newPromocodes = createPromoCodesForPool(agent, plan, bulk);
      // console.log('Added to the pool ', newPromocodes);
      console.log("All promocodes successfully deleted.");
      return promoCodePromises;
    })
    .catch((error) => {
      console.error("Error deleting promocodes:", error);
    });
}

exports.createPromoCodesForPoolFunc = (req, res, next) => {
  const bulk = req.body.bulk;
  const agent = req.body.agent;
  const plan = req.body.plan;

  if (req.body !== null) {
    if (plan === "Monthly" && agent === "Trico Global Network") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "3 Months" && agent === "Trico Global Network") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "6 Months" && agent === "Trico Global Network") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "Annual" && agent === "Trico Global Network") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "Monthly" && agent === "Other") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "3 Months" && agent === "Other") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "6 Months" && agent === "Other") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    }  else if (plan === "Annual" && agent === "Other") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "Monthly" && agent === "Anjali") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "3 Months" && agent === "Anjali") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "6 Months" && agent === "Anjali") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    }  else if (plan === "Annual" && agent === "Anjali") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "Monthly" && agent === "Champa buddipala") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "3 Months" && agent === "Champa buddipala") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    } else if (plan === "6 Months" && agent === "Champa buddipala") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    }  else if (plan === "Annual" && agent === "Champa buddipala") {
      createPromoCodesForPool(agent, plan, bulk).then((value) => {
        console.log("log val ===", value);
      });
    }
  }
};

exports.getTransactionData = async (req, res, next) => {
  const transactionId = req.params.id;

  const transactionsRef = db2.collection("transactions");

  transactionsRef
    .where("transactionId", "==", transactionId)
    .get()
    .then((snaps) => {
      console.log("transactionId ===> ", snaps._size);

      const tempArray = [];
      snaps.forEach((doc) => {
        if (doc.exists) {
          // console.log(doc.exists);
          tempArray.push(doc.data().promocodes);
        } else {
          console.log("Transaction not found");
          res.status(201).json({
            status: "THERE ARE NO RECORDS AVAILABLE",
          });
        }
      });

      if (snaps._size > 0) {
        res.status(201).json({
          status: "SUCCESS",
          body: tempArray,
        });
      } else {
        res.status(201).json({
          status: "THERE ARE NO RECORDS AVAILABLE",
        });
      }
    })
    .catch((error) => {
      console.error("Error getting transaction:", error);
      return null;
    });
};

function checkTransactionIdExists(transactionId) {
  const transactionRef = db2.collection("transactions");

  console.log("transactionId ===> ", transactionId);

  return transactionRef
    .where("transactionId", "==", transactionId)
    .get()
    .then((docSnapshot) => {
      console.error("Checking transaction ID:", docSnapshot.exists);
      let isExist = false;
      docSnapshot.forEach((doc) => {
        if (doc.exists) {
          isExist = true;
        } else {
          console.log("Transaction not found");
          isExist = false;
        }
      });
      return isExist;
    })
    .catch((error) => {
      console.error("Error checking transaction ID:", error);
      return false; // Return false in case of an error
    });
}

exports.sendPromoCodes = (req, res, next) => {
  const secretKey = req.body.secretKey;
  const bulk = req.body.bulk;
  const agent = req.body.agent;
  const salesAgent = req.body.salesAgent;
  const plan = req.body.plan;
  const transactionId = req.body.transactionId;

  if (req.body !== null) {
    if (
      secretKey !== undefined &&
      transactionId !== undefined &&
      agent !== undefined &&
      salesAgent !== undefined &&
      plan !== undefined &&
      bulk !== undefined
    ) {
      if (transactionId != null) {
        checkTransactionIdExists(transactionId).then((exists) => {
          if (exists) {
            console.log(`Transaction ID ${transactionId} already exists.`);
            // Handle the case where the transaction ID already exists
            res.status(401).json({
              status: "TRANSACTION ID ALREADY EXIST",
            });
          } else {
            console.log(`Transaction ID ${transactionId} does not exist.`);
            // Proceed with further operations

            if (secretKey === "D4s%I6jN!W3v#E9xS1C5b@N2mH") {
              console.log("sales ===> ", typeof bulk === "number");
              if (typeof bulk === "number") {
                if (plan === "Monthly" && agent === "Trico Global Network") {
                  deletePromocodes(
                    plan,
                    agent,
                    bulk,
                    salesAgent,
                    transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (
                  plan === "3 Months" &&
                  agent === "Trico Global Network"
                ) {
                  deletePromocodes(
                    plan,
                    agent,
                    bulk,
                    salesAgent,
                    transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (
                  plan === "6 Months" &&
                  agent === "Trico Global Network"
                ) {
                  deletePromocodes(
                    plan,
                    agent,
                    bulk,
                    salesAgent,
                    transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (
                  plan === "Annual" &&
                  agent === "Trico Global Network"
                ) {
                  deletePromocodes(
                    plan,
                    agent,
                    bulk,
                    salesAgent,
                    transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Monthly" && agent === "Other") {
                  deletePromocodes(
                    plan,
                    agent,
                    bulk,
                    salesAgent,
                    transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "3 Months" && agent === "Other") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "6 Months" && agent === "Other") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Annual" && agent === "Other") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Monthly" && agent === "Anjali") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "3 Months" && agent === "Anjali") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "6 Months" && agent === "Anjali") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Annual" && agent === "Anjali") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Monthly" && agent === "Champa buddipala") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "3 Months" && agent === "Champa buddipala") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "6 Months" && agent === "Champa buddipala") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else if (plan === "Annual" && agent === "Champa buddipala") {
                  deletePromocodes(
                      plan,
                      agent,
                      bulk,
                      salesAgent,
                      transactionId
                  ).then((value) => {
                    console.log("log val ===", value);
                    res.status(201).json({
                      status: "SUCCESS",
                      promocodes: value,
                    });
                  });
                } else {
                  res.status(401).json({
                    status: "PARAMETER MISMATCH",
                  });
                }
              } else {
                res.status(401).json({
                  status: "ERROR FROM USER",
                });
              }
            } else {
              res.status(301).json({
                status: "UNAUTHORIZED",
              });
            }
          }
        });
      } else {
        res.status(401).json({
          status: "TRANSACTION ID MISMATCH",
        });
      }
    } else {
      res.status(401).json({
        status: "ERROR FROM USER",
      });
    }
  } else {
    res.status(401).json({
      status: "ERROR FROM USER",
    });
  }
};
