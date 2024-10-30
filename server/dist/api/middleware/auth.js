import jwt from 'jsonwebtoken';
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Unknown Error',
            message: 'Invalid token',
        });
        return;
    }
}
export default verifyToken;
