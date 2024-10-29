function addCustomChild(){
    let element = document.getElementById("itemContainer");
    let node = createCustomNode("div", "przy kupci wolno dupci")
    element.appendChild(node);
}

function appendNewItem(jsonItem){
    let element = document.getElementById("itemContainer");
    let newItem = createItemElementBluePrint(jsonItem);
    element.append(newItem);
}

function appendListofNewItems(jsonItemsList){
    for (let i = 0; i < itemsList.length; i++){
        appendNewItem(itemsList[i]);
    }
}


function createCustomNode(tag, textContent){
    let node = document.createElement(tag);   
    let textnode = document.createTextNode(textContent);
    node.appendChild(textnode);

    return node;
}

async function renderListOfItemsById(){
    itemsList = await getAllItems(2);
    if (!Array.isArray(itemsList)){
        appendNewItem(itemsList);
    } else {
        appendListofNewItems(itemsList)
    }
}

async function renderListOfItemsByTitle(){
    const searchInput = document.getElementById('searchInput').value;
    let itemsList = await getAllItemsByTitle(searchInput);
    if (!Array.isArray(itemsList)){
        appendNewItem(itemsList);
    } else {
        appendListofNewItems(itemsList)
    }
}

async function renderListOfItemsByTitleV2(itemsList){
    if (!Array.isArray(itemsList)){
        appendNewItem(itemsList);
    } else {
        appendListofNewItems(itemsList)
    }
}

function createItemElementBluePrint(itemJson){
    let dummyTitleTextNode = document.createTextNode(itemJson.title);
    let dummyPriceTextNode = document.createTextNode(itemJson.price);
    let dummyDescriptionTextNode = document.createTextNode(itemJson.description);
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    let itemDetailsDiv = document.createElement("div");
    itemDetailsDiv.classList.add("item-details");

    let itemTitleDiv = document.createElement("div");
    itemTitleDiv.classList.add("item-title");
    itemTitleDiv.appendChild(dummyTitleTextNode);

    let itemPriceDiv = document.createElement("div");
    itemPriceDiv.classList.add("item-price");
    itemPriceDiv.appendChild(dummyPriceTextNode);


    let itemDescriptionDiv = document.createElement("div");
    itemDescriptionDiv.classList.add("item-description");
    itemDescriptionDiv.appendChild(dummyDescriptionTextNode);

    itemDiv.append(itemDetailsDiv);
    itemDetailsDiv.append(itemTitleDiv, itemPriceDiv, itemDescriptionDiv);
    return itemDiv;
}

async function getAllItemsByTitle(title){
    let outData = 0;
    let url = new URL(`http://127.0.0.1:8080/findByTitleIgnoreCase/${title}`);
    console.log('dupa0');
    await fetch(url)
        .then(response => {
            if (!response.ok){
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
         })
         .then(data => {
            outData =  data;
         } )
         .catch(error => {
            console.error("Fetch error:", error);
         });
    return outData;
}

async function fromAction(title){
    document.getElementById("myForm").addEventListener("submit", function(event){
        event.preventDefault();
        const szukInput = document.getElementById(searchInput).value;
        let itemsList = getAllItemsByTitle(szukInput);
        renderListOfItemsByTitleV2(itemsList);
    });
}

async function populateDropDown(){
    const dropdown = document.getElementById("categoryDropdown"); 
    const dropDownItems = await fetchAllCategories();

    dropdown.innerHTML="";
    dropDownItems.forEach(element => {
        let option = document.createElement("option");
        option.text = element.name;
        option.value = element.name;
        dropdown.add(option);
    });

}

async function fetchAllCategories(){
    let outData = 0;
    let url = new URL(`http://127.0.0.1:8080/category/findAll`);
    console.log('dupa0');
    await fetch(url)
        .then(response => {
            if (!response.ok){
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
         })
         .then(data => {
            outData =  data;
         } )
         .catch(error => {
            console.error("Fetch error:", error);
         });
    return outData;
}

async function getAllItems(id){
    let outData = 0;
    let url = new URL(`http://127.0.0.1:8080/findById/${id}`);
    await fetch(url)
        .then(response => {
            if (!response.ok){
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
         })
         .then(data => {
            outData =  data;
         } )
         .catch(error => {
            console.error("Fetch error:", error);
         });
    return outData;
}

async function getWheaterDataByLatitudeLongitude(latitude, longitude){
    const url = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = "896a53f5262d59f0df4f162533b352b8";
    let outData = 0;
    const fullUrl = `${url}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const headers = new Headers({
        "appid": `${apiKey}`, 
        "Content-Type":  'application/json'
    })

    await fetch(fullUrl)
        .then(response => {
            if (!response.ok){
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
         })
         .then(data => {
            outData =  data;
         } )
         .catch(error => {
            console.error("Fetch error:", error);
         });
    return outData;
}

async function  getCurrentCityWheaterData(){
    const latitudeLongitude = [];
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
          // Pobierz współrzędne geograficzne
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        
        let wheaterData = await getWheaterDataByLatitudeLongitude(latitude, longitude);
        
        //temperature
        let temperature = wheaterData.main.temp;
        temperature = convertKelvinsToCelsious(temperature);
        temperature = temperature.toFixed(2);
        var element = document.getElementById('temperature');
        element.textContent =  temperature;

        //city
        let city = wheaterData.name;
        var element = document.getElementById('city');
        element.textContent = city;

        //himidity
        let humidity = wheaterData.main.humidity;
        var element = document.getElementById('humidity');
        element.textContent = humidity;

        //windspeed
        let windSpeed = wheaterData.wind.speed;
        var element = document.getElementById('windSpeed');
        element.textContent =  windSpeed;

        });
      } else {
        console.log("Przeglądarka nie obsługuje geolokalizacji.");
      }

}

document.addEventListener("DOMContentLoaded", function(){
    populateDropDown();
});


class Item {
    constructor(id, title, price, description){
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}

