import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { create, useStore } from "zustand";

export const decodeAcessToken = (accessToken) => jwtDecode(accessToken);

const authStore = create()(
  persist(
    (set, get) => ({
      accessToken: undefined,
      refressToken: undefined,
      accessTokenData: undefined,
      userData: undefined,
      setUserData: (userData) => {
        set({ userData });
      },
      setAccessToken: (accessToken) => {
        const accessTokenData = (() => {
          try {
            return accessToken ? decodeAcessToken(accessToken) : undefined;
          } catch (error) {
            console.log(error);
            return undefined;
          }
        })();
        set({ accessToken, accessTokenData });
      },
      setRefreshToken: (refressToken) => {
        set({ refressToken });
      },
      clearTokens: () => {
        set({
          accessToken: undefined,
          accessTokenData: undefined,
          refreshToken: undefined,
          userData: undefined,
        });
      },
    }),
    { name: "auth-store" },
  ),
);

//Selector
const accessTokenSelector = (state) => state.accessToken;
const accessTokenDataSelector = (state) => state.accessTokenData;
const refreshTokenSelector = (state) => state.refreshToken;
const actionsSelector = (state) => ({
  setAccessToken: state.setAccessToken,
  setRefreshToken: state.setRefreshToken,
  clearTokens: state.clearTokens,
  setUserData: state.setUserData,
});
const userDataSelector = (state) => state.userData;

//Getter
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getAccessTokenData = () =>
  accessTokenDataSelector(authStore.getState());
export const getRefreshToken = () => refreshTokenSelector(authStore.getState());
export const getActions = () => actionsSelector(authStore.getState());
export const getUserData = () => userDataSelector(authStore.getState());

export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useAccessTokenData = () => useAuthStore(accessTokenDataSelector);
export const useRefreshToken = () => useAuthStore(refreshTokenSelector);
export const useActions = () => useAuthStore(actionsSelector);
export const useUserData = () => useAuthStore(userDataSelector);

export function useAuthStore(selector) {
  return useStore(authStore, selector);
}
