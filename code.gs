//需要在Google sheet的APPs Script部署，此為版控用檔案
function doGet(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    // ✅ 如果參數中有 name，代表是送出訂單
    if (e.parameter && e.parameter.name) {
      const sheet = ss.getSheetByName("orders");
      sheet.appendRow([
        new Date(),
        e.parameter.name,
        e.parameter.item,
        Number(e.parameter.price),
        e.parameter.size,
        e.parameter.sugar,
        e.parameter.ice,
        e.parameter.toppings
      ]);
  
      return ContentService.createTextOutput(JSON.stringify({
        result: "success"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  
    // ✅ 否則就是要抓菜單
    const todaySheet = ss.getSheetByName("todaysdrink");
    const todayRows = todaySheet.getDataRange().getValues();
    const headers = todayRows.shift();
  
    const storeIdx = headers.indexOf("店名");
    const flagIdx = headers.indexOf("是否今天訂飲料");
    const sheetIdx = headers.indexOf("menuSheet");
    const toppingIdx = headers.indexOf("toppingPrice");
  
    let menuSheetName = null;
    let storeName = null;
    let toppingPrice = "";
  
    for (let row of todayRows) {
      if (row[flagIdx] === "Y") {
        storeName = row[storeIdx];
        menuSheetName = row[sheetIdx];
        toppingPrice = row[toppingIdx];
        break;
      }
    }
  
    if (!menuSheetName) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "今天沒有勾選要訂飲料的店家" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  
    const menuSheet = ss.getSheetByName(menuSheetName);
    const rows = menuSheet.getDataRange().getValues();
    const menuHeaders = rows.shift();
    const result = rows.map(row => {
      let item = { 店名: storeName };
      menuHeaders.forEach((key, i) => item[key] = row[i]);
      return item;
    });
  
    return ContentService
      .createTextOutput(JSON.stringify({
        menu: result,
        toppingPrice: toppingPrice,
        storeName: storeName
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }