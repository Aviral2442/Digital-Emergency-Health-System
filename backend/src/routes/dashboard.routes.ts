import { Router } from 'express';
import { bookingDashboardCountsController, policeDashboardCountsController, driverDashboardCountsController, hospitalDashboardCountsController, mapLocationDashboardCountsController } from '../controllers/dashboard.controller';
const router = Router();

router.get('/booking_dashboard_counts', bookingDashboardCountsController);
router.get('/police_dashboard_counts', policeDashboardCountsController);
router.get('/driver_dashboard_counts', driverDashboardCountsController);
router.get('/hospital_dashboard_counts', hospitalDashboardCountsController);
router.get('/map_location_dashboard_counts', mapLocationDashboardCountsController);

export default router;