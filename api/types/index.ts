export interface APIResponse<T> {
  status?: string;
  message?: string;
  data?: T;
  // total: number;
  // results: T[];
}
