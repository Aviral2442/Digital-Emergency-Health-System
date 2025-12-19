import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { getAllUsers, getCitiesService, getCityService, getPartnerServices, getStateIdByCityIdService, getStateService } from "../services/user.service";

// GET USERS CONTROLLER
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET STATE CONTROLLER
export const getStateController = async (req: Request, res: Response) => {
  try {
    const states = await getStateService();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// GET CITY CONTROLLER
export const getCityController = async (req: Request, res: Response) => {
  try {
    const stateId = parseInt(req.params.stateId);
    const cities = await getCityService(stateId);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// GET CITIES CONTROLLER
export const getCitiesController = async (req: Request, res: Response) => {
  try {
    const cities = await getCitiesService();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// GET PARTNERS CONTROLLER
export const getPartnersController = async (req: Request, res: Response) => {
  try {

    const result = await getPartnerServices();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch partners" });
  }
};

// Get State ID by City ID Controller
export const getStateIdByCityIdController = async (req: Request, res: Response) => {
  try {
    const cityId = parseInt(req.params.cityId);
    const result = await getStateIdByCityIdService(cityId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch state ID by city ID" });
  }
};
