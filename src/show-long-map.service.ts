import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UniqueCodeEntity } from './entities/UniqueCode';
import { UniqueCodeService } from './unique-code.service';
import { ShortLongMapEntity } from './entities/ShortLongMap';

@Injectable()
export class ShowLongMapService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(UniqueCodeService)
  private uniqueCodeService: UniqueCodeService;

  /**
   * 根据长链生成短链：（1）生成唯一码 （2）唯一码作为短链，映射长链，形成map，插入db
   * @param longUrl
   */
  async generate(longUrl: string) {
    if (!longUrl) {
      throw new BadRequestException('长链不能为空');
    }
    // 先从 unique-code 表里取一个压缩码来用，如果没有可用压缩码，那就生成一个。
    let uniqueCode = await this.entityManager.findOneBy(UniqueCodeEntity, {
      status: 0,
    });

    if (!uniqueCode) uniqueCode = await this.uniqueCodeService.generateCode();

    const map = new ShortLongMapEntity();
    map.longUrl = longUrl;
    map.shortUrl = uniqueCode.code;

    // 然后在 short-long-map 表里插入这条新的短链映射，并且把用到的压缩码状态改为 1
    await this.entityManager.insert(ShortLongMapEntity, map);
    await this.entityManager.update(
      UniqueCodeEntity,
      {
        id: uniqueCode.id,
      },
      {
        status: 1,
      },
    );
    return uniqueCode.code;
  }

  /**
   * 根据短链接获取长链接
   * @param shortUrl
   * @returns
   */
  async getLongUrl(shortUrl: string) {
    const map = await this.entityManager.findOneBy(ShortLongMapEntity, {
      shortUrl,
    });
    if (!map) return null;
    return map.longUrl;
  }
}
