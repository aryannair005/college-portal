// Check if PDF loaded successfully
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('iframe');
    const fallback = document.getElementById('pdf-fallback');
    
    iframe.addEventListener('error', function() {
        iframe.style.display = 'none';
        fallback.style.display = 'block';
    });
    
    // Timeout fallback
    setTimeout(function() {
        try {
            // Try to access iframe content to check if PDF loaded
            iframe.contentDocument;
        } catch (e) {
            // If we can't access it, assume it failed
            iframe.style.display = 'none';
            fallback.style.display = 'block';
        }
    }, 5000);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Go back to previous page
        <% if (type === 'resource') { %>
            window.location.href = '/resources';
        <% } else if (type === 'pyq') { %>
            window.location.href = '/pyqs';
        <% } else if (type === 'syllabus') { %>
            window.location.href = '/syllabus';
        <% } %>
    }
});