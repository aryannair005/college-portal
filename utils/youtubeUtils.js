function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
}

// This function seems to be intended for extracting video ID, but your original regex was flawed.
// Re-evaluating based on standard practices.
// However, for this restructuring, we mainly need validation.
// If you need to embed, you typically just use the URL directly or extract the ID for an iframe src.
function extractYouTubeId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
}

module.exports = {
    isValidYouTubeUrl,
    extractYouTubeId
};