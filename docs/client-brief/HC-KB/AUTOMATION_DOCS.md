# 18 — Automation Documentation
Document any automation before building it. Currently minimal automation is appropriate for this business size — avoid building complex n8n/Zapier workflows the owner can't maintain without Aayush.

## Automation 1 — WhatsApp Auto-Greeting
- **Purpose:** Instant acknowledgment of after-hours/busy-period messages
- **Trigger:** New inbound WhatsApp message
- **Tool:** WhatsApp Business native auto-reply (no third-party API needed at this scale)
- **Message:** See Marketing.md "Quick Win" script
- **Owner:** Staff can update the message; Aayush sets it up initially

## Automation 2 — Google Review Request
- **Purpose:** Ask for a review after confirmed purchase
- **Trigger:** Manual — staff sends after each sale (not yet automated; automating requires POS integration, which is out of scope for now)
- **Status:** Manual SOP for now (see SOP.md) — revisit automation only if sales volume makes manual asking inconsistent

## Automation 3 — Weekly GBP Post Reminder
- **Purpose:** Ensure the weekly Google Post cadence doesn't lapse
- **Trigger:** Calendar reminder (Notion task system already built for this project)
- **Owner:** Aayush/assistant executes the post

## Future Consideration (not built yet)
- WhatsApp Business API + chatbot for automated FAQ answers — **do not build this now**; it's a metro-agency-scale solution and premature for current lead volume. Revisit only if WhatsApp inquiry volume exceeds what staff can handle manually (see Analytics_Reports.md thresholds).

## Standing Rule
Every future automation added here must include: Purpose, Trigger, Tool, Inputs/Outputs, Owner, and a note on whether it's proportionate to current business scale.
