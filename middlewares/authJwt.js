const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    
    const token = req.cookies.userid;
  
    if (!token) {
      res.status(401).send('{ message: "Unauthorized" }');
    }

    try {
      const verified = jwt.verify(token, process.env.LOGIN_TOKEN_SECRET);
      req.user = verified;
      next();
    }
    
    catch (err) {
      //res.status(400).send('{ message: "Unauthorized" }');
    }

};

module.exports = verifyToken;