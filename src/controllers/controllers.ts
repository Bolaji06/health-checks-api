import { Request, Response } from "express";
import * as service from "../services/services";
import { json } from "stream/consumers";
import prisma from "../config/prisma";

export async function getAllEndpoint(req: Request, res: Response) {
  try {
    const endpoints = await prisma.apiEndpoint.findMany();
    return res
      .status(200)
      .json({ message: "Endpoint retrieved", data: endpoints });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getEndpointById(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const endpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });
    if (!endpoint) {
      return res.status(404).json({ message: "Not found" });
    }
    return res
      .status(200)
      .json({ message: "Endpoint retrieved", data: endpoint });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createEndpoint(req: Request, res: Response) {
  const bodyData = req.body;
  try {
    const newEndpoint = await prisma.apiEndpoint.create({ data: bodyData });
    return res
      .status(201)
      .json({ message: "Endpoint created", data: newEndpoint });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateEndpointById(req: Request, res: Response) {
  const id = req.params.id;
  const body = req.body;
  try {
    const updateEndpoint = await prisma.apiEndpoint.update({
      where: { id },
      data: body,
    });
    if (!updateEndpoint) {
      return res.status(404).json({ message: "Not found" });
    }
    return res
      .status(200)
      .json({ message: "Endpoint updated", data: updateEndpoint });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteEndpointById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const deletedEndpoint = await prisma.apiEndpoint.delete({ where: { id } });
    if (!deletedEndpoint) {
      return res.json({ message: "Fail to delete", status: false });
    }

    return res.status(200).json({ message: "Endpoint deleted", status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEndpointLogs(req: Request, res: Response) {
  const id = req.params.id;

  try {
    const endpointLogs = await prisma.apiHealthLog.findMany({
      where: { id },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return res
      .status(200)
      .json({ message: "Retrieved all logs", data: endpointLogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllLogs(req: Request, res: Response) {
  try {
    const logs = await prisma.apiHealthLog.findMany();

    return res.status(200).json({ message: "Retrieved all logs", data: logs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
