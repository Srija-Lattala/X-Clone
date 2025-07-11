import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotification, deleteNotifications, getNotificatications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get("/",protectRoute,getNotificatications);
router.delete("/",protectRoute,deleteNotifications);
router.delete("/:id",protectRoute,deleteNotification);


export default router;