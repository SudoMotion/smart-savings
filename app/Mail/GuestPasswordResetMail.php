<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GuestPasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $verificationCode,
        public string $email,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Guest Password Reset Verification Code',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.guest-password-reset',
            with: [
                'verificationCode' => $this->verificationCode,
                'email' => $this->email,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
