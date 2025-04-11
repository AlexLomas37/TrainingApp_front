<template>
    <div class="training-session-view centered-content">
        <!-- affichage de l'objet training -->
        <pre v-if="training">
            <h1>Session d'entraînement {{ training.name }}</h1>
            <p>{{ training.description }}</p>
            <div class="timer-info">
                <span class="material-symbols-outlined">timer</span>
                <span>{{ training.time }} min</span>
            </div>
            <hr class="separator" />
            <ExerciceView :exercice="training.exercices[currentExerciceIndex]" :visible="true" />
        </pre>
        <div v-if="training" class="repetition-counter">
            <div>
                <span>Exercice {{ currentExerciceIndex + 1 }} / {{ training.exercices.length }}</span>
            </div>
            <div class="timer-info">
                <span class="material-symbols-outlined">laps</span>
                <span>{{ repetitionCount }} / {{ training.exercices[currentExerciceIndex].repetitions }}</span>
            </div>
        </div>
        <h1>{{ formattedTime }}</h1>
        <MediaButtons :isPlaying="isPlaying" :onPlay="() => handleDPCommand('start')"
            :onPause="() => handleDPCommand('pause')" :onStop="() => handleDPCommand('stop')"
            :onNext="() => handleDPCommand('next')" :onPrevious="() => handleDPCommand('previous')" />
    </div>
</template>

<script>
import MediaButtons from '@/components/utils/MediaButtons.vue';
import ExerciceView from './ExerciceView.vue';

const StartCommand = {
    execute() {
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
        if (window.confirm("Voulez-vous vraiment arrêter l'entraînement ?")) {
            this.stopTimer();
            console.log("Arrêt de l'entraînement...");
        } else {
            console.log("Arrêt annulé.");
        }
    }
};

const NextCommand = {
    execute() {
        console.log("Passer à l'exercice suivant ou incrémenter la répétition...");
        if (this.training) {
            const currentExercise = this.training.exercices[this.currentExerciceIndex];
            if (this.repetitionCount < currentExercise.repetitions) {
                this.repetitionCount++;
            } else if (this.currentExerciceIndex < this.training.exercices.length - 1) {
                this.currentExerciceIndex++;
                this.repetitionCount = 1;
            }
        }
    }
};

const PreviousCommand = {
    execute() {
        console.log("Revenir à l'exercice précédent ou décrémenter la répétition...");
        if (this.training) {
            if (this.repetitionCount > 1) {
                this.repetitionCount--;
            } else if (this.currentExerciceIndex > 0) {
                this.currentExerciceIndex--;
                const previousExercise = this.training.exercices[this.currentExerciceIndex];
                this.repetitionCount = previousExercise.repetitions;
            }
        }
    }
};

const commands = {
    start: StartCommand,
    pause: PauseCommand,
    stop: StopCommand,
    next: NextCommand,
    previous: PreviousCommand
};

export default {
    components: {
        MediaButtons,
        ExerciceView
    },
    data() {
        return {
            isPlaying: false,
            timer: null,
            timeElapsed: 0,
            training: null,
            repetitionCount: 1, // démarre à 1
            currentExerciceIndex: 0 // Nouveau compteur pour l'exercice en cours
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
            const data = await fetchTrainingSession(id);
            if (data && data.training) {
                // Stocker uniquement l'objet training
                this.training = data.training;
                console.log("Training session data:", data.training);
            }
        },
        incrementRepetition() {
            this.repetitionCount++;
        }
    },
    mounted() {
        this.getTrainingSessionData();
    }
}

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

let compteur = 1;

</script>

<style>
/* Center content horizontally */
.centered-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* Optional: Ensures full viewport height */
    width: 100%;
    /* Ensures it takes the full width of the main container */
}

.timer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Nouveau style pour le compteur */
.repetition-counter {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Nouveau style pour le compteur d'exercices */
.exercice-counter {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>