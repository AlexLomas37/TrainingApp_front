import type { Exercice } from './Exercice';
import type { TrainingSession } from './TrainingSession';

export interface ExerciceSession {
    id: number;
    exercice: Exercice;
    start: Date;
    end: Date;
    trainingSession: TrainingSession;
    statisticsMap: Map<string, string>;
}

export class ExerciceSessionModel implements ExerciceSession {
    constructor(
        public id: number,
        public exercice: Exercice,
        public start: Date,
        public end: Date,
        public trainingSession: TrainingSession,
        public statisticsMap: Map<string, string> = new Map<string, string>()
    ) {}

    getDuration(): number {
        return Math.floor((this.end.getTime() - this.start.getTime()) / 1000); // Duration in seconds
    }

    addStatistic(key: string, value: string): void {
        this.statisticsMap.set(key, value);
    }
}