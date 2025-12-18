import { Router } from "express";
import { getCitiesController, getCityController, getStateController, getUsers, getPartnersController } from "../controllers/user.controller";

const router = Router();

// USER ROUTES
router.get("/", getUsers);

// STATE AND CITY ROUTES
router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);
router.get("/get_cities", getCitiesController);
router.get('/get_partners_list', getPartnersController);

export default router;
