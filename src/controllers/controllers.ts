import { Request, Response } from "express";
import * as service from "../services/services";
import { json } from "stream/consumers";

export async function getAllEndpoint(req: Request, res: Response) {
  const endpoints = await service.getAllEndpoint();
  res.json({
    message: "Endpoints retrieved successfully",
    data: endpoints,
  });
}

export async function getEndpointById(req: Request, res: Response) {
  const id = req.params.id;
  const endpoint = await service.getEndpointById(id);
  if (!endpoint) res.status(404).json({ message: "Not Found" });
  res.json({
    message: "Endpoint retrieved successfully",
    data: endpoint,
  });
}

export async function createEndpoint(req: Request, res: Response) {
  const bodyData = req.body;
  const createNewEndpoint = await service.createEndpoint(bodyData);
  res.status(200).json({
    message: "Endpoint created successfully",
    data: createNewEndpoint,
  });
}

export async function updateEndpointById(req: Request, res: Response) {
  const id = req.params.id;
  const bodyData = req.body;

  const updateEndpoint = await service.updateEndpoint(id, bodyData);
  if (!updateEndpoint) res.status(404).json("Not found");
  res.status(201).json({
    message: "Endpoint updated successfully",
    data: updateEndpoint,
  });
}

export async function deleteEndpointById(req: Request, res: Response) {
  const id = req.params.id;

  const deletedEndpoint = await service.deleteEndpoint(id);
  if (!deletedEndpoint) res.status(404).json("Not found");
  res.status(200).json(deletedEndpoint);
}

export async function getEndpointLogs(req: Request, res: Response) {
  const id = req.params.id;

  const logs = await service.getEndpointLogs(id);
  if(!logs) res.status(404).json("Not found");
  res.status(200).json(logs);
}
