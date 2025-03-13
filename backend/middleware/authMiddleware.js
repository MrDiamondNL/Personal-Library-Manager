const jwt = require("jsonwebtoken");
const serviceAccount = require("../configs/serivceAccountKey");
const admin = require("firebase-admin");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRY = 60 * 60 * 24 * 7;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const createToken = (id) => {
    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: JWT_EXPIRY
    });
}

const checkForFirebaseToken = async (req, res, next) => {
    console.log("checking for token");
    const firebaseToken = req.headers.authorization?.split("Bearer ")[1];

    if (!firebaseToken) {
        console.log("didn't find token")
        return res.status(401).json({ error: "No Firebase token provided" });
    }

    try {
        console.log("found token, attempting decoding")
        const decodedFirebaseToken = await admin.auth().verifyIdToken(firebaseToken);
        console.log("Attempting to create custom token")
        const customToken = createToken(decodedFirebaseToken.uid);
        console.log(customToken);
        res.status(200)
           .cookie("customToken", customToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: JWT_EXPIRY * 1000 
            })
           .json({message: "Authentication successful"});
            
        console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]);

    } catch (err) {
        console.log("Error verifying firebase token", err);
        res.status(401).json({ error: "Invalid Firebase Token" });
    }
}

const checkForCustomToken = async (req, res, next) => {
    const token = req.cookies.customToken;
    console.log(req.cookies);
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const decoded = await jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

const logoutUserToken = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
}

module.exports = { checkForCustomToken, checkForFirebaseToken, logoutUserToken };