import React, { lazy, useState, useEffect, Suspense }  from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter, useHistory, Switch } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";



const Register = lazy(() => import('auth/Register').catch(() => {
  return { default: () => <div className='error'>Component Register is not available!</div> };
}));

const Login = lazy(() => import('auth/Login').catch(() => {
  return { default: () => <div className='error'>Component Login is not available!</div> };
}));

// components
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import "../index.css";

function App () {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [tooltipStatus, setTooltipStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  
  const handleJwtChange = event => {
    const onChange = event.detail.promiseFunc;
    const email = event.detail.email;
    onChange.then((res) => {
      setIsLoggedIn(true);
      setEmail(email);
      history.push("/");
    }).catch((err) => {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    });
  };

  const handleJwtCheck = event => {
    if (event.detail.email) {
      setEmail(event.detail.email);
      setIsLoggedIn(true);
      history.push("/");
    }
  };

  const handleSignup = event => {
    const onChange = event.detail.promiseFunc;
    onChange.then((res) => {
      setTooltipStatus("success");
      setIsInfoToolTipOpen(true);
      history.push("/signin");
    }).catch((err) => {
      setTooltipStatus("fail");
      setIsInfoToolTipOpen(true);
    });
  };

  const handleProfileChange = event => {
    if (event.detail.profile) {
      setCurrentUser(event.detail.profile);
    }
  };
  
  useEffect(() => {
    addEventListener("profile-change", handleProfileChange);
    addEventListener("signup", handleSignup);
    addEventListener("jwt-change", handleJwtChange);
    addEventListener("jwt-check", handleJwtCheck);
    return () => {
      removeEventListener("profile-change", handleProfileChange);
      removeEventListener("signup", handleSignup);
      removeEventListener("jwt-change", handleJwtChange);
      removeEventListener("jwt-check", handleJwtCheck);
    };
  }, []);

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            currentUser={currentUser}
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Suspense fallback="loading...">
              <Register onRedirect={() => history.push("/signin")}/>
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense fallback="loading...">
              <Login />
            </Suspense>
          </Route>
        </Switch>
        <Footer />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={() => setIsInfoToolTipOpen(false)}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
};

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
