import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../mensaje/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])], 
  providers: [SubscriberService],
  exports: [SubscriberService], 
})
export class SubscriberModule {}

