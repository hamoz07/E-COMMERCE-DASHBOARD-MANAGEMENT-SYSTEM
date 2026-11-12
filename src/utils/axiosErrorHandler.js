import { isAxiosError } from "axios";

const axiosErrorHandler = (error) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === "string") return responseData;
    if (responseData?.message) return responseData.message;
    if (responseData?.error) return responseData.error;
    if (responseData?.errors) {
      return Object.values(responseData.errors).flat().join(" ");
    }

    return error.message;
  }
  return "An unexpected error occurred.";
};

export default axiosErrorHandler;