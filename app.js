// app.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lostForm");
  const successMsg = document.getElementById("successMsg");

  // Detect offline mode
  window.addEventListener("offline", () => {
    alert("You are offline. Please connect to the internet.");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("itemName").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!itemName || !location || !description || !contact) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await db.collection("lostItems").add({
        itemName,
        location,
        description,
        contact,
        status: "Open",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      successMsg.classList.remove("hidden");
      successMsg.textContent = "✅ Your lost item was submitted successfully!";
      form.reset();

      setTimeout(() => {
        successMsg.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error saving lost item:", error);
      alert("Failed to submit. Please try again.");
    }
  });
});
