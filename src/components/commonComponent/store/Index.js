import store from "./Store";

export const toast = {
  success: (e) => store.dispatch(success({ msg: e, visible: true })),
  error: (e) => store.dispatch(error({ msg: e, visible: true })),
  info: (e) => store.dispatch(info({ msg: e, visible: true })),
};