const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const MODES = { audit:"audit", mock:"mock", auto:"auto" };
let mode = MODES.audit;

$("#year").textContent = new Date().getFullYear();

$$(".pill").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    if (btn.classList.contains("disabled")) return;
    $$(".pill").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    $("#submit").textContent = mode === MODES.mock ? "Generate Mock Fixes" : "Run Free Audit";
  });
});

$("#audit-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const url = $("#url").value.trim();
  const email = $("#email").value.trim();
  const own = $("#own").checked;
  const alertEl = $("#alert");
  alertEl.classList.add("hidden");
  if (!own) return;

  const btn = $("#submit");
  btn.disabled = true; btn.textContent = "Queuing…";

  try {
    // TODO: replace with your worker/tunnel endpoint later
    const ENDPOINT = "https://example.com/jobs"; // <-- change this after you set up your API
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Aireo-Key": "dev-placeholder" // change in production
      },
      body: JSON.stringify({ target_url: url, email, mode })
    });

    if (res.status === 429) {
      throw new Error("We’re getting a lot of love right now. Please try again in a few minutes.");
    }
    if (!res.ok) {
      const data = await res.json().catch(()=>({message:"Something went wrong."}));
      throw new Error(data.message || "Request failed.");
    }
    const data = await res.json();
    if (data.status === "unavailable" && mode === MODES.auto) {
      throw new Error("Auto Site Editor is coming soon. Join the waitlist!");
    }
    // Simple success UX:
    window.location.href = "thankyou.html";
  } catch (err) {
    alertEl.textContent = err.message || "Error. Please try again.";
    alertEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = mode === MODES.mock ? "Generate Mock Fixes" : "Run Free Audit";
  }
});
