const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
const cardsPerPage = 10; 
let currentPage = 1; 
let totalCards = 0; 
let allCards = []; 
let loader = document.getElementById("loader");
let loader_bg = document.getElementById("loader-bg");
let selectSort = document.getElementById('sort');
let currentSort = "";
let selectFilter = document.getElementById("filter");
let currentFilter = "";

window.onload = function() {
    setTimeout(function() {
        loader.style.display = 'none';
        loader_bg.style.display = 'none';
    }, 500);
}

class Fetcher {
    constructor(apiUrl, cardsPerPage, allCards, totalCards) {
        this.api = apiUrl;
        this.cardsPerPage = cardsPerPage;
        this.cardsArr = allCards;
        this.total = totalCards;
    }

    async fetchAllCards(filter = "") {
        try {
            let url = this.api;
            if (filter) {
                url += `?tags=${filter}`;
            }
            const response = await fetch(url);
            allCards = await response.json();
            this.total = allCards.length;
            this.totalPages = Math.ceil(this.total / this.cardsPerPage);
            return allCards;
        } catch (error) {
            console.error('Error fetching all cards:', error);
        }
    }

    async fetchCards(page, filter = "") {
        try {
            let url = `${this.api}?page=${page}&limit=${this.cardsPerPage}`;
            if (filter) {
                url += `&tags=${filter}`;
            }
            const response = await fetch(url);
            const cardsToDisplay = await response.json();

            if (currentSort === "popularity") {
                cardsToDisplay.sort((a, b) => a.pop - b.pop);
            } else if (currentSort === "nonpopularity") {
                cardsToDisplay.sort((a, b) => b.pop - a.pop);
            } else if (currentSort === "alphabet") {
                cardsToDisplay.sort((a, b) => a.title.localeCompare(b.title));
            } else if (currentSort === "alphabetReverse") {
                cardsToDisplay.sort((a, b) => b.title.localeCompare(a.title));
            } else {
                cardsToDisplay.sort((a, b) => a.id - b.id);
            }

            display.displayCards(cardsToDisplay);
            display.displayPagination(page, this.totalPages);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }
}

let fetcher = new Fetcher(apiUrl, cardsPerPage, allCards, totalCards);

class Display {
    constructor() {}

    displayCards(cards) {
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

    displayPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; 

        const prevButton = document.createElement('button');
        prevButton.innerText = '←';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetcher.fetchCards(currentPage, currentFilter);
            }
        });
        paginationContainer.appendChild(prevButton);

        const pageNum = document.createElement('p');
        pageNum.textContent = currentPage;
        paginationContainer.appendChild(pageNum);

        const nextButton = document.createElement('button');
        nextButton.innerText = '→';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetcher.fetchCards(currentPage, currentFilter);
            }
        });
        paginationContainer.appendChild(nextButton);
    }
}

let display = new Display();



class Filtering{
    constructor(){}
    
searchCards(searchTerm) {
    const foundCards = allCards.filter(card => {
        return card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const totalPages = Math.ceil(foundCards.length / cardsPerPage);
    display.displayCards(foundCards.slice(0, cardsPerPage));
    display.displayPagination(1, totalPages);
}}
let filtering = new Filtering()

document.getElementById('search').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filtering.searchCards(searchTerm);
});

selectSort.addEventListener('change', function() {
    currentSort = selectSort.value;
    fetcher.fetchCards(currentPage, currentFilter);
});

selectFilter.addEventListener('change', function() {
    currentFilter = selectFilter.value;
    fetcher.fetchAllCards(currentFilter).then(() => {
        fetcher.fetchCards(currentPage, currentFilter);
    });
});

fetcher.fetchAllCards().then(() => {
    fetcher.fetchCards(currentPage);
});