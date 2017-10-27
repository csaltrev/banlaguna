{
    document.addEventListener('DOMContentLoaded', () => {
        const transactionsSection = document.querySelector('#transactions-section');
        const bulkModal = document.querySelector('#bulk-modal');
        const singleModal = document.querySelector('#single-modal');
        const accountsModal = document.querySelector('#accounts-modal');
        const userModal = document.querySelector('#user-modal');
        const newAccountModal = document.querySelector('#new-account-modal');
        const resetModal = document.querySelector('#reset-modal');
        const userModalTbody = document.querySelector('#user-modal table tbody');
        const userModalTitle = document.querySelector('#user-modal p');

        const populateTransactionsTable = transactions => {
            transactions.forEach(transaction => {
                const tr = document.createElement('tr');
                const idTh = document.createElement('th');
                const senderTd = document.createElement('td');
                const receiverTd = document.createElement('td');
                const conceptTd = document.createElement('td');
                const dateTd = document.createElement('td');
                const quantityTd = document.createElement('td');

                idTh.textContent = transaction.id;
                senderTd.textContent = transaction.sender;
                receiverTd.textContent = transaction.receiver;
                conceptTd.textContent = transaction.concept;
                dateTd.textContent = transaction.timestamp;
                quantityTd.textContent = transaction.quantity;

                tr.appendChild(idTh);
                tr.appendChild(senderTd);
                tr.appendChild(receiverTd);
                tr.appendChild(conceptTd);
                tr.appendChild(dateTd);
                tr.appendChild(quantityTd);

                userModalTbody.appendChild(tr);
            });
        };

        const handleOpenModal = modal => {
            modal.classList.add('is-active');
            modal.addEventListener('click', e => {
                if (e.target.id === 'cancel-btn' ||
                    e.target.id === 'close-btn') {
                    modal.classList.remove('is-active');
                    if (modal.id === 'user-modal') {
                        userModalTbody.innerHTML = '';
                        userModalTitle.textContent = 'Usuario';
                    }
                }
            });
        };

        transactionsSection.addEventListener('click', e => {
            if (e.target.id.startsWith('user-')) {
                const userId = e.target.id.substr(5);

                fetch(`/admin/user/${userId}`).then(res => {
                    return res.json();
                }).then(transactions => {
                    userModalTitle.textContent = e.target.textContent;
                    handleOpenModal(userModal);
                    populateTransactionsTable(transactions);
                });
            }

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
                case 'reset-btn':
                    handleOpenModal(resetModal);
                    e.stopPropagation();
                    break;
                default:
                    e.stopPropagation();
                    break;
            }
        });
    });
}