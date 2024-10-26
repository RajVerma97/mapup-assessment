export const getUser = () => {
  const userString = localStorage.getItem("user");

  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};
