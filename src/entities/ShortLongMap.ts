import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
/**
 * 断链和长链映射表
 */
export class ShortLongMapEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '压缩码',
  })
  shortUrl: string;

  @Column({
    length: 200,
    comment: '原始 url',
  })
  longUrl: string;

  @CreateDateColumn()
  createTime: Date;
}
