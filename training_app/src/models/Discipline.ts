import type { Training } from "./Training";

export interface Discipline {
    id: number;
    name: string;
    description: string;
    imageLink: string;
    trainings: Training[];    
}

export class DisciplineModel implements Discipline {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public imageLink: string,
        public trainings: Training[] = []
    ) {}

    addTraining(training: Training): void {
        this.trainings.push(training);
    }

    removeTraining(trainingId: number): void {
        this.trainings = this.trainings.filter(training => training.id !== trainingId);
    }

    afficherInfo(): string {
        return `Discipline ${this.name} (ID: ${this.id}). ${this.description}`;
    }
}