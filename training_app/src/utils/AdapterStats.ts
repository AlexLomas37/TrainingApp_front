export function adaptTrainingStatsHeatMap(stats: Record<string, any>): Array<{ date: string; count: number }> {
    if (!stats) return [];
    return Object.entries(stats).map(([date, value]) => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return {
            date: d.toISOString().split('T')[0],
            count: value === false ? 0 : 1,
        };
    });
}

export function adaptExerciceStatsMap(stats: Record<string, any>): Record<string, { categories: string[], series: number[] }> {
    const parsed: Record<string, { categories: string[], series: number[] }> = {};
    const sortedDates = Object.keys(stats).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    for (const date of sortedDates) {
        const statForDate = stats[date];
        for (const [key, value] of Object.entries(statForDate)) {
            if (!parsed[key]) {
                parsed[key] = { categories: [], series: [] };
            }
            const values = (value as string).split(' ; ').map(Number);
            parsed[key].categories.push(...Array(values.length).fill(date));
            parsed[key].series.push(...values);
        }
    }
    return parsed;
}