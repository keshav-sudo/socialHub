declare const _default: {
    saveOtpToRedis: (email: string, otp: string) => Promise<void>;
    getOtpFromRedis: (email: string) => Promise<string | null>;
    verifyOtp: (email: string, inputOtp: string) => Promise<boolean>;
    deleteOtp: (email: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=RedisOtpstore.d.ts.map