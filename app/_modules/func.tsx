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

export async function fetchFile(
  url: string,
  push,
  options: RequestInit,
  fileName: string
) {
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
    const contentType = response.headers.get("Content-Type");
    //如果文件处理出现了json响应信息，肯定是出错了
    if (contentType && contentType.includes("application/json")) {
      const body = await response.json();
      if (response.ok) {
        if (body.code == 401) {
          push("/login");
          return;
        }
      }
    } else {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      (a.href = url), (a.download = fileName);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.log("fetch file error:", error);
  }
}
