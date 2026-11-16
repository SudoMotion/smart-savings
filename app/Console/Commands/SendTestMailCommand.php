<?php

namespace App\Console\Commands;

use App\Support\MailConfig;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTestMailCommand extends Command
{
    protected $signature = 'mail:test {recipient : Email address to send the test message to}';

    protected $description = 'Send a test email using the configured mailer (for VPS/SMTP debugging)';

    public function handle(): int
    {
        $recipient = (string) $this->argument('recipient');

        $this->table(['Setting', 'Value'], [
            ['APP_ENV', (string) env('APP_ENV')],
            ['MAIL_MAILER', config('mail.default')],
            ['MAIL_HOST', (string) config('mail.mailers.smtp.host')],
            ['MAIL_PORT', (string) config('mail.mailers.smtp.port')],
            ['MAIL_SCHEME', (string) (config('mail.mailers.smtp.scheme') ?? '(auto)')],
            ['MAIL_USERNAME', (string) (MailConfig::smtpUsername() ?? '')],
            ['MAIL_FROM', (string) config('mail.from.address')],
        ]);

        if (config('mail.default') === 'log') {
            $this->warn('MAIL_MAILER is "log" — messages are written to logs, not delivered over SMTP.');

            return self::FAILURE;
        }

        try {
            Mail::raw(
                'This is a test message from '.config('app.name').' at '.now()->toDateTimeString(),
                function ($message) use ($recipient) {
                    $message->to($recipient)->subject('SMTP test — '.config('app.name'));
                }
            );
        } catch (\Throwable $exception) {
            $this->error('Send failed: '.$exception->getMessage());
            $this->line('Tips: run `php artisan config:clear`, check firewall (ports 465/587), and Gmail app-password quotes (use MAIL_PASSWORD without spaces or wrap in double quotes).');

            return self::FAILURE;
        }

        $this->info("Test email sent to {$recipient}.");

        return self::SUCCESS;
    }
}
