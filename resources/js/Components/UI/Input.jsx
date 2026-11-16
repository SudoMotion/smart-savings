import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import FieldWrapper from './FieldWrapper';
import { fieldClassName } from './styles';
import { cn } from './cn';

function EyeOpenIcon({ className }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeSlashIcon({ className }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <path d="m2 2 20 20" />
        </svg>
    );
}

const Input = forwardRef(function Input(
    {
        type = 'text',
        className = '',
        wrapperClassName = '',
        isFocused = false,
        label,
        error,
        required = false,
        id,
        readOnly,
        ...props
    },
    ref,
) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const localRef = useRef(null);
    const isPasswordField = type === 'password';

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const inputType = isPasswordField ? (passwordVisible ? 'text' : 'password') : type;
    const toggleDisabled = readOnly || props.disabled;

    const inputElement = (
        <input
            {...props}
            id={id}
            readOnly={readOnly}
            type={inputType}
            ref={localRef}
            className={cn(fieldClassName, isPasswordField && 'pr-10', className)}
        />
    );

    return (
        <FieldWrapper
            label={label}
            id={id}
            error={error}
            required={required}
            className={wrapperClassName}
        >
            {isPasswordField ? (
                <div className="relative">
                    {inputElement}
                    <button
                        type="button"
                        tabIndex={-1}
                        disabled={toggleDisabled}
                        onClick={() => setPasswordVisible((show) => !show)}
                        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                        {passwordVisible ? (
                            <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                            <EyeOpenIcon className="h-4 w-4" />
                        )}
                    </button>
                </div>
            ) : (
                inputElement
            )}
        </FieldWrapper>
    );
});

export default Input;