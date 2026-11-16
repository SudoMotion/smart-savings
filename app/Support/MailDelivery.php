<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Throwable;

class MailDelivery
{
    public static function attempt(callable $send, string $context = 'mail'): bool
    {
        try {
            $send();

            return true;
        } catch (Throwable $exception) {
            Log::error('Outgoing mail failed.', [
                'context' => $context,
                'exception' => $exception->getMessage(),
                'mailer' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'scheme' => config('mail.mailers.smtp.scheme'),
            ]);

            return false;
        }
    }
}
