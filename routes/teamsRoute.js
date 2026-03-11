import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createTeamController, listTeamsController, getTeamByIdController, updateTeamController, deleteTeamController } from "../controllers/teamController.js";

const router = express.Router();

router.post("/", authMiddleware, createTeamController);
router.get("/", authMiddleware, listTeamsController);
router.get("/:id", authMiddleware, getTeamByIdController);
router.put("/:id", authMiddleware, updateTeamController);
router.delete("/:id", authMiddleware, deleteTeamController);

export { router };

