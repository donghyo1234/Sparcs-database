class AuthDB {
    static _inst_;
    static getInst = () => {
        if ( !AuthDB._inst_ ) AuthDB._inst_ = new AuthDB();
        return AuthDB._inst_;
    }

    #id = 0; #itemCount = 0; #LDataDB = []; 

    constructor() { console.log("[Auth-DB] DB Init Completed"); }

    addUser = ( user ) => {
        const { Id, Pw } = user;
        this.#LDataDB.push({ id: this.#id, Id, Pw });
        this.#id++; this.#itemCount++;
        return true;
    }

    login = ( Id, Pw ) => {
        let res = false;
        this.#LDataDB.forEach((user) => {
            if (user.Id === Id && user.Pw === Pw) {
                res = true;
            }
        });
        return res;
    };
}

const authDBInst = AuthDB.getInst();

const authMiddleware = (req, res, next) => {
    if (req.body.register === true) {
        if (!authDBInst.addUser(req.body)) {
            res.status(401).json({ error: "Register Failure.." });
        } else {
            console.log("[AUTH-MIDDLEWARE] Register Succeeded");
            next();
        }
    } else {
        if (authDBInst.login(req.body.Id, req.body.Pw)) {
            next();
        } else {
            res.status(401).json({ error: "Not an Authorized" });
        }
    }
}

module.exports = authMiddleware;