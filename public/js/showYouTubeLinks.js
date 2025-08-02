function showYouTubeLinks(resourceId) {
    const resource = allResources.find(r => r._id === resourceId);
    if (!resource || !resource.youtubeLinks.length) return;

    let modalContent = `<h6>Videos for: ${resource.title}</h6><div class="row">`;

    resource.youtubeLinks.forEach(link => {
        modalContent += `
            <div class="col-md-6 mb-3">
                <div class="card border-danger">
                    <div class="card-body">
                        <h6 class="card-title">${link.topicName}</h6>
                        <p class="card-text">
                            <small class="text-muted">Added: ${new Date(link.addedAt).toLocaleDateString()}</small>
                        </p>
                        <a href="${link.url}" target="_blank" class="btn btn-danger btn-sm">
                            <i class="fas fa-play me-1"></i>Watch Video
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    modalContent += '</div>';
    document.getElementById('youtubeModalBody').innerHTML = modalContent;
    document.getElementById('viewFullDetailsBtn').onclick = () => {
        window.location.href = `/resource/${resourceId}`;
    };

    const modal = new bootstrap.Modal(document.getElementById('youtubeModal'));
    modal.show();
}
