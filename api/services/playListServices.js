
const {
    susilaLifeContentProviderDB: db, susilaLifeContentProviderDB, susilaLifeDB,
} = require("../common/firebaseInit");


async function executeCreatePlayList(userId, name, description) {
    try {
        if (!userId) {
            throw new Error("Invalid userId. Please provide a valid userId.");
        }
        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        let playlistsArray = [];

        if (docSnapshot.exists) {

            const existingData = docSnapshot.data();
            playlistsArray = existingData.playlists || [];


            const existingPlaylistNames = playlistsArray.map(playlist => playlist.name);
            if (existingPlaylistNames.includes(name)) {
                throw new Error(`Playlist with name "${name}" already exists.`);
            }
        }
        playlistsArray.push({
            name: name,
            description: description,
            songsList:[],
            // imageUrl: imageUrl
        });

        await playlistDocRef.set({
            userId: userId,
            playlists: playlistsArray,
            favouriteSongs:[],
        });

        console.log("Playlist created successfully!");
    } catch (error) {
        console.error("Error executing executeCreatePlayList:", error);
        throw error;
    }
}

async function executeDeletePlaylist(userId, playlistName) {
    try {
        if (!userId) {
            throw new Error("Invalid userId. Please provide a valid userId.");
        }
        if (!playlistName) {
            throw new Error("Invalid playlistName. Please provide a valid playlistName.");
        }

        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        if (docSnapshot.exists) {
            const existingData = docSnapshot.data();
            const playlistsArray = existingData.playlists || [];

            const indexToDelete = playlistsArray.findIndex(playlist => playlist.name === playlistName);

            if (indexToDelete === -1) {
                throw new Error(`Playlist "${playlistName}" not found for user ${userId}`);
            }

            playlistsArray.splice(indexToDelete, 1);

            await playlistDocRef.set({
                userId: userId,
                playlists: playlistsArray,
                favouriteSongs: existingData.favouriteSongs || [],
            });

            console.log(`Playlist "${playlistName}" deleted successfully!`);
        } else {
            console.log(`User with ID "${userId}" has no playlists.`);
        }
    } catch (error) {
        console.error("Error executing executeDeletePlaylist:", error);
    }
}




// async function executeAddSongToPlaylist(userId, playListIndex, songId) {
//     try {
//
//         const songslistDocRef = susilaLifeDB.collection("playLists").doc(userId)['playlists'][0][playListIndex];
//         const docSnapshot = await songslistDocRef.get();
//
//
//         let songslistsArray = [];
//
//         if (docSnapshot.exists) {
//             const existingData = docSnapshot.data();
//             songslistsArray = existingData.playlists || [];
//
//             const existingSongsId = songslistsArray.map(songslist => songslist);
//             if (existingSongsId.includes(songId)) {
//                 throw new Error(`Song with id already exists.`);
//             }
//         }
//         songslistsArray.push({
//             songsList: songId,
//         });
//
//         await playlistDocRef.set({
//             userId: userId,
//             songsList: songslistsArray
//         });
//
//         console.log("Songslist created successfully!");
//     } catch (error) {
//         console.error("Error executing executeAddSongToPlaylist:", error);
//         throw error;
//     }
// }

async function executeAddSongToPlaylist(userId, playListIndex, songId) {
    try {
        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Playlist document not found.");
        }

        const existingData = docSnapshot.data();
        const playlistsArray = existingData.playlists || [];

        if (playListIndex < 0 || playListIndex >= playlistsArray.length) {
            throw new Error(`Invalid playlist index: ${playListIndex}`);
        }

        const playlist = playlistsArray[playListIndex];

        if (!playlist) {
            throw new Error(`Playlist at index ${playListIndex} does not exist.`);
        }

        const songsList = playlist.songsList || [];

        if (songsList.some(item => item === songId)) {
            throw new Error(`Song with id ${songId} already exists in the playlist.`);
        }

        songsList.push(songId);

        // Update the playlist array within the document
        playlistsArray[playListIndex].songsList = songsList;

        await playlistDocRef.update({
            playlists: playlistsArray
        });
        console.log("Song added to playlist successfully!");
    } catch (error) {
        console.error("Error executing executeAddSongToPlaylist:", error);
        throw error;
    }
}

async function executeRemoveSongFromPlaylist(userId, playListIndex, songIdToRemove) {
    try {
        // console.log
        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Playlist document not found.");
        }

        const existingData = docSnapshot.data();
        const playlistsArray = existingData.playlists || [];

        if (playListIndex < 0 || playListIndex >= playlistsArray.length) {
            throw new Error(`Invalid playlist index: ${playListIndex}`);
        }

        const playlist = playlistsArray[playListIndex];

        if (!playlist) {
            throw new Error(`Playlist at index ${playListIndex} does not exist.`);
        }

        const songsList = playlist.songsList || [];
        console.log('playlist==>',playlist)
        const songIndex = songsList.findIndex(item => item === songIdToRemove);
        // const songIndex = favouritesArray.indexOf(songId);

        if (songIndex === -1) {
            throw new Error(`Song with id ${songIdToRemove} does not exist in the playlist.`);
        }

        songsList.splice(songIndex, 1);

        playlistsArray[playListIndex].songsList = songsList;

        await playlistDocRef.update({
            playlists: playlistsArray
        });
        console.log("Song removed from playlist successfully!");
    } catch (error) {
        console.error("Error executing executeRemoveSongFromPlaylist:", error);
        throw error;
    }
}


async function executeAddSongToFavourite(userId,songId) {
    try {
        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Favourite document not found.");
        }

        const existingData = docSnapshot.data();
        const favouritesArray = existingData.favouriteSongs || [];

        // const playlist = playlistsArray[playListIndex];

        // if (!playlist) {
        //     throw new Error(`Playlist at index ${playListIndex} does not exist.`);
        // }

        const favSongsList = favouritesArray || [];

        if (favSongsList.some(item => item === songId)) {
            throw new Error(`Song with id ${songId} already exists in the playlist.`);
        }

        favouritesArray.push(songId);

        await playlistDocRef.update({
            favouriteSongs: favouritesArray
        });

        console.log("Song added to favourite songs list successfully!");
    } catch (error) {
        console.error("Error executing executeAddSongToFavourite:", error);
        throw error;
    }
}

async function executeRemoveSongFromFavourite(userId, songId) {
    try {
        const playlistDocRef = susilaLifeDB.collection("playLists").doc(userId);
        const docSnapshot = await playlistDocRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Favourite document not found.");
        }

        const existingData = docSnapshot.data();
        const favouritesArray = existingData.favouriteSongs || [];

        const songIndex = favouritesArray.indexOf(songId);

        if (songIndex === -1) {
            throw new Error(`Song with id ${songId} does not exist in the playlist.`);
        }

        favouritesArray.splice(songIndex, 1);

        await playlistDocRef.update({
            favouriteSongs: favouritesArray
        });

        console.log("Song removed from favourite songs list successfully!");
    } catch (error) {
        console.error("Error executing executeRemoveSongFromFavourite:", error);
        throw error;
    }
}





module.exports = { executeCreatePlayList,executeDeletePlaylist,executeAddSongToPlaylist,executeAddSongToFavourite,executeRemoveSongFromFavourite,executeRemoveSongFromPlaylist};


