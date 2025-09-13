export declare const saveOtpToRedis: (email: string, otp: string) => Promise<void>;
export declare const getOtpFromRedis: (email: string) => Promise<string | null>;
export declare const verifyOtp: (email: string, inputOtp: string) => Promise<boolean>;
export declare const deleteOtp: (email: string) => Promise<void>;
//# sourceMappingURL=OtpStoreRedis.d.ts.map