import { Request, Response, NextFunction } from 'express';
import { addPoliceService, fetchPoliceByIdService, getPoliceListService, updatePoliceService, updatePoliceStatusService } from '../services/police.service';

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

// ADD POLICE CONTROLLER
export const addPoliceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.file;
        const body = req.body;

        const data = {
            ...body,
            police_profile_img: files,
        };

        const response = await addPoliceService(data);
        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// FETCH POLICE BY ID CONTROLLER
export const fetchPoliceByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.police_id) {
            return res.status(400).json({ message: 'Police ID is required' });
        }
        const policeId = parseInt(req.params.police_id);
        const response = await fetchPoliceByIdService(policeId);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};

// UPDATE POLICE CONTROLLER
export const updatePoliceController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.police_id) {
            return res.status(400).json({ message: 'Police ID is required' });
        }
        const policeId = parseInt(req.params.police_id);
        const files = req.file;
        const body = req.body;
        const data = {
            ...body,
            police_profile_img: files,
        };

        const response = await updatePoliceService(policeId, data);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};

// UPDATE POLICE STATUS CONTROLLER
export const updatePoliceStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.police_id) {
            return res.status(400).json({ message: 'Police ID is required' });
        }
        const policeId = parseInt(req.params.police_id);
        const { police_status } = req.body;
        const response = await updatePoliceStatusService(policeId, police_status);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};