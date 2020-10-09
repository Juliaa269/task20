$(() => {
    const STICKER_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';

    const $stickerTemplate = $('#stickerItemTemplate').html();
    const $container = $('#container');
    const $newStickerBtn = $('#addStickerBtn');

    let stickersList = [];

    $newStickerBtn.on('click', onAddNewStickerBtnClick);
    $container.on('change', '.edit-sticker', onTextareaEditClick);
    $container.on('click', '.delete-btn', onDeleteClick);

    init();

    function onAddNewStickerBtnClick() {
        createSticker();
    }

    function onTextareaEditClick() {
        const id = $(this).parent().data('id');
        const value = $(this).val();
        editSticker(
            id,
            value
        );
    } 

    function onDeleteClick() {
        const id = $(this).parent().data('id');
        deleteSticker(id);  
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
        $container.html(data.map(getStickerHtml).join(''));
    }

    function getStickerHtml(sticker){
        return $stickerTemplate
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

    function editSticker(id, value) {
        const sticker = stickersList.find((el) => el.id == id);
        sticker.description = value;

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
    }
}) 
