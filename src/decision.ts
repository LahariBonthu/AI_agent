export function decide(confidence: number) {
    if (confidence > 0.85) return "auto";
    if (confidence > 0.6) return "suggest";
    return "review";
}
