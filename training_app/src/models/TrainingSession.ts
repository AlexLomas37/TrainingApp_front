import type { Training } from './Training';
import type { ExerciceSession } from './ExerciceSession';

export interface TrainingSession {
    id: number;
    training: Training;
    start: Date;
    end: Date;
    exerciceSessions: ExerciceSession[];
}

export class TrainingSessionModel implements TrainingSession {
    public exerciceSessions: ExerciceSession[];

    constructor(
        public id: number,
        public training: Training,
        public start: Date,
        public end: Date,
        exerciceSessions?: ExerciceSession[]
    ) {
        this.exerciceSessions = exerciceSessions || [];
    }

    getDuration(): number {
        return Math.floor((this.end.getTime() - this.start.getTime()) / 1000); // Duration in seconds
    }

    addExerciceSession(session: ExerciceSession): void {
        this.exerciceSessions.push(session);
    }

    removeExerciceSession(sessionId: number): void {
        this.exerciceSessions = this.exerciceSessions.filter(session => session.id !== sessionId);
    }

    updateExerciceSession(sessionId: number, updatedSession: ExerciceSession): void {
        const index = this.exerciceSessions.findIndex(session => session.id === sessionId);
        if (index !== -1) {
            this.exerciceSessions[index] = updatedSession;
        }
    }

    getExerciceSession(sessionId: number): ExerciceSession | undefined {
        return this.exerciceSessions.find(session => session.id === sessionId);
    }
}