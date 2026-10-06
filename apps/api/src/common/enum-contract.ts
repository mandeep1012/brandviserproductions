import type * as Contract from '@brandviserproductions/contracts';
import type * as Db from '../generated/prisma/enums.js';

/**
 * Compile-time check that the Prisma enums and the API contract list the same values.
 * Adding a value on one side only fails `tsc` here instead of at runtime.
 */
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;

export type EnumContractChecks = [
  Assert<Same<Db.EventType, Contract.EventType>>,
  Assert<Same<Db.AudienceSize, Contract.AudienceSize>>,
  Assert<Same<Db.BudgetRange, Contract.BudgetRange>>,
  Assert<Same<Db.FaqPage, Contract.FaqPage>>,
  Assert<Same<Db.EnquirySource, Contract.EnquirySource>>,
  Assert<Same<Db.EnquiryStatus, Contract.EnquiryStatus>>,
];
