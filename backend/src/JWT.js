const { sign, verify, decode } = require('jsonwebtoken');

const createToken = (user) => {
    const accessToken = sign(
        {
            user
        },
        process.env.ACCESS_TOKEN_SECRET
    );
    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];
    
    if (!accessToken) {
        console.log('Token invalido'); // Debugging line
        return res.status(400).json({ error: "Usuario no autenticado" });
    }
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { createToken, validateToken };