export default class ValidationError extends Error {
  status = 400;
  constructor(public errors: { field: string; message: string }[]) {
    super("Validation failed");
  }
}
