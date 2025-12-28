/**
 * Detect high-level patterns from invoice content.
 * These patterns are later used by the agent
 * to suggest corrections or trigger learning.
 */
export function detectPatterns(invoice: any): string[] {
    const patterns: string[] = [];

    // Supplier GmbH — serviceDate from Leistungsdatum
    if (invoice.rawText?.includes("Leistungsdatum")) {
        patterns.push("SERVICE_DATE_FROM_TEXT");
    }

    // Parts AG — VAT already included
    if (
        invoice.rawText?.includes("MwSt. inkl") ||
        invoice.rawText?.includes("Prices incl. VAT")
    ) {
        patterns.push("VAT_INCLUDED");
    }

    // Parts AG — missing currency recovered from raw text
    if (
        invoice.fields?.currency == null &&
        invoice.rawText?.includes("Currency")
    ) {
        patterns.push("CURRENCY_FROM_TEXT");
    }

    // Freight & Co — Skonto / discount terms
    if (invoice.rawText?.includes("Skonto")) {
        patterns.push("DISCOUNT_TERMS");
    }

    // Freight & Co — description-based SKU mapping
    if (
        invoice.vendor === "Freight & Co" &&
        invoice.fields?.lineItems?.[0]?.sku == null
    ) {
        patterns.push("FREIGHT_SKU_MAPPING");
    }

    return patterns;
}

/**
 * Map Seefracht / Shipping → FREIGHT SKU
 */
export function detectFreightSku(invoice: any): boolean {
    if (invoice.vendor !== "Freight & Co") return false;

    const description =
        invoice.fields?.lineItems?.[0]?.description?.toLowerCase() || "";

    return (
        description.includes("seefracht") ||
        description.includes("shipping")
    );
}
