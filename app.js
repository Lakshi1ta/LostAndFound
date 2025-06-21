document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lostForm");
  const successMsg = document.getElementById("successMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const contact = document.getElementById("contact").value;
    window.addEventListener('offline', () => {
  alert("You are offline. Please connect to the internet.");
});

    try {
      await db.collection("lostItems").add({
        itemName,
        location,
        description,
        contact,
        status: "Open",
        createdAt: new Date()
      });

      successMsg.classList.remove("hidden");
      form.reset();
    } catch (error) {
      console.error("Error saving lost item:", error);
      alert("Failed to submit. Try again.");
    }
  });
});
