export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const;

export const API_ROUTES = {
  AUTH: {
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  DOCUMENTS: {
    BASE: '/documents',
  },
} as const;
