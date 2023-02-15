export type ErrorCode =
  | "SERVER_ERROR"
  | "REQUEST_MALFORMED"
  | "REQUEST_UNAUTHORIZED"
  | "OBJECT_NOT_FOUND"
  | "OBJECT_ALREADY_EXISTS"
  | "OBJECT_UNPROCESSABLE"
  | "HTTP_ERROR";

export class TypesenseError extends Error {
  readonly #response: Response;
  get response() {
    return this.#response;
  }
  readonly #code: ErrorCode;
  get code() {
    return this.#code;
  }

  #getCode(status: number): ErrorCode {
    if (status >= 500 && status <= 599) {
      return "SERVER_ERROR";
    }
    switch (status) {
      case 400:
        return "REQUEST_MALFORMED";
      case 401:
        return "REQUEST_UNAUTHORIZED";
      case 404:
        return "OBJECT_NOT_FOUND";
      case 409:
        return "OBJECT_ALREADY_EXISTS";
      case 422:
        return "OBJECT_UNPROCESSABLE";
      default:
        return "HTTP_ERROR";
    }
  }

  constructor(message: string, response: Response) {
    super(message);
    this.name = TypesenseError.name;
    this.#response = response;
    this.#code = this.#getCode(response.status);
  }
}
