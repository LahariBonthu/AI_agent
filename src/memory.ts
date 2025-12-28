import { db } from "./db";

export interface Memory {
    id: number;
    vendor: string;
    type: "VendorMemory" | "CorrectionMemory" | "ResolutionMemory";
    pattern: string;
    action: string;
    confidence: number;
    successCount: number;
    failureCount: number;
    lastUsedAt: string | null;
}

export function recallMemory(vendor: string): Memory[] {
    return db
        .prepare(
            `
      SELECT *
      FROM memory
      WHERE vendor = ?
        AND confidence > 0.5
      ORDER BY confidence DESC
      `
        )
        .all(vendor) as Memory[];
}

export function addMemory(entry: {
    vendor: string;
    type: Memory["type"];
    pattern: string;
    action: string;
}) {
    db.prepare(
        `
    INSERT INTO memory
    (vendor, type, pattern, action, confidence, successCount, failureCount, lastUsedAt)
    VALUES (?, ?, ?, ?, 0.6, 1, 0, datetime('now'))
    `
    ).run(entry.vendor, entry.type, entry.pattern, entry.action);
}

export function reinforceMemory(memoryId: number, approved: boolean) {
    const delta = approved ? 0.1 : -0.2;

    db.prepare(
        `
    UPDATE memory
    SET confidence = MAX(0, MIN(1, confidence + ?)),
        successCount = successCount + ?,
        failureCount = failureCount + ?,
        lastUsedAt = datetime('now')
    WHERE id = ?
    `
    ).run(delta, approved ? 1 : 0, approved ? 0 : 1, memoryId);
}
