import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueCodeEntity } from './entities/UniqueCode';
import { UniqueCodeService } from './unique-code.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ShortLongMapEntity } from './entities/ShortLongMap';
import { ShowLongMapService } from './show-long-map.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'short-url',
      synchronize: true,
      logging: true,
      entities: [UniqueCodeEntity, ShortLongMapEntity],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UniqueCodeService, ShowLongMapService],
})
export class AppModule {}
