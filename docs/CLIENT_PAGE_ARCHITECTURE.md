# Hardware Collection — Route Architecture & Client Use Case Blueprint

> **A4 Printable Visual Reference:** Open [`docs/CLIENT_PAGE_ARCHITECTURE_A4.html`](file:///e:/Hardware-Collection/docs/CLIENT_PAGE_ARCHITECTURE_A4.html) in your browser and press `Ctrl + P` to print or save as a single-page A4 PDF.

---

## 1. The 3-Tier Customer Journey (How Pages Connect)

```mermaid
graph TD
    classDef hub fill:#f6f1e8,stroke:#b38b4d,stroke-width:2px,color:#1a1918;
    classDef space fill:#f0f7fb,stroke:#5ea5d4,stroke-width:1.5px,color:#1e4d6d;
    classDef cat fill:#ffffff,stroke:#999,stroke-width:1px,color:#2b2927;
    classDef outcome fill:#eafaf1,stroke:#27ae60,stroke-width:2px,color:#196f3d;

    subgraph TIER1 [TIER 1 - Brand and Discovery Entry Hubs]
        HOME["Showroom Showcase (/)"]:::hub
        COLLECTIONS["Collections Hub (/collections)"]:::hub
        CATALOGS["Official Brand Catalogs (/catalogs)"]:::hub
    end

    HOME --> COLLECTIONS
    HOME --> CATALOGS

    subgraph TIER2 [TIER 2 - Shop by Room Spaces]
        ROOMS["Space Intent Rail: Entrance | Kitchen | Wardrobe | Bath | Living | Commercial"]:::space
    end

    COLLECTIONS -->|Select Room| ROOMS

    subgraph TIER3 [TIER 3 - Shop by Hardware Categories]
        CAT_DOOR["Door Handles, Mortise & Digital Locks"]:::cat
        CAT_KITCHEN["Modular Kitchen Fittings & Sinks"]:::cat
        CAT_WARDROBE["Wardrobe Sliding & Concealed Hinges"]:::cat
        CAT_BATH["Bath Accessories & Glass Hardware"]:::cat
    end

    ROOMS -->|Curated Room Specs| CAT_DOOR
    ROOMS -->|Curated Room Specs| CAT_KITCHEN
    ROOMS -->|Curated Room Specs| CAT_WARDROBE
    ROOMS -->|Curated Room Specs| CAT_BATH

    COLLECTIONS -->|Browse Direct Grid| CAT_DOOR
    COLLECTIONS -->|Browse Direct Grid| CAT_KITCHEN
    COLLECTIONS -->|Browse Direct Grid| CAT_WARDROBE
    COLLECTIONS -->|Browse Direct Grid| CAT_BATH

    subgraph CONVERSION [CONVERSION GOAL]
        WHATSAPP["Verified WhatsApp Inquiry (+91 98351 90738)"]:::outcome
    end

    CAT_DOOR -->|Product Inquiry| WHATSAPP
    CAT_KITCHEN -->|Product Inquiry| WHATSAPP
    CAT_WARDROBE -->|Product Inquiry| WHATSAPP
    CAT_BATH -->|Product Inquiry| WHATSAPP
    CATALOGS -->|Catalog Request| WHATSAPP
```

---

## 2. Client Use Case & Business Value Matrix

| Page Route | Who It's For | What They Do Here | Business Value |
| :--- | :--- | :--- | :--- |
| **`/`**<br>(Showroom Home) | **Homeowners & Architects** | Explore physical showroom bays, verify authorized dealer status (20+ brands), check store location, and request consultation. | Builds trust, proves authorized status, and drives showroom visits. |
| **`/collections`**<br>(Guided Discovery) | **First-Time Visitors & Renovators** | Search across all hardware by keyword or select a room to furnish. | Eliminates clutter by organizing 100+ items into intuitive room choices. |
| **`/collections/[space]`**<br>(6 Space Landings) | **Room Renovators & Interior Designers** | Browse all hardware needed for an entire room in one place (e.g. Kitchen = Sinks + Soft-close + Runners). | Increases project size and basket value through bundled hardware discovery. |
| **`/collections/[category]`**<br>(18 Category Pages) | **Contractors & Specifiers** | Filter products by brand (Dorset, Hafele, Godrej), check finishes, and submit technical inquiries. | Generates qualified sales leads pre-tagged with the exact item of interest. |
| **`/catalogs`**<br>(Brand Catalogs) | **Architects & Fabricators** | Download official PDF catalogs and architectural specification sheets. | Validates authorized dealership and equips specifiers with dimension sheets. |
| **`/studio`**<br>(Sanity Studio CMS) | **Showroom Staff** | Add new arrivals, adjust photos, and update brand details without writing code. | Enables non-technical showroom managers to update inventory instantly. |
| **`/_not-found`**<br>(404 Error Handler) | **Any User** | Guides lost visitors back to active collections or offers a 1-click WhatsApp helpline. | Ensures zero dead-ends and prevents lost inquiries. |

---

## 3. How to Print or Present to Clients
1. Open the companion file [`docs/CLIENT_PAGE_ARCHITECTURE_A4.html`](file:///e:/Hardware-Collection/docs/CLIENT_PAGE_ARCHITECTURE_A4.html) in Chrome or Edge.
2. Click the top-right button **"Print / Save as PDF (A4)"** (or press `Ctrl + P`).
3. Set **Destination** to `Save as PDF` and **Layout** to `Portrait`.
4. The document is pre-formatted with margins, clean gold styling, and balanced whitespace to fit on an A4 sheet.
