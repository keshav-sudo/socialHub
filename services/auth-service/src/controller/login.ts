import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/Jwthelper/jwtHelper.js";
import pkg from "../../../../shared/generated/auth_pb.js";
import { Payload } from "../types/express.js";

const { LoginResponse, User } = pkg;

export const loginHandler = async (
  call: any,
  callback: (err: Error | null, response?: LoginResponse) => void
) => {
  try {
    const email = call.request.getEmail();
    const password = call.request.getPassword();

    // Optional: validation (similar to loginBody.safeParse)
    if (!email || !password) {
      const res = new LoginResponse();
      res.setSuccess(false);
      res.setMessage("Email and password are required");
      return callback(null, res);
    }

    // Find user in DB
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      const res = new LoginResponse();
      res.setSuccess(false);
      res.setMessage("User does not exist");
      return callback(null, res);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      const res = new LoginResponse();
      res.setSuccess(false);
      res.setMessage("Invalid credentials");
      return callback(null, res);
    }

    // Generate token
    const payload: Payload = {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      isVerified: existingUser.isVerified
    };
    const token = generateToken(payload);

    // Build User message
    const userMsg = new User();
    userMsg.setId(existingUser.id);
    userMsg.setName(existingUser.name);
    userMsg.setEmail(existingUser.email);
    userMsg.setRole(existingUser.role);
    userMsg.setIsVerified(existingUser.isVerified);


    // Build response
    const res = new LoginResponse();
    res.setSuccess(true);
    res.setMessage("Login successful");
    res.setToken(token);
    res.setUser(userMsg);

    // Send response
    callback(null, res);

  } catch (error) {
    const res = new LoginResponse();
    res.setSuccess(false);
    res.setMessage(error instanceof Error ? error.message : String(error));
    callback(null, res);
  }
};
