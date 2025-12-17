import { Request, Response, NextFunction } from 'express';
import {
  bookingDashboardCounts,
  driverDashboardCounts,
  hospitalDashboardCounts,
  policeDashboardCounts
} from '../services/dashboard.service';

// BOOKING DASHBOARD COUNTS CONTROLLER
export const bookingDashboardCountsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingDashboardCounts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POLICE DASHBOARD COUNTS CONTROLLER
export const policeDashboardCountsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await policeDashboardCounts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// DRIVER DASHBOARD COUNTS CONTROLLER
export const driverDashboardCountsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await driverDashboardCounts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// HOSPITAL DASHBOARD COUNTS CONTROLLER
export const hospitalDashboardCountsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await hospitalDashboardCounts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};