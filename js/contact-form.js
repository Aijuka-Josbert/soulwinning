
/* ==========================================================
   CONTACT FORM — Web3Forms submission
   Submits the Visit page contact form via fetch to Web3Forms
   (https://web3forms.com), no backend required. Shows inline
   success/error feedback without a page reload.

   Setup: replace the access_key hidden input value in
   visit.html with a real key from web3forms.com.
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contactFormStatus");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const btnLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const accessKey = form.querySelector('[name="access_key"]').value;
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      statusEl.textContent =
        "This form is not fully set up yet — an access key from web3forms.com is still needed.";
      statusEl.classList.add("form-status--error");
      return;
    }

    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = "Sending...";
    statusEl.textContent = "";
    statusEl.classList.remove("form-status--error", "form-status--success");

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        statusEl.textContent =
          "Thank you — your message has been sent. We'll be in touch soon.";
        statusEl.classList.add("form-status--success");
        form.reset();
      } else {
        statusEl.textContent =
          "Something went wrong sending your message. Please try again or call us directly.";
        statusEl.classList.add("form-status--error");
      }
    } catch (err) {
      statusEl.textContent =
        "Could not send your message — please check your connection or call us directly.";
      statusEl.classList.add("form-status--error");
    } finally {
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = "Send Message";
    }
  });
});
