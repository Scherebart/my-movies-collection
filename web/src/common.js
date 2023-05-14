import { ref, customRef } from "vue";
import { mergeDeepRight } from "ramda";

export const HOME_URL = "http://localhost:8080/";

const API_URL = HOME_URL + "api/";
const AUTH_URL = HOME_URL + "auth/";
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

async function request(url, assignable, options = {}) {
  if (assignable) {
    assignable.value = STATUS_LOADING;
  }

  const response = await fetch(url, options);
  const { ok, status } = response;
  const body = await getBodyFromResponse(response);

  if (assignable) {
    assignable.value = ok ? body : null;
  }

  return { ok, status, body };
}

async function apiRequest(jwtTokenRef, apiFunction, assignable, options) {
  const response = await request(
    API_URL + apiFunction,
    assignable,
    mergeDeepRight(options, {
      headers: { authorization: "Bearer " + jwtTokenRef.value },
    })
  );

  if (response.status === 401) {
    jwtTokenRef.value = null;
  }

  return response;
}

export async function apiGet(
  jwtTokenRef,
  apiFunction,
  assignable,
  options = {}
) {
  return apiRequest(jwtTokenRef, apiFunction, assignable, {
    ...options,
    method: "GET",
  });
}

export async function apiPut(jwtTokenRef, apiFunction, data, options = {}) {
  return apiRequest(jwtTokenRef, apiFunction, null, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function authPost(authFunction, data, options = {}) {
  return request(AUTH_URL + authFunction, null, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function deriveUserMessageFromResponse(response) {
  const { ok, body } = response;

  if (!ok) {
    const error = body?.error;
    if (error) {
      return { error };
    } else {
      return { error: "Unexpected error occured!" };
    }
  } else {
    const success = body?.success;
    if (success) {
      return { success };
    }
  }

  return null;
}

function debouncer() {
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

export const shortTermRef = (initialValue, delay) =>
  customRef((track, trigger) => {
    let state = initialValue;

    const debounce = debouncer();

    return {
      get() {
        track();
        return state;
      },
      set(newValue) {
        state = newValue;
        trigger();

        debounce(delay, () => {
          state = null;
          trigger();
        });
      },
    };
  });
