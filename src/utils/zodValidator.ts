import { z } from 'zod';

const stringValidator = z.string();
const numberValidator = z.number();
const booleanValidator = z.boolean();
const emailValidator = z.string().email();

export {
    stringValidator,
    numberValidator,
    booleanValidator,
    emailValidator,
}