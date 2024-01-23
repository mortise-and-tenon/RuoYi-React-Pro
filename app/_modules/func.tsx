import { getCookie } from "cookies-next";

export async function fetchApi(url: string, push, options?: RequestInit) {
  const token = getCookie("token");
  const authHeader = {
    Authorization: "Bearer " + token,
  };

  const requestHeader = {
    ...options?.headers,
    ...authHeader,
    credentials: "include",
  };

  const requestOptions = {
    ...options,
    headers: requestHeader,
  };

  const response = await fetch(url, requestOptions);

  try {
    const body = await response.json();
    if (response.ok) {
      if (body.code == 401) {
        push("/login");
        return;
      }
    }

    return body;
  } catch (error) {
    console.log("fetch error:", error);
  }
}
