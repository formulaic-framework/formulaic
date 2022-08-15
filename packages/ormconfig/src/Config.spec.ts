import { when, resetAllWhenMocks } from "jest-when";
import { Config, ORMConfig, ORMConfigBase, ORMConfigMySQL, ORMConfigPostgres } from "./Config";

const JS_ENTITIES = ["/test/dist/**/*.entity.js"] as const;
const TS_ENTITIES = ["/test/src/**/*.entity.ts"] as const;

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

  beforeAll(() => {
    minimal = new Config({ type: "mysql", database: "test" });
    config = new Config({
      type: "mysql",
      database: "test",
      __dirname: "/test/",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetAllWhenMocks();
  });

  describe("entities", () => {

    it("defaults to no entities", () => {
      expect(minimal.toConnectionOptions().entities).toStrictEqual([]);
    });

    it("can use a complete 'entities' option", () => {
      const config = new Config({
        type: "mysql",
        database: "test",
        entities: ["myEntity"],
      });
      expect(config.toConnectionOptions().entities).toStrictEqual(["myEntity"]);
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
        "/test/dist/**/*.entity.js",
      ]);
    });

    it("will add additionalEntities to computed sources", () => {
      const config = new Config({
        type: "mysql",
        database: "test",
        __dirname: "/test/",
        additionalEntities: ["custom"],
      });
      expect(config.toConnectionOptions().entities).toStrictEqual([
        ...JS_ENTITIES,
        "custom",
      ]);
    });

    it("can use an alternative 'dist'", () => {
      const config = new Config({
        type: "mysql",
        database: "test",
        __dirname: "/test/",
        dist: "out",
      });
      expect(config.toConnectionOptions().entities).toStrictEqual([
        "/test/out/**/*.entity.js",
      ]);
    });

    it("can use an alternative 'src'", () => {
      const config = new Config({
        type: "mysql",
        database: "test",
        __dirname: "/test/",
        src: "ts",
        entityMode: "ts",
      });
      expect(config.toConnectionOptions().entities).toStrictEqual([
        "/test/ts/**/*.entity.ts",
      ]);
    });

    describe("follows 'entityMode'", () => {

      function entityMode(entityMode?: ORMConfigBase["entityMode"], config: Partial<ORMConfigBase> = {}) {
        return new ConfigFixture({
          type: "mysql",
          database: "test",
          entityMode,
          __dirname: "/test/",
          ...(config as any),
        });
      }

      describe.each([
        ["with the default entityMode", undefined],
        ["with entityMode={}", {}],
      ] as const)("%s", (desc, entityMode) => {
        it.each([
          ["js", ""],
          ["ts", "nest"],
          ["js", "migration"],
        ] as const)("uses '%s' mode when ORM_MODE='%s'", (expected, mode) => {
          const config = new ConfigFixture({
            type: "mysql",
            database: "test",
            __dirname: "/test/",
            entityMode,
            silent: true,
          });
          const fn = jest.fn();
          when(fn)
            .calledWith("ORM_MODE").mockReturnValue(mode)
            .defaultImplementation(x => process.env[x]);
          config.env = fn;

          expect(config.toConnectionOptions().entities).toStrictEqual(
            expected === "js" ? JS_ENTITIES : TS_ENTITIES,
          );
        });
      });

      it("uses dist when ORM_ENV=node if entityMode.nest='js'", () => {
        const config = entityMode({ nest: "js" });
        const fn = jest.fn();
        when(fn)
          .calledWith("ORM_MODE").mockReturnValue("nest")
          .defaultImplementation(x => process.env[x]);
        config.env = fn;
        expect(config.toConnectionOptions().entities).toStrictEqual(JS_ENTITIES);
      });

      it("can use a custom default", () => {
        const config = entityMode({ default: "ts" });
        expect(config.toConnectionOptions().entities).toStrictEqual(TS_ENTITIES);
      });

      it("still uses dist if entityMode='js'", () => {
        const config = entityMode("js");
        expect(config.toConnectionOptions().entities).toStrictEqual([
          "/test/dist/**/*.entity.js",
        ]);
      });

      it("computes based on the src directory if entityMode='ts'", () => {
        const config = entityMode("ts");
        expect(config.toConnectionOptions().entities).toStrictEqual([
          "/test/src/**/*.entity.ts",
        ]);
      });

      it("will still use dist if entityMode={}", () => {
        const config = entityMode({});
        expect(config.toConnectionOptions().entities).toStrictEqual([
          "/test/dist/**/*.entity.js",
        ]);
      });

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
