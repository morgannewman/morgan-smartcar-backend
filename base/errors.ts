export type apiErrorResponse = {
  message: string;
  status: number;
};

export class ApiError extends Error {
  public status: number = 404;

  public constructor(message?: string, status: number = 404) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.status = status;
  }
}
