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

  const K = 10; // parametro di esperienza, puoi modificarlo

  rankings.value = Object.values(rankingsMap).map(player => {
    const winPercentage = player.played > 0 ? ((player.wins / player.played) * 100) : 0;
    const avgPoints = player.played > 0 ? (player.points / player.played) : 0;

    // Percentuale ponderata con fattore esperienza
    const ponderata = player.played > 0 
      ? winPercentage * (player.played / (player.played + K)) 
      : 0;

    // Indice finale con 50% ponderata e 50% media punti
    const indice = (ponderata * 0.5) + (avgPoints * 0.5);

    return {
      ...player,
      winPercentage: winPercentage.toFixed(1),
      ponderata: ponderata.toFixed(1), // opzionale, se vuoi vedere il valore ponderato
      avgPoints: avgPoints.toFixed(1),
      indice: indice.toFixed(1)
    };
  });

  // Ordina la classifica per indice decrescente
  rankings.value.sort((a, b) => b.indice - a.indice)
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

      <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
        <v-icon
          v-bind="activatorProps"
          color="#908435"
          size="32"
          class="cursor-pointer mb-2"
        >
          mdi-information-outline
        </v-icon>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="Indice classifica">
            <template v-slot:text>
              <v-card-text>
                <div class="ranking-explanation formula" style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.5;">
                  <h3 style="color:#908435">Come viene calcolato l'indice dei giocatori</h3>
                  <p>L'indice di ogni giocatore tiene conto sia delle vittorie che dell'esperienza e dei punti medi per partita.</p>

                  <h4 style="color:#908435">Variabili:</h4>
                  <ul>
                    <li><strong style="color:#ffff66">W</strong> = Partite vinte</li>
                    <li><strong style="color:#ffff66">T</strong> = Partite totali giocate</li>
                    <li><strong style="color:#ffff66">P</strong> = Percentuale vittorie = W / T</li>
                    <li><strong style="color:#ffff66">M</strong> = Media punti per partita</li>
                    <li><strong style="color:#ffff66">K</strong> = Fattore esperienza (N° di partite necessarie per stabilizzare la percentuale) = 1</li>
                  </ul>

                  <h4 style="color:#908435">Formula:</h4>
                  <p>Percentuale vittorie ponderata:</p>
                  <p style="text-align: center;"><em><span style="color:#ffff66">P</span><sub>ponderata</sub> = <span style="color:#ffff66">P</span> × (<span style="color:#ffff66">T</span> / (<span style="color:#ffff66">T</span> + <span style="color:#ffff66">K</span>))</em></p>

                  <p style="color:#908435">Indice finale:</p>
                  <p style="text-align: center;"><em>Indice = 0.5 × <span style="color:#ffff66">P</span><sub>ponderata</sub> + 0.5 × <span style="color:#ffff66">M</span></em></p>

                  <p><strong>0.5</strong> viene usato per dare lo stesso peso a <strong style="color:#ffff66">P</strong> ed <strong style="color:#ffff66">M</strong></p>

                  <p>Il fattore esperienza serve a bilanciare il punteggio quando i giocatori hanno media punti e percentuale di vittorie simili, ma un numero molto diverso di partite giocate.</p>
                </div>
              </v-card-text>
            </template>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="surface-variant"
                text="Chiudi"
                variant="flat"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
    </v-dialog>

      <!-- Cards -->
      <!-- <v-card
        class="d-flex flex-column mx-auto py-8 mb-6 bg-grey-darken-4"
        border="double lg"
        elevation="10"
        height="500"
        width="360"
        v-for="(player, index) in rankings"
        :key="player.user"
      >
        <div class="d-flex justify-center mt-auto text-h5 ">

          <p>{{ player.user }}</p>

          <v-icon
            v-if="index === 0"
            class="ml-2"
            color="amber"
            icon="mdi-medal"
          />
          <v-icon
            v-else-if="index === 1"
            class="ml-2"
            color="blue-grey-lighten-1"
            icon="mdi-medal"
          />
          <v-icon
            v-else-if="index === 2"
            class="ml-2"
            color="deep-orange"
            icon="mdi-medal"
          />
        </div>

        <div class="d-flex align-center flex-column my-auto">
          <div class="text-h3 mt-2">
            <p>{{player.indice}}</p>
          </div>

          <v-rating
            :model-value="(player.indice / 100) * 5"
            color="yellow-darken-3"
            half-increments
            size="small"
          />
        </div>

        <v-list
          bg-color="transparent"
          class="d-flex flex-column"
          density="compact"
        >
          <v-list-item >
            <template v-slot:prepend>
              <span>Partite giocate:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.played }} </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            <template v-slot:prepend>
              <span>Partite vinte:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.wins }} </span>
              </div>
            </template>
          </v-list-item>

          <v-list-item >
            <template v-slot:prepend>
              <span>% Vittorie:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.winPercentage }}% </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            <template v-slot:prepend>
              <span>Punti totali:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.points }}</span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            <template v-slot:prepend>
              <span>Media punti a partita:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.avgPoints }}</span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card> -->


    <v-card
      class="mx-auto mb-6"
      max-width="375"
      style="border-color:#908435 !important"
      border="double lg"
      v-for="(player, index) in rankings"
    >

      <v-img
        class="text-white"
        height="300px"
        gradient="rgba(0,0,0,0.5), rgba(0,0,0,0.5)"
        :src="`images/${index+1}.jpg`" 
        cover        
      >
        <div class="d-flex flex-column h-100 py-8">

          <v-card-title class="pb-1 text-center">
            <div class="text-h4" style="font-family: 'Everdell', sans-serif;">
              {{player.user}}
              
            </div>
            <v-icon
              v-if="index === 0"
              class="ml-2"
              color="amber"
              icon="mdi-medal"
            />
            <v-icon
              v-else-if="index === 1"
              class="ml-2"
              color="blue-grey-lighten-1"
              icon="mdi-medal"
            />
            <v-icon
              v-else-if="index === 2"
              class="ml-2"
              color="deep-orange"
              icon="mdi-medal"
            />
          </v-card-title>
          <div class="d-flex align-center flex-column my-2">

              <div class="text-h3 mt-2">
                <p>{{player.indice}}</p>
              </div>

              <v-rating
                :model-value="(player.indice / 100) * 5"
                color="#ffff66"
                half-increments
                size="small"
              />
          </div>
        </div>
      </v-img>

        <v-list
          bg-color="transparent"
          class="d-flex flex-column"
          density="compact"
        >
          <v-list-item >
            <template v-slot:prepend>
              <span>Partite giocate:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.played }} </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            <template v-slot:prepend>
              <span>Partite vinte:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.wins }} </span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            <template v-slot:prepend>
              <span>Punti totali:</span>
            </template>

            <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.points }}</span>
              </div>
            </template>
          </v-list-item>
          <v-list-item >
            
            <template v-slot:prepend>
              <span> % Vittorie:</span>
            </template>

            <!-- <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.winPercentage }}% </span>
              </div>
            </template> -->

            <v-progress-linear
              v-model="player.winPercentage"
              height="20"       
              color="#ffff66"
              rounded="lg"
            >
              <strong>{{ player.winPercentage }}%</strong>
            </v-progress-linear>
          </v-list-item>

          <v-list-item >
            <template v-slot:prepend>
              <span>Media pts:</span>
            </template>

            <!-- <template v-slot:append>
              <div class="rating-values">
                <span class="d-flex justify-end"> {{ player.avgPoints }}</span>
              </div>
            </template> -->
            <v-progress-linear
              v-model="player.avgPoints"
              height="20"
              color="#ffff66"
              rounded="lg"
            >
              <strong>{{ player.avgPoints }}</strong>
            </v-progress-linear>
          </v-list-item>
        </v-list>
    </v-card>


    <!-- <div class="cards">
      <div class="card" v-for="player in rankings" :key="player.user">
        <div class="card-header">
          {{ player.user }}
        </div>
        <div class="card-body">
          <p><span>Indice:</span> {{ player.indice }}</p>
          <p><span>Partite giocate:</span> {{ player.played }}</p>
          <p><span>Vittorie:</span> {{ player.wins }}</p>
          <p><span>% Vittorie:</span> {{ player.winPercentage }}%</p>
          <p><span>Punti totali:</span> {{ player.points }}</p>
        </div>
      </div>
    </div> -->

    </div>
  </div>
</div>

</template>
