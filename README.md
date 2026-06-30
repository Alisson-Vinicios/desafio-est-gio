# ⚡ AgilBank - Desafio Técnico

Uma aplicação bancária completa com arquitetura desacoplada (API Backend + Interface Frontend) construída para o desafio técnico da Agilize. O projeto simula operações de saque e transferência gerenciadas por uma **fila assíncrona baseada em concorrência na memória**, aplicando regras específicas de tarifas e limites para Contas Correntes e Poupanças.

## 🏗️ Diferenciais Implementados
* **Arquitetura Baseada em Fila (Queue):** Evita condições de corrida (race conditions) isolando as requisições em um processador sequencial FIFO com trava de estado (`isProcessing`).
* **Design Agilize:** Me senti livre para está utilizando a paleta de cores institucional e os vetores oficiais da marca.
* **polling de Histórico:** O frontend atualiza saldos e o extrato a cada 3 segundos automaticamente para refletir as transações processadas de forma assíncrona.

---

## 🛠️ Como Executar o Projeto (Passo a Passo)

Certifique-se de ter o **Node.js** instalado em sua máquina. O projeto roda completamente em memória, dispensando configurações de bancos de dados externos.

### 1. Inicializando o Backend (API)
Abra um terminal na raiz do projeto e execute:
```bash
# Entrar na pasta do servidor
cd backend

# Instalar as dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev

### 2. Inicializando o Frontend (Interface)
Bash
# Entrar na pasta da interface
cd frontend

# Instalar as dependências
npm install

# Iniciar o servidor do Vite
npm run dev