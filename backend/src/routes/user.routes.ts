import { Router } from "express";
import { addRemarks, getCityController, getRemarksByIdController, getStateController, getUsers } from "../controllers/user.controller";

const router = Router();

// USER ROUTES
router.get("/", getUsers);

// REMARKS ROUTES
router.post("/add_remarks", addRemarks);
router.get("/get_remarks/:columnName/:primaryKey", getRemarksByIdController);

// STATE AND CITY ROUTES
router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);

export default router;
