<script setup>
import { ref, onMounted } from 'vue'

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '@/config/firebase'

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variabili reattive
const results = ref([])
const rankings = ref([])

// Funzione per leggere i results
const loadResults = async () => {
  const querySnapshot = await getDocs(collection(db, "results"));
  const data = []

  querySnapshot.forEach((doc) => {
    const result = doc.data();
    let createdAtDate = result.created_at?.toDate ? result.created_at.toDate() : null;

    // Trasformo i giocatori in un array
    const players = [
      { user: result.user_1, score: result.score_user_1 },
      { user: result.user_2, score: result.score_user_2 },
      { user: result.user_3, score: result.score_user_3 },
      { user: result.user_4, score: result.score_user_4 }
    ].filter(p => p.user)

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
      createdAtDate,
      players
    });
  });

  // Ordino le giocate per data decrescente (ultima giocata prima)
  data.sort((a, b) => b.createdAtDate - a.createdAtDate);

  results.value = data;
  console.log("Results loaded:", results.value);

  // Genero i rankings
  generateRankings(data)
}

// Funzione per creare i rankings
const generateRankings = (resultsData) => {
  const rankingsMap = {}

  resultsData.forEach(result => {
    const players = result.players
    const maxScore = Math.max(...players.map(p => p.score))
    const winners = players.filter(p => p.score === maxScore).map(p => p.user)

    players.forEach(player => {
      if (!rankingsMap[player.user]) {
        rankingsMap[player.user] = {
          user: player.user,
          played: 0,
          wins: 0,
          points: 0
        }
      }

      rankingsMap[player.user].played += 1
      rankingsMap[player.user].points += player.score
      if (winners.includes(player.user)) rankingsMap[player.user].wins += 1
    })
  })

  rankings.value = Object.values(rankingsMap).map(player => ({
    ...player,
    winPercentage: player.played > 0 ? ((player.wins / player.played) * 100).toFixed(1) : "0.0"
  }))
  console.log("Rankings:", rankings.value)
}

// Carico i dati all'avvio
onMounted(() => {
  loadResults()
})
</script>

<template>

  <div class="container min-vh-100">
    <div class="row h-100 mb-4">
      <div class="col-12 text-center">
        <h1 class="my-4">Classifica All Time</h1>

          <table class="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Giocatore</th>
                <th>Partite giocate</th>
                <th>Vittorie</th>
                <th>% Vittorie</th>
                <th>Punti totali</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in rankings" :key="player.user">
                <td>{{ player.user }}</td>
                <td>{{ player.played }}</td>
                <td>{{ player.wins }}</td>
                <td>{{ player.winPercentage }}%</td>
                <td>{{ player.points }}</td>
              </tr>
            </tbody>
          </table>

      </div>
    </div>
  </div>
</template>
