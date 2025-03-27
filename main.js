let menu = [];

async function loadMenu() {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();

    if (data.error) {
        alert(data.error);
        document.querySelector("#storeName").textContent = "（今日沒有開團）";
        document.querySelector("#toppingprice").textContent = data.toppingPrice || "無資料";
        return;
    }

    // ✅ 顯示店名與加料參考價
    document.querySelector("#storeName").textContent = data.storeName || "未知店名";
    const toppingPriceEl = document.querySelector("#toppingprice");
    if (data.toppingPrice) {
        toppingPriceEl.textContent = data.toppingPrice.split(",").join("\n");
    } else {
        toppingPriceEl.textContent = "無資料";
    }

    // ✅ 解析菜單
    menu = data.menu || [];
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
        wrapper.className = "form-check cursor-pointer";

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
    const size = m.大杯小杯.split(",");
    const sugar = m.糖度選項.split(",");
    const ice = m.冰度選項.split(",");
    const toppings = m.加料選項.split(",");

    renderRadioButtons("size", "size", size);
    renderRadioButtons("sugar", "sugar", sugar);
    renderRadioButtons("ice", "ice", ice);
    renderCheckboxs("toppings", "toppings", toppings);
}

async function submitOrder() {
    const btn = document.querySelector("button"); // 取送出按鈕
    btn.disabled = true;
    btn.textContent = "送出中...";

    const idx = document.querySelector("#item").value;
    const m = menu[idx];

    const params = new URLSearchParams({
        name: document.querySelector("#name").value,
        item: m.品項,
        price: parseInt(document.querySelector("#price").value),
        size: document.querySelector('input[name="size"]:checked').value,
        sugar: document.querySelector('input[name="sugar"]:checked').value,
        ice: document.querySelector('input[name="ice"]:checked').value,
        toppings: Array.from(document.querySelectorAll("#toppings input:checked")).map(el => el.value).join(", ")
    });

    try {
        const res = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const result = await res.json();

        if (result.result === "success") {
            location.href = "submitted.html";
        } else {
            alert("送出失敗！");
        }
    } catch (err) {
        alert("送出錯誤！");
        console.error(err);
    } finally {
        // 使用者還在頁面才恢復按鈕
        btn.disabled = false;
        btn.textContent = "送出";
    }
}

loadMenu();