//Banco de dados simulado em memória

const db = {
    accounts: [
        {
            id:"1",
            holder: "Alisson Oliveira",
            type: "CORRENTE",
            balance: 1000.00
        },
        {
            id:"2",
            holder: "Cliente Agilize Poupança",
            type: "POUPANCA",
            balance: 500.00
        },
    ],
    transactions: []
};