import { cn } from './utils';
import { dashboardInlineErrorClass } from '../layout/dashboardStyles';

type FormErrorProps = {
  message?: string;
  className?: string;
  id?: string;
};

export function FormError({ message, className, id }: FormErrorProps) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className={cn(dashboardInlineErrorClass, className)}>
      {message}
    </p>
  );
}
