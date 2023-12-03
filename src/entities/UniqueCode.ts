import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
/**
 * 断链的唯一码
 */
export class UniqueCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '压缩码，就是短链',
  })
  code: string;

  @Column({
    comment: '状态, 0 未使用、1 已使用',
  })
  status: number;
}
