import type { LeadNotificationPayload } from "./schema";

export async function sendResendEmail(leadData: LeadNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.STAFF_EMAIL;
  
  if (!apiKey || !toEmail) {
    throw new Error("Missing Resend configuration (RESEND_API_KEY or STAFF_EMAIL)");
  }

  const { intent, name, phone, email, source, message, id } = leadData;
  const leadId = id || "NEW";

  let detailLines = "";

  if (intent === "consultation") {
    detailLines = `
Intent
Schedule Consultation

Project Type
${leadData.projectType || "N/A"}

Interested In
${leadData.interest || "N/A"}

Preferred Date
${leadData.consultationDate || "N/A"}

Preferred Time
${leadData.consultationTime || "N/A"}

Consultation Mode
${leadData.consultationMode || "Showroom"}
`;
  } else if (intent === "enquiry") {
    detailLines = `
Intent
Product Enquiry

Category
${leadData.category || "N/A"}

Brand
${leadData.brand || "N/A"}

Product
${leadData.product || "N/A"}

Quantity
${leadData.quantity || "N/A"}

Project
${leadData.projectType || "N/A"}
`;
  } else if (intent === "callback") {
    detailLines = `
Intent
Request Callback

Callback Window
${leadData.consultationTime || "Anytime"}
`;
  }

  // If there are selected products (e.g. from Shortlist)
  if (leadData.selectedProducts) {
    try {
      const products = JSON.parse(leadData.selectedProducts);
      if (Array.isArray(products) && products.length > 0) {
        detailLines += `
Selected Products:
${products.map((p: { brand?: string; name: string }) => `- ${p.brand || 'Hardware'}: ${p.name}`).join("\n")}
`;
      }
    } catch {
      // Ignore JSON parse failure
    }
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">NEW WEBSITE LEAD</h2>
      <p style="font-weight: bold; color: #666;">${leadId}</p>
      
      <div style="margin-top: 20px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 5px;">Customer</h3>
        <p style="margin: 0;"><strong>${name}</strong></p>
        <p style="margin: 0;">${phone}</p>
        ${email ? `<p style="margin: 0;">${email}</p>` : ""}
      </div>

      <div style="margin-top: 20px;">
        ${detailLines.split('\n').map(line => {
          if (!line.trim()) return '';
          if (!line.includes(':') && line === line.toUpperCase() || line === 'Intent' || line === 'Project Type' || line === 'Category' || line === 'Brand' || line === 'Product' || line === 'Quantity' || line === 'Project' || line === 'Callback Window' || line === 'Interested In' || line === 'Preferred Date' || line === 'Preferred Time' || line === 'Consultation Mode' || line === 'Selected Products') {
            return `<h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 5px; margin-top: 20px;">${line}</h3>`;
          }
          return `<p style="margin: 0 0 5px 0;">${line}</p>`;
        }).join('')}
      </div>
      
      ${message ? `
        <div style="margin-top: 20px;">
          <h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 5px;">Message</h3>
          <p style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin: 0;">${message}</p>
        </div>
      ` : ""}

      <div style="margin-top: 20px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 5px;">Source</h3>
        <p style="margin: 0; font-weight: 500;">${
          source === "home" ? "Home Page Studio" :
          source === "navbar" ? "Navigation Bar (Inquire)" :
          source === "collections" ? "Collections Page (Floating Capsule)" :
          source === "product_drawer" ? "Collections → Product Lookbook" :
          source === "shortlist" ? "Collections → Shortlist Drawer" :
          source
        }</p>
        ${leadData.pageUrl ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;"><a href="${leadData.pageUrl}" style="color: #666;">${leadData.pageUrl}</a></p>` : ""}
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #aaa;">
        Created: ${new Date().toLocaleString()}
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Hardware Collection <leads@hardwarecollection.in>", // Fallback or verified domain
      to: [toEmail],
      subject: `New Website Consultation — ${leadId}`,
      html: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API Error: ${response.status} - ${errorBody}`);
  }
}
