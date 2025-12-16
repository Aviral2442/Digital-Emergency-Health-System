import { Request, Response, NextFunction } from "express";
import { addRemarksById, getAllUsers, getCityService, getRemarksById, getStateService } from "../services/user.service";
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

// Remark 
export const addRemarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await addRemarksById(req.body);

    return res.status(response.status).json(response);

  } catch (error) {
    next(error);
  }
};

// Get Remarks by User ID
export const getRemarksByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req.params.columnName || !req.params.primaryKey) {
      throw new ApiError(400, "Missing required parameters: columnName and primaryKey");
    }

    const { columnName, primaryKey } = req.params;
    const response = await getRemarksById(columnName, parseInt(primaryKey));
    return res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
}

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