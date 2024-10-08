const {
    executeGetASeriesData,
    executeGetASeriesDataByTitle, executeSetAFavouriteSeries, executeGetAFavouriteSeries,
} = require("../services/seriesService");
const {executeRemoveSongFromFavourite} = require("../services/playListServices");

exports.getASeriesData = async (req, res, next) => {
    const id = req.body.id;

    try {
        const data = await executeGetASeriesData(id);
        return res.status(200).json(data);
        
    } catch (e) {
        return res.status(401).json(e)
    }
};

exports.getASeriesDataByTitle = async(req, res, next) => {
    const title = req.body.title
    try {
        const data = await executeGetASeriesDataByTitle(title);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(401).json(error);
    }
}

exports.setAFavouriteSeries = async(req, res, next) => {
    const userId = req.body.userId
    const seriesId = req.body.seriesId
    const categoryId = req.body.categoryId
    try {
        console.log('userId====> ',userId);
        console.log('seriesId====> ',seriesId);
        const data = await executeSetAFavouriteSeries(
            userId,
            seriesId,
            categoryId
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
}

exports.getAFavouriteSeries = async(req, res, next) => {
    const userId = req.body.userId
    const seriesId = req.body.seriesId
    const categoryId = req.body.categoryId
    try {
        const data = await executeGetAFavouriteSeries(
            userId,
            seriesId,
            categoryId
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
}