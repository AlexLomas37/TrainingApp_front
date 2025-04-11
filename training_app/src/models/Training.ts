import type { Discipline } from './Discipline';
import type { Exercice } from './Exercice';

export interface Training {
    id: number;
    name: string;
    description: string;
    time: number;
    discipline: Discipline;
    exercices: Exercice[];  
}
export class TrainingModel implements Training {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public time: number,
        public discipline: Discipline,
        public exercices: Exercice[]
    ) {}

    addExercice(exercice: Exercice): void {
        this.exercices.push(exercice);
    }

    removeExercice(exerciceId: number): void {
        this.exercices = this.exercices.filter(exercice => exercice.id !== exerciceId);
    }

}