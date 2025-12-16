import { Request, Response, NextFunction } from "express";
import { ambulanceBookingDetailService, ambulanceBookingCountService, getAmbulanceBookingListService, getBulkAmbulanceBookingListService, getRegularAmbulanceBookingListService, getRentalAmbulanceBookingListService, ambulanceCompleteOngoingCancelReminderBookingCounts } from "../services/ambulance.service";

// CONTROLLER TO GET TOTAL AMBULANCE BOOKING COUNT
export const ambulanceBookingCountController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ambulanceBookingCountService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET COMPLETE, ONGOING, CANCEL & REMINDER BOOKING COUNTS
export const ambulanceCompleteOngoingCancelReminderBookingCountsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ambulanceCompleteOngoingCancelReminderBookingCounts();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

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

// CONTROLLER TO GET REGULAR AMBULANCE BOOKING LIST
export const getRegularAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getRegularAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET RENTAL AMBULANCE BOOKING LIST
export const getRentalAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getRentalAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET RENTAL AMBULANCE BOOKING LIST
export const getBulkAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getBulkAmbulanceBookingListService(filters);
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