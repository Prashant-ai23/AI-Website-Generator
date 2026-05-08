/**
 * Async handler wrapper to catch errors in async route handlers
 * @param fn - Async function to wrap
 * @returns Express middleware function
 */
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
