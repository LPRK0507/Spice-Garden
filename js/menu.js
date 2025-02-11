// Write code for fetching menu details using Axios API
// Assuming menu data is fetched from an API endpoint
const menuDataUrl = "http://localhost:3006/menu"; // Replace with your actual API URL

// Function to fetch menu data from the server using Axios
async function fetchMenuData() {
    try {
        const response = await axios.get(menuDataUrl);
        const menuData = response.data;
        displayMenu(menuData);  // Display the entire menu initially
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }
}

// Function to display menu data in the table
function displayMenu(menuItems) {
    const tableBody = document.querySelector('#menuTable tbody');
    tableBody.innerHTML = "";  // Clear any previous data

    menuItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td><button class="btn btn-warning">Order Now</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to filter menu items by category
function filterMenu(category) {
    axios.get(menuDataUrl)
        .then(response => {
            const menuData = response.data;
            const filteredItems = menuData.filter(item => item.category === category);
            displayMenu(filteredItems);  // Display filtered menu items
        })
        .catch(error => {
            console.error("Error filtering menu data:", error);
        });
}

// Fetch menu data when the page loads
document.addEventListener("DOMContentLoaded", fetchMenuData);
