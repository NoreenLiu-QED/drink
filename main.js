let menu = [];

async function loadMenu() {
  const res = await fetch(SCRIPT_URL);
  const data = await res.json();

  if (data.error) {
    alert(data.error);
    document.querySelector("#storeName").textContent = "（今日無開團）";
    return;
  }

  document.querySelector("#storeName").textContent = data[0]?.店名 || "未知店名";

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
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="${name}" value="${opt}" ${idx === 0 ? "checked" : ""}> ${opt} `;
    container.appendChild(label);
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

  // 加料 checkbox 
  const toppingDiv = document.querySelector("#toppings");
  toppingDiv.innerHTML = "";
  toppings.forEach(t => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${t}"> ${t} `;
    toppingDiv.appendChild(label);
  });
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