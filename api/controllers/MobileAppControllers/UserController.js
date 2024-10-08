const {susilaLifeDB, db} = require("../../common/firebaseInit");
const {
    executeGetAllReadyExistUser,
    executeGetContinueWatchingForUser,
    executeGetWishListDataForUser, 
    executeSetWishListDataForUser,
    executeGeteRferralNumbers,
} = require("../../services/userService");
const usersCollection = susilaLifeDB.collection("users");

exports.getAlreadyExistUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        console.log("user id ====> ", userId)
        const data = await executeGetAllReadyExistUser(userId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(401).json(e)
    }

}

exports.getContinueWatching = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const data = await executeGetContinueWatchingForUser(userId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(401).json(e)
    }

};

exports.getWishListDataForUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const data = await executeGetWishListDataForUser(userId);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(401).json(e)
    }

};

exports.setWishListDataForUser = async (req, res, next) => {
    const userId = req.params.id;
    const wishList = req.body.wishList;

    try {
        if(!wishList) return res.status(401).json("Wishlist is required")

        const data = await executeSetWishListDataForUser(userId, wishList);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(401).json(e)
    }
};

exports.getReferralNumbers = async (req, res, next) => {
    try {
        const data = await executeGeteRferralNumbers();
        return res.status(200).json(data);
        
    } catch (e) {
        return res.status(401).json(e)
    } 
}