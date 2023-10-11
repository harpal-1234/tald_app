import passport from "passport";
import {
  USER_TYPE,
  ERROR_MESSAGES,
  STATUS_CODES,
} from "../config/appConstants.js";
import { AuthFailedError } from "../utils/errors.js";

const verifyCallback =
  (req, resolve, reject, role) => async (err, token, info) => {
    if (err || info || !token) {
      return reject(new AuthFailedError());
    }
    if (role != "Non") {
      if (role && token.role != role) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.UNAUTHORIZED,
            STATUS_CODES.AUTH_FAILED
          )
        );
      }
    }

    if (token.role === USER_TYPE.ADMIN && !token.admin) {
      return reject(new AuthFailedError());
    }
    if (token.role === USER_TYPE.USER && !token.user) {
      return reject(new AuthFailedError());
    }
    if (token.role === USER_TYPE.NON_USER && !token.user) {
      return reject(new AuthFailedError());
    }

    if (token.role === USER_TYPE.USER || token.role === USER_TYPE.NON_USER) {
      if (token.user.isDeleted) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_DELETED,
            STATUS_CODES.ACTION_FAILED
          )
        );
      }
      if (token.user.isBlocked) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_BLOCKED,
            STATUS_CODES.AUTH_FAILED
          )
        );
      }
    }
    // if (token.role === USER_TYPE.USER) {
    //   if (token.user.isDeleted) {
    //     return reject(
    //       new AuthFailedError(
    //         ERROR_MESSAGES.ACCOUNT_DELETED,
    //         STATUS_CODES.AUTH_FAILED
    //       )
    //     );
    //   }
    //   if (token.user.isBlocked) {
    //     return reject(
    //       new AuthFailedError(
    //         ERROR_MESSAGES.ACCOUNT_BLOCKED,
    //         STATUS_CODES.AUTH_FAILED
    //       )
    //     );
    //   }
    // }

    if (token.role === USER_TYPE.ADMIN) {
      if (token.admin.isDeleted) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_DELETED,
            STATUS_CODES.AUTH_FAILED
          )
        );
      }
      if (token.admin.isBlocked) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_BLOCKED,
            STATUS_CODES.AUTH_FAILED
          )
        );
      }
    }

    if (token.role === USER_TYPE.VENDOR_ADMIN) {
      if (token.vendor.isDeleted) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_DELETED,
            STATUS_CODES.ACTION_FAILED
          )
        );
      }
      if (token.vendor.isBlocked) {
        return reject(
          new AuthFailedError(
            ERROR_MESSAGES.ACCOUNT_BLOCKED,
            STATUS_CODES.ACTION_FAILED
          )
        );
      }
    }

    req.token = token;

    return resolve();
  };

const auth = (role) => async (req, res, next) => {
  console.log(role);
  if (role == USER_TYPE.NON_USER) {
    if (req.headers.authorization) {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(req, resolve, reject, role)
        )(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));
    } else {
      return new Promise((resolve, reject) => {
        resolve();
      })
        .then(() => next())
        .catch((err) => next(err));
    }
  }
  if (role == "Admin" || role == "User") {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, role)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  }
};
export default auth;
