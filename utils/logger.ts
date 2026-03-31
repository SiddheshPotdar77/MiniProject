/**
 * Logger Utility
 * 
 * Provides timestamped logging wrapper for consistent log formatting
 * across the automation framework.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage(level, message);
    const fullMessage = args.length > 0 
      ? `${formattedMessage} ${args.map(arg => JSON.stringify(arg)).join(' ')}`
      : formattedMessage;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage);
        break;
      case LogLevel.INFO:
        console.info(fullMessage);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage);
        break;
    }
  }

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * Log test step with context
   */
  public step(stepName: string, details?: string): void {
    const message = details 
      ? `STEP: ${stepName} - ${details}`
      : `STEP: ${stepName}`;
    this.info(message);
  }

  /**
   * Log assertion with context
   */
  public assertion(description: string, passed: boolean): void {
    const status = passed ? 'PASSED' : 'FAILED';
    this.info(`ASSERTION: ${description} - ${status}`);
  }
}

export const logger = new Logger();
