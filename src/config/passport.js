import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { UserManager } from "../dao/managers/UserManager.js"; // Nuevo manager

dotenv.config();

const initializePassport = () => {
    const options = {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(new JwtStrategy(options, async (payload, done) => {
        try {
            const userManager = new UserManager();
            const user = await userManager.findById(payload.id); // Usar el manager
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default initializePassport;