const express = require('express');
const crypto = require('crypto');
const db = require('./database');
const { enquere, enqueue } = require('./queue');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

//Rota listar contas
app.get('/accounts', (req, res) => {
    return res.json(db.accounts);
});

//Rota listar historico de transações
app.get('/transactions', (req, res) => {
    return res.json(db.transactions);
});

//Rota criar movimentação
app.post('/transactions', (req, res) => {
    const { accountOriginId, accountDestinationId, type, amount } = req.body;
//Validações básicas
    if (!accountOriginId || !type || !amount){
        return res.status(400).json({error: "Campos obrigatórios: accountOriginId, type, amount."});
    }

    if(amount <= 0){
        return res.status(400).json({error: "O valor da operação deve ser maior que 0"});
    }

    if(type !== 'SAQUE' && type !== 'TRANSFERENCIA'){
        return res.status(400).json({error: "Tipo de operação inválida. Use SAQUE ou TRANSFERENCIA."});
    }

    const transactionBlock = {
        transctionId: crypto.randomUUID(),
        accountOriginId,
        accountDestinationId: type === 'TRANSFERENCIA' ? accountDestinationId: null,
        type,
        amount: parseFloat(amount),
        fee: 0,
        timestamp: new Date().toISOString(),
        status: "PENDING",
        failureReason: null
    };

    enqueue(transactionBlock);

    return res.status(202).json({
        message: "Transação recebida e enviada para processamento.",
        transaction: transactionBlock
    });
});

app.get('/', (req, res) => {
  res.send('O servidor está rodando perfeitamente!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});