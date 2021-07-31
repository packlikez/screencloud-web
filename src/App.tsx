import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ATM from "./features/ATM";
import Withdraw from "./features/Withdraw";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/withdraw" component={Withdraw} />
        <Route path="/" component={ATM} />
      </Switch>
    </Router>
  );
};

export default App;
