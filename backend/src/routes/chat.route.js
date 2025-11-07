import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, ensureUsersInStream, syncAllUsersToStream } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/ensure-users", protectRoute, ensureUsersInStream);
router.post("/sync-all-users", protectRoute, syncAllUsersToStream);

export default router;
