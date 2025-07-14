import { ZodTypeAny } from 'zod3';

declare class ZodParseError extends Error {
    constructor(message: string);
}
declare function parseZodString(str: string): ZodTypeAny;

export { ZodParseError, parseZodString };
