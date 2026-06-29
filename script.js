document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Invite Modal
  // ==========================
  const inviteButtons = document.querySelectorAll(".primary-button");
  const modal = document.getElementById("inviteModal");
  const agreeCheckbox = document.getElementById("agree");
  const continueButton = document.getElementById("continueInvite");
  const cancelInvite = document.getElementById("cancelInvite");

  inviteButtons.forEach(button => {
    // Don't trigger the modal when clicking the Continue button itself
    if (button.id === "continueInvite") return;

    button.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.style.display = "flex";
    });
  });

  cancelInvite.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.style.display = "none";
    agreeCheckbox.checked = false;
    continueButton.disabled = true;
  });

  agreeCheckbox.addEventListener("change", () => {
    continueButton.disabled = !agreeCheckbox.checked;
  });

  continueButton.addEventListener("click", () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1410414657499566141&permissions=8&integration_type=0&scope=bot";
  });

  // ==========================
  // Bot Status
  // ==========================
  const URL =
    "https://gist.githubusercontent.com/figthgamer124/fcb15385ebacc7e89c79e95dadbc7d86/raw/status.json";

  const OFFLINE_AFTER = 120;

  function formatUptime(seconds = 0) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
  }

  async function loadStatus() {
    try {
      const res = await fetch(URL + "?t=" + Date.now());
      const data = await res.json();

      const statusDot = document.getElementById("statusDot");
      const statusText = document.getElementById("statusText");
      const uptimeText = document.getElementById("uptimeText");

      const liveDot = document.getElementById("liveDot");
      const liveStatus = document.getElementById("liveStatus");
      const liveUptime = document.getElementById("liveUptime");

      const lastUpdate = new Date(data.last_update).getTime();
      const alive = Date.now() - lastUpdate < OFFLINE_AFTER * 1000;

      if (alive && data.online) {
        statusDot.style.backgroundColor = "#00f0ff";
        liveDot.style.backgroundColor = "#00f0ff";

        statusText.textContent = "Bot is Online";
        liveStatus.textContent = "Bot is Online";
      } else {
        statusDot.style.backgroundColor = "#ff3b3b";
        liveDot.style.backgroundColor = "#ff3b3b";

        statusText.textContent = "Bot is Offline";
        liveStatus.textContent = "Bot is Offline";
      }

      const uptime = "Uptime: " + formatUptime(data.uptime || 0);

      uptimeText.textContent = uptime;
      liveUptime.textContent = uptime;
    } catch (err) {
      console.error("Status fetch failed:", err);

      document.getElementById("statusText").textContent =
        "Status unavailable";

      document.getElementById("liveStatus").textContent =
        "Status unavailable";
    }
  }

  loadStatus();
  setInterval(loadStatus, 60000);
});
