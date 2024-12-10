// const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
// const cardsPerPage = 4; 
// let currentPage = 1; 
// let totalCards = 0; 
// let allCards = []; 
// let loader = document.getElementById("loader")
// let loader_bg = document.getElementById("loader-bg")
// let selectSort = document.getElementById('sort')

// window.onload = function() {
//     setTimeout(function() {
//         loader.style.display = 'none'
//         loader_bg.style.display = 'none'
//     }, 500)
// }

// class Fetcher{

//     constructor(apiUrl, cardsPerPage, allCards, totalCards){
//         this.api = apiUrl
//         this.cardsPerPage = cardsPerPage
//         this.cardsArr = allCards
//         this.total = totalCards
//     }

//     async fetchTotalCards() {
//         try {
//             const response = await fetch(this.api);
//             this.allCards = await response.json();
//             this.total = this.allCards.length;
//             this.totalPages = Math.ceil(this.total / this.cardsPerPage);
//             return this.totalPages;
//         } catch (error) {
//             console.error('Error fetching total cards:', error);
//         }
//     }

//     async fetchCards(page) {
//         try {
//             const response = await fetch(`${this.api}?page=${page}&limit=${this.cardsPerPage}`);
//             const cards = await response.json();
//             display.displayCards(cards);
//             this.totalPages = await this.fetchTotalCards();
//             display.displayPagination(page, this.totalPages);
//         } catch (error) {
//             console.error('Error fetching cards:', error);
//         }
//     }
// }
// let fetcher = new Fetcher(apiUrl, cardsPerPage, allCards, totalCards);


// class Display{
//     constructor(){

//     }

//     displayCards(cards) {
//         const container = document.getElementById('cards-container');
//         container.innerHTML = ''; 
//         cards.forEach(card => {
//             const cardElement = document.createElement('div');
//             cardElement.className = 'card';
//             cardElement.innerHTML = `
//                 <h1>${card.title}</h1>
//                 <p>${card.description}</p>
//                 <img src="${card.image}" alt="${card.title}">
//             `;
//             cardElement.addEventListener('click', () => {
//                 window.location.href = `page.html?id=${card.id}`;
//             });
//             container.appendChild(cardElement);
//         });
// }

//     displayPagination(currentPage, totalPages) {


//         this.paginationContainer = document.getElementById('pagination');
//         this.paginationContainer.innerHTML = ''; 

//         this.prevButton = document.createElement('button');
//         this.prevButton.innerText = '←';
//         this.prevButton.disabled = currentPage === 1;
//         this.prevButton.addEventListener('click', () => {
//             if (currentPage > 1) {
//                 currentPage--;
//                 fetcher.fetchCards(currentPage);
//             }
//         });
//         this.paginationContainer.appendChild(this.prevButton);

//         this.pageNum = document.createElement('p');
//         this.pageNum.textContent = currentPage;
//         this.paginationContainer.appendChild(this.pageNum);

//         this.nextButton = document.createElement('button');
//         this.nextButton.innerText = '→';
//         this.nextButton.disabled = currentPage === totalPages;
//         this.nextButton.addEventListener('click', () => {
//             if (currentPage < totalPages) {
//                 currentPage++;
//                 fetcher.fetchCards(currentPage);
//             }
//         });
//         this.paginationContainer.appendChild(this.nextButton);
// }
// }
// let display = new Display();



// function filterCards(searchTerm) {
//     const filteredCards = fetcher.allCards.filter(card => {
//         return card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             card.description.toLowerCase().includes(searchTerm.toLowerCase());
//     });






//     const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
//     display.displayCards(filteredCards.slice(0, cardsPerPage));
//     display.displayPagination(1, totalPages);
// }

// document.getElementById('search').addEventListener('input', (event) => {
//     const searchTerm = event.target.value;
//     filterCards(searchTerm);
// });


// selectSort.addEventListener('change', function() {
//     console.log('afaf')
//     if (selectSort.value == ""){
//         display.displayCards(fetcher.allCards.sort((a,b) => a.id - b.id).slice(0, cardsPerPage))
//         currentPage = 1
//         }
//     else if (selectSort.value == "popularity"){
        
//         display.displayCards(fetcher.allCards.sort((a,b) => a.pop - b.pop).slice(0, cardsPerPage))
        
//     }
// })

// fetcher.fetchCards(currentPage);



const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
const cardsPerPage = 4; 
let currentPage = 1; 
let totalCards = 0; 
let allCards = []; 
let loader = document.getElementById("loader")
let loader_bg = document.getElementById("loader-bg")
let selectSort = document.getElementById('sort')
let currentSort = ""; // Переменная для хранения текущего порядка сортировки

window.onload = function() {
    setTimeout(function() {
        loader.style.display = 'none'
        loader_bg.style.display = 'none'
    }, 500)
}

class Fetcher {
    constructor(apiUrl, cardsPerPage, allCards, totalCards) {
        this.api = apiUrl
        this.cardsPerPage = cardsPerPage
        this.cardsArr = allCards
        this.total = totalCards
    }

    async fetchAllCards() {
        try {
            const response = await fetch(this.api);
            allCards = await response.json(); // Сохраняем все карточки в глобальную переменную
            this.total = allCards.length;
            this.totalPages = Math.ceil(this.total / this.cardsPerPage);
            return allCards;
        } catch (error) {
            console.error('Error fetching all cards:', error);
        }
    }

    async fetchCards(page) {
        try {
            // Применяем сортировку к полному массиву allCards
            let sortedCards = [...allCards];
            if (currentSort === "popularity") {
                sortedCards.sort((a, b) => a.pop - b.pop);
            } 
            else if (currentSort === "nonpopularity") {
                sortedCards.sort((a, b) => b.pop - a.pop);
            } 
            else if (currentSort === "alphabet") {
                sortedCards.sort((a, b) => a.title.localeCompare(b.title));
            } 
            else if (currentSort === "alphabetReverse") {
                sortedCards.sort((a, b) => b.title.localeCompare(a.title));
            } 
            else if (currentSort === "nonpopularity") {
                sortedCards.sort((a, b) => b.pop - a.pop);
            } 
            else {
                sortedCards.sort((a, b) => a.id - b.id);
            }

            // Определяем индексы для текущей страницы
            const startIndex = (page - 1) * cardsPerPage;
            const endIndex = startIndex + cardsPerPage;

            // Получаем карточки для текущей страницы
            const cardsToDisplay = sortedCards.slice(startIndex, endIndex);

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
                fetcher.fetchCards(currentPage);
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
                fetcher.fetchCards(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }
}

let display = new Display();

// Функция для фильтрации карточек
function filterCards(searchTerm) {
    const filteredCards = allCards.filter(card => {
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

// Обработчик изменения сортировки
selectSort.addEventListener('change', function() {
    currentSort = selectSort.value;
    fetcher.fetchCards(currentPage);
});

// Инициализация: загрузка всех карточек и отображение первой страницы
fetcher.fetchAllCards().then(() => {
    fetcher.fetchCards(currentPage);
});