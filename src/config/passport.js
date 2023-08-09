//import { JwtStrategy, ExtractJwt } from 'passport-jwt';
import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
import config from "./config.js";
import { TOKEN_TYPE, USER_TYPE} from "./appConstants.js";
import { Token } from "../models/index.js";
import { formatUserDB } from "../utils/formatResponse.js";
import { AuthFailedError } from "../utils/errors.js";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new AuthFailedError();
    }

    let token = {};
    console.log(payload);
    if (payload.role === USER_TYPE.ADMIN) {
      token = await Token.findOne({ _id: payload.id, isDeleted: false })
        .populate({ path: "admin" })
        .lean();
    }
    if (payload.role === USER_TYPE.USER) {
      token = await Token.findOne({ _id: payload.id, isDeleted: false });
      formatUserDB(token.user, token.role);
    }
    console.log(token);
    if (!token) {
      return done(null, false);
    }

    done(null, token);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export {
  jwtStrategy
};
