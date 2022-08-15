import { Config, ORMConfig, ORMConfigMySQL, ORMConfigPostgres } from "./Config";

class ConfigFixture extends Config {

  public env = jest.fn((name: string) => process.env[name]);

  public constructor(options: ORMConfig) {
    super(options);
  }

  protected getEnvironmentVarValue(name: string): string {
    return this.env(name);
  }

}

describe("configuration", () => {

  let minimal: Config;
  let config: Config;
  let withDirname: Config;

  beforeAll(() => {
    minimal = new Config({ type: "mysql", database: "test" });
    config = new Config({
      type: "mysql",
      database: "test",
      __dirname: "/test/",
    });
  });

  afterEach(() => jest.clearAllMocks());

  describe("entities", () => {

    it("defaults to no entities", () => {
      expect(minimal.toConnectionOptions().entities).toStrictEqual([]);
    });

    it("uses 'additionalEntities' if no other variables set", () => {
      const additional = new Config({
        type: "mysql",
        database: "test",
        additionalEntities: [ "src/entities.ts" ],
      });
      expect(additional.toConnectionOptions().entities).toStrictEqual([
        "src/entities.ts",
      ]);
    });

    it("computes entities based on '__dirname' if provided", () => {
      expect(config.toConnectionOptions().entities).toStrictEqual([
        "/test/src/**/*.entity.ts",
      ]);
    });

  });

  describe("migrations", () => {

    it("loads based on '__dirname' if provided", () => {
      expect(config.toConnectionOptions().migrations).toStrictEqual([
        "/test/dist/migrations/*.js",
      ]);
    });

  });

  describe("sync", () => {

    describe.each(["mysql", "postgres", "cockroachdb"] as const)("in %s", (type) => {

      type C = ORMConfigMySQL | ORMConfigPostgres;

      it("defaults to non-synchronizing", () => {
        const config = new Config({ type } as C).toConnectionOptions();
        expect(config).not.toHaveProperty("synchronize", true);
      });

      it("can be set to synchronize via config", () => {
        const config = new Config({ type, sync: true } as C).toConnectionOptions();
        expect(config.synchronize).toBe(true);
      });

      it("can be set to synchronize via environment variable", () => {
        const config = new ConfigFixture({ type } as C);
        config.env = jest.fn((name: string) => {
          if(name === "DB_SYNC") {
            return "true";
          }
          return process.env[name];
        });
        const options = config.toConnectionOptions();
        expect(options.synchronize).toBe(true);
        expect(config.env).toBeCalledWith("DB_SYNC");
      });

    });

  });

});

describe("DataSource", () => {

  it("can create a DataSource", () => {
    const ds = new Config({ type: "mysql", database: "test" }).toDataSource();
    expect(ds.driver.database).toBe("test");
  });

});
