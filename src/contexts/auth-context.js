import { createContext, use, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import jwt from "jsonwebtoken";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = localStorage.getItem("token") !== null;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      const user = {
        token,
        nome: localStorage.getItem("nome"),
        tipo: localStorage.getItem("tipo"),
        departamento: localStorage.getItem("departamento"),
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (email, senha) => {
    try {
      const user = await axios.post("https://pimbackend.onrender.com/auth/login", {
        email,
        senha,
      });

      const { token, nome, tipo, departamento } = user.data;

      localStorage.setItem("token", token);
      localStorage.setItem("nome", nome);
      localStorage.setItem("tipo", tipo);
      localStorage.setItem("departamento", departamento);

      console.log("Token:", localStorage.getItem("token"));
      console.log("Nome:", localStorage.getItem("nome"));
      console.log("Tipo:", localStorage.getItem("tipo"));
      console.log("Departamento:", localStorage.getItem("departamento"));

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { token, nome, tipo, departamento },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getUserInfo = () => {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwt.decode(token);
      console.log(decodedToken);
      return {
        nome: decodedToken.nome,
        tipo: decodedToken.tipo,
        departamento: decodedToken.departamento,
        // ... outras informações do usuário
      };
    }

    return null;
  };

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // O usuário está autenticado, defina o estado de autenticação
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          token,
          nome: localStorage.getItem("nome"),
          tipo: localStorage.getItem("tipo"),
          departamento: localStorage.getItem("departamento"),
        },
      });
    } else {
      // O usuário não está autenticado
      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    }
  };

  const signUpFunc = async (email, nome, senha, tipo = 1, departamento) => {
    await axios.post("https://pimbackend.onrender.com/auth/register", {
      email,
      nome,
      senha,
      tipo,
      departamento,
    });
  };

  const signUpAdmin = async (email, nome, senha, tipo = 2, departamento) => {
    await axios.post("https://pimbackend.onrender.com/auth/register", {
      email,
      nome,
      senha,
      tipo,
      departamento,
    });
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUpFunc,
        signOut,
        signUpAdmin,
        getUserInfo,
        checkAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
