import { Injectable } from '@nestjs/common';
import { generateRandomStr } from './utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UniqueCodeEntity } from './entities/UniqueCode';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UniqueCodeService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async generateCode() {
    // 生成随机的长度为 6 的字符串
    const str = generateRandomStr(6);

    // 查下数据库
    const uniqueCode = await this.entityManager.findOneBy(UniqueCodeEntity, {
      code: str,
    });

    // 如果没查到，就插入数据，否则重新生成
    if (uniqueCode) return await this.generateCode();
    const code = new UniqueCodeEntity();
    code.code = str;
    code.status = 0;
    const res = await this.entityManager.insert(UniqueCodeEntity, code);
    return res;
  }

  // 在凌晨 4 点左右批量插入一堆，比如一次性插入 10000 个
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async batchGenerateCode() {
    const MAX_COUNT = 10000;
    for (let i = 0; i < MAX_COUNT; i++) {
      this.generateCode();
    }
  }
}
