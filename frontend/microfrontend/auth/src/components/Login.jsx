import React from 'react';
import * as auth from "../utils/auth.js";
import "../blocks/auth-form/auth-form.css";

function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth.checkToken(token).then((res) => {
        dispatchEvent(new CustomEvent("jwt-check", {
            detail: {
              email: res.data.email
            }
        }));
      }).catch((err) => {
        localStorage.removeItem("jwt");
        console.log(err);
      });
    }
  }, []);

  function handleSubmit(e){
    e.preventDefault();
    const userData = {
      email,
      password
    }
    onLogin(userData);
  }

  function onLogin({ email, password }) {
    dispatchEvent(new CustomEvent("jwt-change", {
      detail: {
        promiseFunc: auth.login(email, password),
        email: email
      }
    }));
  }

  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__wrapper">
          <h3 className="auth-form__title">Вход</h3>
          <label className="auth-form__input">
            <input type="text" name="name" id="email"
              className="auth-form__textfield" placeholder="Email"
              onChange={e => setEmail(e.target.value)} required  />
          </label>
          <label className="auth-form__input">
            <input type="password" name="password" id="password"
              className="auth-form__textfield" placeholder="Пароль"
              onChange={e => setPassword(e.target.value)} required  />
          </label>
        </div>
        <button className="auth-form__button" type="submit">Войти</button>
      </form>
    </div>
  )
}

export default Login;
