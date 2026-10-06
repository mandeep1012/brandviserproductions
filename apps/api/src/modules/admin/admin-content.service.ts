import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RevalidationService } from '../revalidation/revalidation.service.js';
import { SITE_SETTINGS_ID } from '../site/site.service.js';
import type {
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

const slugsToConnect = (slugs: string[] | undefined) => slugs?.map((slug) => ({ slug }));

/**
 * Admin writes. Every write asks the web app to revalidate the pages that show the changed
 * content. Prisma errors (duplicate slug, missing id) become 409/404 in PrismaExceptionFilter.
 */
@Injectable()
export class AdminContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revalidation: RevalidationService,
  ) {}

  // ── Case studies ──

  async createCaseStudy({ serviceSlugs, eventDate, ...data }: CreateCaseStudyDto) {
    const row = await this.prisma.caseStudy.create({
      data: { ...data, eventDate: new Date(eventDate), services: { connect: slugsToConnect(serviceSlugs) } },
    });
    this.revalidation.revalidate('case-studies');
    return row;
  }

  async updateCaseStudy(id: string, { serviceSlugs, eventDate, ...data }: UpdateCaseStudyDto) {
    const row = await this.prisma.caseStudy.update({
      where: { id },
      data: {
        ...data,
        ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        ...(serviceSlugs ? { services: { set: slugsToConnect(serviceSlugs) } } : {}),
      },
    });
    this.revalidation.revalidate('case-studies');
    return row;
  }

  async deleteCaseStudy(id: string): Promise<void> {
    await this.prisma.caseStudy.delete({ where: { id } });
    this.revalidation.revalidate('case-studies', 'testimonials');
  }

  // ── Testimonials ──

  async createTestimonial({ caseStudySlug, ...data }: CreateTestimonialDto) {
    const row = await this.prisma.testimonial.create({
      data: { ...data, ...(caseStudySlug ? { caseStudy: { connect: { slug: caseStudySlug } } } : {}) },
    });
    this.revalidation.revalidate('testimonials', 'case-studies');
    return row;
  }

  async updateTestimonial(id: string, { caseStudySlug, ...data }: UpdateTestimonialDto) {
    const link =
      caseStudySlug === undefined
        ? {}
        : caseStudySlug === null
          ? { caseStudy: { disconnect: true } }
          : { caseStudy: { connect: { slug: caseStudySlug } } };
    const row = await this.prisma.testimonial.update({ where: { id }, data: { ...data, ...link } });
    this.revalidation.revalidate('testimonials', 'case-studies');
    return row;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.prisma.testimonial.delete({ where: { id } });
    this.revalidation.revalidate('testimonials', 'case-studies');
  }

  // ── Services (with their event-type matrix rows) ──

  async createService({ eventTypes, ...data }: CreateServiceDto) {
    const row = await this.prisma.service.create({
      data: { ...data, offerings: eventTypes ? { create: eventTypes.map((eventType) => ({ eventType })) } : undefined },
    });
    this.revalidation.revalidate('services', 'case-studies');
    return row;
  }

  async updateService(id: string, { eventTypes, ...data }: UpdateServiceDto) {
    const row = await this.prisma.$transaction(async (tx) => {
      if (eventTypes) {
        await tx.eventTypeOffering.deleteMany({ where: { serviceId: id } });
        await tx.eventTypeOffering.createMany({ data: eventTypes.map((eventType) => ({ eventType, serviceId: id })) });
      }
      return tx.service.update({ where: { id }, data });
    });
    this.revalidation.revalidate('services', 'case-studies');
    return row;
  }

  async deleteService(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
    this.revalidation.revalidate('services', 'case-studies');
  }

  // ── Process steps ──

  async createProcessStep(data: CreateProcessStepDto) {
    const row = await this.prisma.processStep.create({ data });
    this.revalidation.revalidate('process');
    return row;
  }

  async updateProcessStep(id: string, data: UpdateProcessStepDto) {
    const row = await this.prisma.processStep.update({ where: { id }, data });
    this.revalidation.revalidate('process');
    return row;
  }

  async deleteProcessStep(id: string): Promise<void> {
    await this.prisma.processStep.delete({ where: { id } });
    this.revalidation.revalidate('process');
  }

  // ── Team ──

  async createTeamMember(data: CreateTeamMemberDto) {
    const row = await this.prisma.teamMember.create({ data });
    this.revalidation.revalidate('team');
    return row;
  }

  async updateTeamMember(id: string, data: UpdateTeamMemberDto) {
    const row = await this.prisma.teamMember.update({ where: { id }, data });
    this.revalidation.revalidate('team');
    return row;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await this.prisma.teamMember.delete({ where: { id } });
    this.revalidation.revalidate('team');
  }

  // ── Client logos (part of /site) ──

  async createClientLogo(data: CreateClientLogoDto) {
    const row = await this.prisma.clientLogo.create({ data });
    this.revalidation.revalidate('site');
    return row;
  }

  async updateClientLogo(id: string, data: UpdateClientLogoDto) {
    const row = await this.prisma.clientLogo.update({ where: { id }, data });
    this.revalidation.revalidate('site');
    return row;
  }

  async deleteClientLogo(id: string): Promise<void> {
    await this.prisma.clientLogo.delete({ where: { id } });
    this.revalidation.revalidate('site');
  }

  // ── FAQs ──

  async createFaq(data: CreateFaqDto) {
    const row = await this.prisma.faq.create({ data });
    this.revalidation.revalidate('faqs');
    return row;
  }

  async updateFaq(id: string, data: UpdateFaqDto) {
    const row = await this.prisma.faq.update({ where: { id }, data });
    this.revalidation.revalidate('faqs');
    return row;
  }

  async deleteFaq(id: string): Promise<void> {
    await this.prisma.faq.delete({ where: { id } });
    this.revalidation.revalidate('faqs');
  }

  // ── Site settings ──

  async updateSite(data: UpdateSiteDto) {
    const row = await this.prisma.siteSettings.update({ where: { id: SITE_SETTINGS_ID }, data });
    this.revalidation.revalidate('site');
    return row;
  }
}
