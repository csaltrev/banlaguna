{
    document.addEventListener('DOMContentLoaded', () => {
        const transactionsSection = document.querySelector('#transactions-section');
        const bulkModal = document.querySelector('#bulk-modal');
        const singleModal = document.querySelector('#single-modal');
        const accountsModal = document.querySelector('#accounts-modal');
        const userModal = document.querySelector('#user-modal');
        const newAccountModal = document.querySelector('#new-account-modal');

        const handleOpenModal = modal => {
            modal.classList.add('is-active');
            modal.addEventListener('click', e => {
                if (e.target.id === 'cancel-btn' ||
                    e.target.id === 'close-btn') {
                    modal.classList.remove('is-active');
                }
            });
        };

        transactionsSection.addEventListener('click', e => {
            switch (e.target.id) {
                case 'bulk-btn':
                    handleOpenModal(bulkModal);
                    e.stopPropagation();
                    break;
                case 'single-btn':
                    handleOpenModal(singleModal);
                    e.stopPropagation();
                    break;
                case 'accounts-btn':
                    handleOpenModal(accountsModal);
                    accountsModal.addEventListener('click', e => {
                        if (e.target.id === 'create-btn') {
                            handleOpenModal(newAccountModal);
                        }
                    });
                    e.stopPropagation();
                    break;
                case 'user':
                    handleOpenModal(userModal);
                    e.stopPropagation();
                    break;
                default:
                    e.stopPropagation();
                    break;
            }
        });
    });
}