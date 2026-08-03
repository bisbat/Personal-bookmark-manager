import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CollectionModule } from './collection/collection.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import {MeController} from './profile/profile.controller';

@Module({
  imports: [BookmarkModule, CollectionModule, ConfigModule.forRoot(), AuthModule],
  controllers: [AppController, MeController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
