import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = +process.env.PORT | 4333;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Server has been started on ${PORT} port...`);
  });
}
bootstrap();
