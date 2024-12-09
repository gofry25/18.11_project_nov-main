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

class Fetcher{

    constructor(apiUrl, cardsPerPage, allCards, totalCards){
        this.api = apiUrl
        this.cardsPerPage = cardsPerPage
        this.cardsArr = allCards
        this.total = totalCards
    }

    async fetchTotalCards() {
        try {
            const response = await fetch(this.api);
            this.allCards = await response.json();
            this.total = this.allCards.length;
            this.totalPages = Math.ceil(this.total / this.cardsPerPage);
            return this.totalPages;
        } catch (error) {
            console.error('Error fetching total cards:', error);
        }
    }

    async fetchCards(page) {
        try {
            const response = await fetch(`${this.api}?page=${page}&limit=${this.cardsPerPage}`);
            const cards = await response.json();
            display.displayCards(cards);
            this.totalPages = await this.fetchTotalCards();
            display.displayPagination(page, this.totalPages);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }
}
let fetcher = new Fetcher(apiUrl, cardsPerPage, allCards, totalCards);


class Display{
    constructor(){

    }

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


        this.paginationContainer = document.getElementById('pagination');
        this.paginationContainer.innerHTML = ''; 

        this.prevButton = document.createElement('button');
        this.prevButton.innerText = '←';
        this.prevButton.disabled = currentPage === 1;
        this.prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetcher.fetchCards(currentPage);
            }
        });
        this.paginationContainer.appendChild(this.prevButton);

        this.pageNum = document.createElement('p');
        this.pageNum.textContent = currentPage;
        this.paginationContainer.appendChild(this.pageNum);

        this.nextButton = document.createElement('button');
        this.nextButton.innerText = '→';
        this.nextButton.disabled = currentPage === totalPages;
        this.nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetcher.fetchCards(currentPage);
            }
        });
        this.paginationContainer.appendChild(this.nextButton);
}
}
let display = new Display();



function filterCards(searchTerm) {
    const filteredCards = fetcher.allCards.filter(card => {
        return card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    display.displayCards(filteredCards.slice(0, cardsPerPage));
    display.displayPagination(1, totalPages);
}

document.getElementById('search').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filterCards(searchTerm);
});

fetcher.fetchCards(currentPage);