// Получаем id карточки из URL
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');
// URL вашего MockAPI
const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
let loader = document.getElementById("loader")
let loader_bg = document.getElementById("loader-bg")

window.onload = function() {
    setTimeout(function() {
    loader.style.display = 'none'
    loader_bg.style.display = 'none'
}, 2500)
}

// Функция для получения данных карточки по id
async function fetchCardDetails(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const card = await response.json();
        displayCardDetails(card);
    } catch (error) {
        console.error('Error fetching card details:', error);
    }
}

// Функция для отображения данных карточки
function displayCardDetails(card) {
    const container = document.getElementById('card-details');
    const map = document.getElementById('map')
    container.innerHTML = `
        <h1>${card.title}</h1>
        <img src="${card.image}" alt="${card.title}">
        <img src="${card.image2}" alt="${card.title}">
        <img src="${card.image3}" alt="${card.title}">
        <p>${card.longerDescription}</p>
        ${card.map}
    `;
}

// Загрузка данных карточки при загрузке страницы
fetchCardDetails(cardId);