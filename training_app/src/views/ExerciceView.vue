<template>
    <div v-if="visible" class="exercice-card card">
        <div class="card-header">
            <!-- Bouton ajouté pour fermer la page -->
            <button class="close-btn" @click="closePage"><span class="material-symbols-outlined"> close </span></button>
            <h1>{{ exercice.name }}</h1>
        </div>
        <div class="card-body">
            <div style="display: flex; align-items: center; margin-bottom: 1em;">
                <span v-if="exercice.time > 0" style="margin-right: 20px;">
                    <span class="material-symbols-outlined md-36">timer</span>
                    {{ exercice.time }} min
                </span>
                <span v-if="exercice.repetitions > 1">
                    <span class="material-symbols-outlined">laps</span>
                    {{ exercice.repetitions }}
                </span>
            </div>
            <h3>Description</h3>
            <p class="card-text">{{ exercice.description }}</p>
            <br>
            <h3>Informations</h3>
            <br>
            <h3>Statistiques récoltés</h3>
            <ul>
                <li v-for="(stat, index) in exercice.statisticsMap" :key="index">
                    {{ index + " en " + stat }}
                </li>
            </ul>
            <br>
            <div v-if="Object.keys(parsedStatistics).length > 0" class="graphs-container">
                <div v-for="(stat, key) in parsedStatistics" :key="key" class="graph-item">
                    <h3>{{ key }} (en {{ exercice.statisticsMap[key] }})</h3>
                    <apexchart
                        type="line"
                        :options="{
                            xaxis: { categories: stat.categories },
                            stroke: { curve: 'smooth' }
                        }"
                        :series="[{ name: key, data: stat.series.flat() }]"
                    />
                </div>
            </div>
            <div v-else>
                <p>Aucune statistique disponible pour cet exercice.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { adaptExerciceStatsMap } from '@/util/adapter/AdapterStats.js';

export default {
    name: "ExerciceView",
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        exercice: {
            type: Object,
            default: () => ({
                name: "Nom de l'exercice",
                description: "Description de l'exercice",
                time: "00:00",
                repetitions: "0",
            })
        }
    },
    setup(props) {

        const statistics = ref([]);
        const accordionOpen = ref(false);
        const parsedStatistics = ref({});

        const fetchStatistics = async () => {
            try {
                const BASE_API_URL = import.meta.env.DEV ? '/api' : `${import.meta.env.VITE_API_URL}`;
                const response = await fetch(`${BASE_API_URL}/statistics/exercices/curve/nbTimes?exercice=${props.exercice.id}&nbTime=20`);
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                statistics.value = data;
                parsedStatistics.value = adaptExerciceStatsMap(data);
                console.log(response)
                console.log('Parsed Statistics:', parsedStatistics.value);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        onMounted(() => {
            fetchStatistics();
        });

        return {
            statistics,
            parsedStatistics,
            fetchStatistics,
            adaptExerciceStatsMap
        };
    },
    methods: {
        closePage() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.exercice-card {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    margin: 20px auto;
    position: relative;
    box-sizing: border-box;
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border);
    overflow-y: auto;
    max-height: 90vh;
    max-width: 90vw;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid;
    padding: 10px 20px;
    margin-bottom: 15px;
    position: relative;
    background-color: var(--color-background-soft);
    color: var(--v-text-primary);
    border-bottom: 1px solid var(--color-border);
}

.card-body {
    padding: 0 20px;
    color: var(--v-text-primary);
    background-color: var(--color-background-soft);
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--v-text-secondary);
}

.card-body span {
    display: flex;
    align-items: center;
    padding-right: 5px;
}

.accordion-header {
    background-color: var(--vt-c-black-soft);
    color: var(--v-text-primary);
}

.accordion-content {
    background-color: var(--vt-c-black-soft);
    color: var(--v-text-secondary);
    border: 1px solid var(--color-border);
}

.graphs-container {
    display: flex;
    flex-wrap: wrap; /* Allow graphs to wrap to the next line */
    gap: 20px; /* Add space between graphs */
    justify-content: space-between; /* Distribute graphs evenly */
}

.graph-item {
    flex: 1 1 48%; /* Make each graph take up 48% of the width */
    max-width: 48%; /* Ensure graphs don't exceed 48% width */
}

@media (max-width: 768px) {
    .graph-item {
        flex: 1 1 100%; /* Stack graphs vertically on smaller screens */
        max-width: 100%;
    }
}
</style>
