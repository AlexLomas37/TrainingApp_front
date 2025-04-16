<template>
  <main>
    <div class="centered-content">
      <!-- affichage de l'objet training -->
      <div v-if="training" class="training-info">
        <h1>Session d'entraînement {{ training.name }}</h1>
        <p>{{ training.description }}</p>
        <div class="timer-info">
          <span class="material-symbols-outlined">timer</span>
          <span>{{ training.time }} min</span>
        </div>
        <hr class="divider" />
        <ExerciceView :exercice="training.exercices[currentExerciceIndex]" :visible="true" :showClose="false"/>
        <form class="statistics-form" @submit.prevent="submitStatistics">
            <div v-if="training.exercices[currentExerciceIndex]?.statisticsMap && Object.keys(training.exercices[currentExerciceIndex].statisticsMap).length > 0">
            <h3>Entrez vos statistiques</h3>
            <div v-for="(label, stat) in training.exercices[currentExerciceIndex].statisticsMap" :key="stat" class="stat-field">
              <label :for="stat">{{ label }}</label>
              <GenericInput type="number" v-model.number="statisticsForm[stat]" />
            </div>
            </div>
        </form>
      </div>
      <div class="manage-training">
        <div v-if="training" class="exercice-session-info">
          <div class="repetition-counter">
            <span>Exercice {{ currentExerciceIndex + 1 }} / {{ training.exercices.length }}</span>
          </div>
          <div class="timer-info">
            <span class="material-symbols-outlined">laps</span>
            <span>{{ repetitionCount }} / {{ training.exercices[currentExerciceIndex].repetitions }}</span>
          </div>
          <h1>{{ formattedTime }}</h1>
        </div>
        <MediaButtons :isPlaying="isPlaying" :onPlay="() => handleDPCommand('start')"
          :onPause="() => handleDPCommand('pause')" :onStop="() => handleDPCommand('stop')"
          :onNext="() => handleDPCommand('next')" :onPrevious="() => handleDPCommand('previous')"
          :disabledPlay="disabled_play" :disabledStop="disabled_stop" :disabledNext="disabled_next"
          :disabledPrevious="disabled_previous" />
      </div>
      <ConfirmPopup :visible="showConfirmPopup" 
        message="Voulez-vous vraiment arrêter l'entraînement ? Les données sauvegardées seront envoyées."
        @confirm="confirmStop" 
        @cancel="showConfirmPopup = false" />
      <ConfirmPopup :visible="errorPopupVisible" 
        :message="errorPopupMessage"
        @confirm="errorPopupVisible = false"
        @cancel="errorPopupVisible = false" />
    </div>
  </main>
</template>

<script>
import MediaButtons from '@/components/utils/MediaButtons.vue';
import GenericButton from '@/components/utils/GenericButton.vue';
import GenericInput from '@/components/utils/GenericInput.vue';
import ExerciceView from './ExerciceView.vue';
import ConfirmPopup from '@/components/utils/ConfirmPopup.vue';
import { ExerciceSessionModel } from '@/models/ExerciceSession';
import { TrainingSessionModel } from '@/models/TrainingSession';

const StartCommand = {
  execute() {
    this.disabled_stop = false;
    this.startTimer();
    console.log("Démarrage de l'entraînement...");
  }
};

const PauseCommand = {
  execute() {
    this.pauseTimer();
    console.log("Mise en pause de l'entraînement...");
  }
};

const StopCommand = {
  execute() {
    this.showConfirmPopup = true;
    console.log("Ouverture de la popup de confirmation pour arrêter l'entraînement.");
  }
};

const NextCommand = {
  execute() {
    console.log("Passer à l'exercice suivant ou incrémenter la répétition...");
    if (!this.training) return;
    if (!this.currentExerciceSession) return;

    this.currentExerciceSession.end = new Date();
    this.currentExerciceSession.statisticsMap = new Map(Object.entries(this.statisticsForm));
    console.log("ExerciceSession mise à jour:", this.currentExerciceSession);
    if (this.trainingSessionObject.getExerciceSession(this.currentExerciceSession.id)) {
      console.log("Cette session d'exercice est déjà présente dans l'historique.");
      this.trainingSessionObject.updateExerciceSession(this.currentExerciceSession);
    } else {
      console.log("Cette session d'exercice n'est pas encore dans l'historique.");
      this.trainingSessionObject.addExerciceSession(this.currentExerciceSession);
    }

    this.currentExerciceSession = null;

    if (this.currentExerciceIndex >= this.training.exercices.length - 1 && this.repetitionCount >= this.training.exercices[this.currentExerciceIndex].repetitions) {
      this.disabled_previous = true;
      console.log("Fin de l'entraînement.");
      return;
    } else {
      this.disabled_previous = false;
      if (this.repetitionCount >= this.training.exercices[this.currentExerciceIndex].repetitions) {
        this.currentExerciceIndex++;
        this.repetitionCount = 1;
        this.currentExercice = this.training.exercices[this.currentExerciceIndex];
        this.statisticsForm = {};
      } else {
        this.repetitionCount++;
      }
    }

    this.updateButtons();

    const currentExercice = this.training.exercices[this.currentExerciceIndex];
    this.currentExerciceSession = new ExerciceSessionModel(
      ++this.exerciceSessionCounter,
      currentExercice,
      new Date(),
      new Date(),
      this.trainingSessionObject,
      new Map(Object.entries(currentExercice.statisticsMap || {}))
    );
    this.statisticsForm = {};
  }
};

const PreviousCommand = {
  execute() {
    console.log("Revenir à l'exercice précédent ou décrémenter la répétition...");
    if (this.currentExerciceIndex === 0 && this.repetitionCount === 1) {
      this.disabled_previous = true;
      console.warn("Impossible de revenir à l'exercice précédent.");
      return;
    } else {
      this.disabled_previous = false;
      if (this.trainingSessionObject.exerciceSessions.length === 0) {
        console.warn("Aucune session d'exercice dans l'historique.");
        return;
      } else {
        if (this.repetitionCount > 1) {
          this.repetitionCount--;
        } else {
          this.currentExerciceIndex--;
          this.repetitionCount = this.training.exercices[this.currentExerciceIndex].repetitions;
        }
        this.updateButtons();
        this.currentExercice = this.training.exercices[this.currentExerciceIndex];
        this.exerciceSessionCounter--;
        this.currentExerciceSession = this.trainingSessionObject.exerciceSessions.find(session => session.id === this.exerciceSessionCounter);
        if (this.currentExerciceSession && this.currentExerciceSession.statisticsMap) {
          this.statisticsForm = Object.fromEntries(this.currentExerciceSession.statisticsMap);
        } else {
          console.warn("Aucune session d'exercice trouvée pour l'exercice courant.");
        }
      }
    }
  }
};

const commands = {
  start: StartCommand,
  pause: PauseCommand,
  stop: StopCommand,
  next: NextCommand,
  previous: PreviousCommand,
};

export default {
  components: {
    MediaButtons,
    ExerciceView,
    GenericButton,
    GenericInput,
    ConfirmPopup
  },
  data() {
    return {
      isPlaying: false,
      timer: null,
      timeElapsed: 0,
      training: null,
      repetitionCount: 1,
      currentExerciceIndex: 0,
      trainingSessionObject: null,
      currentExerciceSession: null,
      exerciceSessions: [],
      futureExerciceSessions: [],
      statisticsForm: {},
      disabled_next: false,
      disabled_previous: true,
      disabled_play: false,
      disabled_stop: true,
      exerciceSessionCounter: 0,
      showConfirmPopup: false,
      errorPopupVisible: false,
      errorPopupMessage: "",
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeElapsed / 60000);
      const seconds = Math.floor((this.timeElapsed % 60000) / 1000);
      const centiseconds = Math.floor((this.timeElapsed % 1000) / 10);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
  },
  methods: {
    startTimer() {
      this.isPlaying = true;
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.timeElapsed += 10;
        }, 10);
      }
      if (this.trainingSessionObject.exerciceSessions.length === 0 && this.currentExerciceSession === null) {
        console.log("Creation d'un nouvel objet ExerciceSession...");
        this.trainingSessionObject.start = new Date();
        this.currentExerciceSession = new ExerciceSessionModel(
          ++this.exerciceSessionCounter,
          this.training.exercices[this.currentExerciceIndex],
          new Date(),
          new Date(),
          this.trainingSessionObject,
          new Map(Object.entries(this.training.exercices[this.currentExerciceIndex].statisticsMap || {}))
        );
      }
    },
    pauseTimer() {
      this.isPlaying = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    stopTimer() {
      this.isPlaying = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timeElapsed = 0;
    },
    handleDPCommand(commandName) {
      const command = commands[commandName];
      if (command) {
        command.execute.call(this);
      } else {
        console.warn("Commande inconnue:", commandName);
      }
    },
    async getTrainingSessionData() {
      const id = this.$route.params.id;
      try {
        const data = await fetchTrainingSession(id);
        if (data && data.training) {
          this.trainingSessionObject = new TrainingSessionModel(
            data.id || 0,
            data.training,
            data.start ? new Date(data.start) : new Date(),
            data.end ? new Date(data.end) : new Date()
          );
          this.training = data.training;
        }
      } catch (error) {
        console.error('Error fetching training session:', error);
        this.errorPopupMessage = "Erreur lors de la récupération d'informations";
        this.errorPopupVisible = true;
      }
    },

    sendTrainingSession() {
      if (!this.trainingSessionObject) {
        console.warn("Aucune session d'entraînement à envoyer.");
        return Promise.reject("No training session object");
      }
      console.log("Envoi de la session d'entraînement... ", this.trainingSessionObject);
      const id = this.$route.params.id;
      const trainingSessionData = {
        start: this.trainingSessionObject.start.toISOString(),
        end: this.trainingSessionObject.end.toISOString(),
        training: {
          id: this.trainingSessionObject.training.id
        }
      };
      console.log("Envoi de la session d'entraînement:", trainingSessionData);
      return fetch(`${BASE_API_URL}/training-sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingSessionData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de la session");
          }
          console.log("Session envoyée avec succès !", response.data);
          this.trainingSessionObject.exerciceSessions.forEach(session => {
            this.sendExerciceSession(session);
          });
          return response;
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi de la session:", error);
          this.showConfirmPopup = false;
          throw error;
        });
    },

    sendExerciceSession(session) {
      const id = this.$route.params.id;
      const exerciceSessionData = {
        start: session.start.toISOString(),
        end: session.end.toISOString(),
        statisticsMap: Object.fromEntries(session.statisticsMap),
        trainingSession: {
          id: id,
        },
        exercice: {
          id: session.exercice.id,
        }
      };
      console.log("Envoi de l'exercice session:", exerciceSessionData);
      fetch(`${BASE_API_URL}/exercice-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciceSessionData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de l'exercice session");
          }
          console.log("ExerciceSession envoyée avec succès !", session.id);
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi de l'exercice session:", error);
        });
    },

    updateButtons() {
      console.log("Modification des compteurs:", "Index =", this.currentExerciceIndex, "Repetition =", this.repetitionCount);
      this.disabled_previous = this.currentExerciceIndex === 0 && this.repetitionCount === 1;
      this.disabled_next = this.currentExerciceIndex === this.training.exercices.length - 1 && this.repetitionCount === this.training.exercices[this.currentExerciceIndex].repetitions;
    },
    confirmStop() {
      this.stopTimer();
      if (!this.training) return;
      this.currentExerciceSession.end = new Date();
      this.currentExerciceSession.statisticsMap = new Map(Object.entries(this.statisticsForm));
      console.log("ExerciceSession mise à jour:", this.currentExerciceSession);
      if (this.trainingSessionObject.getExerciceSession(this.currentExerciceSession.id)) {
        console.log("Cette session d'exercice est déjà présente dans l'historique.");
        this.trainingSessionObject.updateExerciceSession(this.currentExerciceSession);
      } else {
        console.log("Cette session d'exercice n'est pas encore dans l'historique.");
        this.trainingSessionObject.addExerciceSession(this.currentExerciceSession);
      }
      this.currentExerciceSession = null;
      this.trainingSessionObject.end = new Date();
      this.sendTrainingSession()
        .then(() => {
          console.log("Arrêt de l'entraînement et envoi de la session...");
        })
        .catch(error => console.error("Erreur lors de l'envoi de la session:", error));
      this.showConfirmPopup = false;
    }
  },

  mounted() {
    this.getTrainingSessionData();
  }
};

const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;
const fetchTrainingSession = async (id) => {
  const apiUrl = `${BASE_API_URL}/training-sessions/${id}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Error fetching training session data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching training session:', error);
  }
};

</script>

<style>
main {
  width: 100vw;
  margin: 0;
  padding: 0 0 120px 0;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-text);
  margin: 10px 0;
}

.training-info {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.manage-training {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-background-soft);
  border-radius: 20px;
}

.exercice-session-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.centered-content pre {
  width: 100%;
  white-space: normal;
}

.timer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repetition-counter {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.exercice-counter {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.statistics-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

.statistics-form label {
  margin-right: 0.5rem;
}
</style>