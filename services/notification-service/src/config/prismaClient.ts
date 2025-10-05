import pkg from "../../generated/prisma/index.js"

const {PrismaClient} = pkg;

const prisma = new PrismaClient();

export default prisma;