'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import type { Service } from '@brandviserproductions/contracts';
import { describedBy, FormField, Honeypot } from '@/components/common/FormField';
import { OptionSelect } from '@/components/common/OptionSelect';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitEnquiry } from '@/lib/api/hooks';
import { useBriefUpload } from '@/lib/api/use-brief-upload';
import { isPlaceholder, telHref } from '@/lib/contact-links';
import {
  AUDIENCE_SIZE_LABELS,
  AUDIENCE_SIZES,
  BUDGET_RANGE_LABELS,
  BUDGET_RANGES,
  EVENT_TYPE_LABELS,
  EVENT_TYPES,
} from '@/lib/labels';
import { cn } from '@/lib/utils';
import {
  enquiryDefaults,
  enquirySchema,
  STEP_ONE_FIELDS,
  toEnquiryRequest,
  type EnquiryFormValues,
} from '@/lib/validation/enquiry';
import { BriefUpload } from './BriefUpload';
import { EnquirySuccess } from './EnquirySuccess';

const eventTypeOptions = EVENT_TYPES.map((value) => ({ value, label: EVENT_TYPE_LABELS[value] }));
const audienceOptions = AUDIENCE_SIZES.map((value) => ({ value, label: AUDIENCE_SIZE_LABELS[value] }));
const budgetOptions = BUDGET_RANGES.map((value) => ({ value, label: BUDGET_RANGE_LABELS[value] }));

const stepOne = new Set<string>(STEP_ONE_FIELDS);

interface EnquiryFormProps {
  services: Array<Pick<Service, 'slug' | 'name'>>;
  phone: string | null;
}

/**
 * Contact & Booking form. Desktop shows "1 Your event" and "2 Your details" together; phones
 * get two steps with a sticky "Next" button. Validation runs in the browser (zod) and again
 * in the API; API field errors are shown next to their inputs and the entered data is kept.
 */
export function EnquiryForm({ services, phone }: EnquiryFormProps) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('service');
  const [step, setStep] = useState<1 | 2>(1);
  const stepTwoHeading = useRef<HTMLParagraphElement>(null);
  const submit = useSubmitEnquiry();
  const upload = useBriefUpload();

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      ...enquiryDefaults,
      services: preselected && services.some((s) => s.slug === preselected) ? [preselected] : [],
    },
    shouldFocusError: true,
  });
  const { errors } = form.formState;

  const goToStepTwo = async () => {
    if (await form.trigger([...STEP_ONE_FIELDS])) {
      setStep(2);
      requestAnimationFrame(() => stepTwoHeading.current?.focus());
    }
  };

  // If an error is in a step that is hidden on mobile, show that step first.
  const onInvalid = (invalid: FieldErrors<EnquiryFormValues>) => {
    const fields = Object.keys(invalid);
    setStep(fields.some((f) => stepOne.has(f)) ? 1 : 2);
  };

  const onSubmit = form.handleSubmit((values) => {
    const attachment = upload.state.status === 'done' ? { url: upload.state.url, name: upload.state.name } : null;
    submit.mutate(toEnquiryRequest(values, attachment), {
      onError: (error) => {
        const entries = Object.entries(error.fields) as Array<[keyof EnquiryFormValues, string]>;
        entries.forEach(([field, message]) => form.setError(field, { message }));
        if (entries[0]) {
          setStep(stepOne.has(entries[0][0]) ? 1 : 2);
          form.setFocus(entries[0][0]);
        }
      },
    });
  }, onInvalid);

  if (submit.isSuccess) return <EnquirySuccess result={submit.data} />;

  const uploading = upload.state.status === 'uploading';
  const callable = phone && !isPlaceholder(phone);

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5 md:gap-6" aria-label="Enquiry">
      <p className="eyebrow text-slate">
        <span className="hidden md:inline">
          <span className="text-ink">1 Your event</span> · 2 Your details
        </span>
        <span className="md:hidden">
          <span className="text-ink">Step {step} of 2</span> · {step === 1 ? 'Your event' : 'Your details'}
        </span>
      </p>

      {/* ── 1 · Your event ── */}
      <div className={cn('flex flex-col gap-5 md:gap-6', step === 2 && 'max-md:hidden')}>
        <fieldset>
          <legend className="mb-2 text-[14px] leading-5">Service needed (choose any)</legend>
          <Controller
            control={form.control}
            name="services"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {services.map((service) => {
                  const checked = field.value.includes(service.slug);
                  return (
                    <label
                      key={service.slug}
                      className={cn(
                        'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border border-rule bg-card px-3 text-[15px]',
                        checked && 'border-navy bg-gold-100/40',
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(on) =>
                          field.onChange(
                            on ? [...field.value, service.slug] : field.value.filter((slug) => slug !== service.slug),
                          )
                        }
                      />
                      {service.name}
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.services && <p className="text-small mt-1.5 text-destructive">{errors.services.message}</p>}
        </fieldset>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <FormField id="enq-event-type" label="Event type" error={errors.eventType?.message}>
            <Controller
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <OptionSelect
                  id="enq-event-type"
                  value={field.value}
                  onChange={field.onChange}
                  options={eventTypeOptions}
                  error={errors.eventType?.message}
                />
              )}
            />
          </FormField>
          <FormField id="enq-city" label="City" error={errors.city?.message}>
            <Input id="enq-city" autoComplete="address-level2" {...form.register('city')} {...describedBy('enq-city', errors.city?.message)} />
          </FormField>
          <FormField id="enq-month" label="Date or month" error={errors.eventMonth?.message}>
            <Input
              id="enq-month"
              placeholder="e.g. March 2027"
              {...form.register('eventMonth')}
              {...describedBy('enq-month', errors.eventMonth?.message)}
            />
          </FormField>
          <FormField id="enq-audience" label="Audience size" error={errors.audienceSize?.message}>
            <Controller
              control={form.control}
              name="audienceSize"
              render={({ field }) => (
                <OptionSelect id="enq-audience" value={field.value} onChange={field.onChange} options={audienceOptions} />
              )}
            />
          </FormField>
          <FormField id="enq-budget" label="Budget range" error={errors.budgetRange?.message} className="md:col-span-2">
            <Controller
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <OptionSelect id="enq-budget" value={field.value} onChange={field.onChange} options={budgetOptions} />
              )}
            />
          </FormField>
        </div>

        <div className="sticky bottom-[76px] z-10 -mx-4 bg-card/95 px-4 py-2 md:hidden">
          <Button type="button" variant="outline" className="w-full" onClick={goToStepTwo}>
            Next: your details
          </Button>
        </div>
      </div>

      {/* ── 2 · Your details ── */}
      <div className={cn('flex flex-col gap-5 md:gap-6', step === 1 && 'max-md:hidden')}>
        <p
          ref={stepTwoHeading}
          tabIndex={-1}
          className="eyebrow hidden border-t border-rule pt-6 text-ink outline-none md:block"
        >
          2 Your details
        </p>
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <FormField id="enq-name" label="Name *" error={errors.name?.message}>
            <Input id="enq-name" autoComplete="name" {...form.register('name')} {...describedBy('enq-name', errors.name?.message)} />
          </FormField>
          <FormField id="enq-company" label="Company *" error={errors.company?.message}>
            <Input
              id="enq-company"
              autoComplete="organization"
              {...form.register('company')}
              {...describedBy('enq-company', errors.company?.message)}
            />
          </FormField>
          <FormField id="enq-email" label="Work email *" error={errors.email?.message}>
            <Input
              id="enq-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              {...form.register('email')}
              {...describedBy('enq-email', errors.email?.message)}
            />
          </FormField>
          <FormField id="enq-phone" label="Phone *" error={errors.phone?.message}>
            <Input
              id="enq-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...form.register('phone')}
              {...describedBy('enq-phone', errors.phone?.message)}
            />
          </FormField>
          <FormField id="enq-brief" label="Brief" error={errors.brief?.message} className="md:col-span-2">
            <Textarea
              id="enq-brief"
              rows={5}
              className="min-h-30"
              {...form.register('brief')}
              {...describedBy('enq-brief', errors.brief?.message)}
            />
          </FormField>
          <div className="md:col-span-2">
            <BriefUpload state={upload.state} onSelect={(file) => void upload.start(file)} onRemove={upload.reset} />
          </div>
        </div>

        <div>
          <Controller
            control={form.control}
            name="consent"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start gap-2.5 text-[15px] leading-6">
                <Checkbox
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={(on) => field.onChange(on === true)}
                  className="mt-1"
                  {...describedBy('enq-consent', errors.consent?.message)}
                />
                <span>
                  I agree to be contacted about this enquiry. <Link href="/privacy">Privacy policy</Link>
                </span>
              </label>
            )}
          />
          {errors.consent && (
            <p id="enq-consent-error" className="text-small mt-1.5 text-destructive">
              {errors.consent.message}
            </p>
          )}
        </div>

        <Honeypot register={() => form.register('website')} />

        {submit.isError && !submit.error.isValidation && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-[15px]">
            <p className="font-semibold">Your enquiry wasn&apos;t sent.</p>
            <p className="mt-1">
              {submit.error.status === 429
                ? 'Too many attempts in a short time. Please wait a minute and try again.'
                : `${submit.error.message} Your answers are still here.`}
              {callable && (
                <>
                  {' '}
                  Or call us on <a href={telHref(phone)}>{phone}</a>.
                </>
              )}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Button type="submit" disabled={submit.isPending || uploading} className="w-full md:w-auto">
            {submit.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {submit.isPending ? 'Sending…' : 'Request a proposal'}
          </Button>
          {uploading && <p className="text-small text-slate">Waiting for the upload to finish…</p>}
          <Button type="button" variant="ghost" className="md:hidden" onClick={() => setStep(1)}>
            ← Back to your event
          </Button>
        </div>
      </div>
    </form>
  );
}
