import { processInvoice } from "../agent";
import { addMemory, recallMemory, reinforceMemory } from "../memory";

/**
 * DEMO 1 — Supplier GmbH
 * Learning serviceDate from "Leistungsdatum"
 */

const supplierInvoice = {
    vendor: "Supplier GmbH",
    fields: { serviceDate: null },
    rawText: "Leistungsdatum: 01.01.2024"
};

console.log("\n===== RUN 1 (No Memory) =====");
console.log(processInvoice(supplierInvoice));

// Simulate human correction
addMemory({
    vendor: "Supplier GmbH",
    type: "VendorMemory",
    pattern: "Leistungsdatum",
    action: "Map to serviceDate"
});

console.log("\n===== RUN 2 (After Learning) =====");
let result = processInvoice(supplierInvoice);
console.log(result);

// Simulate repeated human approval → reinforce memory
const supplierMemory = recallMemory("Supplier GmbH")[0];
reinforceMemory(supplierMemory.id, true);

console.log("\n===== RUN 3 (Reinforced Confidence) =====");
result = processInvoice(supplierInvoice);
console.log(result);

/**
 * DEMO 2 — Freight & Co
 * SKU mapping
 */

const freightInvoice = {
    vendor: "Freight & Co",
    fields: {
        lineItems: [
            { description: "Seefracht / Shipping", sku: null }
        ]
    },
    rawText: "Service: Seefracht"
};

console.log("\n===== FREIGHT SKU MAPPING =====");
console.log(processInvoice(freightInvoice));

/**
 * DEMO 3 — Duplicate Invoice
 * No learning on duplicates
 */

const duplicateInvoice = {
    vendor: "Supplier GmbH",
    isDuplicate: true,
    fields: {
        invoiceNumber: "INV-2024-003"
    }
};

console.log("\n===== DUPLICATE INVOICE =====");
console.log(processInvoice(duplicateInvoice));
