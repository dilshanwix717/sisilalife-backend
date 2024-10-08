const {executeGetAdsForTheCountry} = require("../services/adsServices");
exports.getAdsForTheCountry = async(req, res, next) => {
    try {
        const data = await executeGetAdsForTheCountry();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting documents:", error);
        res.status(500).json({
            status: "500",
            error: error.message,
        });
    }
}
