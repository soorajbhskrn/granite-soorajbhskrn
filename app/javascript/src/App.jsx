import React, { useEffect, useState } from "react";

import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { registerIntercepts, setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";
import PrivateRoute from "components/Common/PrivateRoute";
import Dashboard from "components/Dashboard";
import MyPreferences from "components/MyPreferences";
import PageLoader from "components/PageLoader";
import { CreateTask, ShowTask, EditTask } from "components/Tasks";
import DownloadReport from "components/Tasks/DownloadReport";
import { getFromLocalStorage } from "utils/storage";

import { Signup, Login } from "./components/Authentication";

const App = () => {
  const [loading, setLoading] = useState(true);
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  useEffect(() => {
    initializeLogger();
    registerIntercepts();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact component={ShowTask} path="/tasks/:slug/show" />
        <Route exact component={EditTask} path="/tasks/:slug/edit" />
        <Route exact component={CreateTask} path="/tasks/create" />
        <Route exact component={MyPreferences} path="/my/preferences" />
        <Route exact component={Dashboard} path="/dashboard" />
        <Route exact component={Signup} path="/signup" />
        <Route exact component={Login} path="/login" />
        <Route exact component={DownloadReport} path="/tasks/report" />;
        <PrivateRoute
          component={Dashboard}
          condition={isLoggedIn}
          path="/"
          redirectRoute="/login"
        />
      </Switch>
    </Router>
  );
};

export default App;
