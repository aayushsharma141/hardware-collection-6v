# 15 — CRM Structure
Even a simple spreadsheet or Notion database should track these fields consistently. This is a structure spec, not a live database.

## Record Types
- Lead (not yet purchased)
- Customer (has purchased)
- Architect/Designer (recurring B2B contact)
- Builder/Contractor (recurring B2B contact)
- Vendor (see Vendors.md — separate table)

## Fields per Contact
| Field | Notes |
|---|---|
| Name | |
| Phone/WhatsApp | Primary channel |
| Contact type | Lead / Customer / Architect / Builder |
| Source | GMB / WhatsApp / Walk-in / Referral / Instagram |
| Interest category | e.g., Digital Locks, Modular Kitchen |
| Budget tier | Premium / Value (per Sales Playbook qualification) |
| Quote sent? | Y/N + date |
| Follow-up stage | Day 0 / Day 3 / Day 7 / Cold |
| Purchase history | Linked items + dates |
| Next cross-sell opportunity | Per Customer Personas lifetime-value notes (e.g., kitchen buyer → wardrobe hardware follow-up in 6-12 months) |
| Review requested? | Y/N |
| Notes | |

## Recommended Tool
Given the scale of this business, a lightweight Notion database or Google Sheet is sufficient — a full CRM platform (Zoho, HubSpot) would be over-engineering at this stage. Revisit only if lead volume exceeds what a spreadsheet can track (~100+ active leads/month).
