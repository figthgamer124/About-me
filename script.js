document.addEventListener("DOMContentLoaded", () => {
  const inviteButtons = document.querySelectorAll(".primary-button");
  const modal = document.getElementById("inviteModal");
  const agreeCheckbox = document.getElementById("agree");
  const continueButton = document.getElementById("continueInvite");
  const cancelInvite = document.getElementById("cancelInvite");

  // Show modal when "Invite Bot" button is clicked
  inviteButtons.forEach(button => {
    button.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  });

  // Hide modal when "Cancel" is clicked
  cancelInvite.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Enable "Continue" button only when checkbox is checked
  agreeCheckbox.addEventListener("change", () => {
    continueButton.disabled = !agreeCheckbox.checked;
  });

  // Redirect to Discord invite when "Continue" is clicked
  continueButton.addEventListener("click", () => {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1410414657499566141&permissions=8&integration_type=0&scope=bot";
  });

  // Fetch bot status
  fetch("https://gist.githubusercontent.com/figthgamer124/fcb15385ebacc7e89c79e95dadbc7d86/raw/status.json")
    .then(response => response.json())
    .then(data => {
      const statusIndicator = document.querySelector(".dot");
      const statusText = document.querySelector(".status-text");

      if (data.status === "online") {
        statusIndicator.style.backgroundColor = "#00f0ff";
        statusText.textContent = "Online";
      } else {
        statusIndicator.style.backgroundColor = "#f00";
        statusText.textContent = "Offline";
      }
    })
    .catch(error => {
      console.error("Error fetching bot status:", error);
    });
});
