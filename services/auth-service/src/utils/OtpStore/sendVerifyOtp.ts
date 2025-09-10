import transporter from "../../config/nodeMailer.js";

const sendVerifyOtp = async (to: string, otp: string) => {
  const mailOptions = {
    from: "Microservices Project <thesharmakeshav@gmail.com>",
    to,
    subject: "[Microservices Project] OTP Verification Code",
    html: `
      <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
          <h1 style="margin: 0; font-size: 22px; color: #2c3e50;">Microservices Project</h1>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Secure OTP Verification</p>
        </div>

        <div style="padding: 20px; text-align: center;">
          <h2 style="font-size: 18px; color: #333;">Your One-Time Password</h2>
          <p style="font-size: 15px; margin: 15px 0;">Use the OTP below to complete verification:</p>
          
          <div style="display: inline-block; background: #3498db; color: #fff; padding: 12px 24px; border-radius: 6px; font-size: 22px; letter-spacing: 4px; font-weight: bold;">
            ${otp}
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #777;">
            This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
          </p>
        </div>

      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Otp email sent :" , info.response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }

 
};


export default sendVerifyOtp;