import { Router } from 'express';
import { ambulanceBookingDetailController, getAmbulanceBookingListController } from '../controllers/ambulance.controller';

const router = Router();

// BOOKING & DETAILS ROUTES 
router.get('/get_ambulance_booking_list', getAmbulanceBookingListController);
router.get('/ambulance_booking_detail/:id', ambulanceBookingDetailController);

export default router;