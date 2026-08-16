/* ==========================================================
   CONTACT FORM — Web3Forms submission with strict validation
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contactFormStatus");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;

  // ---- Helper: sanitise (trim + escape HTML) ----
  function sanitiseInput(value) {
    if (typeof value !== "string") return "";
    let clean = value.trim();
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return clean.replace(/[&<>"']/g, function (m) { return map[m]; });
  }

  // ---- Helper: validate email ----
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ---- Helper: validate name (only letters, spaces, hyphens, apostrophes) ----
  function isValidName(name) {
    return /^[A-Za-z\s\-']+$/.test(name);
  }

  // ---- Helper: clear all field errors ----
  function clearErrors() {
    document.querySelectorAll('.form-group.error').forEach(el => {
      el.classList.remove('error');
    });
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    statusEl.textContent = '';
    statusEl.className = 'form-status'; // reset classes
    statusEl.style.display = 'none';
    // Reset button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-success-state');
      if (btnLabel) btnLabel.textContent = 'Send Message';
    }
  }

  // ---- Helper: show error on a specific field ----
  function showFieldError(fieldName, message) {
    const group = document.querySelector(`.form-group[data-field="${fieldName}"]`);
    if (!group) return;
    group.classList.add('error');
    const errorSpan = group.querySelector('.field-error');
    if (errorSpan) errorSpan.textContent = message;
  }

  // ---- Helper: show status (success or error) ----
  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'form-status'; // reset
    if (type === 'success') {
      statusEl.classList.add('form-status--success');
    } else if (type === 'error') {
      statusEl.classList.add('form-status--error');
    }
    statusEl.style.display = 'block';
  }

  // ---- Submit handler ----
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    // ---- Get fields ----
    const nameField = form.querySelector('[name="name"]');
    const emailField = form.querySelector('[name="email"]');
    const phoneField = form.querySelector('[name="phone"]');
    const messageField = form.querySelector('[name="message"]');
    const agreeCheckbox = form.querySelector('[name="agree"]');

    // ---- Sanitise values ----
    if (nameField) nameField.value = sanitiseInput(nameField.value);
    if (emailField) emailField.value = sanitiseInput(emailField.value);
    if (phoneField) phoneField.value = sanitiseInput(phoneField.value);
    if (messageField) messageField.value = sanitiseInput(messageField.value);

    // ---- Validate ----
    let hasError = false;

    if (!nameField || nameField.value.length < 2 || !isValidName(nameField.value)) {
      showFieldError('name', 'Please enter a valid full name using letters, spaces, hyphens, or apostrophes (at least 2 characters). No numbers.');
      hasError = true;
    }

    if (!emailField || !isValidEmail(emailField.value)) {
      showFieldError('email', 'Please enter a valid email address (e.g., name@gmail.com).');
      hasError = true;
    }

    if (!messageField || messageField.value.length < 5) {
      showFieldError('message', 'Please enter a message of at least 5 characters.');
      hasError = true;
    }

    if (!agreeCheckbox || !agreeCheckbox.checked) {
      showFieldError('agree', 'You must agree to the Privacy Policy and Terms & Conditions.');
      hasError = true;
    }

    if (hasError) {
      showStatus('Please fix the errors highlighted above.', 'error');
      const firstError = document.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input, textarea');
        if (input) setTimeout(() => input.focus({ preventScroll: true }), 200);
      }
      return;
    }

    // ---- Check Web3Forms key ----
    const accessKey = form.querySelector('[name="access_key"]').value;
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      showStatus(
        'This form is not fully set up yet — an access key from web3forms.com is still needed.',
        'error'
      );
      return;
    }

    // ---- Submit ----
    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = "Sending...";
    showStatus('Sending your message, please wait...', null); // neutral

    try {
      const subjectField = form.querySelector('[name="subject"]');
      if (nameField && nameField.value && subjectField) {
        subjectField.value = `New message from ${nameField.value} — Soul Winning Mission Church website`;
      }

      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        // ---- SUCCESS ----
        showStatus('Your message has been sent successfully! We\'ll be in touch soon.', 'success');
        form.reset();
        clearErrors(); // resets all field errors and button text

        // Override button to show success state
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-success-state');
        if (btnLabel) btnLabel.textContent = '✓ Sent!';

        // Auto-revert button and hide success after 6 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-success-state');
          if (btnLabel) btnLabel.textContent = 'Send Message';
          statusEl.style.display = 'none';
        }, 6000);

      } else {
        // ---- WEB3FORMS ERROR ----
        showStatus(
          'Something went wrong sending your message. Please try again or call us directly.',
          'error'
        );
        submitBtn.disabled = false;
        if (btnLabel) btnLabel.textContent = 'Send Message';
      }
    } catch (err) {
      // ---- NETWORK / CONNECTION ERROR ----
      showStatus(
        'Could not send your message — please check your internet connection or call us directly.',
        'error'
      );
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = 'Send Message';
    }
  });
});