import { Router } from 'express';
import { getHospitalListController, hospitalAllDataController } from '../controllers/hospital.controller';

const router = Router();

router.get('/hospital_list', getHospitalListController);
router.get('/hospital_all_data/:hospital_id', hospitalAllDataController);

export default router;