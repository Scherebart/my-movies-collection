import { ref, customRef } from "vue";

export const HOME_URL = "http://localhost:8080/";

const API_URL = HOME_URL + "api/";
const USER_ID = new URLSearchParams(document.location.search).get("user-id");

export const STAUS_LOADING = Symbol();

export async function fetchAsMe(apiFunction, assignable, options = {}) {
  assignable.value = STAUS_LOADING;

  const defaultOptions = {
    headers: Object.assign(
      {},
      options.headers || {
        "user-id": USER_ID,
      }
    ),
  };

  const mergedOptions = Object.assign({}, options, defaultOptions);

  const ret = await fetch(API_URL + apiFunction, mergedOptions);
  const body = await ret.json();

  if (ret.status !== 200) {
    console.error(apiFunction, body);
  }

  const value = ret.status == 200 ? body : null;

  if (assignable) {
    assignable.value = value;
  }

  return value;
}

export function debouncer() {
  let lastTimeout;

  return (delay, func) => {
    clearTimeout(lastTimeout);

    lastTimeout = setTimeout(() => {
      func();
    }, delay);
  };
}

export const debouncedRef = (initialValue, delay) =>
  customRef((track, trigger) => {
    let state = initialValue;

    const debounce = debouncer();

    return {
      get() {
        track();

        return state;
      },
      set(newValue) {
        debounce(delay, () => {
          state = newValue;

          trigger();
        });
      },
    };
  });
