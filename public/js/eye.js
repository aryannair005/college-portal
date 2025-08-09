// Password visibility toggle for login and register pages
document.addEventListener('DOMContentLoaded', function () {
  const toggleButtons = document.querySelectorAll('.password-toggle');

  toggleButtons.forEach(function (toggleButton) {
    const targetSelector = toggleButton.getAttribute('data-target');
    if (!targetSelector) return;

    const input = document.querySelector(targetSelector);
    if (!input) return;

    const icon = toggleButton.querySelector('i');

    function setVisibility(isVisible) {
      input.type = isVisible ? 'text' : 'password';
      if (icon) {
        icon.classList.toggle('fa-eye', !isVisible);
        icon.classList.toggle('fa-eye-slash', isVisible);
      }
      toggleButton.setAttribute('aria-pressed', String(isVisible));
    }

    toggleButton.addEventListener('click', function () {
      const currentlyVisible = input.type === 'text';
      setVisibility(!currentlyVisible);

      // Keep focus on the input and move caret to end for better UX
      input.focus({ preventScroll: true });
      const value = input.value;
      input.value = '';
      input.value = value;
    });

    // Initialize state
    toggleButton.setAttribute('aria-pressed', 'false');
  });
});


