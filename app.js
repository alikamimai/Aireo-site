document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('optin-form');
  const errorBox = document.getElementById('form-error');
  const successBox = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const consented = document.getElementById('sms-consent').checked;

    errorBox.style.display = 'none';

    if (!name || !phone || !consented) {
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Store locally as backup
    const record = { name, phone, email, consented: true, submittedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('aireo_submissions') || '[]');
    existing.push(record);
    localStorage.setItem('aireo_submissions', JSON.stringify(existing));

    // Show success
    form.style.display = 'none';
    successBox.style.display = 'block';
    successBox.innerHTML = `
      <strong>Thank you, ${name}.</strong><br>
      We received your information and will reach out to you at ${phone} shortly.<br>
      <span style="font-size:12px; opacity:0.8; display:block; margin-top:8px;">No obligation. No upfront cost.</span>
    `;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
