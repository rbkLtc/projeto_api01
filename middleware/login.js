const jwt = require('jsonwebtoken');

exports.obg = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'password');
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({nota: 'falha token'});    
    }
}

exports.opc = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'password');
        req.user = decode;
        next();
    } catch (error) {
        next();
    }
}