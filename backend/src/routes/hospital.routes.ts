import { Router } from 'express';
import { getHospitalListController } from '../controllers/hospital.controller';

const router = Router();

router.get('/hospital_list', getHospitalListController);

export default router;