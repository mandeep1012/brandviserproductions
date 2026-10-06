import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CacheControl } from '../../common/decorators/cache-control.decorator.js';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard.js';
import { AdminContentService } from './admin-content.service.js';
import { AdminEnquiriesService } from './admin-enquiries.service.js';
import {
  CreateCaseStudyDto,
  CreateClientLogoDto,
  CreateFaqDto,
  CreateProcessStepDto,
  CreateServiceDto,
  CreateTeamMemberDto,
  CreateTestimonialDto,
  UpdateCaseStudyDto,
  UpdateClientLogoDto,
  UpdateFaqDto,
  UpdateProcessStepDto,
  UpdateServiceDto,
  UpdateSiteDto,
  UpdateTeamMemberDto,
  UpdateTestimonialDto,
} from './dto/content.dto.js';
import { ListEnquiriesQuery, UpdateEnquiryDto } from './dto/enquiries.dto.js';

/**
 * /api/v1/admin/*: content management and the enquiry inbox.
 * Every route needs `Authorization: Bearer <ADMIN_API_TOKEN>` and is never cached.
 */
@Controller({ path: 'admin', version: '1' })
@UseGuards(AdminTokenGuard)
@CacheControl('no-store')
export class AdminController {
  constructor(
    private readonly content: AdminContentService,
    private readonly enquiries: AdminEnquiriesService,
  ) {}

  // ── Enquiries ──

  @Get('enquiries')
  listEnquiries(@Query() query: ListEnquiriesQuery) {
    return this.enquiries.list(query);
  }

  @Get('enquiries/:id')
  getEnquiry(@Param('id') id: string) {
    return this.enquiries.get(id);
  }

  @Patch('enquiries/:id')
  updateEnquiry(@Param('id') id: string, @Body() dto: UpdateEnquiryDto) {
    return this.enquiries.update(id, dto);
  }

  @Get('enquiries/:id/attachment')
  enquiryAttachment(@Param('id') id: string) {
    return this.enquiries.attachment(id);
  }

  // ── Site ──

  @Patch('site')
  updateSite(@Body() dto: UpdateSiteDto) {
    return this.content.updateSite(dto);
  }

  // ── Case studies ──

  @Post('case-studies')
  createCaseStudy(@Body() dto: CreateCaseStudyDto) {
    return this.content.createCaseStudy(dto);
  }

  @Patch('case-studies/:id')
  updateCaseStudy(@Param('id') id: string, @Body() dto: UpdateCaseStudyDto) {
    return this.content.updateCaseStudy(id, dto);
  }

  @Delete('case-studies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCaseStudy(@Param('id') id: string) {
    return this.content.deleteCaseStudy(id);
  }

  // ── Testimonials ──

  @Post('testimonials')
  createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.content.createTestimonial(dto);
  }

  @Patch('testimonials/:id')
  updateTestimonial(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.content.updateTestimonial(id, dto);
  }

  @Delete('testimonials/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTestimonial(@Param('id') id: string) {
    return this.content.deleteTestimonial(id);
  }

  // ── Services ──

  @Post('services')
  createService(@Body() dto: CreateServiceDto) {
    return this.content.createService(dto);
  }

  @Patch('services/:id')
  updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.content.updateService(id, dto);
  }

  @Delete('services/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteService(@Param('id') id: string) {
    return this.content.deleteService(id);
  }

  // ── Process steps ──

  @Post('process-steps')
  createProcessStep(@Body() dto: CreateProcessStepDto) {
    return this.content.createProcessStep(dto);
  }

  @Patch('process-steps/:id')
  updateProcessStep(@Param('id') id: string, @Body() dto: UpdateProcessStepDto) {
    return this.content.updateProcessStep(id, dto);
  }

  @Delete('process-steps/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProcessStep(@Param('id') id: string) {
    return this.content.deleteProcessStep(id);
  }

  // ── Team ──

  @Post('team')
  createTeamMember(@Body() dto: CreateTeamMemberDto) {
    return this.content.createTeamMember(dto);
  }

  @Patch('team/:id')
  updateTeamMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.content.updateTeamMember(id, dto);
  }

  @Delete('team/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTeamMember(@Param('id') id: string) {
    return this.content.deleteTeamMember(id);
  }

  // ── Client logos ──

  @Post('client-logos')
  createClientLogo(@Body() dto: CreateClientLogoDto) {
    return this.content.createClientLogo(dto);
  }

  @Patch('client-logos/:id')
  updateClientLogo(@Param('id') id: string, @Body() dto: UpdateClientLogoDto) {
    return this.content.updateClientLogo(id, dto);
  }

  @Delete('client-logos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteClientLogo(@Param('id') id: string) {
    return this.content.deleteClientLogo(id);
  }

  // ── FAQs ──

  @Post('faqs')
  createFaq(@Body() dto: CreateFaqDto) {
    return this.content.createFaq(dto);
  }

  @Patch('faqs/:id')
  updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.content.updateFaq(id, dto);
  }

  @Delete('faqs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFaq(@Param('id') id: string) {
    return this.content.deleteFaq(id);
  }
}
