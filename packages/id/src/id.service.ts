import { Inject, Injectable } from "@nestjs/common";
import { v4 } from "uuid";
import { customAlphabet } from "nanoid/async";
import { customAlphabet as customAlphabetSync } from "nanoid";
import { alphanumeric, nolookalikesSafe } from "nanoid-dictionary";
import { IDConfig, IDDefinition, IDModuleConfig, ID_MODULE_CONFIG, MAX_ALPHANUMERIC_SIZE, MAX_NOLOOKALIKES_SIZE } from "./config";

@Injectable()
export class IDService<IDs extends IDConfig> {

  public readonly safe: (size?: number) => Promise<string>;
  public readonly alphanumeric: (size?: number) => Promise<string>;

  public readonly safeSync: (size?: number) => string;
  public readonly alphanumericSync: (size?: number) => string;

  public constructor(
    @Inject(ID_MODULE_CONFIG)
    private readonly config: IDModuleConfig<IDs>,
  ) {
    this.safe = customAlphabet(nolookalikesSafe);
    this.alphanumeric = customAlphabet(alphanumeric);
    this.safeSync = customAlphabetSync(nolookalikesSafe);
    this.alphanumericSync = customAlphabetSync(alphanumeric);
  }

  public async id(id: keyof IDs): Promise<string> {
    const config: IDDefinition = this.config.ids[id];
    if(config === "uuid") {
      return v4();
    }
    if(config[0] === "safe") {
      const sizeConfig = config[1];
      if(typeof sizeConfig === "number") {
        return this.safe(sizeConfig);
      }
      const size = MAX_NOLOOKALIKES_SIZE[sizeConfig];
      return this.safe(size);
    }
    if(config[0] === "alphanumeric") {
      const sizeConfig = config[1];
      if(typeof sizeConfig === "number") {
        return this.safe(sizeConfig);
      }
      const size = MAX_ALPHANUMERIC_SIZE[sizeConfig];
      return this.alphanumeric(size);
    }
  }

  public async sync(id: keyof IDs): Promise<string> {
    const config: IDDefinition = this.config.ids[id];
    if(config === "uuid") {
      return v4();
    }
    if(config[0] === "safe") {
      const size = MAX_NOLOOKALIKES_SIZE[config[1]];
      return this.safeSync(size);
    }
    if(config[0] === "alphanumeric") {
      const size = MAX_ALPHANUMERIC_SIZE[config[1]];
      return this.alphanumericSync(size);
    }
  }

}
