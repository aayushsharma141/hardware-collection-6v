export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, logger?: { error: (event: string, context?: Record<string, unknown>) => void }) {
  if (error instanceof ApiError) {
    if (logger && error.statusCode >= 500) {
      logger.error('api.server_error', { error: error.message, code: error.code, stack: error.stack });
    } else if (logger) {
      logger.error('api.client_error', { error: error.message, code: error.code });
    }
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod or other unhandled errors generically
  if (logger) {
    logger.error('api.unhandled_error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined 
    });
  }

  return Response.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
    },
    { status: 500 }
  );
}
