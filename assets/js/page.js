// Получаем id карточки из URL
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');

// URL вашего MockAPI
const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';

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
    container.innerHTML = `
        <h1>${card.title}</h1>
        <p>${card.longerDescription}</p>
        <img src="${card.image}" alt="${card.title}">
    `;
}

// Загрузка данных карточки при загрузке страницы
fetchCardDetails(cardId);