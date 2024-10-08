const {
    susilaLifeDB,
    susilaLifeFirebaseApp,
} = require("../common/firebaseInit");

const usersCollection = susilaLifeDB.collection("users");
const referralCollection = susilaLifeDB.collection("referral");

const executeGetAllReadyExistUser = async (userId) => {

    try {
        let dataResult = [];
        let userData;
        let isExist = false;
        const querySnapshot = await usersCollection
            .where("user_id", "==", userId)
            .get().then((value) => {
                dataResult = value.docs.map((e) => e.data());
                userData = value.docs.map((e) => e.data());
            })
        if(dataResult.length > 0) isExist = true;

        return {userData , isExist};
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; // Return an empty object in case of an error
    }
}

const executeGetContinueWatchingForUser = async (userId) => {

    try {
        let lastWatched;
        const querySnapshot = await usersCollection
            .doc(userId)
            .get().then((value) => {
                // userData = value.docs.map((e) => e.data().lastWatched);
                lastWatched = value.data().lastWatched
            })

        // let lastWatched = userData.

        return lastWatched;
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; // Return an empty object in case of an error
    }
}

const executeGetWishListDataForUser = async (userId) => {

    try {
        let my_list;
        const querySnapshot = await usersCollection
            .doc(userId)
            .get().then((value) => {
                // userData = value.docs.map((e) => e.data().lastWatched);
                my_list = value.data().my_list
            })

        // let lastWatched = userData.
        if(my_list.length > 0) {
            return my_list;
        } else  {
            return  "No any favourites"
        }


    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; // Return an empty object in case of an error
    }
}

const executeSetWishListDataForUser = async (userId, wishList) => {

    try {
        return await usersCollection
            .doc(userId)
            .update({'my_list': wishList})
            .then((value) => {
                console.log(value)
            })
    } catch (e) {
        console.error("Error executing getAllInquiries:", e);
        return { e }; // Return an empty object in case of an error
    }
}

const executeGeteRferralNumbers = async () => {
    const dataList = [];

    try {
        const query= referralCollection;

        const querySnapshot = await query.get();
        querySnapshot.forEach((doc) => {
            dataList.push(doc.data());
        });
        console.log('dataList===================>>>>', dataList);
        return dataList;
    } catch (error) {
        console.error("Error executing getAllInquiries:", error );
        return { error }; 
    }
}

// const executeLogin = async() => {
//     console.log(" Execute login function =====> ");
//     const data = [];
//     const {email, password} = req.body;
//     console.log(" Execute login function =====> ", email ,"=>>>>>", password);
//     if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//     }
//
//     if (!req.body.password) {
//         return res.status(400).json({ error: 'Password is required' });
//     }
//     console.log(" Execute login function =====> ");
//     try {
//         const snapshot = await usersCollection.where("email", "==", email).get()?okjtrewq
//         let userData;
//         snapshot.forEach(result => {
//             console.log("userdata =====> ", result.data());
//             userData = result.data()
//         })
//         const validity = await bcrypt.compare(password, userData.password);
//         if (!validity) {
//             return res.status(400).json("Wrong password");
//         } else {
//             return res.status(200).json({ message: 'Login successful', userData});
//         }
//     } catch (err) {
//         return  res.status(500).json(err);
//     }
// }

module.exports = {
    executeGetAllReadyExistUser,
    executeGetContinueWatchingForUser,
    executeGetWishListDataForUser,
    executeSetWishListDataForUser,
    executeGeteRferralNumbers,
}