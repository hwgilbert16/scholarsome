type ErrorApiResponse = {
  status: "error";
  message: string;
}

type FailApiResponse = {
  status: "fail";
  message: string;
}

type SuccessApiResponse<T> = {
  status: "success";
  data: T;
}

export type ApiResponse<T> = SuccessApiResponse<T> | FailApiResponse | ErrorApiResponse;
