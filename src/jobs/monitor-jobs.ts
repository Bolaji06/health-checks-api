import axios, { AxiosRequestConfig } from "axios";
import prisma from "../config/prisma";
import cron, { ScheduledTask } from "node-cron";

type ErrorType =
  | "Timeout"
  | "Client Error"
  | "Server Error"
  | "Network Error"
  | "Unknown Error";

function classifyError(statusCode?: number, errorMessage?: string): ErrorType {
  if (errorMessage?.includes("timeout")) return "Timeout";
  if (!statusCode) return "Network Error";
  if (statusCode >= 500) return "Server Error";
  if (statusCode >= 400) return "Client Error";
  return "Unknown Error";
}

// Store cron jobs to avoid duplication
const scheduledJobs = new Map<string, ScheduledTask>();

function convertIntervalToCron(intervalInMinutes: number): string {
  if (intervalInMinutes < 1) intervalInMinutes = 1; // minimum 1 minute
  return `*/${intervalInMinutes} * * * *`;
}

async function monitorSingleEndpoint(endpointId: string) {
  const endpoint = await prisma.apiEndpoint.findUnique({
    where: { id: endpointId },
  });

  if (!endpoint || !endpoint.isActive) return;

  const config: AxiosRequestConfig = {
    url: endpoint.url,
    method: endpoint.method.toLowerCase() as any,
    headers: {
      Authorization:
        "Bearer 1088|lG5Cf2hVutbbYwX82gVidHkAjPK5LUM7ziehlHfN17036b30",
      ...(endpoint.headers && typeof endpoint.headers === "object"
        ? (endpoint.headers as Record<string, string>)
        : {}),
    },
    data: endpoint.body ?? undefined,
    timeout: 5000,
  };

  const start = Date.now();

  try {
    const response = await axios(config);
    const responseTime = Date.now() - start;

    await prisma.apiHealthLog.create({
      data: {
        endpointId: endpoint.id,
        statusCode: response.status,
        responseTime,
      },
    });

    console.log(
      `[✅] ${endpoint.name} — ${response.status} in ${responseTime}ms`
    );
  } catch (err: any) {
    const responseTime = Date.now() - start;

    const statusCode = err.response?.status;
    const errorMessage = err.message || "Unknown Error";
    const errorType = classifyError(statusCode, errorMessage);

    await prisma.apiHealthLog.create({
      data: {
        endpointId: endpoint.id,
        statusCode,
        responseTime,
        errorType,
        errorMessage,
      },
    });

    console.error(`[❌] ${endpoint.name} — ${errorType}: ${errorMessage}`);
  }
}

async function scheduleMonitoringJobs() {
  const endpoints = await prisma.apiEndpoint.findMany({
    where: { isActive: true },
  });

  for (const endpoint of endpoints) {
    const cronExpr = convertIntervalToCron(endpoint.interval || 5); // default to every 5 mins

    // Avoid rescheduling if already exists
    if (scheduledJobs.has(endpoint.id)) continue;

    const task = cron.schedule(cronExpr, () => {
      monitorSingleEndpoint(endpoint.id);
    });

    scheduledJobs.set(endpoint.id, task);

    console.log(
      `🕒 Scheduled ${endpoint.name} every ${endpoint.interval} minutes`
    );
  }
}

// Run once on startup
scheduleMonitoringJobs();

// Optionally: Refresh jobs every 10 mins to pick up new/updated endpoints
cron.schedule("*/10 * * * *", async () => {
  console.log("🔄 Refreshing scheduled endpoint monitors...");
  const endpoints = await prisma.apiEndpoint.findMany({
    where: { isActive: true },
  });

  for (const endpoint of endpoints) {
    const cronExpr = convertIntervalToCron(endpoint.interval || 5);

    const existingTask = scheduledJobs.get(endpoint.id);

    if (!existingTask) {
      const task = cron.schedule(cronExpr, () => {
        monitorSingleEndpoint(endpoint.id);
      });
      scheduledJobs.set(endpoint.id, task);
      console.log(`🆕 Added monitor for ${endpoint.name}`);
    }
  }
});
