export default class ValidationError {
  constructor(public errors: { field: string; message: string }[]) {}
}
