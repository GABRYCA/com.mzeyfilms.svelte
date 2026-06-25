export async function load({locals: {pb}}) {
    const videos = await pb.collection('videos').getFullList({
        sort: '-created'
    });

    const videosWithUrls = videos.map(video => ({
        ...video,
        animatedhighresUrl: video.animatedhighres ? `${pb.baseUrl}/api/files/${video.collectionId}/${video.id}/${video.animatedhighres}` : '',
        animatedlowresUrl: video.animatedlowres ? `${pb.baseUrl}/api/files/${video.collectionId}/${video.id}/${video.animatedlowres}` : '',
        credits: video.credits || []
    }));

    return {
        videos: videosWithUrls,
        title: 'MZEYFILMS - Admin - Videos',
        description: 'MZEFILMS Admin Videos. Manage your films.',
        index: false
    }
}

export const actions = {
    upload: async ({request, locals: {pb}}) => {
        const formData = await request.formData();

        const name = formData.get('name');
        const existing = await pb.collection('videos').getFullList({
            filter: `name = "${name}"`,
        });

        if (existing && existing.length > 0) {
            return {
                status: 400,
                body: {message: 'Video already exists'}
            }
        }

        const highres = formData.get('animatedhighres');
        if (!highres || highres.size === 0 || highres.name === 'undefined') {
            formData.delete('animatedhighres');
        }

        const lowres = formData.get('animatedlowres');
        if (!lowres || lowres.size === 0 || lowres.name === 'undefined') {
            formData.delete('animatedlowres');
        }

        if (!formData.has('credits')) {
            formData.append('credits', '[]');
        }

        try {
            await pb.collection('videos').create(formData);
            return {
                status: 200,
                body: {message: 'Video added successfully'}
            }
        } catch (err) {
            console.error("Upload error:", err);
            return {
                status: 500,
                body: {message: err.message || 'Error occurred during creation'}
            }
        }
    },

    update: async ({request, locals: {pb}}) => {
        const formData = await request.formData();

        const id = formData.get('id');
        formData.delete('id');

        const highres = formData.get('animatedhighres');
        if (!highres || highres.size === 0 || highres.name === 'undefined') {
            formData.delete('animatedhighres');
        }

        const lowres = formData.get('animatedlowres');
        if (!lowres || lowres.size === 0 || lowres.name === 'undefined') {
            formData.delete('animatedlowres');
        }

        if (formData.get('deleteHighres') === 'true') {
            formData.set('animatedhighres', '');
        }
        formData.delete('deleteHighres');

        if (formData.get('deleteLowres') === 'true') {
            formData.set('animatedlowres', '');
        }
        formData.delete('deleteLowres');

        try {
            await pb.collection('videos').update(id, formData);
            return {
                status: 200,
                body: {message: 'Video updated successfully'}
            }
        } catch (err) {
            console.error("Update error:", err);
            return {
                status: 500,
                body: {message: err.message || 'Error updating video'}
            }
        }
    },

    delete: async ({request, locals: {pb}}) => {
        const formData = await request.formData();
        const id = formData.get('id');

        try {
            await pb.collection('videos').delete(id);
            return {
                status: 200,
                body: {message: 'Video deleted successfully'}
            }
        } catch (err) {
            console.error("Delete error:", err);
            return {
                status: 400,
                body: {message: 'Unable to delete video'}
            }
        }
    }
}