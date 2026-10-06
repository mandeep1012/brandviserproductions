import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminContentService } from './admin-content.service.js';
import { AdminEnquiriesService } from './admin-enquiries.service.js';

@Module({
  controllers: [AdminController],
  providers: [AdminContentService, AdminEnquiriesService],
})
export class AdminModule {}
