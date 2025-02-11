function validInput() {
    let isValid = true;

    clearErrors();

    const orderId = document.getElementById("id").value;
    if (!orderId) {
        isValid = false;
        document.getElementById("order-id-error").textContent = "Order Id is required";
    }

    const name = document.getElementById("name").value;
    if (!name) {
        isValid = false;
        document.getElementById("name-error").textContent = "Name is required";
    }

    const email = document.getElementById("email").value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
        isValid = false;
        document.getElementById("email-error").textContent = "Enter valid Email ID";
    }

    const number = document.getElementById("contact").value;
    if (!number || number.length !== 10) {
        isValid = false;
        document.getElementById("contact-error").textContent = "Number should be 10 digits";
    }

    const date = document.getElementById("date").value;
    if (!date) {
        isValid = false;
        document.getElementById("date-error").textContent = "Date is required";
    }

    const address = document.getElementById("address").value;
    if (!address || address.length < 10) {
        isValid = false;
        document.getElementById("address-error").textContent = "Address is required and must have at least 10 characters";
    }

    return isValid;
}

function clearErrors() {
    const errors = document.querySelectorAll(".error");
    errors.forEach((error) => {
        error.textContent = "";
    });
}

document.querySelector(".order-now").addEventListener('click', function (event) {
    event.preventDefault();
    if (validInput()) {
        submitOrder();
    } else {
        alert("Invalid Input");
    }
});

// Dynamically add order form fields
let itemCount = 0;

function addOrderItem() {
    itemCount++;
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('order-item');
    itemDiv.setAttribute('id', `order-item-${itemCount}`);

    itemDiv.innerHTML = `
        <div class="order-item-inputs">
            <input type="text" id="category-${itemCount}" name="category-${itemCount}" placeholder="Category name" required>
            <input type="text" id="item-name-${itemCount}" name="item-name-${itemCount}" placeholder="Item name" required>
            <input type="number" id="price-${itemCount}" name="price-${itemCount}" placeholder="0" required oninput="calculateAmount(${itemCount})">
            <input type="number" id="quantity-${itemCount}" name="quantity-${itemCount}" placeholder="0" required oninput="calculateAmount(${itemCount})">
            <input type="text" id="amount-${itemCount}" name="amount-${itemCount}" readonly>
            <button id="add-button-${itemCount}" onClick="disableAddButton(${itemCount})">Add</button>
        </div>
    `;

    document.getElementById('order-item').appendChild(itemDiv);
}

document.querySelector('.addOrder').addEventListener('click', addOrderItem);

function calculateAmount(index) {
    const price = parseFloat(document.getElementById(`price-${index}`).value) || 0;
    const quantity = parseInt(document.getElementById(`quantity-${index}`).value) || 0;

    const amount = price * quantity;
    document.getElementById(`amount-${index}`).value = amount.toFixed(2);

    calculateTotalAmount();
}

function calculateTotalAmount() {
    let total = 0;
    for (let i = 1; i <= itemCount; i++) {
        const amount = parseFloat(document.getElementById(`amount-${i}`).value) || 0;
        total += amount;
    }

    document.getElementById('total').value = total.toFixed(2);
    return total;
}

function disableAddButton(index) {
    const addButton = document.getElementById(`add-button-${index}`);
    addButton.disabled = true;

    document.getElementById(`category-${index}`).readOnly = true;
    document.getElementById(`item-name-${index}`).readOnly = true;
    document.getElementById(`price-${index}`).readOnly = true;
    document.getElementById(`quantity-${index}`).readOnly = true;
    document.getElementById(`amount-${index}`).readOnly = true;

    calculateTotalAmount();
}

function submitOrder() {
    const orderData = [];

    for (let i = 1; i <= itemCount; i++) {
        const category = document.getElementById(`category-${i}`)?.value;
        const itemName = document.getElementById(`item-name-${i}`)?.value;
        const price = parseFloat(document.getElementById(`price-${i}`)?.value) || 0;
        const quantity = parseInt(document.getElementById(`quantity-${i}`)?.value) || 0;
        const amount = parseFloat(document.getElementById(`amount-${i}`)?.value) || 0;

        if (category && itemName && price && quantity) {
            orderData.push({
                category: category,
                itemName: itemName,
                price: price,
                quantity: quantity,
                amount: amount
            });
        }
    }

    // Recalculate the total amount after populating orderData
    const totalAmount = orderData.reduce((sum, item) => sum + item.amount, 0);

    if (orderData.length > 0) {
        const orderId = document.getElementById("id").value;

        axios.post("http://localhost:3002/order", {
            orderId: orderId,
            items: orderData,
            totalAmount: totalAmount
        })
            .then(() => {
                clearForm();
                checkForComplements(totalAmount);
            })
            .catch(error => {
                console.error("Error saving order:", error);
            });
    }
}

function countMainCourse() {
    for (let i = 1; i <= itemCount; i++) {
        const category = document.getElementById(`category-${i}`)?.value;
        const quantity = parseInt(document.getElementById(`quantity-${i}`)?.value);
        if (quantity >= 2 && category.toLowerCase() === "main course") {
            return true;
        }
    }
    return false;
}
//?-code doesn't throw an error if the element doesn't exist, returning undefined instead.

function checkForComplements(totalAmount) {
    const mainCourseCount = countMainCourse();

    if (mainCourseCount) {
        alert(`Total amount to be paid: $ ${totalAmount.toFixed(2)}\nThe order is eligible for a free soft drink.`);
    } else {
        alert(`Total amount to be paid: $ ${totalAmount.toFixed(2)}`);
    }
}


function clearForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("address").value = "";
    document.getElementById("date").value = "";
    document.getElementById("total").value = "";

    const orderItems = document.getElementById("order-item");
    orderItems.innerHTML = "";

    itemCount = 0;
}
