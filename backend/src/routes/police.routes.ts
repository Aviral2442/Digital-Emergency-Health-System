import { Router } from 'express';
import { getPoliceListController } from '../controllers/police.controller';

const router = Router();

router.get('/get_police_list', getPoliceListController);

export default router;