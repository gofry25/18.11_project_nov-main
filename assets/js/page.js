const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');
const apiUrl = 'https://6735cb285995834c8a941c33.mockapi.io/card';
let loader = document.getElementById("loader");
let loader_bg = document.getElementById("loader-bg");

window.onload = function() {
    setTimeout(function() {
        loader.style.display = 'none';
        loader_bg.style.display = 'none';
    }, 500);
}

class Fetcher {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    async fetchCardDetails(id) {
        this.pageId = id
        try {
            this.response = await fetch(`${this.apiUrl}/${id}`);
            this.card = await this.response.json();
            display.displayCardDetails(this.card);
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    }
}
let fetcher = new Fetcher(apiUrl);

class Display {
    constructor() {}

    displayCardDetails(card) {
        this.container = document.getElementById('upper');
        this.container.innerHTML = `
            <h1>${card.title}</h1>
        `;
        const imgBlock = document.createElement('div');
        imgBlock.className='img_block';
        imgBlock.id = 'imgs';
        imgBlock.innerHTML=`
            <img src="${card.image}" alt="${card.title}">
            <img src="${card.image2}" alt="${card.title}">
            <img src="${card.image3}" alt="${card.title}">
        `;
        this.container.innerHTML += imgBlock.innerHTML;
        this.container.innerHTML += `
            <p>${card.longerDescription}</p>
            ${card.map}
        `;

        if (card.comment_names && card.comment_texts) {
            this.comms__container = document.getElementsByClassName('comms__container')[0];
            this.comms__container.innerHTML = ''; // Очищаем контейнер перед добавлением комментариев
            for (let i = 0; i < card.comment_names.length; i++) {
                this.comms__container.innerHTML += `
                    <div class='comm__el' id=${i}>
                        <h3 class='commName'>${card.comment_names[i]}</h3>
                        <p>${card.comment_texts[i]}</p>
                        <button type='button' class='delBtn' id='delBtn' >Удалить</button>
                    </div>
                `;
            }
        } else {
            this.comms__container = document.getElementsByClassName('comms__container')[0];
            this.comms__container.innerHTML = '<p>Комментариев пока нет.</p>';
        }
    }

    addCommentToPage(name, text) {
        const commsContainer = document.getElementsByClassName('comms__container')[0];
        commsContainer.innerHTML += `
            <div class='comm__el'>
                <h3>${name}</h3>
                <p>${text}</p>
            </div>
        `;
    }
}
let display = new Display();

class AddComms {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async changeData(id) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('mail').value;
        const content = document.getElementById('content').value;

        if (!name || !email || !content) {
            alert('Необходимо заполнить все поля!');
            return;
        }

        try {
            const response = await axios.get(`${this.apiUrl}/${id}`);
            const card = response.data;

            card.comment_names.push(name);
            card.comment_texts.push(content);

            await axios.put(`${this.apiUrl}/${id}`, card);

            display.addCommentToPage(name, content);
            window.location.reload()
            document.getElementById('name').value = '';
            // document.getElementById('mail').value = '';
            document.getElementById('content').value = '';

        } catch (error) {
            console.error('Error updating card:', error);
        }
    }
}
let addComment = new AddComms(apiUrl);

document.getElementById('sub').addEventListener('click', function() {
    addComment.changeData(cardId);
});

document.addEventListener('click', async function(event) {
    if (event.target && event.target.classList.contains('delBtn')) {
        const commEl = event.target.closest('.comm__el');
        if (commEl) {
            commEl.remove();
            await delComms.deleteCommentFromServer(cardId, commEl);
        }
    }
});

class DelComms{
    async deleteCommentFromServer(cardId, commEl) {
    try {
        const response = await axios.get(`${apiUrl}/${cardId}`);
        const card = response.data;

        const commentName = commEl.querySelector('h3').textContent;
        const commentText = commEl.querySelector('p').textContent;

        const nameIndex = card.comment_names.indexOf(commentName);
        const textIndex = card.comment_texts.indexOf(commentText);

        if (nameIndex !== -1 && textIndex !== -1) {
            card.comment_names.splice(nameIndex, 1);
            card.comment_texts.splice(textIndex, 1);

            await axios.put(`${apiUrl}/${cardId}`, card);
            console.log('Комментарий удален');
        } else {
            console.error('Комментарий не найден');
        }
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
    }
}}
let delComms = new DelComms()

// document.getElementById('upper').appendChild(imgBlock);
// document.getElementById('imgs').addEventListener('click', function(){
//     console.log()
// })

fetcher.fetchCardDetails(cardId);