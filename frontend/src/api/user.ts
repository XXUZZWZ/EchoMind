import axios from "./config";

export const getUser = () => {
  return axios.get(`/user`);
};

export const doLogin = ({ username, password }: { username: string, password: string }) => {
  return axios.post("/login", { username, password });
};

export const doRegister = ({ username, password }: { username: string, password: string }) => {
  return axios.post("/register", { username, password });
};

export const checkLogin = () => {
  return axios.get("/user");
};


