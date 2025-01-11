
export async function load( { locals: { pb }}) {

    const videos = await pb.collection('videos').getFullList();

    return {
        videos: videos,
        title: 'MZEYFILMS - Admin - Videos',
        description: 'MZEFILMS Admin Videos. Manage your videos.',
        index: false
    }
}

export const actions = {
    upload: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const name = formData.name;
        const url = formData.url;

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + name + '"',
        });

        if (video && video.length > 0) {
            return {
                status: 400,
                body: {
                    message: 'Video already exists'
                }
            }
        }

        const data = {
            name: name,
            url: url
        };

        await pb.collection('videos').create(data);

        return {
            status: 200,
            body: {
                message: 'Video added successfully'
            }
        }
    },
    rename: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const oldName = formData.oldName;
        const newName = formData.newName;

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + oldName + '"',
        });

        if (!video || video.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Video not found'
                }
            }
        }

        const data = {
            name: newName,
        };

        await pb.collection('videos').update(video[0].id, data);

        return {
            status: 200,
            body: {
                message: 'Video renamed successfully'
            }
        }
    },
    delete: async ({ request, locals: { pb } }) => {
        const formData = Object.fromEntries(await request.formData());

        const name = formData.name;

        const video = await pb.collection('videos').getFullList({
            filter: 'name = "' + name + '"',
        });

        if (!video || video.length === 0) {
            return {
                status: 400,
                body: {
                    message: 'Invalid video'
                }
            }
        }

        await pb.collection('videos').delete(video[0].id);

        return {
            status: 200,
            body: {
                message: 'Video deleted successfully'
            }
        }
    }
}