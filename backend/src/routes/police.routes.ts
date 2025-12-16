import { Router } from 'express';
import multer from "multer";
import { addPoliceController, getPoliceListController } from '../controllers/police.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get_police_list', getPoliceListController);
router.post('/add_police', upload.single('police_profile_img'), addPoliceController);

export default router;