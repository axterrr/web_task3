let itemsList = [];
let namesList = [];

window.addEventListener('beforeunload', function (){
    localStorage.setItem("data", JSON.stringify(itemsList));
});

window.addEventListener('load', function (){
    //localStorage.clear();
    const storedData = localStorage.getItem('data');
    if (storedData) itemsList = JSON.parse(storedData);
    else itemsList = [{name: "Tomatoes", amount: 2, bought: true},
                      {name: "Cookies", amount: 2, bought: false},
                      {name: "Cheese", amount: 1, bought: false}];
    for (let i = 0; i < itemsList.length; i++)
        addItem(itemsList[i]);
});

const addButton = document.getElementsByClassName("add-button")[0];
addButton.addEventListener('click', add);

function add() {
    const addInput = document.getElementsByClassName("add-input")[0];
    const itemName = addInput.value;

    if (namesList.indexOf(itemName.toLowerCase())!==-1) {
        window.alert("These goods are already added!");
    } else if (itemName === '') {
        window.alert("Enter the name of the goods!");
    } else {
        const newItem = {
            name: itemName,
            amount: 1,
            bought: false
        };
        addItem(newItem);
        itemsList.push(newItem);
    }

    addInput.value = "";
    addInput.focus();
}

function addItem(item) {
    const newItem = document.createElement("div");
    newItem.className = "goods";
    let tooltip = "Buy";
    let button = "Bought";

    if(item.bought) {
        newItem.className = "goods bought";
        tooltip = "Don't buy";
        button = "Not bought";
    }

    newItem.innerHTML = `
            <span class="goods-name">${item.name}</span>
            <div class="amount">
                <button class="amount-minus" data-tooltip="Reduce">-</button>
                <span class="amount-number">${item.amount}</span>
                <button class="amount-plus" data-tooltip="Increase">+</button>
            </div>
            <div class="buttons">
                <button class="bought-button" data-tooltip="${tooltip}">${button}</button>
                <button class="bought-cancel" data-tooltip="Cancel">X</button>
            </div>
        `;

    newItem.getElementsByClassName("bought-cancel")[0].addEventListener("click", deleteItem);
    if(!item.bought) newItem.getElementsByClassName("bought-button")[0].addEventListener("click", buyItem);
    else newItem.getElementsByClassName("bought-button")[0].addEventListener("click", dontBuyItem);
    newItem.getElementsByClassName("goods-name")[0].addEventListener("click", changeName);
    newItem.getElementsByClassName("amount-minus")[0].addEventListener("click", reduceItem);
    newItem.getElementsByClassName("amount-plus")[0].addEventListener("click", increaseItem);
    if(item.amount === 1) newItem.getElementsByClassName("amount-minus")[0].disabled = true;
    if(item.bought) newItem.getElementsByClassName("goods-name")[0].disabled = true;

    const goodsList = document.getElementsByClassName("menu")[0];
    const hr = document.createElement("hr");
    goodsList.appendChild(hr);
    goodsList.appendChild(newItem);

    const infoItem = document.createElement("span");
    infoItem.className = "product-item";
    infoItem.innerHTML = `
            ${item.name}
            <span class="item-amount">${item.amount}</span>
    `;
    const leftList = document.getElementsByClassName("info-product")[0];
    const boughtList = document.getElementsByClassName("info-product-bought")[0];
    if(item.bought) boughtList.appendChild(infoItem);
    else leftList.appendChild(infoItem);

    namesList.push(item.name.toLowerCase());
}

function deleteItem(event) {
    const item = event.target.parentNode.parentNode;
    const hr = item.previousElementSibling;
    item.parentNode.removeChild(hr);
    item.parentNode.removeChild(item);

    const itemName = item.getElementsByClassName("goods-name")[0].textContent;
    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);

    namesList = namesList.filter(function(value) {
        return value !== itemName.toLowerCase();
    });

    itemsList = itemsList.filter(function(item) {
        return item.name !== itemName;
    });
}

function buyItem(event) {
    const button = event.target;
    button.textContent = "Not bought";
    button.setAttribute("data-tooltip", "Don't buy");
    const item = button.parentNode.parentNode;
    item.className = "goods bought";

    const itemName = item.getElementsByClassName("goods-name")[0].textContent
    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);
    document.getElementsByClassName("info-product-bought")[0].appendChild(deleted);

    item.getElementsByClassName("goods-name")[0].disabled = true;

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].bought = true;

    button.removeEventListener("click", buyItem);
    button.addEventListener("click", dontBuyItem);
}

function dontBuyItem(event) {
    const button = event.target;
    button.textContent = "Bought";
    button.setAttribute("data-tooltip", "Buy");
    const item = button.parentNode.parentNode;
    item.className = "goods";

    const itemName = item.getElementsByClassName("goods-name")[0].textContent;
    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);
    document.getElementsByClassName("info-product")[0].appendChild(deleted);

    item.getElementsByClassName("goods-name")[0].disabled = false;

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].bought = false;

    button.removeEventListener("click", dontBuyItem);
    button.addEventListener("click", buyItem);
}

function reduceItem(event) {
    const button = event.target;
    const newValue = parseInt(button.nextElementSibling.textContent) - 1;
    button.nextElementSibling.textContent = newValue.toString();
    if(newValue===1) button.disabled = true;

    const amountBlock = button.parentNode;
    const itemName = amountBlock.previousElementSibling.textContent;
    const changed = findProduct(itemName).getElementsByClassName("item-amount")[0];
    changed.textContent = newValue.toString();

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].amount = newValue;
}

function increaseItem(event) {
    const button = event.target;
    const newValue = parseInt(button.previousElementSibling.textContent) + 1;
    button.previousElementSibling.textContent = newValue.toString();
    button.previousElementSibling.previousElementSibling.disabled = false;

    const amountBlock = button.parentNode;
    const itemName = amountBlock.previousElementSibling.textContent;
    const changed = findProduct(itemName).getElementsByClassName("item-amount")[0];
    changed.textContent = newValue.toString();

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].amount = newValue;
}

function changeName(event) {
    const spam = event.target;
    const previousName = spam.textContent;

    if(!spam.disabled) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = previousName;
        input.className = "goods-input";
        spam.parentNode.replaceChild(input, spam);
        input.focus();

        namesList = namesList.filter(function (value) {
            return value !== previousName.toLowerCase();
        });

        input.addEventListener('blur', function () {
            let newName = input.value;
            if (namesList.indexOf(newName.toLowerCase()) !== -1) {
                window.alert("This name is already taken!");
            } else if (newName === '') {
                window.alert("You haven't entered any text!");
            } else {
                spam.textContent = newName;

                const changed = findProduct(previousName);
                changed.innerHTML = `
                    ${newName}
                    ${changed.firstElementChild.outerHTML}
                `;

                const index = itemsList.findIndex(item => item.name === previousName);
                itemsList[index].name = newName;
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