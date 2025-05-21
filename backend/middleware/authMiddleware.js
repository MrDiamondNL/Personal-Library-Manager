const jwt = require("jsonwebtoken");
const serviceAccount = require("../configs/serivceAccountKey");
const admin = require("firebase-admin");
const CustomError = require("../utils/customError");
const { jwtConfig } = require("../configs/serviceAccountJWTSettings");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const createToken = (id) => {
    return jwt.sign({ id }, jwtConfig().SECRET_KEY, {
        expiresIn: jwtConfig().JWT_EXPIRY
    });
}

const checkForFirebaseToken = async (req, res, next) => {
    console.log("checking for token");
    const firebaseToken = req.headers.authorization?.split("Bearer ")[1];
    console.log(firebaseToken);

    if (!firebaseToken) {
        console.log("didn't find token");
        return next(CustomError.unauthorized("No Firebase token provided"));
    }

    try {
        console.log("found token, attempting decoding")
        const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken);
        console.log("Attempting to create custom token")
        const customToken = createToken(decodedFirebaseToken.uid);
        res.status(200)
           .cookie("customToken", customToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: jwtConfig().JWT_EXPIRY * 1000,
                partitioned: true
            })
           .json({
                message: "Authentication successful",
                token: customToken
            });
            
        console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);

    } catch (err) {
        console.log("Error verifying firebase token", err);
        return next(CustomError.unauthorized("Invalid Firebase Token"));
    }
}

const checkForCustomToken = async (req, res, next) => {

    let token;
    
    // Check custom header first (Safari with session storage)
    if (req.headers['x-custom-token']) {
        token = req.headers['x-custom-token'];
    }
    
    // Fallback to cookie (other browsers)
    if (!token && req.cookies.customToken) {
        token = req.cookies.customToken;
    }

    if (!token) {
        return next(CustomError.unauthorized("Authentication Required"));
    }
    try {
        const decoded = await jwt.verify(token, jwtConfig().SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err.message);
        return next(CustomError.unauthorized("Invalid or expired token" ));
    }
}

const logoutUserToken = (req, res) => {
    res.cookie("customToken", "", { maxAge: 1 });
}

const getUserFromToken = async (req, res) => {
    const token = req.cookies.customToken;
    try {
        const decoded = await jwt.verify(token, jwtConfig().SECRET_KEY);
        req.user = decoded;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { checkForCustomToken, checkForFirebaseToken, logoutUserToken, createToken, getUserFromToken };