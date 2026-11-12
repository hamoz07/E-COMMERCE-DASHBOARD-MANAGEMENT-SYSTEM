import Cookie from "cookie-universal";

const cookie = Cookie();

export const getAuthToken = () => cookie.get("user-token");

export const isAuthenticated = () => Boolean(getAuthToken());

export const isGuest = () => !isAuthenticated();
