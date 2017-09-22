{
    document.addEventListener('DOMContentLoaded', e => {
        const transferBtn = document.querySelector('#transfer-btn');
        const cancelBtn = document.querySelector('#cancel-btn');
        const closeBtn = document.querySelector('#close-btn');
        const transferModal = document.querySelector('#transfer-modal');

        transferBtn.addEventListener('click', e => {
            transferModal.classList.add('is-active');
        });

        cancelBtn.addEventListener('click', e => {
            transferModal.classList.remove('is-active');
        });

        closeBtn.addEventListener('click', e => {
            transferModal.classList.remove('is-active');
        });
    });
}