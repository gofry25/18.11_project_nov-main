// URL вашего MockAPI
const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
const cardsPerPage = 4; 
let currentPage = 1; 
let totalCards = 0; 
let allCards = []; 
let loader = document.getElementById("loader")
let loader_bg = document.getElementById("loader-bg")

window.onload = function() {
    setTimeout(function() {
    loader.style.display = 'none'
    loader_bg.style.display = 'none'
}, 500)
}

async function fetchTotalCards() {
    try {
        const response = await fetch(apiUrl);
        allCards = await response.json();
        totalCards = allCards.length;
        const totalPages = Math.ceil(totalCards / cardsPerPage);
        return totalPages;
    } catch (error) {
        console.error('Error fetching total cards:', error);
    }
}


async function fetchCards(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${cardsPerPage}`);
        const cards = await response.json();
        displayCards(cards);
        const totalPages = await fetchTotalCards();
        displayPagination(page, totalPages);
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
}


function displayCards(cards) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; 
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <h1>${card.title}</h1>
            <p>${card.description}</p>
            <img src="${card.image}" alt="${card.title}">
        `;
        cardElement.addEventListener('click', () => {
            window.location.href = `page.html?id=${card.id}`;
        });
        container.appendChild(cardElement);
    });
}


function displayPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; 


    const prevButton = document.createElement('button');
    prevButton.innerText = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchCards(currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const pageNum = document.createElement('p');
    pageNum.textContent = currentPage
    paginationContainer.appendChild(pageNum);


    const nextButton = document.createElement('button');
    nextButton.innerText = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchCards(currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextButton);
}


function filterCards(searchTerm) {
    const filteredCards = allCards.filter(card => {
        return card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    displayCards(filteredCards.slice(0, cardsPerPage));
    displayPagination(1, totalPages);
}


document.getElementById('search').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filterCards(searchTerm);
});


fetchCards(currentPage);