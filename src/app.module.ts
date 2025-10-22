import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './features/users/users.module';
import { ProductsModule } from './features/products/products.module';
import { GalleriesModule } from './features/galleries/galleries.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AuthModule } from './core/auth/auth.module';
import { AuthGuard } from './core/auth/guards/auth.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../'),
      renderPath: '/uploads'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    GalleriesModule,
    AuthModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ]
})
export class AppModule {}
