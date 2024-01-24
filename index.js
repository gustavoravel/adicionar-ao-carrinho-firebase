import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = require('./config');

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListRef = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEL = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
    const inputValue = inputFieldEl.value.trim();

    if (inputValue) {
        push(shoppingListRef, inputValue);
        clearInputField();
    }
});

shoppingListEL.addEventListener("click", function (event) {
    const target = event.target;
    if (target.tagName === "LI") {
        const itemID = target.dataset.itemId;
        const exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    }
});

onValue(shoppingListRef, function (snapshot) {
    clearShoppingListEL();

    if (snapshot.exists()) {
        snapshot.forEach(function (itemSnapshot) {
            const itemID = itemSnapshot.key;
            const itemValue = itemSnapshot.val();
            appendItemToShoppingListEL(itemID, itemValue);
        });
    } else {
        shoppingListEL.innerHTML = "Sem itens aqui... ainda";
    }
});

function clearInputField() {
    inputFieldEl.value = "";
}

function clearShoppingListEL() {
    shoppingListEL.innerHTML = "";
}

function appendItemToShoppingListEL(itemID, itemValue) {
    const newEl = document.createElement("li");
    newEl.textContent = itemValue;
    newEl.dataset.itemId = itemID;
    shoppingListEL.appendChild(newEl);
}
