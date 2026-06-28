document.addEventListener("DOMContentLoaded", () => {
  const inviteButtons = document.querySelectorAll(".primary-button");
  const modal = document.getElementById("inviteModal");
  const agreeCheckbox = document.getElementById("agree");
  const continueButton = document.getElementById("continueInvite");
  const cancelInvite = document.getElementById("cancelInvite");

  // Show modal on "Invite Bot" button click
  inviteButtons.forEach(button => {
    button.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  });

  // Hide modal on "Cancel" click
  cancelInvite.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Enable "Continue" button when checkbox is checked
  agreeCheckbox.addEventListener("change", () => {
    continueButton.disabled = !agreeCheckbox.checked;
  });

  // Redirect to invite link on "Continue" click
  continueButton.addEventListener("click", () => {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1410414657499566141&permissions=8&integration_type=0&scope=bot";
  });

  // Fetch bot status
  fetch("https://gist.githubusercontent.com/yourusername/yourgistid/raw/yourfile.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("statusText").textContent = data.status;
      document.getElementById("uptimeText").textContent = data.uptime;
    })
    .catch(error => {
      console.error("Error fetching status:", error);
    });
});
