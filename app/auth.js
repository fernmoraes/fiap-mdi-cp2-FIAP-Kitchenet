let loggedIn = false;

export function login() {
  loggedIn = true;
}

export function logout() {
  loggedIn = false;
}

export function isAuthenticated() {
  return loggedIn;
}
