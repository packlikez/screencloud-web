import React, { useState, ChangeEvent, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";

import { checkPIN, selectATM } from "../app/stores/ATMSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useHistory } from "react-router-dom";

const ATM = () => {
  const history = useHistory();
  const ATMState = useAppSelector(selectATM);
  const dispatch = useAppDispatch();
  const [pin, setPin] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 4) return;
    setPin(value);
  };

  const onClick = () => {
    dispatch(checkPIN(pin));
  };

  useEffect(() => {
    if (ATMState.status === "loggedIn") history.push("/withdraw");
  }, [ATMState.status]);

  return (
    <Wrapper>
      <InputBox>
        <TextField
          label="PIN"
          type="password"
          value={pin}
          onChange={onChange}
        />
      </InputBox>
      {ATMState.status}
      <ActionBox>
        <Button variant="contained" color="primary" onClick={onClick}>
          Enter
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

const InputBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  column-gap: 8px;
`;

export default ATM;
