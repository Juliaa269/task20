const STICKER_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';

const DELETE_STICKER_CLASS = 'delete-btn';
const EDIT_STICKER_CLASS = 'edit-sticker';

const stickerTemplate = document.getElementById('stickerItemTemplate').innerHTML;
const formStickerEl = document.getElementById('formSticker');
const containerEl = document.getElementById('containerEl');
const newStickerBtn = document.getElementById('addStickerBtn');

let stickersList = [];

newStickerBtn.addEventListener('click', onAddNewStickerBtnClick);
containerEl.addEventListener('focusout', onContainerStickerEditClick);
containerEl.addEventListener('click', onContainerStickerDeleteClick);

init();

function onAddNewStickerBtnClick() {
    createSticker();
}

function onContainerStickerEditClick(e) {
    switch (true) {
        case e.target.classList.contains(EDIT_STICKER_CLASS):
            editSticker(
                e.target.parentElement.dataset.id,
                e.target.name,
                e.target.value
            );
            break;
    }
}

function onContainerStickerDeleteClick(e) {
    switch (true) {
        case e.target.classList.contains(DELETE_STICKER_CLASS):
            deleteSticker(e.target.parentElement.dataset.id);
            break;
    }
}

function init() {
    getList();
}

function getList() {
    fetch(STICKER_URL)
        .then((res) => res.json())
        .then((data) => (stickersList = data))
        .then(renderList);
}

function renderList(data) {
    containerEl.innerHTML = data.map(getStickerHtml).join('');
}

function getStickerHtml(sticker){
    return stickerTemplate
        .replace('{{id}}', sticker.id)
        .replace('{{description}}', sticker.description);
}

function createSticker() {
    const sticker = {
        description: '',
    };
    addSticker(sticker);
}

function addSticker(sticker) {
    fetch(STICKER_URL, {
        method: 'POST',
        body: JSON.stringify(sticker),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((sticker) => {
        stickersList.push(sticker);
        renderList(stickersList);
    })
}

function editSticker(id, name, value) {
    const sticker = stickersList.find((el) => el.id == id);
    sticker[name] = value;

    fetch(STICKER_URL + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sticker),
    })
}

function deleteSticker(id) {
    fetch(STICKER_URL + id, {
        method: 'DELETE',
    }).then(getList);  
    
    stickersList = stickersList.filter((el) => el.id != id);
    renderList(stickersList);
}
