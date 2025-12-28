# Memory-Driven AI Agent for Invoice Processing

## Overview

This project implements a **memory-driven AI agent layer** for invoice processing.  
Instead of treating every invoice as a new document, the system **learns from past human corrections** and applies those learnings to future invoices in a **safe, explainable, and auditable** way.

The focus of this assignment is **agent decision logic and learned memory**, not OCR or extraction accuracy.

---

## Problem Statement

Invoice processing systems often encounter repeated corrections such as:
- Vendor-specific field labels
- VAT inclusion behavior
- Freight description mappings
- Discount (Skonto) terms
- Duplicate invoice submissions

Most systems discard these corrections.  
This project builds a **persistent memory layer** so the agent can reuse past learnings and improve automation over time.

---

## Core Agent Loop

Each invoice follows this workflow:


- **Recall**: Fetch relevant past memory  
- **Apply**: Suggest corrections using stored memory  
- **Decide**: Auto-apply, suggest, or escalate based on confidence  
- **Learn**: Reinforce or decay memory based on human feedback  

---

## Memory Types

### Vendor Memory
Stores vendor-specific patterns.  
Example:
- Supplier GmbH: `"Leistungsdatum"` → `serviceDate`

### Correction Memory
Learns from repeated correction strategies such as VAT handling or SKU mapping.

### Resolution Memory
Tracks whether suggested corrections were approved or rejected and updates confidence accordingly.

Each memory record stores:
- Vendor
- Pattern
- Action
- Confidence score
- Success and failure counts

---

## Confidence-Based Decision Logic

To ensure safe automation, decisions are based on confidence thresholds:

| Confidence Score | Action |
|-----------------|--------|
| < 0.6 | Escalate for human review |
| 0.6 – 0.85 | Suggest correction |
| > 0.85 | Auto-apply correction |

This prevents low-confidence or incorrect memories from dominating decisions.

---

## Safety Mechanisms

### Duplicate Invoice Detection
- Duplicate invoices are immediately escalated
- No memory is recalled or learned
- Prevents contradictory or harmful learning

### Confidence Reinforcement & Decay
- Human approval increases confidence
- Rejection decreases confidence
- Ensures only reliable patterns become automated

---

## Explainability & Audit Trail

Each processed invoice outputs a structured JSON containing:
- Normalized invoice
- Proposed corrections
- Confidence score
- Decision reasoning
- Full audit trail (`recall`, `apply`, `decide` steps)

This makes the system transparent and auditable.

---

## Demonstrated Outcomes

The demo demonstrates:

- **Supplier GmbH**
  - Learns to populate `serviceDate` from `"Leistungsdatum"`
  - Confidence increases with repeated approvals

- **Freight & Co**
  - Maps `"Seefracht / Shipping"` descriptions to SKU `FREIGHT`
  - Detects discount (Skonto) terms

- **Duplicate Invoices**
  - Flags duplicates
  - Prevents memory pollution

- **Learning Over Time**
  - Shows transition from review → suggest as confidence increases

---

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js
- **Persistence:** SQLite (`better-sqlite3`)
- **Approach:** Rule-based heuristics with confidence learning  
- **No ML training used**

---

## How to Run the Demo

### 1. Install dependencies
```powershell
npm install
```

### 2. Reset memory (important for clean demo)
```powershell
del memory.db
```

### 3. Run the demo
```powershell
npx ts-node src/demo/run.ts
```




      
