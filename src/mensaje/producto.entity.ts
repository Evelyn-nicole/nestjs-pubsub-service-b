import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryColumn()
  id: string;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  stock: number;

  @Column({ length: 250, nullable: true })
  category?: string;

  @Column({ length: 250, nullable: true })
  brand?: string;

  @Column()
  created_at: string;

  @Column()
  available: boolean;

  @Column('jsonb') // para guardar array de variantes
  variants: any[];

  @Column('jsonb') // para guardar el objeto supplier
  supplier: any;
}
