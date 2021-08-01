import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, Button, Snackbar } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { withdraw, selectATM, reset } from "../app/stores/ATMSlice";
import { selectUser } from "../app/stores/userSlice";

const LIMIT_OVERDRAFT = 100;

const Withdraw = () => {
  const history = useHistory();
  const atm = useAppSelector(selectATM);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const addValue = (value: number) => () =>
    setValue((prevState) => prevState + value);

  const onReset = () => {
    dispatch(reset());
    setValue(0);
  };

  const onConfirm = () => {
    dispatch(withdraw(value));
    setOpen(true);
  };

  useEffect(() => {
    if (atm.status !== "loggedIn") history.push("/");
  }, [atm.status]);

  const isOverdraft = value > user.balance;
  const isOverLimit = value - user.balance > LIMIT_OVERDRAFT;

  const isSuccessWithdraw = atm.noteOuts.filter((note) => note > 0).length > 0;
  const message = `You got ${atm.notes
    .map((note, i) => `${note}£x${atm.noteOuts[i]}`)
    .join(" ")}`;
  const errorMessage = `Out of notes`;

  return (
    <Wrapper>
      <Snackbar open={open}>
        {isSuccessWithdraw ? (
          <Alert severity="success">{message}</Alert>
        ) : (
          <Alert severity="error">{errorMessage}</Alert>
        )}
      </Snackbar>
      <h1>Your balance is {user.balance}</h1>
      <TextField label="Amount" value={value} />
      {isOverdraft && (
        <ErrorText>You are over withdraw {value - user.balance}£</ErrorText>
      )}
      {isOverLimit && <ErrorText>You are over limit</ErrorText>}
      <ActionBox>
        <Button variant="outlined" onClick={addValue(5)}>
          +5
        </Button>
        <Button variant="outlined" onClick={addValue(10)}>
          +10
        </Button>
        <Button variant="outlined" onClick={addValue(50)}>
          +50
        </Button>
        <Button variant="outlined" onClick={addValue(100)}>
          +100
        </Button>
        <Button variant="contained" color="secondary" onClick={onReset}>
          Reset
        </Button>
        <Button
          disabled={isOverLimit}
          variant="contained"
          color="primary"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </ActionBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100vh;
`;

const ActionBox = styled.div`
  display: flex;
  column-gap: 8px;
  margin: 16px 0;
`;

const ErrorText = styled.span`
  color: red;
`;

export default Withdraw;
