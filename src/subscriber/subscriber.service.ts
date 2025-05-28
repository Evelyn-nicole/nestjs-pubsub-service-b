import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';
import { Repository } from 'typeorm';
import { Producto } from '../mensaje/producto.entity'; // <--- correcto
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto } from '../DTO/create-product.dto'; // <--- correcto


@Injectable()
export class SubscriberService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async onModuleInit() {
    console.log('📦 Inicializando servicio de suscripción...');
    const credentialsBase64 = this.configService.get<string>('GCP_CREDENTIALS_B64') || '';
    const credentialsJson = JSON.parse(
      Buffer.from(credentialsBase64, 'base64').toString('utf-8'),
    );

    const projectId = this.configService.get<string>('GCP_PROJECT_ID');
    const subscriptionName = this.configService.get<string>('GCP_SUBSCRIPTION_NAME');

    if (!subscriptionName) {
      throw new Error('La variable GCP_SUBSCRIPTION_NAME no está definida en el .env');
    }

    const pubsub = new PubSub({
      projectId,
      credentials: {
        client_email: credentialsJson.client_email,
        private_key: credentialsJson.private_key,
      },
    });

    const subscription = pubsub.subscription(subscriptionName);

    subscription.on('message', async (message) => {
  try {
    console.log('📨 Mensaje recibido:', message.data.toString());

    const data = JSON.parse(message.data.toString());

    // Validación
    const dto = plainToInstance(CreateProductDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      console.error(
        '❌ Errores de validación:',
        errors.map(e => e.constraints ? Object.values(e.constraints).join(', ') : 'Error desconocido'
  )
);
      message.nack();
      return;
    }

    // Guardado
    const producto = this.productoRepository.create(dto);
    await this.productoRepository.save(producto);
    console.log('✅ Producto guardado:', producto);

    message.ack();
  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error);
    message.nack();
  }
});

    console.log(`✅ Suscrito a la suscripción: ${subscriptionName}`);
  }
}
























// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { PubSub } from '@google-cloud/pubsub';
// import { Repository } from 'typeorm';
// import { Mensaje } from '../mensaje/producto.entity';

// @Injectable()
// export class SubscriberService implements OnModuleInit {
//     constructor(
//         private configService: ConfigService,
//         @InjectRepository(Mensaje)
//         private readonly mensajeRepository: Repository<Mensaje>,
//     ) {}

//     async onModuleInit() {
//         console.log('📦 Inicializando servicio de suscripción...');
//         const credentialsBase64 = this.configService.get<string>('GCP_CREDENTIALS_B64') || '';
//         const credentialsJson = JSON.parse(
//             Buffer.from(credentialsBase64, 'base64').toString('utf-8'),
//         );

//         const projectId = this.configService.get<string>('GCP_PROJECT_ID');
//         const subscriptionName = this.configService.get<string>('GCP_SUBSCRIPTION_NAME');
//         console.log('Project ID:', projectId);
//         console.log('Subscription Name:', subscriptionName);
        
//         if (!subscriptionName) {
//             throw new Error('La variable GCP_SUBSCRIPTION_NAME no está definida en el env');
//         }

//         const pubsub = new PubSub({
//             projectId,
//             credentials: {
//                 client_email: credentialsJson.client_email,
//                 private_key: credentialsJson.private_key,
//             },
//         });

//         const subscription = pubsub.subscription(subscriptionName);

//         subscription.on('message', async (message) => {
//             try {
//                 console.log('Mensaje recibido:', message.data.toString());

//                 const data = JSON.parse(message.data.toString());

//                 // Guardar en la base de datos
//                 const nuevoMensaje = this.mensajeRepository.create(data);
//                 await this.mensajeRepository.save(nuevoMensaje);
//                 console.log('Mensaje guardado:', nuevoMensaje);

//                 message.ack();
//             } catch (error) {
//                 console.error('❌ Error al procesar el mensaje:', error);
//             }
//         });

//         console.log(`✅ Suscrito a la suscripción: ${subscriptionName}`);
//     }
// }

// // message.ack() es una confirmación (acknowledgment) que le dice a Pub/Sub:
// // “✅ He recibido y procesado este mensaje, puedes eliminarlo de la cola”.