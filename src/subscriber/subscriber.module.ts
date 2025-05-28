import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../mensaje/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])], // 👈 Esto es lo que faltaba
  providers: [SubscriberService],
  exports: [SubscriberService], // opcional si lo usas fuera
})
export class SubscriberModule {}

