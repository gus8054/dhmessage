import express, { Router } from "express";
import { checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Router 타입을 명시적으로 지정해 줍니다. (선택 사항이지만 권장됩니다)
const router: Router = express.Router();

router.get("/check", protectRoute, checkAuth);

export default router;
