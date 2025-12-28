import { recallMemory, Memory } from "./memory";
import { decide } from "./decision";
import { audit } from "./audit";

/**
 * Core agent function
 * Implements:
 * recall → apply → decide
 */
export function processInvoice(invoice: any) {
    const auditTrail: any[] = [];


    // DUPLICATE CHECK
    if (invoice.isDuplicate === true) {
        auditTrail.push(
            audit("decide", "Duplicate invoice detected. Escalating without learning.")
        );

        return {
            normalizedInvoice: invoice.fields ?? invoice,
            proposedCorrections: [],
            requiresHumanReview: true,
            reasoning: "Duplicate invoice detected. No memory applied.",
            confidenceScore: 0,
            memoryUpdates: [],
            auditTrail
        };
    }


    // 1. RECALL
    auditTrail.push(
        audit("recall", `Recalling memory for vendor ${invoice.vendor}`)
    );

    const memories: Memory[] = recallMemory(invoice.vendor);

    let confidenceScore = 0;
    let decision = "review";
    let reasoning = "No applicable memory found";
    const proposedCorrections: string[] = [];
    const memoryUpdates: string[] = [];


    // 2. APPLY MEMORY (if any)
    if (memories.length > 0) {
        const memory = memories[0];

        confidenceScore = memory.confidence;
        decision = decide(confidenceScore);
        proposedCorrections.push(memory.action);

        reasoning = `Applied ${memory.type} (${memory.pattern}) with confidence ${memory.confidence.toFixed(
            2
        )}`;

        auditTrail.push(
            audit(
                "apply",
                `Memory applied: ${memory.pattern} → ${memory.action}`
            )
        );
    }


    // OUTCOME 6: FREIGHT & CO SKU MAPPING
    if (
        invoice.vendor === "Freight & Co" &&
        invoice.fields?.lineItems?.[0]?.sku == null
    ) {
        const description =
            invoice.fields.lineItems[0].description?.toLowerCase() || "";

        if (
            description.includes("seefracht") ||
            description.includes("shipping")
        ) {
            proposedCorrections.push("Map description to SKU FREIGHT");

            reasoning =
                "Detected Freight & Co shipping description → SKU FREIGHT";

            auditTrail.push(
                audit(
                    "apply",
                    "Freight description matched (Seefracht/Shipping) → FREIGHT SKU"
                )
            );
        }
    }


    // 3. DECIDE
    auditTrail.push(
        audit(
            "decide",
            `Decision: ${decision} (confidence ${confidenceScore.toFixed(2)})`
        )
    );

    return {
        normalizedInvoice: invoice.fields ?? invoice,
        proposedCorrections,
        requiresHumanReview: decision !== "auto",
        reasoning,
        confidenceScore,
        memoryUpdates,
        auditTrail
    };
}
