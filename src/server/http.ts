import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, publicError } from "./errors";
export function errorResponse(error:unknown){const status=error instanceof AppError?error.status:error instanceof ZodError?400:500;return NextResponse.json({error:publicError(error)},{status})}
