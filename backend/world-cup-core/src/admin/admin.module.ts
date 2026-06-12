import { Module } from '@nestjs/common';
import { BasicModule } from '../basic/basic.module';
import { HttpModule } from '@nestjs/axios';
import { WorldCupFeatureApiService } from '../basic/world-cup-feature-api.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { N8nAiProvider } from '../n8n/n8nAutomationService';

@Module({
  imports: [BasicModule,HttpModule],
  controllers: [AdminController],
  providers: [AdminService, WorldCupFeatureApiService,N8nAiProvider],
  exports: [AdminService, WorldCupFeatureApiService],
})
export class AdminModule {}
