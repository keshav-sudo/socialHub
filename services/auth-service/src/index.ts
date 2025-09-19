import pkg from "../../../shared/generated/auth_grpc_pb.js"
import * as grpc from "@grpc/grpc-js";
import { loginHandler } from "./controller/login.js";

import { signupController } from "./controller/signup.js";


const server = new grpc.Server();

server.addService(pkg.AuthServiceService as any , {
    Login: loginHandler,
});


const PORT = 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    console.log(`AuthService gRPC server running on port ${port}`);
    server.start();
  }
);