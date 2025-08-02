// ==================== ADMIN JAVASCRIPT FUNCTIONS ====================

// Resource Type Toggle Functions
function toggleResourceType() {
    const type = document.getElementById('type').value;
    const pdfSection = document.getElementById('pdfSection');
    const linkSection = document.getElementById('linkSection');
    
    if (type === 'pdf') {
        pdfSection.style.display = 'block';
        linkSection.style.display = 'none';
        document.getElementById('pdf').required = true;
        document.getElementById('url').required = false;
    } else if (type === 'link') {
        pdfSection.style.display = 'none';
        linkSection.style.display = 'block';
        document.getElementById('pdf').required = false;
        document.getElementById('url').required = true;
    } else {
        pdfSection.style.display = 'none';
        linkSection.style.display = 'none';
        document.getElementById('pdf').required = false;
        document.getElementById('url').required = false;
    }
}

// Syllabus Type Toggle Functions
function toggleSyllabusType() {
    const type = document.getElementById('type').value;
    const pdfSection = document.getElementById('pdfSection');
    const linkSection = document.getElementById('linkSection');
    
    if (type === 'pdf') {
        pdfSection.style.display = 'block';
        linkSection.style.display = 'none';
        document.getElementById('pdf').required = true;
        document.getElementById('url').required = false;
    } else if (type === 'link') {
        pdfSection.style.display = 'none';
        linkSection.style.display = 'block';
        document.getElementById('pdf').required = false;
        document.getElementById('url').required = true;
    } else {
        pdfSection.style.display = 'none';
        linkSection.style.display = 'none';
        document.getElementById('pdf').required = false;
        document.getElementById('url').required = false;
    }
}

// Delete Resource Function
function deleteResource(id, title) {
    document.getElementById('resourceTitle').textContent = title;
    document.getElementById('deleteForm').action = '/admin/delete-resource/' + id;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Delete Syllabus Function
function deleteSyllabus(id, title) {
    document.getElementById('syllabusTitle').textContent = title;
    document.getElementById('deleteForm').action = '/admin/delete-syllabus/' + id;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Remove YouTube Link Function
function removeYouTubeLink(resourceId, linkId, topicName) {
    document.getElementById('linkTopicName').textContent = topicName;
    document.getElementById('deleteForm').action = `/admin/remove-youtube-link/${resourceId}/${linkId}`;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// YouTube URL Validation
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url');
    if (urlInput) {
        urlInput.addEventListener('input', function() {
            const url = this.value;
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
            
            if (url && !youtubeRegex.test(url)) {
                this.setCustomValidity('Please enter a valid YouTube URL');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});