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

// Variabile reattiva per i rankings
const rankings = ref([])

// Funzione per leggere i rankings
const loadRankings = async () => {
  const querySnapshot = await getDocs(collection(db, "rankings"))
  const data = []

  querySnapshot.forEach((doc) => {
    const ranking = doc.data()
    console.log(ranking)
    // il campo "text" è un JSON salvato come stringa → lo parsifico
    let scores = {}
    try {
      scores = JSON.parse(ranking.text).scores
    } catch (e) {
      console.error("Errore parsing JSON:", e)
    }
    data.push({
      id: doc.id,
      round: JSON.parse(ranking.text).round,
      scores,
      createdAt: ranking.createdAt?.toDate ? ranking.createdAt.toDate().toLocaleString() : ""
    })
  })
  rankings.value = data
}

// Carico i dati all'avvio
onMounted(() => {
  loadRankings()
})
</script>

<template>
  <div class="container vh-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 text-center">
        <h1>Classifica Everdell</h1>

        <!-- Tabella classifica -->
        <table class="table table-bordered mt-4" v-if="rankings.length">
          <thead>
            <tr>
              <th>Round</th>
              <th>Giocatore</th>
              <th>Punteggio</th>
              <th>Creato il</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ranking in rankings" :key="ranking.id">
              <td :rowspan="Object.keys(ranking.scores).length">{{ ranking.round }}</td>
              <template v-for="(score, player) in ranking.scores" :key="player">
                <tr>
                  <td>{{ player }}</td>
                  <td>{{ score }}</td>
                  <td>{{ ranking.createdAt }}</td>
                </tr>
              </template>
            </tr>
          </tbody>
        </table>

        <p v-else>Nessun ranking trovato.</p>
      </div>
    </div>
  </div>
</template>
