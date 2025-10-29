function openAllVideos() {
    if (currentResource.youtubeLinks && currentResource.youtubeLinks.length > 0) {
        const videoUrls = currentResource.youtubeLinks.map(link => link.url);

        if (confirm(`This will open ${videoUrls.length} videos in new tabs. Continue?`)) {
            videoUrls.forEach(url => {
                window.open(url, '_blank');
            });
        }
    }
}

// Extract YouTube video ID and create thumbnail
function getYouTubeThumbnail(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Add thumbnails to video cards (if needed)
document.addEventListener('DOMContentLoaded', function () {
    if (currentResource.youtubeLinks && currentResource.youtubeLinks.length > 0) {
        currentResource.youtubeLinks.forEach((link, index) => {
            const videoId = getYouTubeThumbnail(link.url);
            if (videoId) {
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                // OPTIONAL: Use this URL to set image src, e.g.,
                // document.querySelector(`#thumb-${index}`).src = thumbnailUrl;
            }
        });
    }
});
