import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // 统一路径前缀 如：http://www.localhost:3000/api/v1/user
  const PREFIX = '/api-docs';

  /**
   * swagger 文档配置
   */
  const option = new DocumentBuilder()
    .setTitle('博客系统API文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup(`${PREFIX}`, app, document);

  await app.listen(3000, () => {
    Logger.log(`服务已经启动，Api文档请访问http://www.localhost:3000${PREFIX}`);
  });
}
bootstrap();
