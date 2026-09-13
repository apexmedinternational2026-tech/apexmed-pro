// Typed errors for the query layer. Read functions throw these instead of
// returning null on failure, so a missing row and a broken connection are
// never silently indistinguishable from "there's just no data here."

export class DatabaseQueryError extends Error {
  readonly table: string;
  readonly originalError: unknown;

  constructor(message: string, options: { table: string; originalError?: unknown }) {
    super(message);
    this.name = "DatabaseQueryError";
    this.table = options.table;
    this.originalError = options.originalError;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
