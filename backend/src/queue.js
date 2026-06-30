const {db} = require('./database');
const queue = [];
let isProcessing = false;

function enqueue(transactionsBlock) {
    queue.push(transactionsBlock);
    console.log(`[QUEUE] Nova Transação de ${transactionsBlock.type} no valor de R$${transactionsBlock.amount} adicionada à fila.`);
    processQueue();
};

async function processQueue() {
    if(isProcessing) return;
    if(queue.length === 0){
        return;
    }

    isProcessing = true;

    const currentBlock = queue.shift();
    console.log(`[QUEUE] Processando transação ${currentBlock.type}...`);

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        executeTransaction(currentBlock);

    } catch (error) {
        console.error(`[QUEUE] Erro crítico ao processar bloco:`, error);
        currentBlock.status = "FAILED";
        currentBlock.failureReason = "Erro interno no processamento.";
        db.transactions.push(currentBlock);
    } finally {
    isProcessing = false;
    processQueue();
  }
};

function executeTransaction(block) {
    const originAccount = db.accounts.find(acc => acc.id === block.accountOriginId);

    //Existencia de conta
    if(!originAccount) {
        block.status = "FAILED";
        block.failureReason = "Conta de origem não encontrada.";
        db.transactions.push(block);
        return;
    }

    let fee = 0;
    let limit = 0;

    if( originAccount.type === "CORRENTE") {
        fee = 1.00;
        limit = -500.00;
    } else if( originAccount.type === "POUPANCA") {
        fee = 0.00;
        limit = 0.00;
    }

    const totalCost = block.amount + fee;
    //Validacao de saldo + limite
    if(originAccount.balance - totalCost < limit){
        block.status = "FAILED";
        block.fee = fee;
        block.failureReason = originAccount.type === "CORRENTE"
            ? "Saldo e limite de cheque especial insuficientes." 
            : "Saldo insuficiente (Poupança não pode ficar negativa).";
    }

    //Logica por operação
    if(block.type === "SAQUE") {
        originAccount.balance -= totalCost;

        block.status = "SUCCESS";
        block.fee = fee;
        db.transactions.push(block);
        console.log(`[SUCCESS] Saque de R$ ${block.amount} concluído na conta ${originAccount.id}. Novo Saldo: R$ ${originAccount.balance}`);
        return;
    }

    if(block.type === "TRANSFERENCIA") {
        const destinationAccount = db.accounts.find(acc => acc.id === block.accountDestinationId);
        //Verificação se existe conta destino
        if(!destinationAccount) {
            block.status = "FAILED";
            block.fee = fee;
            block.failureReason = "Conta de destino não encontrada.";
            db.transactions.push(block);
            return;
        }

        originAccount.balance -= totalCost;
        destinationAccount.balance += block.amount;

        block.status = "SUCCESS"
        block.fee = fee;
        db.transactions.push(block);
        console.log(`[SUCCESS] Saque de R$ ${block.amount} concluído na conta ${originAccount.id} para a conta ${destinationAccount.id} concluída.`);
        return;
    }
};

module.exports = { enqueue };