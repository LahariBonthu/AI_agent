export function audit(step: string, details: string) {
    return {
        step,
        timestamp: new Date().toISOString(),
        details
    };
}
