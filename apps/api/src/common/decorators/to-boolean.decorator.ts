import { Transform } from 'class-transformer';

/** Converts query-string booleans ("true" / "false" / "1" / "0") into real booleans. */
export const ToBoolean = () =>
  Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return value;
  });
