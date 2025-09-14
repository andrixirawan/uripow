import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { config } from "./env";

/**
 * Global Axios instance untuk semua API calls
 * Reusable dan terkonfigurasi dengan baik
 */

// Create axios instance dengan default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Enable credentials untuk cookies
  withCredentials: true,
});

// Request interceptor untuk menambahkan auth token dan logging
axiosInstance.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    // Log request di development
    if (config.env.isDevelopment && config.logging.enableConsole) {
      console.log(
        `🚀 API Request: ${requestConfig.method?.toUpperCase()} ${
          requestConfig.url
        }`
      );
    }

    // Tambahkan timestamp untuk request tracking
    (requestConfig as Record<string, unknown>).metadata = {
      startTime: Date.now(),
    };

    return requestConfig;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling response dan error
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response di development
    if (config.env.isDevelopment && config.logging.enableConsole) {
      const duration =
        Date.now() -
        ((
          (response.config as Record<string, unknown>).metadata as {
            startTime: number;
          }
        )?.startTime || 0);
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } (${duration}ms)`
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Handle 401 Unauthorized - redirect ke login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("🚫 Access forbidden");
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests - retry dengan backoff
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      const retryDelay = config.api.retryDelay * Math.pow(2, 0); // Exponential backoff

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return axiosInstance(originalRequest);
    }

    // Handle network errors - retry
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      const retryDelay = config.api.retryDelay;

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Client class untuk wrapper axios
export class ApiClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance = axiosInstance) {
    this.instance = instance;
  }

  // GET request
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST request
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT request
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PATCH request
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE request
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Upload file
  async upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await this.instance.post<ApiResponse<T>>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.instance.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }

  // Handle error response
  private handleError(error: unknown): ApiResponse {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError;
      // Server responded with error status
      return {
        success: false,
        error:
          ((axiosError.response?.data as Record<string, unknown>)
            ?.error as string) || "Server error",
        message: (axiosError.response?.data as Record<string, unknown>)
          ?.message as string,
        details: (axiosError.response?.data as Record<string, unknown>)
          ?.details,
      };
    } else if (error && typeof error === "object" && "request" in error) {
      // Request was made but no response received
      return {
        success: false,
        error: "Network error",
        message: "Unable to connect to server",
      };
    } else {
      // Something else happened
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: "Request error",
        message: errorMessage,
      };
    }
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken(): void {
    delete this.instance.defaults.headers.common["Authorization"];
  }

  // Get raw axios instance
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Export axios instance untuk direct use
export { axiosInstance };

// Export default
export default apiClient;
