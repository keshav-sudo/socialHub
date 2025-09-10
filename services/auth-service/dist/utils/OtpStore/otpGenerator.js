const genrateOtp = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    console.log(otp);
};
export default genrateOtp;
//# sourceMappingURL=otpGenerator.js.map