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
        const passwordModal = document.querySelector('#password-modal');
        const passwordModalTitle = document.querySelector('#password-modal p');
        const passwordModalId = document.querySelector('#password-modal #user-id');

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
                        } else if (e.target.id.startsWith('change-pass-')) {
                            const userId = e.target.parentNode.querySelectorAll('td')[0].textContent;
                            passwordModalId.value = userId;
                            passwordModalTitle.textContent = e.target.parentNode.querySelectorAll('td')[1].textContent;
                            handleOpenModal(passwordModal);
                        }
                    });
                    e.stopPropagation();
                    break;
                case 'export-btn':
                    const accounts = [];
                    const tableData = document.querySelectorAll('#acc-bal-table tbody td');
                    for (let i = 0; i < tableData.length - 1; i += 2) {
                        const row = [];
                        row.push(tableData[i].textContent);
                        row.push(tableData[i + 1].textContent.replace(/\,/g, ''));
                        accounts.push(row);                     
                    }
                    let csvContent = 'data:text/csv;charset=utf-8,';
                    accounts.forEach(account => {
                        let row = account.join(',');
                        csvContent += row + '\r\n';
                    });
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);

                    let today = new Date();
                    let dd = today.getDate();
                    let mm = today.getMonth() + 1;
                    const yyyy = today.getFullYear();
                    if(dd < 10) dd = '0' + dd;
                    if(mm < 10) mm = '0' + mm;
                    today = mm + '/' + dd + '/' + yyyy;
                    link.setAttribute('download', `Cuentas-${today}.csv`);

                    document.body.appendChild(link);
                    link.click();
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