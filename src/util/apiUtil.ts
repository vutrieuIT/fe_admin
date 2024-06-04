import axios, { AxiosResponse } from "axios";

class ApiUtils {
  private static BASE_URL: string;

  public static init(baseUrl: string): void {
    ApiUtils.BASE_URL = baseUrl;
  }

  public static async get(path: string): Promise<AxiosResponse> {
    const token = this.getToken();
    return axios.get(this.BASE_URL + path, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public static async post(
    path: string,
    data?: unknown
  ): Promise<AxiosResponse> {
    const token = this.getToken();
    return axios.post(this.BASE_URL + path, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public static async put(
    path: string,
    data?: unknown
  ): Promise<AxiosResponse> {
    const token = this.getToken();
    return axios.put(this.BASE_URL + path, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public static async delete(path: string): Promise<AxiosResponse> {
    const token = this.getToken();
    return axios.delete(this.BASE_URL + path, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private static getToken() {
    return sessionStorage.getItem("token") || "";
  }
}

export default ApiUtils;
