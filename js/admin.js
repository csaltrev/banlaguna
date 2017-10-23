{
    document.addEventListener('DOMContentLoaded', () => {
        const transactionsSection = document.querySelector('#transactions-section');
        const bulkModal = document.querySelector('#bulk-modal');
        const singleModal = document.querySelector('#single-modal');
        const accountsModal = document.querySelector('#accounts-modal');
        const userModal = document.querySelector('#user-modal');
        const newAccountModal = document.querySelector('#new-account-modal');
        const userModalTbody = document.querySelector('#user-modal table tbody');
        const userModalTitle = document.querySelector('#user-modal p');

        const formatDateTime = timestamp => {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

            const dateTime = new Date(timestamp);
            const dateTimeHour = dateTime.getHours();
            const dateTimeMinute = dateTime.getMinutes();

            const day = days[dateTime.getDay()];
            const date = `${months[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()}`;

            const hour = dateTimeHour < 10 ? `0${dateTimeHour}` : dateTimeHour;
            const minute = dateTimeMinute < 10 ? `0${dateTimeMinute}` : dateTimeMinute;
            const time = `${hour}:${minute}`;

            return `${day}, ${date} @ ${time}`;
        };

        const populateTransactionsTable = transactions => {
            transactions.forEach(transaction => {
                const tr = document.createElement('tr');
                const idTh = document.createElement('th');
                const receiverTd = document.createElement('td');
                const conceptTd = document.createElement('td');
                const dateTd = document.createElement('td');
                const quantityTd = document.createElement('td');

                idTh.textContent = transaction.id;
                receiverTd.textContent = transaction.receiver;
                conceptTd.textContent = transaction.concept;
                dateTd.textContent = formatDateTime(transaction.timestamp);
                quantityTd.textContent = parseFloat(transaction.quantity).toFixed(2);

                tr.appendChild(idTh);
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

        const handleDeleteUsers = () => {
            const usersToDelete = [];
            const userCheckboxes = document.querySelectorAll('[name="delete"]');
            for (let i = 0; i < userCheckboxes.length; i++) {
                if (userCheckboxes[i].checked) {
                    usersToDelete.push(userCheckboxes[i].value);
                }
            }
            console.log(usersToDelete);
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
                case 'delete-btn':
                    handleDeleteUsers();
                    e.stopPropagation();
                    break;
                default:
                    e.stopPropagation();
                    break;
            }
        });
    });
}