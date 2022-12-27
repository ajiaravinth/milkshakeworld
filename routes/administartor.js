module.exports = (app) => {
    try {
        let auth = (req, res, next) => {
            let token;
            token = req.headers.authorization;
            if (token) {
                jwt.verify(token, CONFIG.SECRET_KEY, async (err, decoded) => {
                    if (err || !decoded.username) {
                        res.status(401).send("Unauthorized Access");
                    } else {
                        try {
                            let response = await db.GetOneDocument("administrators", { _id: decoded.username, status: 1 }, {}, {});
                            req.params.loginId = response._id;
                            req.params.login_Id = response._id;
                            req.params.loginData = response;
                            if (String(response.role) === 'subadmin') {
                                let get_admin_data = await db.GetOneDocument("administrators", { role: 'admin', status: 1 }, {}, {});
                                req.params.login_Id = get_admin_data._id;
                            }
                            req.params.loginrole = response.role;
                            req.params.login_username = response.username;
                            next();
                        } catch (e) {
                            let resp = {};
                            resp.status = 0;
                            resp.response = `Error occurred -> ${e}`;
                            res.status(500).send(resp);
                        }
                    }
                });
            } else {
                res.status(401).send("Unauthorized Access");
            }
        };
        const administrators = require("../controller/administrators")(app, auth);

    } catch (error) {
        console.log(error)
    }
}