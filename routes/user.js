const dateTime = require(`${__dirname}/../util/dateTime.js`);
const db = require(`${__dirname}/../db/index.js`);
const Router = require('express-promise-router');
const router = new Router();

module.exports = router;

router.get('/:id', async(req, res, next) => {
    const sess = req.session;
    if (sess.userId && sess.userId.toString() === req.params.id) {
        try {
            const accountsQuery = 'SELECT * FROM public.accounts;';
            const accountsRes = await db.query(accountsQuery);
            const users = accountsRes.rows;
            const user = users.find(u => u.id.toString() === req.params.id);
            user.balance = parseFloat(user.balance).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

            const transactionsQuery = 'SELECT * FROM public.transactions WHERE sender = $1 OR receiver = $2;';
            const transactionsRes = await db.query(transactionsQuery, [user.id, user.id]);
            const rawTransactions = transactionsRes.rows;
            
            const formattedTransactions = rawTransactions;
            formattedTransactions.forEach(transaction => {
                transaction.receiver = users.find(u => u.id === transaction.receiver).username;
                transaction.timestamp = dateTime.format(transaction.timestamp);
                transaction.quantity = parseFloat(transaction.quantity).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                if (transaction.sender.toString() === user.id.toString()) {
                    transaction.quantity = `-${transaction.quantity}`;
                }
                transaction.sender = users.find(u => u.id === transaction.sender).username;
            });

            const data = {
                user: user,
                formattedTransactions: formattedTransactions,
                users: users
            }

            res.render('user', data);
        } catch (e) {
            res.send(e.stack);
        }
    } else {
        res.redirect('/');
    }
});

router.post('/:id', async(req, res, next) => {
    const quantity = req.body.quantity;
    const concept = req.body.concept;
    const senderId = req.params.id;
    const receiverId = req.body.receiver;

    if (isValid(quantity, concept, senderId, receiverId)) {
        try {
            const senderQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
            const senderRes = await db.query(senderQuery, [senderId]);
            const sender = senderRes.rows[0];
    
            const receiverQuery = 'SELECT * FROM public.accounts WHERE id = $1;';
            const receiverRes = await db.query(receiverQuery, [receiverId]);
            const receiver = receiverRes.rows[0];
    
            const newSenderBalance = parseFloat(sender.balance) - parseFloat(quantity);
            const newReceiverBalance = parseFloat(receiver.balance) + parseFloat(quantity);
    
            const senderBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
            await db.query(senderBalanceQuery, [newSenderBalance, senderId]);
    
            const receiverBalanceQuery = 'UPDATE public.accounts SET balance = $1 WHERE id = $2;';
            await db.query(receiverBalanceQuery, [newReceiverBalance, receiverId]);
        
            const transactionsQuery = 'INSERT INTO public.transactions (timestamp, sender, receiver, quantity, concept) VALUES (current_timestamp(2), $1, $2, $3, $4);';
            await db.query(transactionsQuery, [senderId, receiverId, quantity, concept]);
    
            res.redirect(`/user/${senderId}`);   
        } catch (e) {
            res.send(e.stack);
        }
    } else if (parseInt(senderId) == parseInt(receiverId)) {
        res.send('(Me dio flojera estilizar esta página.) Felicidades, has sido acreedor a una multa (ahorita pienso de cuánto). Que tengas un bonito día.');
    } else {
        res.redirect(`/user/${senderId}`);
    }
});

const isValid = (quantity, concept, senderId, receiverId) => {
    let isConceptValid = false;
    let isQuantityValid = false;
    let isEntityValid = false;

    if (parseInt(senderId) != parseInt(receiverId))
        isEntityValid = true;

    if (concept.length >= 8 &&
        concept.length <= 25) isConceptValid = true;

    if (/^\$?\d+(\d{3})*(\.\d*)?$/.test(quantity) &&
        parseFloat(quantity) >= 1 &&
        parseFloat(quantity) <= 9999999)
        isQuantityValid = true;

    return isQuantityValid && isConceptValid && isEntityValid;
};