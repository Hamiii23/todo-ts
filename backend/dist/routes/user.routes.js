"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.route('/').get(user_controller_1.getUser);
router.route('/create').post(user_controller_1.createUser);
router.route('/login').post(user_controller_1.loginUser);
router.route('/update').patch(user_controller_1.updateUser);
exports.default = router;
