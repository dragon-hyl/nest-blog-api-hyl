import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@/common/interceptors/response/response.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception/http-exception.filter';

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
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup(`${PREFIX}`, app, document);

  /**
   * 全局内置管道配置
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * 注册全局响应拦截器
   */
  app.useGlobalInterceptors(new ResponseInterceptor());

  /**
   * 注册全局异常拦截器
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000, () => {
    Logger.log(`服务已经启动，Api文档请访问http://www.localhost:3000${PREFIX}`);
  });
}
bootstrap();
