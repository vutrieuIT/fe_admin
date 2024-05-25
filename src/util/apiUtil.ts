import axios, { AxiosResponse } from "axios";

class ApiUtils {
  private static BASE_URL: string;

  public static init(baseUrl: string): void {
    ApiUtils.BASE_URL = baseUrl;
  }

  public static async get(path: string): Promise<AxiosResponse> {
    return axios.get(this.BASE_URL + path);
  }

  public static async post(
    path: string,
    data?: unknown
  ): Promise<AxiosResponse> {
    return axios.post(this.BASE_URL + path, data);
  }

  public static async put(
    path: string,
    data?: unknown
  ): Promise<AxiosResponse> {
    return axios.put(this.BASE_URL + path, data);
  }

  public static async delete(path: string): Promise<AxiosResponse> {
    return axios.delete(this.BASE_URL + path);
  }
}

export default ApiUtils;
