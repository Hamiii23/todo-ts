import { Router } from "express";
import { createUser, getUser, loginUser, updateUser } from "../controllers/user.controller";

const router = Router();

router.route('/').get(getUser);
router.route('/create').post(createUser);
router.route('/login').post(loginUser);
router.route('/update').patch(updateUser);
export default router;
