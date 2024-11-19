// URL вашего MockAPI
const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
const cardsPerPage = 5; // Количество карточек на странице
let currentPage = 1; // Текущая страница

// Функция для загрузки данных с MockAPI с учетом пагинации
async function fetchCards(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${cardsPerPage}`);
        const cards = await response.json();
        displayCards(cards);
        displayPagination(page);
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
}

// Функция для отображения карточек
function displayCards(cards) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Очищаем контейнер перед добавлением новых карточек
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <h1>${card.title}</h1>
            <p>${card.description}</p>
            <img src="${card.image}" alt="${card.title}">
        `;
        container.appendChild(cardElement);
    });
}

// Функция для отображения пагинации
function displayPagination(currentPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок

    // Создаем кнопку "Предыдущая"
    const prevButton = document.createElement('button');
    prevButton.innerText = '←';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchCards(currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const pageNum = document.createElement('p');
    pageNum.textContent = currentPage
    paginationContainer.appendChild(pageNum);

    // Создаем кнопку "Следующая"
    const nextButton = document.createElement('button');
    nextButton.innerText = '→';
    nextButton.addEventListener('click', () => {
        fetchCards(currentPage + 1);
    });
    paginationContainer.appendChild(nextButton);
}

// Загрузка карточек при загрузке страницы
fetchCards(currentPage);