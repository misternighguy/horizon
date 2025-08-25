import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export default function Pill({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={clsx('pill', className)} {...rest} />;
}
