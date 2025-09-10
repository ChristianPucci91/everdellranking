<script setup>
import { ref, computed } from 'vue'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from '@/config/firebase'

// Inizializzo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lista dei giocatori disponibili
const playersList = ['Christian', 'Fabio', 'Luca', 'Valerio','Mauro','Michele']

// Form
const form = ref({
  user_1: '',
  score_user_1: '',
  user_2: '',
  score_user_2: '',
  user_3: '',
  score_user_3: '',
  user_4: '',
  score_user_4: ''
})

// Errori
const error = ref('')

// Controllo duplicati solo tra utenti selezionati
const hasDuplicates = computed(() => {
  const users = [form.value.user_1, form.value.user_2, form.value.user_3, form.value.user_4].filter(u => u)
  return new Set(users).size !== users.length
})

// Controllo punteggi solo per utenti selezionati
const hasEmptyScores = computed(() => {
  return [1,2,3,4].some(i => {
    const user = form.value[`user_${i}`];
    const score = form.value[`score_user_${i}`];
    return user && score === '';
  });
});

// Controllo minimo 3 giocatori
const hasMinPlayers = computed(() => {
  const selectedUsers = [form.value.user_1, form.value.user_2, form.value.user_3, form.value.user_4].filter(u => u);
  return selectedUsers.length >= 3;
});

// Salvataggio su Firestore
const saveResult = async () => {
  error.value = ''

  if (!hasMinPlayers.value) {
    error.value = 'Devi selezionare almeno 3 giocatori!'
    return
  }

  if (hasDuplicates.value) {
    error.value = 'Ci sono nomi duplicati!'
    return
  }

  if (hasEmptyScores.value) {
    error.value = 'Tutti i punteggi dei giocatori selezionati devono essere inseriti!'
    return
  }

  try {
    await addDoc(collection(db, "results"), {
      user_1: form.value.user_1 || null,
      score_user_1: form.value.user_1 ? Number(form.value.score_user_1) : null,
      user_2: form.value.user_2 || null,
      score_user_2: form.value.user_2 ? Number(form.value.score_user_2) : null,
      user_3: form.value.user_3 || null,
      score_user_3: form.value.user_3 ? Number(form.value.score_user_3) : null,
      user_4: form.value.user_4 || null,
      score_user_4: form.value.user_4 ? Number(form.value.score_user_4) : null,
      created_at: serverTimestamp()
    });

    alert('Risultato salvato con successo!');
    form.value = { user_1:'', score_user_1:'', user_2:'', score_user_2:'', user_3:'', score_user_3:'', user_4:'', score_user_4:'' };

  } catch (e) {
    console.error(e);
    error.value = 'Errore durante il salvataggio!';
  }
}
</script>
<template>
  <div class="container min-vh-100">
    <div class="row h-100 mb-4">
      <div class="col-12 text-center">
        <h2 class="mt-4">Inserisci risultato</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="saveResult">
          <div class="row mb-2" v-for="i in 4" :key="i">
            <div class="col-6">
              <select class="form-select" v-model="form[`user_${i}`]">
                <option value="">Seleziona giocatore {{ i }}</option>
                <option v-for="p in playersList" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="col-6">
              <input type="number" class="form-control" placeholder="Punteggio" v-model="form[`score_user_${i}`]">
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-2">Salva risultato</button>
        </form>
      </div>
    </div>
  </div>
</template>