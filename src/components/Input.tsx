import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, id, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = props.value !== undefined && props.value !== '';

        return (
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        "peer flex h-14 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pt-6",
                        className
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={label}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-3 top-4 z-10 origin-[0] -translate-y-1 scale-75 transform text-sm text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary pointer-events-none",
                        (hasValue || isFocused) && "-translate-y-3 scale-75"
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
