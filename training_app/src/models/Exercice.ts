import type { Training } from './Training';

export interface Exercice {
    id: number;
    name: string;
    description: string;
    time: number;
    repetitions: number;
    training: Training;
    statisticsMap: Map<string, string>;
}

export class ExerciceModel implements Exercice {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public repetitions: number,
        public time: number,
        public training: Training,
        public statisticsMap: Map<string, string> = new Map<string, string>()
    ) {}
}