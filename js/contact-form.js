/* ==========================================================
   CONTACT / PRAYER REQUEST FORMS — Web3Forms submission with
   strict validation.

   Works on any <form class="contact-form"> found on the page —
   the main "Get In Touch" form on visit.html and the "Prayer
   Request" form on soul-winning.html both reuse this same logic.
   Fields are optional per-form: a form only needs the fields it
   actually contains (e.g. the prayer form has no phone field).
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form.contact-form");
  if (!forms.length) return;

  forms.forEach(initContactForm);

  function initContactForm(form) {
    const statusEl = form.querySelector(".form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    const defaultLabel = btnLabel ? btnLabel.textContent : "Send Message";

    function sanitiseInput(value) {
      if (typeof value !== "string") return "";
      let clean = value.trim();
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return clean.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidName(name) {
      return /^[A-Za-z\s\-']+$/.test(name);
    }

    function clearErrors() {
      form.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-success-state');
        if (btnLabel) btnLabel.textContent = defaultLabel;
      }
    }

    function showFieldError(fieldName, message) {
      const group = form.querySelector(`.form-group[data-field="${fieldName}"]`);
      if (!group) return;
      group.classList.add('error');
      const errorSpan = group.querySelector('.field-error');
      if (errorSpan) errorSpan.textContent = message;
    }

    function showStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'form-status';
      if (type === 'success') statusEl.classList.add('form-status--success');
      else if (type === 'error') statusEl.classList.add('form-status--error');
      statusEl.style.display = 'block';
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearErrors();

      const nameField = form.querySelector('[name="name"]');
      const emailField = form.querySelector('[name="email"]');
      const phoneField = form.querySelector('[name="phone"]');
      const messageField = form.querySelector('[name="message"]');
      const agreeCheckbox = form.querySelector('[name="agree"]');

      if (nameField) nameField.value = sanitiseInput(nameField.value);
      if (emailField) emailField.value = sanitiseInput(emailField.value);
      if (phoneField) phoneField.value = sanitiseInput(phoneField.value);
      if (messageField) messageField.value = sanitiseInput(messageField.value);

      let hasError = false;

      if (nameField && (nameField.value.length < 2 || !isValidName(nameField.value))) {
        showFieldError('name', 'Please enter a valid full name using letters, spaces, hyphens, or apostrophes (at least 2 characters). No numbers.');
        hasError = true;
      }

      if (emailField && !isValidEmail(emailField.value)) {
        showFieldError('email', 'Please enter a valid email address (e.g., name@gmail.com).');
        hasError = true;
      }

      if (messageField) {
        const minLen = parseInt(messageField.getAttribute('minlength'), 10) || 5;
        if (messageField.value.length < minLen) {
          showFieldError('message', `Please enter at least ${minLen} characters.`);
          hasError = true;
        }
      }

      if (agreeCheckbox && !agreeCheckbox.checked) {
        showFieldError('agree', 'You must agree to the Privacy Policy and Terms & Conditions.');
        hasError = true;
      }

      if (hasError) {
        showStatus('Please fix the errors highlighted above.', 'error');
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = firstError.querySelector('input, textarea');
          if (input) setTimeout(() => input.focus({ preventScroll: true }), 200);
        }
        return;
      }

      const accessKeyField = form.querySelector('[name="access_key"]');
      const accessKey = accessKeyField ? accessKeyField.value : "";
      if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
        showStatus('This form is not fully set up yet — an access key from web3forms.com is still needed.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = "Sending...";
      showStatus('Sending your message, please wait...', null);

      try {
        const subjectField = form.querySelector('[name="subject"]');
        if (nameField && nameField.value && subjectField) {
          const baseSubject = subjectField.dataset.subjectPrefix || 'New message';
          subjectField.value = `${baseSubject} from ${nameField.value} — Soul Winning Mission Church website`;
        }

        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          showStatus('Your message has been sent successfully! We\'ll be in touch soon.', 'success');
          form.reset();
          clearErrors();

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-success-state');
          }
          if (btnLabel) btnLabel.textContent = '✓ Sent!';

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.classList.remove('btn-success-state');
            }
            if (btnLabel) btnLabel.textContent = defaultLabel;
            if (statusEl) statusEl.style.display = 'none';
          }, 6000);

        } else {
          showStatus('Something went wrong sending your message. Please try again or call us directly.', 'error');
          if (submitBtn) submitBtn.disabled = false;
          if (btnLabel) btnLabel.textContent = defaultLabel;
        }
      } catch (err) {
        showStatus('Could not send your message — please check your internet connection or call us directly.', 'error');
        if (submitBtn) submitBtn.disabled = false;
        if (btnLabel) btnLabel.textContent = defaultLabel;
      }
    });
  }
});
