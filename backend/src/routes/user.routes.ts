import { Router } from "express";
import { getCityController, getStateController, getUsers } from "../controllers/user.controller";

const router = Router();

// USER ROUTES
router.get("/", getUsers);

// STATE AND CITY ROUTES
router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);

export default router;
