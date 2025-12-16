import { Request, Response, NextFunction } from 'express';
import { getHospitalListService } from '../services/hospital.service';

// HOSPITAL LIST CONTROLLER
export const getHospitalListController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
        };

        const result = await getHospitalListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};