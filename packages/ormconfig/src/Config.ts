import { readFileSync } from "fs";
import { ConnectionOptions, DataSource } from "typeorm";

export type DatabaseType
  = "mysql"
  | "postgres"
  | "cockroachdb"
  | "sqlite"
  | "better-sqlite3";

export interface ORMConfigBase {
  /**
   * The type of database to connect to.
   */
  type: DatabaseType;

  /**
   * Disables printing warnings to the console.
   * Defaults to `false`.
   */
  silent?: boolean;

  /**
   * Provide {@link __dirname} from Node - if provided,
   * sets the default paths to entities and migrations relative to the project directory.
   */
  __dirname?: string;

  /**
   * If the database structure should be updated and synchronized on boot.
   * Defaults to `false`.
   */
  sync?: boolean;
}

export interface ORMConfigRemote {
  /**
   * Set a default database host per `NODE_ENV` setting.
   *
   * {@link host} overrides this setting.
   */
  hostByNodeEnv?: Record<string, string>;

  /**
   * If you are primarily setting a default production hostname, it may be better to set {@link hostByNodeEnv}
   * to `{ "production": "<hostname>" }`, which leaves the default to `localhost`.
   */
  host?: string;
  port?: string;
  user?: string;
  pass?: string;
}

export interface SQLiteConnectionInMemory {
  inMemory: true;
}

export interface SQLiteConnectionPath {
  path: string;
}

export type SQLiteConnection
  = SQLiteConnectionInMemory
  | SQLiteConnectionPath;

export function isInMemoryConnection(connection: SQLiteConnection): connection is SQLiteConnectionInMemory {
  return connection["inMemory"] === true;
}

export type ORMConfigMySQL = ORMConfigBase & ORMConfigRemote & {
  type: "mysql";
  database: string;
};

export type ORMConfigPostgres = ORMConfigBase & ORMConfigRemote & {
  type: "postgres" | "cockroachdb";
  database: string;
};

export type ORMConfigSQLite = ORMConfigBase & SQLiteConnection & {
  type: "sqlite";
};

export type ORMConfigBetterSQLite = ORMConfigBase & SQLiteConnection & {
  type: "better-sqlite3";
}

export type ORMConfig
  = ORMConfigMySQL
  | ORMConfigPostgres
  | ORMConfigSQLite
  | ORMConfigBetterSQLite;

export class Config {

  public constructor(private readonly options: ORMConfig) {}

  /**
   * Produce {@link ConnectionOptions}, used for TypeORM <0.3.0
   */
  public toConnectionOptions(): ConnectionOptions {
    const options = this.options;
    const syncOption = this.getVar("DB_SYNC", options.sync, false)
    const synchronize = syncOption === true || (typeof syncOption === "string" && syncOption.length > 0);
    if(options.type === "mysql") {
      return this.mysqlOptions(options, synchronize);
    } else if(options.type === "postgres" || options.type === "cockroachdb") {
      return this.postgresOptions(options, synchronize);
    } else if(options.type === "sqlite" || options.type === "better-sqlite3") {
      const database = isInMemoryConnection(options) ? ":memory:" : options.path;
      if(options.type === "sqlite") {
        return {
          type: options.type,
          database,
          synchronize,
        };
      } else {
        return {
          type: options.type,
          database,
          synchronize,
        };
      }
    } else {
      throw new ReferenceError(`Unknown database type: '${options.type}'`);
    }
  }

  /**
   * Produce a {@link DataSource}, used by TypeORM >=0.3.0
   */
  public toDataSource() {
    const options = this.options;
    const syncOption = this.getVar("DB_SYNC", options.sync, false)
    const synchronize = syncOption === true || (typeof syncOption === "string" && syncOption.length > 0);
    if(options.type === "mysql") {
      return new DataSource(this.mysqlOptions(options, synchronize));
    } else if(options.type === "postgres" || options.type === "cockroachdb") {
      return new DataSource(this.postgresOptions(options, synchronize));
    } else if(options.type === "sqlite" || options.type === "better-sqlite3") {
      const database = isInMemoryConnection(options) ? ":memory:" : options.path;
      if(options.type === "sqlite") {
        return new DataSource({
          type: options.type,
          database,
          synchronize,
        });
      } else {
        return new DataSource({
          type: options.type,
          database,
          synchronize,
        });
      }
    } else {
      throw new ReferenceError(`Unknown database type: '${options.type}'`);
    }
  }

  protected mysqlOptions(options: ORMConfigMySQL, synchronize: boolean) {
    return {
      type: "mysql",

      host: this.getHost(options),
      port: this.getPort(options, 3306),

      database: this.getVar("MYSQL_DATABASE", options.database, undefined),

      username: this.getVar("MYSQL_USER", options.user, "root"),
      password: this.getVar("MYSQL_PASSWORD", options.pass, this.getVar("MYSQL_ROOT_PASSWORD", undefined, undefined)),

      synchronize,
    } as const;
  }

  protected postgresOptions(options: ORMConfigPostgres, synchronize: boolean) {
    return {
      type: options.type,

      host: this.getHost(options),
      port: this.getPort(options, 5432),

      database: this.getVar("POSTGRES_DB", options.database, undefined),

      username: this.getVar("POSTGRES_USER", options.user, "root"),
      password: this.getVar("POSTGRES_PASSWORD", options.pass, undefined),

      synchronize,
    } as const;
  }

  protected getDefaultHostname(options: ORMConfigRemote): string {
    if(options.hostByNodeEnv && typeof options.hostByNodeEnv[process.env.NODE_ENV] === "string") {
      return options.hostByNodeEnv[process.env.NODE_ENV];
    }
    return "localhost";
  }

  protected getHost(options: ORMConfigRemote, defaultHostname: string = this.getDefaultHostname(options)): string {
    return this.getVar("DB_HOST", options.host, "localhost");
  }

  protected getPort(options: ORMConfigRemote, defaultPort: number): number {
    const portVar = this.getVar("DB_PORT", undefined, undefined);
    const parsedPortVar = parseInt(portVar, 10);
    if(parsedPortVar && parsedPortVar !== NaN) {
      return parsedPortVar;
    }
    if(typeof options.port === "number") {
      return options.port;
    }
    return defaultPort;
  }

  protected getVar<C,T>(name: string, config: C | undefined, defaultValue: T): string | C | T {
    const value = this.getEnvironmentVar(name);
    if(value) {
      return value;
    }
    const fileValue = this.readEnvironmentVarFile(name);
    if(fileValue) {
      return fileValue;
    }
    if(typeof config === "boolean" && config === true) {
      return config;
    }
    if(typeof config === "string" && config.length > 0) {
      return config;
    }
    return defaultValue;
  }

  protected getEnvironmentVarValue(name: string) {
    return process.env[name];
  }

  protected getEnvironmentVar(name: string) {
    const val = this.getEnvironmentVarValue(name);
    if(typeof val === "string" && val.length > 0) {
      return val;
    }
    return undefined;
  }

  protected readEnvironmentVarFile(name: string, suffix: string = "_FILE") {
    const variable = `${name}${suffix}`;
    const filePath = this.getEnvironmentVar(variable);
    if(filePath) {
      try {
        const content = readFileSync(filePath, "utf8");
        if(typeof content === "string" && content.length > 0) {
          return content;
        }
      } catch (e) {
        if(!this.options.silent) {
          console.warn(`Warning: could not read from '$${name}' file - attempted to read '${filePath}' (set by '$${variable}')`, e);
        }
      }
    }
    return undefined;
  }

}
