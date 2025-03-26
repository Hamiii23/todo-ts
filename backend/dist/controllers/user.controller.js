"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.updateUser = exports.createUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zodValidator_1 = require("../utils/zodValidator");
const prisma = new client_1.PrismaClient();
;
const selectOptions = {
    firstName: true,
    lastName: true,
    username: true,
    email: true
};
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = req.body;
    const errors = [];
    if (email) {
        if (!zodValidator_1.emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        }
        ;
    }
    ;
    if (username) {
        if (!zodValidator_1.stringValidator.safeParse(username).success) {
            errors.push(`Make sure the Username: ${username} is a valid string`);
        }
        ;
    }
    ;
    if (errors.length > 0) {
        res.status(400).json({ errors });
    }
    ;
    const result = yield prisma.user.findFirst({
        where: {
            OR: [
                {
                    email
                },
                {
                    username
                }
            ]
        },
        select: selectOptions
    });
    if (!result) {
        res.status(500).json({
            error: 'Something went wrong while looking for the user'
        });
        return;
    }
    ;
    res.status(200).json({ result });
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, username, password } = req.body;
    const errors = [];
    if (!zodValidator_1.stringValidator.safeParse(firstName).success) {
        errors.push(`Make sure the First Name: ${firstName} is a valid string`);
    }
    ;
    if (!zodValidator_1.stringValidator.safeParse(lastName).success) {
        errors.push(`Make sure the Last Name: ${lastName} is a valid string`);
    }
    ;
    if (!zodValidator_1.stringValidator.safeParse(username).success) {
        errors.push(`Make sure the Username: ${username} is a valid string`);
    }
    ;
    if (!zodValidator_1.stringValidator.safeParse(password).success) {
        errors.push(`Make sure the Password: ${password} is a valid string`);
    }
    ;
    if (!zodValidator_1.emailValidator.safeParse(email).success) {
        errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
    }
    ;
    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }
    ;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const createdUser = yield prisma.user.create({
        data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword
        }, select: selectOptions
    });
    if (!createdUser) {
        res.status(500).json({
            error: 'Something went wrong while registering the user'
        });
    }
    ;
    res.status(200).json({ createdUser });
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ;
    const { username, email, password } = req.body;
    const errors = [];
    if (!(email || username)) {
        errors.push('Either username or email is required');
    }
    ;
    if (username) {
        if (!zodValidator_1.stringValidator.safeParse(username).success) {
            errors.push(`Make sure the Username: ${username} is a valid string`);
        }
        ;
    }
    ;
    if (email) {
        if (!zodValidator_1.emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        }
        ;
    }
    ;
    if (!zodValidator_1.stringValidator.safeParse(password).success) {
        errors.push(`Make sure the Password: ${password} is a valid string`);
    }
    ;
    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }
    ;
    const userExists = yield prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });
    if (!userExists) {
        res.status(500).json({
            error: 'user with the username or email does not exist'
        });
        return;
    }
    ;
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, userExists.password);
    if (!isPasswordCorrect) {
        res.status(400).json({
            error: "Incorrect password"
        });
        return;
    }
    ;
    const loggedInUser = yield prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }, select: {
            firstName: true,
            lastName: true,
            username: true,
            email: true
        }
    });
    res.status(200).json({
        loggedInUser,
        message: "Logged in successfully"
    });
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, username } = req.body;
    const errors = [];
    const data = {};
    if (firstName) {
        if (!zodValidator_1.stringValidator.safeParse(firstName).success) {
            errors.push(`Make sure the First Name: ${firstName} is a valid string`);
        }
        else {
            data.firstName = firstName;
        }
        ;
    }
    ;
    if (lastName) {
        if (!zodValidator_1.stringValidator.safeParse(lastName).success) {
            errors.push(`Make sure the Last Name: ${lastName} is a valid string`);
        }
        else {
            data.lastName = lastName;
        }
        ;
    }
    ;
    if (email) {
        if (!zodValidator_1.emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        }
        else {
            data.email = email;
        }
        ;
    }
    ;
    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }
    ;
    const updatedUser = yield prisma.user.update({
        where: {
            username: username
        }, data,
        select: selectOptions
    });
    if (!updatedUser) {
        res.status(500).json({
            error: 'Something went wrong while updating the user'
        });
        return;
    }
    ;
    res.status(200).json({
        updatedUser
    });
});
exports.updateUser = updateUser;
