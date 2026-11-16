<?php

namespace App\Support;

class MailConfig
{
    public static function defaultMailer(): string
    {
        $mailer = self::envString('MAIL_MAILER');

        if ($mailer !== null) {
            return $mailer;
        }

        return env('APP_ENV') === 'production' ? 'smtp' : 'log';
    }

    public static function smtpScheme(): ?string
    {
        $scheme = self::envString('MAIL_SCHEME');

        if ($scheme !== null) {
            return $scheme;
        }

        $encryption = self::envString('MAIL_ENCRYPTION');

        if ($encryption === 'ssl') {
            return 'smtps';
        }

        $port = (int) (self::envString('MAIL_PORT') ?? 587);

        return $port === 465 ? 'smtps' : 'smtp';
    }

    public static function smtpPassword(): ?string
    {
        return self::envString('MAIL_PASSWORD');
    }

    public static function smtpUsername(): ?string
    {
        return self::envString('MAIL_USERNAME');
    }

    /**
     * Normalizes .env values (null, empty, quoted strings, literal "null").
     */
    public static function envString(string $key): ?string
    {
        $value = env($key);

        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        if ($trimmed === '' || strtolower($trimmed) === 'null') {
            return null;
        }

        if (
            (str_starts_with($trimmed, '"') && str_ends_with($trimmed, '"'))
            || (str_starts_with($trimmed, "'") && str_ends_with($trimmed, "'"))
        ) {
            $trimmed = substr($trimmed, 1, -1);
        }

        return $trimmed;
    }
}
