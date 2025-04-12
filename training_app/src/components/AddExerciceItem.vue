<template>
    <div class="card">
        <h2>Ajouter un exercice</h2>
        <br />
        <form @submit.prevent="submitExercice">
            <div>
                <label for="exName">Nom de l'exercice :</label>
                <GenericInput v-model="exercice.name" type="text" placeholder="Nom de l'exercice" required
                    style="width: 100%;" />
            </div>
            <div>
                <label for="exDesc">Description :</label>
                <GenericTextArea v-model="exercice.description" placeholder="Description de l'exercice" required
                    class="vertical-only" style="width: 100%;" />
            </div>
            <div>
                <label for="exTime">Temps (en minutes) :</label>
                <GenericInput v-model="exercice.time" type="number" placeholder="Temps en minutes"
                    style="width: 100%;" />
            </div>
            <div>
                <label for="exRep">Nombre de répétitions :</label>
                <GenericInput v-model="exercice.repetitions" type="number" placeholder="Nombre de répétitions"
                    style="width: 100%;" />
            </div>
            <div>
                
                <div style="display: flex; align-items: center;">
                    <label for="exStat">Statistiques :</label>
                    <GenericButton type="button" icon="docs_add_on" @click="addStatistique" style="margin-left: auto;"/>
                </div>
                <div id="stats-container" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <div v-for="(stat, index) in statisticsMapArray" :key="index" class="stat-row">
                        <select v-model="stat.type" style="margin: 0 10px;">
                            <option v-for="option in statisticOptions" :key="option.value" :value="option.value">
                                {{ option.value }}
                            </option>
                        </select>
                        <GenericInput v-model="stat.value" type="text" placeholder="Ajouter une unité" style="flex: 1; margin: 0 10px;" />
                        <GenericButton type="button" icon="remove" color="gray" @click="removeStatistique(index)" style="margin-left: 10px;" />
                    </div>
                </div>
            </div>
            <br />
            <div class="button-container">
                <GenericButton type="button" color="rgb(46, 46, 46)" desktopText="Fermer" mobileText="Fermer" @click="closePopup" />
                <GenericButton type="submit" icon="add" desktopText="Ajouter l'exercice" />
            </div>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GenericButton from '@/components/utils/GenericButton.vue';
import GenericInput from '@/components/utils/GenericInput.vue';
import GenericTextArea from '@/components/utils/GenericTextArea.vue';

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
        GenericButton,
        GenericInput,
        GenericTextArea
    },
    data() {
        return {
            exercice: {
                name: '',
                description: '',
                time: 0,
                repetitions: 1
            },
            statisticsMapArray: [],
            statisticOptions: [] // Store options fetched from the API
        }
    },
    methods: {
        async fetchStatisticOptions() {
            try {
                const response = await fetch(`${BASE_API_URL}/statistic-types`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des options de statistiques');
                }
                const data = await response.json();
                this.statisticOptions = data.map(option => ({
                    value: option,
                    label: option // Use the same value for label and value
                }));
            } catch (error) {
                console.error('Erreur lors de la récupération des options:', error);
            }
        },
        addStatistique() {
            this.statisticsMapArray.push({ type: 'NONE', value: '' }); // Default to 'NONE'
        },
        removeStatistique(index) {
            this.statisticsMapArray.splice(index, 1);
        },
        submitExercice() {
            const statisticsMap = this.statisticsMapArray.reduce((map, stat) => {
                if (stat.type && stat.value) {
                    map[stat.type] = stat.value;
                }
                return map;
            }, {});

            const exerciceData = { 
                ...this.exercice, 
                training: { id: this.trainingId },
                statisticsMap
            };

            exerciceData.time = Number(exerciceData.time);
            if (exerciceData.time < 0) {
                exerciceData.time = 0;
            }
            exerciceData.repetitions = Number(exerciceData.repetitions);
            if (exerciceData.repetitions < 1) {
                exerciceData.repetitions = 1;
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
    },
    mounted() {
        this.fetchStatisticOptions(); // Fetch options when the component is mounted
    }
}
</script>

<style scoped>
.card {
    padding: 1rem;
    background-color: var(--color-background);
    border-radius: 16px;
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    width: 100%;
}

.vertical-only {
    resize: vertical !important;
}

@media (max-width: 600px) {
    .stat-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
    }
    .stat-row select,
    .stat-row input {
        width: 50px;
    }
    .stat-row button {
        margin: 0 5px;
    }
    .stat-row .GenericButton {
        margin: 0 5px;
        flex: 1 1 auto;
    }
}
</style>
