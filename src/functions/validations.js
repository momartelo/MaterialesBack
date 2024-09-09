export const isValidEmail = (email) => {
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,6}$/;
  return REGEX_EMAIL.test(email);
};

export const isValidPassword = (password) => {
  const REGEX_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]{4,})(?=.*[!?@#$%^&*()_+]).{8,}$/;
  return REGEX_PASSWORD.test(password);
};
