'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { describedBy, FormField, Honeypot } from '@/components/common/FormField';
import { OptionSelect } from '@/components/common/OptionSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSubmitQuickEnquiry } from '@/lib/api/hooks';
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '@/lib/labels';
import { quickEnquirySchema, toQuickEnquiryRequest, type QuickEnquiryFormValues } from '@/lib/validation/enquiry';

const eventTypeOptions = EVENT_TYPES.map((value) => ({ value, label: EVENT_TYPE_LABELS[value] }));

/** "Have a brief? Let's meet." Name, phone and event type; the team calls back. */
export function QuickEnquiryForm() {
  const submit = useSubmitQuickEnquiry();
  const form = useForm<QuickEnquiryFormValues>({
    resolver: zodResolver(quickEnquirySchema),
    defaultValues: { name: '', phone: '', eventType: '', website: '' },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    submit.mutate(toQuickEnquiryRequest(values), {
      onError: (error) => {
        for (const [field, message] of Object.entries(error.fields)) {
          form.setError(field as keyof QuickEnquiryFormValues, { message });
        }
      },
    }),
  );

  if (submit.isSuccess) {
    return (
      <div role="status" className="lg:col-span-7">
        <p className="text-h3">Thank you. We&apos;ll call you within one working day.</p>
        <p className="text-small mt-2 text-slate">Your reference is {submit.data.reference}.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative grid items-start gap-4 lg:col-span-7 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <FormField id="quick-name" label="Name" error={errors.name?.message}>
        <Input id="quick-name" autoComplete="name" {...form.register('name')} {...describedBy('quick-name', errors.name?.message)} />
      </FormField>
      <FormField id="quick-phone" label="Phone" error={errors.phone?.message}>
        <Input
          id="quick-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          {...form.register('phone')}
          {...describedBy('quick-phone', errors.phone?.message)}
        />
      </FormField>
      <FormField id="quick-event" label="Event type" error={errors.eventType?.message}>
        <Controller
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <OptionSelect
              id="quick-event"
              value={field.value}
              onChange={field.onChange}
              options={eventTypeOptions}
              error={errors.eventType?.message}
            />
          )}
        />
      </FormField>
      <Honeypot register={() => form.register('website')} />
      <Button type="submit" disabled={submit.isPending} className="lg:mt-7">
        {submit.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
        Enquire
      </Button>
      {submit.isError && !submit.error.isValidation && (
        <p role="alert" className="text-small text-destructive lg:col-span-4">
          {submit.error.message}
        </p>
      )}
    </form>
  );
}
