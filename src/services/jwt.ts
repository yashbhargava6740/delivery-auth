import { User } from "@prisma/client";
import JWT from 'jsonwebtoken';
import { JWTUser } from "../interfaces";
require('dotenv').config();
const JWT_SECRET=process.env.JWT_SECRET as string;
class JWTService { 
    public static generateWebToken(user: User) {
        const payload : JWTUser = {
            id: user?.id,
            email: user?.email
        }
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }
    public static decodeToken(token: string) {
        return JWT.verify(token,JWT_SECRET) as JWTUser;
    }
}
export default JWTService;