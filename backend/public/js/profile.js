document.addEventListener('DOMContentLoaded', function() {
    // Bio character counter
    const bioTextarea = document.getElementById('bio');
    const bioCounter = document.getElementById('bioCounter');
    
    function updateBioCounter() {
        const currentLength = bioTextarea.value.length;
        bioCounter.textContent = currentLength;
        
        if (currentLength > 450) {
            bioCounter.className = 'text-warning';
        } else if (currentLength > 480) {
            bioCounter.className = 'text-danger';
        } else {
            bioCounter.className = 'text-muted';
        }
    }
    
    bioTextarea.addEventListener('input', updateBioCounter);
    updateBioCounter(); // Initial count
    
    // Form validation
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', function(e) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[type="tel"]');
        
        inputs.forEach(input => {
            if (input.name === 'phone' && input.value) {
                const phonePattern = /^[+]?[\d\s\-\(\)]{7,15}$/;
                if (!phonePattern.test(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                        const feedback = document.createElement('div');
                        feedback.className = 'invalid-feedback';
                        feedback.textContent = 'Please enter a valid phone number';
                        input.parentNode.appendChild(feedback);
                    }
                } else {
                    input.classList.remove('is-invalid');
                }
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
});

// Image preview function
function previewImage(input) {
    const preview = document.getElementById('preview');
    const previewContainer = document.getElementById('imagePreview');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        previewContainer.style.display = 'none';
    }
}