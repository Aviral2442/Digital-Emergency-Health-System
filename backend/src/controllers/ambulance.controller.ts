import { Request, Response, NextFunction } from "express";
import { ambulanceBookingDetailService, getAmbulanceBookingListService } from "../services/ambulance.service";



// CONTROLLER TO GET AMBULANCE BOOKING LIST
export const getAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET AMBULANCE BOOKING DETAIL
export const ambulanceBookingDetailController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const bookingId = parseInt(req.params.id);
        const result = await ambulanceBookingDetailService(bookingId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};