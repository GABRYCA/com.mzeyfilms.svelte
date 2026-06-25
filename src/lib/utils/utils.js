const pageSize = 2

export async function fetchVideos(page, pb, pageSize= 2) {

    if (pageSize <= 0) {
        // Get whole list
        return await pb.collection('videos').getFullList({
            sort: '-created',
        });
    }

    return await pb.collection('videos').getList(page, pageSize, {
        sort: '-created',
    });
}