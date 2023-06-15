let namesList = []

const addButton = document.getElementsByClassName("add-button")[0];
addButton.addEventListener('click', addItem);

const deleteButtons = document.getElementsByClassName("bought-cancel");
for (let i = 0; i < deleteButtons.length; i++)
    deleteButtons[i].addEventListener("click", deleteItem);

const buyButtons = document.getElementsByClassName("bought-button");
for (let i = 0; i < buyButtons.length; i++)
    buyButtons[i].addEventListener("click", buyItem);

const reduceButtons = document.getElementsByClassName("amount-minus");
for (let i = 0; i < reduceButtons.length; i++) {
    reduceButtons[i].addEventListener("click", reduceItem);
    if(parseInt(reduceButtons[i].nextElementSibling.textContent) <= 1)
        reduceButtons[i].disabled = true;
}

const increaseButtons = document.getElementsByClassName("amount-plus");
for (let i = 0; i < increaseButtons.length; i++)
    increaseButtons[i].addEventListener("click", increaseItem);

const names = document.getElementsByClassName("goods-name");
for (let i = 0; i < names.length; i++) {
    namesList.push(names[i].textContent.toLowerCase());
    names[i].addEventListener("click", changeName);
}

function addItem() {
    const addInput = document.getElementsByClassName("add-input")[0];
    const itemName = addInput.value;

    if (namesList.indexOf(itemName.toLowerCase())!==-1) {
        window.alert("These goods are already added!");
    } else if (itemName === '') {
        window.alert("Enter the name of the goods!");
    } else {
        const newItem = document.createElement("div");
        newItem.className = "goods";
        newItem.innerHTML = `
            <span class="goods-name">${itemName}</span>
            <div class="amount">
                <button class="amount-minus" data-tooltip="Reduce">-</button>
                <span class="amount-number">1</span>
                <button class="amount-plus" data-tooltip="Increase">+</button>
            </div>
            <div class="buttons">
                <button class="bought-button" data-tooltip="Buy">Bought</button>
                <button class="bought-cancel" data-tooltip="Cancel">X</button>
            </div>
        `;
        newItem.getElementsByClassName("bought-cancel")[0].addEventListener("click", deleteItem);
        newItem.getElementsByClassName("bought-button")[0].addEventListener("click", buyItem);
        newItem.getElementsByClassName("goods-name")[0].addEventListener("click", changeName);
        newItem.getElementsByClassName("amount-minus")[0].addEventListener("click", reduceItem);
        newItem.getElementsByClassName("amount-plus")[0].addEventListener("click", increaseItem);
        newItem.getElementsByClassName("amount-minus")[0].disabled = true;

        const goodsList = document.getElementsByClassName("menu")[0];
        const hr = document.createElement("hr");
        goodsList.appendChild(hr);
        goodsList.appendChild(newItem);

        const infoItem = document.createElement("span");
        infoItem.className = "product-item";
        infoItem.innerHTML = `
            ${itemName}
            <span class="item-amount">1</span>
        `;
        const leftList = document.getElementsByClassName("info-product")[0];
        leftList.appendChild(infoItem);

        namesList.push(itemName.toLowerCase());
    }

    addInput.value = "";
    addInput.focus();
}

function deleteItem(event) {
    const item = event.target.parentNode.parentNode;
    const hr = item.previousElementSibling;
    item.parentNode.removeChild(hr);
    item.parentNode.removeChild(item);

    const itemName = item.getElementsByClassName("goods-name")[0].textContent;
    namesList = namesList.filter(function(value) {
        return value !== itemName.toLowerCase();
    });
    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);
}

function buyItem(event) {
    const button = event.target;
    button.textContent = "Not bought";
    button.setAttribute("data-tooltip", "Don't buy");
    const item = button.parentNode.parentNode;
    item.className = "goods bought";

    const deleted = findProduct(item.getElementsByClassName("goods-name")[0].textContent);
    deleted.parentNode.removeChild(deleted);
    document.getElementsByClassName("info-product-bought")[0].appendChild(deleted);

    item.getElementsByClassName("goods-name")[0].disabled = true;

    button.removeEventListener("click", buyItem);
    button.addEventListener("click", function (){
        button.textContent = "Bought";
        button.setAttribute("data-tooltip", "Buy");
        item.className = "goods";

        const deleted = findProduct(item.getElementsByClassName("goods-name")[0].textContent);
        deleted.parentNode.removeChild(deleted);
        document.getElementsByClassName("info-product")[0].appendChild(deleted);

        item.getElementsByClassName("goods-name")[0].disabled = false;

        button.removeEventListener("click", this);
        button.addEventListener("click", buyItem);
    });
}

function reduceItem(event) {
    const button = event.target;
    const newValue = parseInt(button.nextElementSibling.textContent) - 1;
    button.nextElementSibling.textContent = newValue.toString();
    if(newValue===1) button.disabled = true;

    const amountBlock = button.parentNode;
    const changed = findProduct(amountBlock.previousElementSibling.textContent).getElementsByClassName("item-amount")[0];
    changed.textContent = newValue.toString();
}

function increaseItem(event) {
    const button = event.target;
    const span = button.previousElementSibling;
    const newValue = parseInt(span.textContent) + 1;
    button.previousElementSibling.textContent = newValue.toString();
    if(span.previousElementSibling.disabled) span.previousElementSibling.disabled = false;

    const amountBlock = button.parentNode;
    const changed = findProduct(amountBlock.previousElementSibling.textContent).getElementsByClassName("item-amount")[0];
    changed.textContent = newValue.toString();
}

function changeName(event) {
    const spam = event.target;

    if(!spam.disabled) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = spam.textContent;
        input.className = "goods-input";
        spam.parentNode.replaceChild(input, spam);
        input.focus();

        namesList = namesList.filter(function (value) {
            return value !== spam.textContent.toLowerCase();
        });

        input.addEventListener('blur', function () {
            let newName = input.value;
            if (namesList.indexOf(newName.toLowerCase()) !== -1) {
                window.alert("This name is already taken!");
            } else if (newName === '') {
                window.alert("You haven't entered any text!");
            } else {
                const changed = findProduct(spam.textContent);
                changed.innerHTML = `
                ${newName}
                ${changed.firstElementChild.outerHTML}
            `;
                spam.textContent = newName;
            }
            namesList.push(spam.textContent.toLowerCase());
            input.parentNode.replaceChild(spam, input);
        });
    }
}

function findProduct(name) {
    const spans1 = document.getElementsByClassName("info-product")[0].getElementsByClassName('product-item');
    const spans2 = document.getElementsByClassName("info-product-bought")[0].getElementsByClassName('product-item');

    for (let i = 0; i < spans1.length; i++) {
        const span = spans1[i];
        const text = span.textContent.trim();

        if (text.indexOf(name+"\n") === 0) {
            return span;
        }
    }

    for (let i = 0; i < spans2.length; i++) {
        const span = spans2[i];
        const text = span.textContent.trim();

        if (text.indexOf(name+"\n") === 0) {
            return span;
        }
    }
}