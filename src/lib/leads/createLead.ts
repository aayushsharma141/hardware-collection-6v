import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import type { CreateLeadInput } from "./schema";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter, log: ["query"] });
}

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function createLead(data: CreateLeadInput, leadId: string) {
  const commonData = {
    id: leadId,
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    source: data.source,
    pageUrl: data.pageUrl || null,
    status: "new",
    intent: data.intent,
    message: data.message || null,
    
    // Notifications status
    telegramStatus: "pending",
    emailStatus: "pending",
    whatsappStatus: "pending",
  };

  let specificData = {};

  if (data.intent === "consultation") {
    specificData = {
      projectType: data.projectType || null,
      interest: data.interest || null,
      consultationDate: data.consultationDate || null,
      consultationTime: data.consultationTime || null,
      consultationMode: data.consultationMode || null,
      selectedProducts: data.selectedProducts ? JSON.stringify(data.selectedProducts) : null,
    };
  } else if (data.intent === "enquiry") {
    specificData = {
      category: data.category || null,
      brand: data.brand || null,
      product: data.product || null,
      quantity: data.quantity || null,
      projectType: data.projectType || null,
    };
  } else if (data.intent === "callback") {
    specificData = {
      consultationTime: data.consultationTime || null, // Best time to call
    };
  }

  const record = await prisma.lead.create({
    data: {
      ...commonData,
      ...specificData,
    },
  });

  return record;
}

export async function updateNotificationStatus(
  leadId: string, 
  channel: "telegram" | "email" | "whatsapp", 
  status: "sent" | "failed"
) {
  const updateData: { telegramStatus?: string; emailStatus?: string; whatsappStatus?: string } = {};
  if (channel === "telegram") updateData.telegramStatus = status;
  if (channel === "email") updateData.emailStatus = status;
  if (channel === "whatsapp") updateData.whatsappStatus = status;

  return await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
  });
}
