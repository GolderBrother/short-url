import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShowLongMapService } from './show-long-map.service';

@Controller()
export class AppController {
  @Inject(ShowLongMapService)
  private showLongMapService: ShowLongMapService;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('short-url')
  async generateShortUrl(@Query('longUrl') longUrl: string) {
    return await this.showLongMapService.generate(longUrl);
  }

  @Get(':code')
  @Redirect()
  async jump(@Param('code') code: string) {
    const longUrl = await this.showLongMapService.getLongUrl(code);
    if (!longUrl) throw new BadRequestException('长链接不存在');
    return {
      url: longUrl,
      statusCode: 302,
    };
  }
}
