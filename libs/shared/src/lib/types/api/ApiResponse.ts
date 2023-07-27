import { ApiResponseOptions } from "../ui";

type ErrorApiResponse = {
  status: ApiResponseOptions.Error;
  message: string;
}

type FailApiResponse = {
  status: ApiResponseOptions.Fail;
  message: string;
}

type SuccessApiResponse<T> = {
  status: ApiResponseOptions.Success;
  data: T;
}

export type ApiResponse<T> = SuccessApiResponse<T> | FailApiResponse | ErrorApiResponse;
