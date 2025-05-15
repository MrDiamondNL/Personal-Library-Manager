const { createToken, checkForFirebaseToken, checkForCustomToken, logoutUserToken } = require("../../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { jwtConfig } = require("../../configs/serviceAccountJWTSettings");
const CustomError = require("../../utils/customError");

jest.mock("jsonwebtoken");
jest.mock("../../configs/serviceAccountJWTSettings", () => ({
    jwtConfig: jest.fn().mockReturnValue({
      SECRET_KEY: 'test-secret-key',
      JWT_EXPIRY: 3600
    })
  }));
jest.mock("../../utils/customError", () => ({
    unauthorized: jest.fn()
}));
jest.mock("../../configs/serivceAccountKey", () => {
    return {};
  });

jest.mock("firebase-admin");

describe("Authorization Middleware Testing", () => {
    describe("createToken", () =>{
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("should create a valid jwt with the provided id", () => {
            const userId = "123456";
            const mockToken = "fake.jwt.token";
            const SECRET_KEY = "mittens";
            const JWT_EXPIRY = 604800;

            jwtConfig.mockReturnValue({SECRET_KEY, JWT_EXPIRY});
            jwt.sign.mockReturnValue(mockToken);
            admin.credential.cert.mockReturnValue("");

            const token = createToken(userId);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: userId },
                SECRET_KEY,
                { expiresIn: JWT_EXPIRY }
            );
            expect(token).toBe("fake.jwt.token");
        });
    });

    describe("checkForFirebaseToken", () =>{
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return error with no firebase token found", async () => {
            const req = {
                headers: {}
            }
            const res = {};
            const next = jest.fn();
            const mockError = { 
                statusCode: 401, 
                message: "No Firebase token provided" 
            };
            CustomError.unauthorized.mockReturnValue(mockError);
            
            await checkForFirebaseToken(req, res, next);            

            expect(next).toHaveBeenCalledWith(mockError);
            expect(CustomError.unauthorized).toHaveBeenCalledWith("No Firebase token provided");
        });
        
        test("should return error with improper header authorization", async() => {
            const req = {
                headers: "wrong header"
            }
            const res = {};
            const next = jest.fn();
            const mockError = { 
                statusCode: 401, 
                message: "No Firebase token provided" 
            };
            CustomError.unauthorized.mockReturnValue(mockError);

            await checkForFirebaseToken(req, res, next);            

            expect(next).toHaveBeenCalledWith(mockError);
            expect(CustomError.unauthorized).toHaveBeenCalledWith("No Firebase token provided");
        });

        test("Should return status 200 if a proper firebaseToken provided", async () => {
            const req = {
                headers: {
                    authorization: "Bearer properToken"
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                cookie: jest.fn().mockReturnThis(),
                json: jest.fn(),
                getHeaders: jest.fn().mockReturnValue({ "set-cookie": "customToken=token" })
              };
            const next = jest.fn();
            const mockVerifyIdToken = jest.fn().mockResolvedValue({ uid: "user123" });
            admin.auth = jest.fn().mockReturnValue({
                verifyIdToken: mockVerifyIdToken
            });

            await checkForFirebaseToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.cookie).toHaveBeenCalledWith(
                "customToken",
                "fake.jwt.token",
                expect.objectContaining({
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                })
            );
            expect(mockVerifyIdToken).toHaveBeenCalledWith("properToken");
            expect(res.json).toHaveBeenCalledWith({message: "Authentication successful"});
            expect(next).not.toHaveBeenCalled();
        });

    });

    describe("checkForCustomToken", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("should return Authentication Required if no token in headers", async ()=> {
            const req = {
                cookies: {}
            }
            const res = {};
            const next = jest.fn();
            const mockError = { 
                statusCode: 401, 
                message: "Authentication Required" 
            };
            CustomError.unauthorized.mockReturnValue(mockError);

            await checkForCustomToken(req, res, next);

            expect(CustomError.unauthorized).toHaveBeenCalledWith("Authentication Required");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return invalid token if token is invalid", async () => {
            const req = {
                cookies: {
                    customToken: {}
                }
            }
            const res = {};
            const next = jest.fn();
            const mockError = { 
                statusCode: 401, 
                message: "Invalid or expired token" 
            };
            CustomError.unauthorized.mockReturnValue(mockError);
            jwt.verify = jest.fn().mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await checkForCustomToken(req, res, next);

            expect(CustomError.unauthorized).toHaveBeenCalledWith("Invalid or expired token");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should assign user value to req from decoded customToken", async () => {
            const req = {
                cookies: {
                    customToken: "valid token"
                },
                user: jest.fn()
            }
            const res = {};
            const next = jest.fn();
            jwt.verify = jest.fn().mockReturnValue("verified user");

            await checkForCustomToken(req, res, next);

            expect(req.user).toBe("verified user");
            expect(next).toHaveBeenCalled();
        });
    });

    describe("logOutUserToken", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("should replace existing token with expiring new token", () => {
            const req = {}
            const res = {
                cookie: jest.fn()
            }

            logoutUserToken(req, res);

            expect(res.cookie).toHaveBeenCalledWith("customToken", "", { maxAge: 1 });
        });
    });

    describe("getUserFromToken", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should assign user value to req from decoded customToken", async () => {
            const req = {
                cookies: {
                    customToken: "valid token"
                },
                user: jest.fn()
            }
            const res = {};
            const next = jest.fn();
            jwt.verify = jest.fn().mockReturnValue("verified user");

            await checkForCustomToken(req, res, next);

            expect(req.user).toBe("verified user");
            expect(next).toHaveBeenCalled();
        });
    })
})