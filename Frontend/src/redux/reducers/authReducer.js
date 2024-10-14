// authReducer.js
import { LOGIN_SUCCESS, LOGOUT } from "../actions/authAction";

const initialState = {
  name: "",
  username: "",
  token: "",
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        name: action.payload.name,
        username: action.payload.username,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default authReducer;
