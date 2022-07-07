import { DynamicModule, Module } from "@nestjs/common";
import { IDConfig, IDModuleConfig, ID_MODULE_CONFIG } from "./config";
import { IDService } from "./id.service";

@Module({})
export class IDModule {

  public static forRoot<IDs extends IDConfig>(config: IDModuleConfig<IDs>): DynamicModule {
    return {
      module: IDModule,
      providers: [
        {
          provide: ID_MODULE_CONFIG,
          useValue: config,
        },
        IDService,
      ],
      exports: [
        IDService,
      ],
    };
  }

}
