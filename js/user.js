{
    document.addEventListener('DOMContentLoaded', () => {
        const transferBtn = document.querySelector('#transfer-btn');
        const cancelBtn = document.querySelector('#cancel-btn');
        const closeBtn = document.querySelector('#close-btn');
        const transferModal = document.querySelector('#modal');

        transferBtn.addEventListener('click', () => {
            transferModal.classList.add('is-active');
        });

        cancelBtn.addEventListener('click', () => {
            transferModal.classList.remove('is-active');
        });

        closeBtn.addEventListener('click', () => {
            transferModal.classList.remove('is-active');
        });
    });
}