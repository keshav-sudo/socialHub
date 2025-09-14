import { z } from "zod";
export declare const signupBody: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginBody: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const resetPassBody: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const resetPass: z.ZodObject<{
    email: z.ZodEmail;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const verifyOtpBody: z.ZodObject<{
    email: z.ZodEmail;
    otp: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=user.model.d.ts.map