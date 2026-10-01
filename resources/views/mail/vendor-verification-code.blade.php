@php
use Illuminate\Support\Str;
@endphp

@component('mail::message')

# Vendor Verification Code

Hello {{ $name }},

Your verification code for the vendor application is:

## {{ $verificationCode }}

This code will expire in 10 minutes. Please enter this code to verify your email address and complete your vendor application.

If you did not request this verification code, please contact our support team.

Thank you,

{{ config('app.name') }}
@endcomponent