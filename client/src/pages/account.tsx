import React from "react";
import Header from "../components/header";
import axios from "axios";
import {SAPIBase} from "../tools/api";
import "./css/account.css";

const AccountPage = () => {
  const [ Id, setId ] = React.useState<string>("");
  const [ Pw, setPw ] = React.useState<string>("");
  const [ NBalance, setNBalance ] = React.useState<number | "Not Authorized">("Not Authorized");
  const [ NTransaction, setNTransaction ] = React.useState<number | ''>(0);

  const getAccInfo = () => {
    const asyncFun = async() => {
      interface IAPIResponse { balance: number };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/getInfo', { Id: Id, Pw: Pw });
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCUrrRED: ${e}`));
  }

  const regAcc = () => {
    const asyncFun = async() => {
      interface IAPIResponse { balance: number };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/register', { Id: Id, Pw: Pw, register: true });
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCUReeED: ${e}`));
  }

  const performTransaction = ( amount: number | '' ) => {
    const asyncFun = async() => {
      if (amount === '') return;
      interface IAPIResponse { success: boolean, balance: number, msg: string };
      const { data } = await axios.post<IAPIResponse>(SAPIBase + '/account/transaction', { Id: Id, Pw: Pw, register: true });
      setNTransaction(0);
      if (!data.success) {
        window.alert('Transaction Failed:' + data.msg);
        return;
      }
      window.alert(`Transaction Success! ₩${ NBalance } -> ₩${ data.balance }\nThank you for using SPARCS Bank`);
      setNTransaction(0);
      setNBalance(data.balance);
    }
    asyncFun().catch((e) => window.alert(`AN ERROR OCCeeURED: ${e}`));
  }

  return (
    <div className={"account"}>
      <Header/>
      <h2>Account</h2>
      <div className={"account-token-input"}>
        Enter Id: <input type={"text"} value={Id} onChange={e => setId(e.target.value)}/><br/>
        Enter Pw: <input type={"password"} value={Pw} onChange={e => setPw(e.target.value)}/><br/>
        <button onClick={e => getAccInfo()}>Login</button>
        <button onClick={e => regAcc()}>Register</button>
      </div>
      <div className={"account-bank"}>
        <h3>The National Bank of SPARCS API</h3>
        <div className={"balance"}>
          <p className={"balance-title"}>Current Balance</p>
          <p className={"balance-value " + (typeof(NBalance) === "number" ? (NBalance >= 0 ? "balance-positive" : "balance-negative") : "")}>₩ { NBalance }</p>
        </div>
        <div className={"transaction"}>
          ₩ <input type={"number"} value={NTransaction} min={0} onChange={e => setNTransaction(e.target.value === '' ? '' : parseInt(e.target.value))}/>
          <button onClick={e => performTransaction(NTransaction)}>DEPOSIT</button>
          <button onClick={e => performTransaction(NTransaction === '' ? '' : NTransaction * -1)}>WITHDRAW</button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;