import { Router } from "express";

import * as controller from "../controllers/controllers";

const apiEndpointRouter = Router();

apiEndpointRouter.get("/", controller.getAllEndpoint);
apiEndpointRouter.get("/:id", controller.getEndpointById);
apiEndpointRouter.post("/", controller.createEndpoint);
apiEndpointRouter.put("/:id", controller.updateEndpointById);
apiEndpointRouter.delete("/:id", controller.deleteEndpointById);
apiEndpointRouter.get("/logs", controller.getAllLogs);
apiEndpointRouter.get("/:id/logs", controller.getEndpointLogs);


export default apiEndpointRouter;
