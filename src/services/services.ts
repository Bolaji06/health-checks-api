import prisma from "../config/prisma";

export function getAllEndpoint() {
  const endpoints = prisma.apiEndpoint.findMany();
  return endpoints;
}

export function getEndpointById(id: string) {
  const endpoint = prisma.apiEndpoint.findUnique({ where: { id } });
  return endpoint;
}

export function createEndpoint(data: any) {
  const newEndpoint = prisma.apiEndpoint.create({ data });
  return newEndpoint;
}

export function deleteEndpoint(id: string) {
  const deletedEndpoint = prisma.apiEndpoint
    .delete({
      where: {
        id,
      },
    })
    .catch(() => null);
  return deletedEndpoint;
}

export function updateEndpoint(id: string, data: any) {
  const updateEndpoint = prisma.apiEndpoint
    .update({
      where: {
        id,
      },
      data,
    })
    .catch(() => null);
    return updateEndpoint;
}

export function getEndpointLogs(id: string) {
  const logs = prisma.apiHealthLog.findMany({
    where: { id },
    orderBy: { timestamp: "desc" },
    take: 100,
  });
  return logs;
}

export function getAllLogs(){
  const logs = prisma.apiHealthLog.findMany();
  //console.log(logs)
  return logs
}
