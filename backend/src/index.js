const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        message: "Bem-vindo à API do AgilBank! Servidor rodando com sucesso."
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ativo e rodando na porta http://localhost:${PORT}`)
})