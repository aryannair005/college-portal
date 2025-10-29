// ==================== AUTHENTICATION JAVASCRIPT ====================

// Admin Creation Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminForm');
    if (!form) return; // Exit if not on admin creation page
    
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    
    // Password validation checks
    const checks = {
        length: document.getElementById('lengthCheck'),
        uppercase: document.getElementById('uppercaseCheck'),
        lowercase: document.getElementById('lowercaseCheck'),
        number: document.getElementById('numberCheck'),
        special: document.getElementById('specialCheck')
    };
    
    function updateCheck(element, isValid) {
        const icon = element.querySelector('i');
        if (isValid) {
            icon.className = 'fas fa-check text-success';
            element.className = 'text-success';
        } else {
            icon.className = 'fas fa-times text-danger';
            element.className = 'text-muted';
        }
    }
    
    function validatePassword() {
        const pwd = password.value;
        const hasLength = pwd.length >= 8;
        const hasUppercase = /[A-Z]/.test(pwd);
        const hasLowercase = /[a-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
        
        updateCheck(checks.length, hasLength);
        updateCheck(checks.uppercase, hasUppercase);
        updateCheck(checks.lowercase, hasLowercase);
        updateCheck(checks.number, hasNumber);
        updateCheck(checks.special, hasSpecial);
        
        const isValid = hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
        
        if (pwd.length > 0) {
            if (isValid) {
                password.classList.remove('is-invalid');
                password.classList.add('is-valid');
            } else {
                password.classList.remove('is-valid');
                password.classList.add('is-invalid');
            }
        } else {
            password.classList.remove('is-valid', 'is-invalid');
        }
        
        return isValid;
    }
    
    function validateConfirmPassword() {
        const pwd = password.value;
        const confirmPwd = confirmPassword.value;
        
        if (confirmPwd.length > 0) {
            if (pwd === confirmPwd && pwd.length > 0) {
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
                return true;
            } else {
                confirmPassword.classList.remove('is-valid');
                confirmPassword.classList.add('is-invalid');
                return false;
            }
        } else {
            confirmPassword.classList.remove('is-valid', 'is-invalid');
            return false;
        }
    }
    
    function validateForm() {
        const isPasswordValid = validatePassword();
        const isConfirmValid = validateConfirmPassword();
        const allFieldsFilled = form.checkValidity();
        
        submitBtn.disabled = !(isPasswordValid && isConfirmValid && allFieldsFilled);
    }
    
    // Real-time validation
    password.addEventListener('input', validateForm);
    confirmPassword.addEventListener('input', validateForm);
    
    // Validate other fields
    form.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
            validateForm();
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validatePassword() || !validateConfirmPassword()) {
            e.stopPropagation();
            return false;
        }
        
        if (form.checkValidity()) {
            form.submit();
        } else {
            form.classList.add('was-validated');
        }
    });
});