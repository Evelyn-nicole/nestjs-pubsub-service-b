import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriberModule } from './subscriber/subscriber.module';
import { Producto } from './mensaje/producto.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [Producto],
        synchronize: true, // cuidado en producción
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Producto]), // si vas a usar repos aquí
    SubscriberModule, // este sí va en imports
  ],
})
export class AppModule {}

