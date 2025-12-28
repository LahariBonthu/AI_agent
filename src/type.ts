export interface Memory {
    id: number;
    vendor: string;
    type: string;
    pattern: string;
    action: string;
    confidence: number;
    successCount: number;
    failureCount: number;
    lastUsedAt: string | null;
}
