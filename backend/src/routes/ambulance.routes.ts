import { Router } from 'express';
import { ambulanceBookingDetailController, ambulanceBookingCountController, getAmbulanceBookingListController, getBulkAmbulanceBookingListController, getRegularAmbulanceBookingListController, getRentalAmbulanceBookingListController, ambulanceCompleteOngoingCancelReminderBookingCountsController } from '../controllers/ambulance.controller';

const router = Router();

// DASHBOARD AMBULANCE ROUTE
router.get('/ambulance_bookings_count', ambulanceBookingCountController);
router.get('/ambulance_booking_count', ambulanceCompleteOngoingCancelReminderBookingCountsController);

// BOOKING & DETAILS ROUTES 
router.get('/get_ambulance_booking_list', getAmbulanceBookingListController);
router.get('/get_regular_ambulance_booking_list', getRegularAmbulanceBookingListController);
router.get('/get_rental_ambulance_booking_list', getRentalAmbulanceBookingListController);
router.get('/get_bulk_ambulance_booking_list', getBulkAmbulanceBookingListController);
router.get('/ambulance_booking_detail/:id', ambulanceBookingDetailController);

export default router;