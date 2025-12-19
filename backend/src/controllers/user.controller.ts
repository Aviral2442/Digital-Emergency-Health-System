import { Request, Response, NextFunction } from "express";
import { getAllUsers, getCityService, getStateIdByCityIdService, getStateService } from "../services/user.service";
import { ApiError } from "../utils/api-error";

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get State Controller
export const getStateController = async (req: Request, res: Response) => {
  try {
    const states = await getStateService();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// Get City Controller
export const getCityController = async (req: Request, res: Response) => {
  try {
    const stateId = parseInt(req.params.stateId);
    const cities = await getCityService(stateId);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// Get State ID by City ID Controller
export const getStateIdByCityIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cityId = parseInt(req.params.cityId); 
    const result = await getStateIdByCityIdService(cityId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};