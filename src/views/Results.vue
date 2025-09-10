<script setup>
import { ref, onMounted } from 'vue'

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCZUTNDQ8la4dSvR4N56zQvKWxTDwezsI",
  authDomain: "everdell-21f0f.firebaseapp.com",
  databaseURL: "https://everdell-21f0f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "everdell-21f0f",
  storageBucket: "everdell-21f0f.firebasestorage.app",
  messagingSenderId: "28450169793",
  appId: "1:28450169793:web:c7460c13b4bcdd68670540",
  measurementId: "G-7GLH1S1MX6"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variabile reattiva per i results
const results = ref([])

// Funzione per leggere i results
const loadResults = async () => {
  const querySnapshot = await getDocs(collection(db, "results"));
  const data = [];

  querySnapshot.forEach((doc) => {
    const result = doc.data();
    let createdAtDate = result.created_at?.toDate ? result.created_at.toDate() : null;

    // Trasformo i giocatori in un array
    const players = [
      { user: result.user_1, score: result.score_user_1 },
      { user: result.user_2, score: result.score_user_2 },
      { user: result.user_3, score: result.score_user_3 },
      { user: result.user_4, score: result.score_user_4 }
    ].filter(p => p.user); // rimuovo eventuali giocatori nulli

    // Ordino i giocatori per punteggio decrescente
    players.sort((a, b) => b.score - a.score);

    const createdAt = createdAtDate
      ? `${createdAtDate.getDate().toString().padStart(2, '0')}/${
          (createdAtDate.getMonth() + 1).toString().padStart(2, '0')
        }/${createdAtDate.getFullYear()}`
      : "";

    data.push({
      id: doc.id,
      createdAt,
      createdAtDate, // serve solo per ordinamento
      players
    });
  });

  // Ordino le giocate per data decrescente (ultima giocata prima)
  data.sort((a, b) => b.createdAtDate - a.createdAtDate);

  results.value = data;
  console.log("Results loaded:", results.value);
};

// Carico i dati all'avvio
onMounted(() => {
  loadResults()
})
</script>

<template>
  <div class="container vh-100">
    <div class="row h-100 mb-4">
      <div class="col-12 text-center">
        <h1 class="my-4">Ultimi 5 match Everdell</h1>

        <div v-if="results.length">
          <div v-for="result in results" :key="result.id" class="mb-4">
            <h3>Giocata il {{ result.createdAt }}</h3>
            <table class="table table-bordered table-dark">
              <thead>
                <tr>
                  <th>Giocatore</th>
                  <th>Punteggio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="player in result.players" :key="player.user">
                  <td>{{ player.user }}</td>
                  <td>{{ player.score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p v-else>Nessun ranking trovato.</p>
      </div>
    </div>
  </div>
</template>



