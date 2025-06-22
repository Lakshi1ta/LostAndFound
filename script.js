import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVLYN7ZyT6BVJyi5IrtbZ_LiKOCD1cMUQ",
  authDomain: "lostandfound-c5cc3.firebaseapp.com",
  projectId: "lostandfound-c5cc3",
  storageBucket: "lostandfound-c5cc3.firebasestorage.app",
  messagingSenderId: "493880880100",
  appId: "1:493880880100:web:94ba0302d280cfd8c1b5f1",
  measurementId: "G-JV9WNW7PGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and display items
const itemsContainer = document.getElementById("itemsContainer");
const itemCount = document.getElementById("itemCount");

async function fetchItems() {
  try {
    const lostQuery = query(collection(db, "lostItems"), orderBy("createdAt", "desc"));
    const foundQuery = query(collection(db, "foundItems"), orderBy("createdAt", "desc"));

    const [lostSnapshot, foundSnapshot] = await Promise.all([
      getDocs(lostQuery),
      getDocs(foundQuery)
    ]);

    const allItems = [];

    lostSnapshot.forEach(doc => {
      allItems.push({ ...doc.data(), status: "Lost" });
    });

    foundSnapshot.forEach(doc => {
      allItems.push({ ...doc.data(), status: "Found" });
    });

    // Sort by createdAt timestamp (fallback to 0)
    allItems.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    itemsContainer.innerHTML = "";
    itemCount.textContent = `Showing ${allItems.length} item(s)`;

    allItems.forEach((data) => {
      const tagClass = data.status === 'Lost'
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';

      const itemHTML = `
        <div class="p-4 hover:bg-gray-50 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">${data.itemName || 'Unnamed'}</h3>
              <p class="text-sm text-gray-600">${data.description || 'No description provided'}</p>
              <p class="text-sm text-gray-500">📍 ${data.location || 'Unknown location'}</p>
              <p class="text-sm text-blue-500">📞 ${data.contact || 'No contact info'}</p>
            </div>
            <span class="${tagClass} inline-block px-2 py-1 text-xs font-semibold rounded-full">
              ${data.status}
            </span>
          </div>
        </div>
      `;
      itemsContainer.innerHTML += itemHTML;
    });

  } catch (err) {
    console.error("Failed to load items:", err);
    itemsContainer.innerHTML = `<p class="text-red-600 p-4">Failed to load items.</p>`;
  }
}

fetchItems();
