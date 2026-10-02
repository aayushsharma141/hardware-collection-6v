type LogLevel = 'info' | 'warn' | 'error';

class StructuredLogger {
  private log(level: LogLevel, event: string, context?: Record<string, unknown>) {
    // Avoid logging sensitive config keys
    const safeContext = { ...context };
    
    // In production, you would stream this to Datadog/CloudWatch/BetterStack, etc.
    // For now, it outputs cleanly formatted JSON to Vercel's console
    const logEntry = {
      level,
      event,
      timestamp: new Date().toISOString(),
      ...safeContext,
    };

    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  info(event: string, context?: Record<string, unknown>) {
    this.log('info', event, context);
  }

  warn(event: string, context?: Record<string, unknown>) {
    this.log('warn', event, context);
  }

  error(event: string, context?: Record<string, unknown>) {
    this.log('error', event, context);
  }
}

export const logger = new StructuredLogger();
