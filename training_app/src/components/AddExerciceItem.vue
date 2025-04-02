<template>
    <div class="card">
        <h2>Ajouter un exercice</h2>
        <form @submit.prevent="submitExercice">
            <div>
                <label for="exName">Nom de l'exercice :</label>
                <input id="exName" type="text" v-model="exercice.name" required />
            </div>
            <div>
                <label for="exDesc">Description :</label>
                <textarea id="exDesc" v-model="exercice.description" required></textarea>
            </div>
            <div>
                <label for="exTime">Temps (en minutes) :</label>
                <input id="exTime" type="number" v-model="exercice.time" />
            </div>
            <div>
                <label for="exRep">Nombre de répétitions :</label>
                <input id="exRep" type="number" v-model="exercice.repetition" />
            </div>
            <div class="button-container">
                <GenericButton type="button" color="red" desktopText="Fermer" mobileText="Fermer" @click="closePopup" />
                <GenericButton type="submit" desktopText="Ajouter l'exercice" mobileText="Ajouter" />
            </div>
        </form>
    </div>
</template>

<script>
import GenericButton from '@/components/utils/GenericButton.vue';

const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;

export default {
    name: 'AddExerciceItem',
    props: {
        trainingId: {
            type: String,
            required: true
        }
    },
    components: {
        GenericButton
    },
    data() {
        return {
            exercice: {
                name: '',
                description: '',
                time: null,
                repetitions: null
            }
        }
    },
    methods: {
        submitExercice() {
            const exerciceData = { ...this.exercice, training: { id: this.trainingId } };
            if (!exerciceData.time || exerciceData.time <= 0) {
                exerciceData.time = 0;
            }
            if (!exerciceData.repetition || exerciceData.repetition <= 0) {
                exerciceData.repetition = 1;
            }
            console.log(exerciceData);
            fetch(`${BASE_API_URL}/exercices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exerciceData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de l\'ajout de l\'exercice');
                    }
                    return response.json();
                })
                .then(data => {
                    this.$emit('close');
                    window.location.reload();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        closePopup() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.card {
    padding: 1rem;
    margin: 1rem;
}
.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
