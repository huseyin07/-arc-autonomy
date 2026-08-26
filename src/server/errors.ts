export class AppError extends Error { constructor(public code:string, public status:number, message:string){super(message)} }
export const publicError = (error:unknown) => error instanceof AppError ? { code:error.code, message:error.message } : { code:"INTERNAL_ERROR", message:"The request could not be completed." };
