let menu = [];

async function loadMenu() {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
        document.querySelector("#storeName").textContent = "（今日無開團）";
        return;
    }
    const storeName = data[0] && data[0].店名 ? data[0].店名 : "未知店名";
    document.querySelector("#storeName").textContent = storeName;

    menu = data;
    const itemSelect = document.querySelector("#item");
    itemSelect.innerHTML = "";
    menu.forEach((m, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = `${m.品項}（${m.價格}元）`;
        itemSelect.appendChild(option);
    });

    itemSelect.addEventListener("change", updateOptions);
    updateOptions();
}

function renderRadioButtons(containerId, name, options) {
    const container = document.querySelector(`#${containerId}`);
    container.innerHTML = "";

    options.forEach((opt, idx) => {
        const id = `${name}${String(idx + 1).padStart(2, '0')}`;

        const wrapper = document.createElement("div");
        wrapper.className = "form-check form-check-inline cursor-pointer";

        wrapper.innerHTML = `
            <input class="form-check-input" type="radio" id="${id}" name="${name}" value="${opt}" ${idx === 0 ? "checked" : ""}>
            <label class="form-check-label" for="${id}">${opt}</label>
        `;

        container.appendChild(wrapper);
    });
}

function renderCheckboxs(containerId, name, options) {
    const container = document.querySelector(`#${containerId}`);
    container.innerHTML = "";

    options.forEach((opt, idx) => {
        const id = `${name}${String(idx + 1).padStart(2, '0')}`;

        const wrapper = document.createElement("div");
        wrapper.className = "form-check form-check-inline cursor-pointer";

        wrapper.innerHTML = `
            <input class="form-check-input" type="checkbox" id="${id}" name="${name}" value="${opt}">
            <label class="form-check-label" for="${id}">${opt}</label>
        `;

        container.appendChild(wrapper);
    });
}

function updateOptions() {
    const idx = document.querySelector("#item").value;
    const m = menu[idx];
    document.querySelector("#price").value = m.價格;

    const sugar = m.糖度選項.split(",");
    const ice = m.冰度選項.split(",");
    const toppings = m.加料選項.split(",");

    renderRadioButtons("sugar", "sugar", sugar);
    renderRadioButtons("ice", "ice", ice);
    renderCheckboxs("toppings", "toppings", toppings);
}

function submitOrder() {
    const idx = document.querySelector("#item").value;
    const m = menu[idx];

    const params = new URLSearchParams({
        name: document.querySelector("#name").value,
        item: m.品項,
        price: m.價格,
        sugar: document.querySelector('input[name="sugar"]:checked').value,
        ice: document.querySelector('input[name="ice"]:checked').value,
        toppings: Array.from(document.querySelectorAll("#toppings input:checked")).map(el => el.value).join(", ")
    });

    fetch(`${SCRIPT_URL}?${params.toString()}`)
        .then(res => res.json())
        .then(result => {
            if (result.result === "success") {
                location.href = "submitted.html";
            } else {
                alert("送出失敗！");
            }
        })
        .catch(err => {
            alert("送出錯誤！");
            console.error(err);
        });
}

loadMenu();