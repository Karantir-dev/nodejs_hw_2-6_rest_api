const User = require("../model/__mocks__/data");
const guard = require("../helpers/guard");
const HttpCode = require("../helpers/constants");
const passport = require("passport");

describe("Unit test: helper/guard", () => {
  const req = {
    get: jest.fn((header) => {
      return `Bearer ${User.token}`;
    }),
    user: User,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((response) => response),
  };
  const next = jest.fn();
  //-----------------
  test("runs guard with token", () => {
    passport.authenticate = jest.fn((authType, options, callback) => () => {
      callback(null, User);
    });

    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  //-------------------
  test("runs guard without token", () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, false);
      }
    );

    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      Status: `${HttpCode.UNAUTHORIZED} Unauthorized`,
      ContentType: "application/json",
      ResponseBody: {
        message: "Not authorized",
      },
    });
  });
  //---------------------
  test("runs guard with wrong token", () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, { token: null });
      }
    );

    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      Status: `${HttpCode.UNAUTHORIZED} Unauthorized`,
      ContentType: "application/json",
      ResponseBody: {
        message: "Not authorized",
      },
    });
  });
});
