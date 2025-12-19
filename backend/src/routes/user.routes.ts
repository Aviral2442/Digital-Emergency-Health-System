import { Router } from "express";
import { getCitiesController, getCityController, getPartnersController, getStateController, getStateIdByCityIdController, getUsers } from "../controllers/user.controller";

const router = Router();

// USER ROUTES
router.get("/", getUsers);

// STATE AND CITY ROUTES
router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);
router.get("/get_all_cities", getCitiesController);
router.get("/get_partners", getPartnersController);
router.get("/get_state_id/:cityId", getStateIdByCityIdController);

export default router;
