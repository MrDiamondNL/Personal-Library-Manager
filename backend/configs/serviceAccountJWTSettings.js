function jwtConfig() {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const JWT_EXPIRY = 60 * 60 * 24 * 7;
    return {
        SECRET_KEY, JWT_EXPIRY
    }
}

module.exports = {jwtConfig};