import { Router } from 'express';
import multer from "multer";
import { addPoliceController, fetchPoliceByIdController, getPoliceListController, updatePoliceController } from '../controllers/police.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get_police_list', getPoliceListController);
router.post('/add_police', upload.single('police_profile_img'), addPoliceController);
router.get('/fetch_police/:police_id', fetchPoliceByIdController);
router.put('/update_police/:police_id', upload.single('police_profile_img'), updatePoliceController);

export default router;