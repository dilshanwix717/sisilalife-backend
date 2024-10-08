
const { scheduleRevenueCalculationFunc} = require("../Schedules/revenueCalculation");
const {executeCreatePlayList,executeAddSongToPlaylist,executeAddSongToFavourite, executeRemoveSongFromFavourite,executeRemoveSongFromPlaylist,
    executeDeletePlaylist
} = require("../services/playListServices");


const createPlayList = async (req, res, next) => {
    const userId = req.body.userId
    const playListName = req.body.playListName
    const playListDescription = req.body.playListDescription

    try {
        console.log('userId====> $userId',userId);
        const data = await executeCreatePlayList(
            userId,
            playListName,
            playListDescription,
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


const deletePlayList = async (req, res, next) => {
    const userId = req.body.userId;
    const playlistName = req.body.playlistName;

    try {
        const result = await executeDeletePlaylist(userId, playlistName);
        if (result) {
            res.status(200).json({ message: "Playlist deleted successfully" });
        } else {
            res.status(404).json({ error: "Playlist not found" });
        }
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({
            status: "500",
            error: error.message,
        });
    }
};

const addSongToFavourite = async (req, res, next) => {
    const userId = req.body.userId
    const songId = req.body.songId

    try {
        console.log('userId====> ',userId);
        console.log('songId====> ',songId);
        const data = await executeAddSongToFavourite(
            userId,
            songId,
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

const removeSongFromFavourite = async (req, res, next) => {
    const userId = req.body.userId
    const songId = req.body.songId

    try {
        console.log('userId====> ',userId);
        console.log('songId====> ',songId);
        const data = await executeRemoveSongFromFavourite(
            userId,
            songId,
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

const addSongToPlaylist = async (req, res, next) => {
    const userId = req.body.userId
    const playListIndex = req.body.playListIndex
    const songId = req.body.songId

    try {
        console.log('userId====> ',userId);
        console.log('playListIndex====> ',playListIndex);
        console.log('songId====> ',songId);
        const data = await executeAddSongToPlaylist(
            userId,
            playListIndex,
            songId,
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

const removeSongFromPlaylist = async (req, res, next) => {
    const userId = req.body.userId
    const playListIndex = req.body.playListIndex
    const songId = req.body.songId

    try {
        console.log('userId====> ',userId);
        console.log('playListIndex====> ',playListIndex);
        console.log('songId====> ',songId);
        const data = await executeRemoveSongFromPlaylist(
            userId,
            playListIndex,
            songId,
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




module.exports = {
    createPlayList,
    deletePlayList,
    addSongToPlaylist,
    addSongToFavourite,
    removeSongFromFavourite,
    removeSongFromPlaylist
};
