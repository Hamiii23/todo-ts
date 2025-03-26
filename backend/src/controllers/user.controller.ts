import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { 
    stringValidator, 
    emailValidator 
} from "../utils/zodValidator";

const prisma = new PrismaClient();

interface User {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
};

const selectOptions = {
    firstName: true,
    lastName: true,
    username: true,
    email: true
}

const getUser = async (req:Request, res:Response) => {
    type userProps = Pick<User, "email" | "username">
    const {email , username} = req.body

    const errors = [];
    if(email) {
        if(!emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        };
    };

    if(username) {
        if(!stringValidator.safeParse(username).success) {
            errors.push(`Make sure the Username: ${username} is a valid string`);
        };
    };

    if(errors.length > 0) {
        res.status(400).json({errors});
    };

    const result = await prisma.user.findFirst({
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

    if(!result) {
        res.status(500).json({
            error: 'Something went wrong while looking for the user'
        });
        return;
    };

    res.status(200).json({result});
};

const createUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, username, password }: User = req.body;

    const errors = [];

    if(!stringValidator.safeParse(firstName).success) {
        errors.push(`Make sure the First Name: ${firstName} is a valid string`);
    };
    
    if(!stringValidator.safeParse(lastName).success) {
        errors.push(`Make sure the Last Name: ${lastName} is a valid string`);
    };   
    
    if(!stringValidator.safeParse(username).success) {
        errors.push(`Make sure the Username: ${username} is a valid string`);
    };

    if(!stringValidator.safeParse(password).success) {
        errors.push(`Make sure the Password: ${password} is a valid string`);
    };

    if(!emailValidator.safeParse(email).success) {
        errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
    };

    if(errors.length > 0) {
        res.status(400).json({errors});
        return;
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
        data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword
        }, select: selectOptions
    });

    if(!createdUser) {
        res.status(500).json({
            error: 'Something went wrong while registering the user'
        });
    };

    res.status(200).json({createdUser});
};

const loginUser = async(req: Request, res: Response) => {
    interface LoginProps {
        username?: string,
        email?: string,
        password: string,
    };

    const { username, email, password }: LoginProps = req.body;

    const errors = [];

    if(!(email || username)) {
        errors.push('Either username or email is required');
    };

    if (username) {
        if(!stringValidator.safeParse(username).success) {
            errors.push(`Make sure the Username: ${username} is a valid string`);
        };
    };

    if(email) {
        if(!emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        };
    };
    
    if(!stringValidator.safeParse(password).success) {
        errors.push(`Make sure the Password: ${password} is a valid string`);
    };

    if(errors.length > 0) {
        res.status(400).json({errors});
        return;
    };

    const userExists = await prisma.user.findFirst({
        where: {
            OR: [
                {email},
                {username}
            ]
        }
    });

    if(!userExists) {
        res.status(500).json({
            error: 'user with the username or email does not exist'
        });
        return;
    };

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

    if(!isPasswordCorrect) {
        res.status(400).json({
            error: "Incorrect password"
        });
        return;
    };

    const loggedInUser = await prisma.user.findFirst({
        where: {
            OR: [
                {username},
                {email}
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
};

const updateUser = async (req: Request, res: Response) => {
    type UpdateProp = Partial<User>
    const { firstName, lastName, email, username}: UpdateProp = req.body;

    const errors = [];
    const data: Partial<Prisma.UserUpdateInput> = {};

    if(firstName) {
        if(!stringValidator.safeParse(firstName).success) {
            errors.push(`Make sure the First Name: ${firstName} is a valid string`);
        } else {
            data.firstName = firstName;
        };
    };
    
    if(lastName) {
        if(!stringValidator.safeParse(lastName).success) {
            errors.push(`Make sure the Last Name: ${lastName} is a valid string`);
        } else {
            data.lastName = lastName;
        };   
    };

    if(email) {
        if(!emailValidator.safeParse(email).success) {
            errors.push(`Make sure the Email: ${email} is a valid string and is in a proper format`);
        } else {
            data.email = email;
        };
    };

    if(errors.length > 0) {
        res.status(400).json({errors});
        return;
    };

    const updatedUser = await prisma.user.update({
        where: {
            username: username
        }, data,
        select: selectOptions
    });

    if(!updatedUser) {
        res.status(500).json({
            error: 'Something went wrong while updating the user'
        });
        return;
    };

    res.status(200).json({
        updatedUser
    });
};

export {
    getUser,
    createUser,
    updateUser,
    loginUser
};