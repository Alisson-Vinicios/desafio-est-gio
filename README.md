# Desafio Técnico Fullstack - AgilBank

Repositório com o desenvolvimento do desafio técnico para a vaga de estágio fullstack da Agilize. A aplicação simula um sistema bancário utilizando Node.js com Express no backend e Vue.js 3 com Vite no frontend.
Optei por seguir o caminho de fazer por blocos, pois achei que seria mais seguro e não teria competição de ações, do jeito que resolvi cada bloco de requsição só será resolvida depois que outra já tiver sido concluída.

Como diferencial, o projeto conta com regras de negócio completas para conta corrente e poupança, controle de concorrência com fila assíncrona em memória e interface 100% personalizada com a identidade visual da empresa.

---

## Como rodar o projeto localmente

Para executar a aplicação em sua máquina de forma limpa, siga os passos abaixo. Você precisará ter apenas o Node.js instalado.

### 1. Configurando o Backend (API)

Abra um terminal na raiz do projeto e execute os seguintes comandos:

```bash
# Entrar na pasta do servidor
cd backend

# Instalar as dependências necessárias
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```
### 2. Inicializando o Frontend (Interface)
Abra um segundo terminal separado na raiz do projeto e execute:
```bash
# Entrar na pasta da interface
cd frontend

# Instalar as dependências
npm install

# Iniciar o servidor do Vite
npm run dev
```
### Massa de Testes Pré-Configurada
O sistema inicializa com duas contas simuladas em memória:

1. Alisson Oliveira (ID: 1) - CONTA CORRENTE: Saldo inicial de R$ 1.000,00. Tarifa de R$ 1,00 por operação e Cheque Especial de até R$ -500,00.

2. Cliente Agilize Poupança (ID: 2) - CONTA POUPANÇA: Saldo inicial de R$ 500,00. Isento de tarifas, bloqueado contra saldos negativos.

### Observações
Como já comentei acima, fiquei com receio de simplesmente mandar requisições sem fazer nenhum tratamento nelas, então optei por fazer por blocos.
No geral gostei muito de está realizando esse projeto, achei uma projeto bem desafiador, e eu quiz trazer um pouco dos conhecimentos da faculdade me preocupando com certas ações, já que se trata de um sistema de banco. Me senti a vontade para utilizar também as cores e a logo do sistema.
Senti um pouco de dificuldade com o Front mas espero que tenham gostado do resultado final.
