document.addEventListener("DOMContentLoaded", () => {

  const inviteButtons = document.querySelectorAll(".primary-button");
  const modal = document.getElementById("inviteModal");
  const agreeCheckbox = document.getElementById("agree");
  const continueButton = document.getElementById("continueInvite");
  const cancelInvite = document.getElementById("cancelInvite");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  inviteButtons.forEach(button => {
    button.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.style.display = "flex";
    });
  });

  cancelInvite.addEventListener("click", () => {
    modal.style.display = "none";
  });

  agreeCheckbox.addEventListener("change", () => {
    continueButton.disabled = !agreeCheckbox.checked;
  });
  
  continueButton.addEventListener("click", () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1410414657499566141&permissions=8&integration_type=0&scope=bot";
  });
  
  // Mobile navigation
if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

  // Close menu if the user taps outside of it
  document.addEventListener("click", (e) => {
    if (
      !navMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      navMenu.classList.remove("active");
    }
  });

}
  function loadBotStatus() {

    fetch("https://gist.githubusercontent.com/figthgamer124/fcb15385ebacc7e89c79e95dadbc7d86/raw/status.json?t=" + Date.now())
      .then(response => response.json())
      .then(data => {

        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("statusText");
        const uptimeText = document.getElementById("uptimeText");

        const liveDot = document.getElementById("liveDot");
        const liveStatus = document.getElementById("liveStatus");
        const liveUptime = document.getElementById("liveUptime");

        const serverCount = document.getElementById("serverCount");


        const lastUpdate = new Date(data.last_update).getTime();
        const alive = (Date.now() - lastUpdate) < 120000;


        if (data.online && alive) {

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


        function formatUptime(seconds) {

          const d = Math.floor(seconds / 86400);
          const h = Math.floor((seconds % 86400) / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = Math.floor(seconds % 60);

          return `${d}d ${h}h ${m}m ${s}s`;

        }


        if (window.uptimeInterval) {
          clearInterval(window.uptimeInterval);
        }


        let uptime =
          (data.uptime || 0) +
          Math.floor((Date.now() - lastUpdate) / 1000);


        function updateUptime() {

          uptimeText.textContent =
            "Uptime: " + formatUptime(uptime);

          liveUptime.textContent =
            "Uptime: " + formatUptime(uptime);

          uptime++;

        }


        updateUptime();

        window.uptimeInterval = setInterval(updateUptime, 1000);



        if (serverCount) {

          serverCount.textContent =
            (data.servers ?? 0).toLocaleString();

        }


      })
      .catch(error => {

        console.error("Error fetching bot status:", error);

        const statusText = document.getElementById("statusText");
        const liveStatus = document.getElementById("liveStatus");

        if (statusText)
          statusText.textContent = "Status unavailable";

        if (liveStatus)
          liveStatus.textContent = "Status unavailable";

      });

  }


  // Load once immediately
  loadBotStatus();


  // Refresh JSON every minute
  setInterval(loadBotStatus, 60000);


});
