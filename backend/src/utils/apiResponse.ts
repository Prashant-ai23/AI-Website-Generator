export class ApiResponse<T = any> {
  constructor(
    public statusCode: number,
    public data: T,
    public message: string = 'Success',
    public success: boolean = true
  ) {}
}
