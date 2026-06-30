<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'

  const api = axios.create({
    baseURL: 'http://localhost:3000'
  })

  const accounts = ref([])
  const transactions = ref([])

  const selectedAccountId = ref('1')

  const transactionType = ref('SAQUE')
  const destinationAccountId = ref('')
  const transactionAmount = ref(0)

  const successMessage = ref('')
  const errorMessage = ref('')

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts')
      // Só repassa se a resposta for um array, evitando quebras
      if (Array.isArray(response.data)) {
        accounts.value = response.data
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions')
      if (Array.isArray(response.data)) {
        // Cria uma cópia do array antes de rodar o reverse
        transactions.value = [...response.data].reverse()
      }
    } catch (error) {
      console.error("Erro ao buscar transações:", error)
    }
  }

  const handleTransaction = async () => {
    successMessage.value = ''
    errorMessage.value = ''

    if (transactionAmount.value <= 0) {
      errorMessage.value = "O valor deve ser maior que zero."
      return
    }

    try {
      const payload = {
        accountOriginId: selectedAccountId.value,
        type: transactionType.value,
        amount: transactionAmount.value,
        accountDestinationId: transactionType.value === 'TRANSFERENCIA' ? destinationAccountId.value : null
      }

      await api.post('/transactions', payload)
      
      successMessage.value = "Transação enviada para processamento com sucesso!"
      
      transactionAmount.value = 0
      destinationAccountId.value = ''

      await fetchAccounts()
      await fetchTransactions()

    } catch (error) {
      errorMessage.value = error.response?.data?.error || "Erro ao realizar a operação."
    }
  }

  onMounted(async () => {
    await fetchAccounts()
    await fetchTransactions()

    setInterval(async () => {
      await fetchAccounts()
      await fetchTransactions()
    }, 3000)
  })
</script>

<template>
  
  <div class="bank-container">
    <header class="bank-header">
      <div class="logo-area">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" class="agilize-icon">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4789 34.4762H17.4153C7.80423 34.4762 0 26.7513 0 17.2381C0 7.72484 7.80423 0 17.4153 0C27.0263 0 34.8305 7.72484 34.8305 17.2381V31.8211C34.8305 33.2865 33.6286 34.4801 32.1442 34.4801C30.8229 34.4801 29.7484 33.4165 29.7484 32.1087V17.242C29.7484 10.5099 24.2246 5.04616 17.4192 5.04616C10.6139 5.04616 5.09006 10.5099 5.09006 17.242C5.09006 23.9742 10.6139 29.4379 17.4192 29.4379H17.4869C18.6609 29.4418 19.6121 30.3872 19.6121 31.5493V32.3687C19.6121 33.5347 18.6569 34.4801 17.4789 34.4801V34.4762ZM27.2253 17.2381V31.8093C27.2253 33.2826 26.0154 34.4801 24.527 34.4801C23.1978 34.4801 22.1193 33.4126 22.1193 32.0969V17.2381C22.1193 14.6736 20.0657 12.5898 17.475 12.5898C14.8842 12.5898 12.7789 14.6736 12.7789 17.2381C12.7789 19.8025 14.8842 21.8864 17.475 21.8864H17.4948C18.6649 21.8982 19.6081 22.8397 19.6081 24.0018V24.8251C19.6081 25.9911 18.6529 26.9365 17.475 26.9365H17.4192C12.0068 26.9365 7.61718 22.5954 7.61718 17.246C7.61718 11.8965 12.0108 7.55545 17.4192 7.55545C22.8277 7.55545 27.2173 11.8925 27.2213 17.2381H27.2253Z" fill="currentColor"></path>
        </svg>
        
        <h1 class="brand-title">AgilBank</h1>
        <span class="badge">Fullstack</span>
      </div>
      
      <div class="account-selector">
        <label for="user-select"><strong>Acessar como cliente:</strong></label>
        <select id="user-select" v-model="selectedAccountId">
          <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
            {{ acc.holder }}
          </option>
        </select>
      </div>
    </header>

    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <main class="bank-main" v-for="currentAcc in accounts.filter(a => a.id === selectedAccountId)" :key="currentAcc.id">
      
      <section class="balance-card" :class="{'corrente-style': currentAcc.type === 'CORRENTE', 'poupanca-style': currentAcc.type === 'POUPANCA'}">
        <span class="account-type-badge">CONTA {{ currentAcc.type }}</span>
        
        <h3>Saldo Disponível</h3>
        <h2>R$ {{ currentAcc.balance.toFixed(2) }}</h2>
        
        <p v-if="currentAcc.type === 'CORRENTE'" class="limit-info">
          * Tarifa por transação: R$ 1,00 | Limite Cheque Especial: R$ 500,00
        </p>
        <p v-else class="limit-info">* Conta Isenta de Tarifa | Não permite saldo negativo</p>
      </section>

      <section class="operation-card">
        <h3>Efetuar Operação</h3>
        <form @submit.prevent="handleTransaction" class="transaction-form">
          
          <div class="form-group">
            <label>Tipo de Operação:</label>
            <div class="radio-group">
              <label>
                <input type="radio" value="SAQUE" v-model="transactionType" /> Saque
              </label>
              <label>
                <input type="radio" value="TRANSFERENCIA" v-model="transactionType" /> Transferência
              </label>
            </div>
          </div>

          <div v-if="transactionType === 'TRANSFERENCIA'" class="form-group animate-fade">
            <label for="dest-account">Conta de Destino:</label>
            <select id="dest-account" v-model="destinationAccountId" required>
              <option value="" disabled>Selecione a conta destino</option>
              <option v-for="acc in accounts.filter(a => a.id !== selectedAccountId)" :key="acc.id" :value="acc.id">
                {{ acc.holder }} (ID: {{ acc.id }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="amount">Valor (R$):</label>
            <input id="amount" type="number" step="0.01" min="0.01" v-model.number="transactionAmount" required placeholder="0,00" />
          </div>

          <button type="submit" class="btn-submit">Enviar para Processamento</button>
        </form>
      </section>
    </main>

    <section class="transactions-section">
      <h3>Extrato de Transações (Fila Assíncrona)</h3>
      <div v-if="transactions.length === 0" class="empty-state">
        Nenhuma transação realizada até o momento.
      </div>
      <div v-else class="table-responsive">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Horário</th>
              <th>Tipo</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Valor</th>
              <th>Tarifa</th>
              <th>Status</th>
              <th>Detalhes / Falha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.transactionId">
              <td>{{ new Date(t.timestamp).toLocaleTimeString() }}</td>
              <td>
                <span class="type-badge" :class="t.type.toLowerCase()">{{ t.type }}</span>
              </td>
              <td>ID: {{ t.accountOriginId }}</td>
              <td>{{ t.accountDestinationId ? 'ID: ' + t.accountDestinationId : '-' }}</td>
              <td><strong>R$ {{ t.amount.toFixed(2) }}</strong></td>
              <td>R$ {{ t.fee.toFixed(2) }}</td>
              <td>
                <span class="status-badge" :class="t.status.toLowerCase()">
                  {{ t.status === 'PENDING' ? '⏳ PENDENTE' : t.status === 'SUCCESS' ? '✅ SUCESSO' : '❌ FALHA' }}
                </span>
              </td>
              <td class="reason-text">{{ t.failureReason || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>