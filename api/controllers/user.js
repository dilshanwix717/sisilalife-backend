const {
  susilaLifeDB: db,
  susilaLifeContentProviderDB: db2,
  susilaLifeContentProviderApp,
  susilaLifeContentProviderDB,
} = require("../common/firebaseInit");
const {executeLogin} = require("../services/userService");
// const admin = require("firebase-admin");
// const credentials = require("../../susila-life-test-firebase-adminsdk-3eph5-f70f6ab24a.json");

// admin.initializeApp({
//     credential: admin.credential.cert(credentials)
// });
//
// const { auth } = require("firebase-admin");
// const db = admin.firestore();
//
// const admin2 = require("firebase-admin");
// const credentials2 = require("../../content-provider-test1-firebase-adminsdk-qh35i-3f042d0fb5.json");
// admin2.initializeApp({
//     credential: admin2.credential.cert(credentials2),
// }, 'Content-Provider-Test3');
// const db2 = admin2.firestore();

exports.setContinueWatching = async (req, res, next) => {
  const userId = req.params.id;
  const continueWatching = req.body.continueWatching;

  if (req.body != null) {
    await db
      .collection("users")
      .doc(userId)
      .update({ lastWatched: continueWatching })
      .then((value) => {
        res.status(201).json({
          status: "COMPLETED",
        });
      });
  } else {
    res.status(500).json({
      status: "NOT_COMPLETED",
    });
  }
};

// exports.createUser = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const displayName = req.body.displayName;
//
//   if(req.body != null) {
//       await susilaLifeContentProviderApp.auth().createUser({
//           email,
//           password,
//           displayName,
//       }).then(async (userRecord) => {
//           console.log('Successfully created new user:', userRecord.uid);
//           console.log('Successfully created new user:', userRecord.email);
//           const userData = {
//               email: userRecord.email,
//               id: userRecord.uid,
//               contentProvider: null,
//               // createAt: adminContentProvider.firestore.FieldValue.serverTimestamp(),
//               profilePicture_url: null,
//               bannerImage_url: null,
//               title: userRecord.displayName,
//               userRole: 'ADMIN'
//           };
//           await db2.collection('users').doc(userRecord.uid).set(userData);
//           res.status(201).json({message: 'User created successfully'});
//       }).catch((error) => {
//           res.status(201).json({message: 'User not created'});
//       });
//   } else {
//       res.status(500).json({
//           "status": "NOT_COMPLETED"
//       });
//   }

// if (req.body != null) {
//   await susilaLifeContentProviderApp.auth().createUser({
//       email,
//       password,
//       displayName,
//   }).then(async (userRecord) => {
//       console.log('Successfully created new user:', userRecord.uid);
//
//   const userData = {
//     email: req.body.email,
//     id: userRecord.uid,
//     contentProvider: null,
//     // createAt: db2.FieldValue.serverTimestamp(),
//     profilePicture_url: null,
//     bannerImage_url: null,
//     title: displayName,
//     userRole: "ADMIN",
//   };
//   await db2.collection("users").doc(userRecord.uid).set(userData);
//   res.status(201).json({ message: "User created successfully" });
//   // }).catch((error) => {
//   //     res.status(201).json({message: 'User not created'});
//   // });
// });
// } else {
//   res.status(500).json({
//     status: "NOT_COMPLETED",
//   });
// }
// };

// exports.createUser = async (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const displayName = req.body.displayName;
//     console.log(req.body)
//
//     if (!email || !password || !displayName) {
//         return res.status(400).json({ message: 'Invalid input data' });
//     }
//
//     try {
//         const userRecord = await susilaLifeContentProviderApp.auth().createUser({
//             email,
//             password,
//             displayName,
//         })
//
//         console.log('Successfully created new user:', userRecord.uid);
//         console.log('Successfully created new user:', userRecord.email);
//
//         const userData = {
//             email: userRecord.email,
//             id: userRecord.uid,
//             contentProvider: null,
//             profilePicture_url: null,
//             createAt: susilaLifeContentProviderDB.FieldValue.serverTimestamp(),
//             bannerImage_url: null,
//             title: userRecord.displayName,
//             userRole: 'ADMIN'
//         };
//
//         await db2.collection('users').doc(userRecord.uid).set(userData);
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ message: 'User not created', error: error.message });
//     }
// };

exports.createUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const displayName = req.body.displayName;

  console.log(req.body);

  if (!email || !password || !displayName) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  susilaLifeContentProviderApp
    .auth()
    .createUser({
      email,
      password,
      displayName,
    })
    .then(async (userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      console.log("Successfully created new user:", userRecord.email);

      const userData = {
        email: userRecord.email,
        id: userRecord.uid,
        contentProvider: null,
        profilePicture_url: null,
        createAt: susilaLifeContentProviderDB.FieldValue.serverTimestamp(),
        bannerImage_url: null,
        title: userRecord.displayName,
        userRole: "ADMIN",
      };

      await db2.collection("users").doc(userRecord.uid).set(userData);
      res.status(200).json({ message: "User created successfully" });
      // alert('User created successfuly');
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res
        .status(500)
        .json({ message: "User not created", error: error.message });
    });
};

exports.deleteUserByID = async (req, res, next) => {
  // console.log(req.params);
  // console.log(req.query);
  const userId = req.query.id;

  try {
    await db2.collection("users").doc(userId).delete();
    // db2.auth.deleteUser()
    // await auth().deleteUser(userId)
    susilaLifeContentProviderApp
      .auth()
      .deleteUser(userId)
      .then((res) => {});

    res.status(200).json({
      status: "COMPLETED",
    });
    console.error("user deleted");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "NOT_COMPLETED",
      error: error.message,
    });
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const data = await executeLogin();
//     return res.status(200).json(data);
//   }catch (error) {
//     return res.status(401).json(error);
//   }
// }