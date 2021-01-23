export const validUsername = (username: string) => {
  const r = /^([a-zA-Z0-9-_]{3,})$/.test(username);
  return r;
};
export const validPassword = (password: string) => {
  if (password.length > 5) return true;
  return false;
};
export const validEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};
