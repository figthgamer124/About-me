document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // Element References
  // ==========================================
  const inviteButtons = document.querySelectorAll("#inviteTop, #inviteHero");
  const modal = document.getElementById("inviteModal");
  const agreeCheckbox = document.getElementById("agree");
  const continueButton = document.getElementById("continueInvite");
  const cancelInvite = document.getElementById("cancelInvite");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const cmdSearchInput = document.getElementById("cmdSearch");

  const DISCORD_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1410414657499566141&permissions=8&integration_type=0&scope=bot";
  const STATUS_GIST_URL = "https://gist.githubusercontent.com/figthgamer124/fcb15385ebacc7e89c79e95dadbc7d86/raw/status.json";

  // ==========================================
  // Modal Functionality
  // ==========================================
  const openModal = () => {
    if (!modal) return;
    modal.classList.remove("hidden");
    agreeCheckbox.checked = false;
    continueButton.disabled = true;
    agreeCheckbox.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add("hidden");
  };

  inviteButtons.forEach(button => {
    button.addEventListener("click", openModal);
  });

  if (cancelInvite) {
    cancelInvite.addEventListener("click", closeModal);
  }

  // Close modal when clicking on backdrop
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  if (agreeCheckbox && continueButton) {
    agreeCheckbox.addEventListener("change", () => {
      continueButton.disabled = !agreeCheckbox.checked;
    });

    continueButton.addEventListener("click", () => {
      if (agreeCheckbox.checked) {
        window.location.href = DISCORD_INVITE_URL;
      }
    });
  }

  // ==========================================
  // Mobile Navigation
  // ==========================================
  if (menuToggle && navMenu) {
    const toggleMenu = (isOpen) => {
      const activeState = isOpen !== undefined ? isOpen : !navMenu.classList.contains("active");
      navMenu.classList.toggle("active", activeState);
      menuToggle.setAttribute("aria-expanded", activeState.toString());
    };

    menuToggle.addEventListener("click", () => toggleMenu());

    // Close menu when clicking navigation links
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => toggleMenu(false));
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // ==========================================
  // Command Showcase Filter (Category & Collapsible Aware)
  // ==========================================
  if (cmdSearchInput) {
    cmdSearchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const categories = document.querySelectorAll(".command-category");

      // Handle grouped <details> categories
      if (categories.length > 0) {
        categories.forEach(cat => {
          const cards = cat.querySelectorAll(".command-card");
          let hasMatch = false;

          cards.forEach(card => {
            const name = card.getAttribute("data-name")?.toLowerCase() || "";
            const desc = card.querySelector(".command-desc")?.textContent.toLowerCase() || "";

            if (name.includes(query) || desc.includes(query)) {
              card.style.display = "";
              hasMatch = true;
            } else {
              card.style.display = "none";
            }
          });

          if (query !== "") {
            cat.open = hasMatch;
            cat.style.display = hasMatch ? "" : "none";
          } else {
            cat.open = false;
            cat.style.display = "";
            cards.forEach(card => (card.style.display = ""));
          }
        });
      } else {
        // Fallback for flat command grid layout
        const commandCards = document.querySelectorAll(".command-card");
        commandCards.forEach(card => {
          const name = card.getAttribute("data-name")?.toLowerCase() || "";
          const desc = card.querySelector(".command-desc")?.textContent.toLowerCase() || "";

          if (name.includes(query) || desc.includes(query)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      }
    });
  }

  // ==========================================
  // Live Status & Metrics Handler
  // ==========================================
  function formatUptime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0s";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    return parts.join(" ");
  }

  function loadBotStatus() {
    fetch(`${STATUS_GIST_URL}?t=${Date.now()}`)
      .then(response => {
        if (!response.ok) throw new Error("Network response failed");
        return response.json();
      })
      .then(data => {
        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("statusText");
        const uptimeText = document.getElementById("uptimeText");

        const liveDot = document.getElementById("liveDot");
        const liveStatus = document.getElementById("liveStatus");
        const liveUptime = document.getElementById("liveUptime");

        const serverCount = document.getElementById("serverCount");

        const lastUpdate = new Date(data.last_update).getTime();
        const isAlive = (Date.now() - lastUpdate) < 120000;
        const isOnline = data.online && isAlive;

        // Apply status themes
        const statusColor = isOnline ? "#10B981" : "#EF4444";
        const statusLabel = isOnline ? "Bot is Online" : "Bot is Offline";

        if (statusDot) statusDot.style.backgroundColor = statusColor;
        if (liveDot) liveDot.style.backgroundColor = statusColor;

        if (statusText) statusText.textContent = statusLabel;
        if (liveStatus) liveStatus.textContent = statusLabel;

        // Manage local tick counter for smooth uptime timer
        if (window.uptimeInterval) {
          clearInterval(window.uptimeInterval);
        }

        let currentUptime = (data.uptime || 0) + Math.floor((Date.now() - lastUpdate) / 1000);

        function updateUptimeDisplay() {
          const formatted = `Uptime: ${formatUptime(currentUptime)}`;
          if (uptimeText) uptimeText.textContent = formatted;
          if (liveUptime) liveUptime.textContent = formatted;
          currentUptime++;
        }

        updateUptimeDisplay();
        window.uptimeInterval = setInterval(updateUptimeDisplay, 1000);

        // Server count display formatting
        if (serverCount) {
          serverCount.textContent = (data.servers ?? 0).toLocaleString();
        }
      })
      .catch(error => {
        console.error("Error fetching bot status:", error);

        const statusText = document.getElementById("statusText");
        const liveStatus = document.getElementById("liveStatus");

        if (statusText) statusText.textContent = "Status unavailable";
        if (liveStatus) liveStatus.textContent = "Status unavailable";
      });
  }

  // Initial load & 60-second polling refresh
  loadBotStatus();
  setInterval(loadBotStatus, 60000);

});