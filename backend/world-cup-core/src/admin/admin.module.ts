import { Module } from '@nestjs/common';
import { BasicModule } from '../basic/basic.module';
import { HttpModule } from '@nestjs/axios';
import { WorldCupFeatureApiService } from '../basic/world-cup-feature-api.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [BasicModule,HttpModule],
  controllers: [AdminController],
  providers: [AdminService, WorldCupFeatureApiService],
  exports: [AdminService, WorldCupFeatureApiService],
})
export class AdminModule {}
