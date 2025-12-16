import { Request, Response, NextFunction } from 'express';
import { getPoliceListService } from '../services/police.service';

// POLICE LIST CONTROLLER
export const getPoliceListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
            search: req.query.search as string,
        };
        const result = await getPoliceListService(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};