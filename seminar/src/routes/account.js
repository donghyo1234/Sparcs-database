const express = require('express');
const authMiddleware = require('../middleware/auth');
const AccountModel = require('../models/account');
const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    constructor() { console.log("[Bank-DB] DB Init Completed"); }

    getBalance = async (Id) => {
        try {
            const res = await AccountModel.findOne({ Id });
            return { success: true, data: res.total.toString() };
        } catch (e) {
            return { success: false, data: `[Bank-DB] Error : ${ e }` };
        }
    }
    register = async (Id) => {
        try {
            const newItem = new AccountModel({ Id });
            const res = await newItem.save();
            return { success: true, data: "10000" };
        } catch (e) {
            return { success: false, data: `[Bank-DB] Error : ${ e }` };
        }
    }

    transaction = async ( Id, amount ) => {
        try {
            const curr = await this.getBalance({ Id });
            const newTotal = parseInt(curr.data) + parseInt(amount);
            const res = await AccountModel.updateOne({ Id }, { total: newTotal });
            return { success: true, data: newTotal.toString() };
        } catch (e) {
            return { success: false, data: `[Bank-DB] Error : ${ e }` };
        }
    }
}

const bankDBInst = BankDB.getInst();

router.post('/register', authMiddleware, async (req, res) =>{
    try {
        const { success, data } = await bankDBInst.register(req.body.Id);
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/getInfo', authMiddleware, async (req, res) => {
    try {
        const { success, data } = await bankDBInst.getBalance(req.body.Id);
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, async (req, res) => {
    try {
        const { amount, Id } = req.body;
        const { success, data } = await bankDBInst.transaction( Id, parseInt(amount) );
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction succeeded!" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;