const CheckAuth = (req, res, next) => {


    try {
        const token = req.headers.authorization;
        console.log("token secret =====> ", token)
        if(token === "D4s%I6jN!W3v#E9xS1C5b@N2mH") {
            next();
        } else {
            res.status(401).json({ message: "Token mismatch" });
        }
    } catch (err) {
        res.status(401).json({ message: "No token provided" });
    }


};

module .exports = { CheckAuth }