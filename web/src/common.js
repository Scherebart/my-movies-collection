import { ref, customRef } from "vue";
import { mergeDeepLeft } from "ramda";

export const HOME_URL = "http://localhost:8080/";

const API_URL = HOME_URL + "api/";
const USER_ID = new URLSearchParams(document.location.search).get("user-id");

export const STATUS_LOADING = Symbol();

const getBodyFromResponse = async (response) => {
  const contentType = response.headers.get("Content-Type");

  if (!contentType) {
    return null;
  }

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

async function fetchAsMe(apiFunction, assignable, options = {}) {
  if (assignable) {
    assignable.value = STATUS_LOADING;
  }

  const defaultOptions = {
    headers: {
      "user-id": USER_ID,
    },
  };
  const mergedOptions = mergeDeepLeft(options, defaultOptions);

  const response = await fetch(API_URL + apiFunction, mergedOptions);
  const body = await getBodyFromResponse(response);

  if (!response.ok) {
    console.error(apiFunction, body);
  }

  const value = response.status == 200 ? body : null;

  if (assignable) {
    assignable.value = value;
  }

  return value;
}

export async function getAsMe(apiFunction, assignable, options = {}) {
  return fetchAsMe(apiFunction, assignable, { ...options, method: "GET" });
}

export async function putAsMe(apiFunction, data, options = {}) {
  return fetchAsMe(apiFunction, null, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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
