import { IDModule } from '@formulaic/id';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IDs } from './id';

@Module({
  imports: [
    IDModule.forRoot({
      ids: IDs,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
