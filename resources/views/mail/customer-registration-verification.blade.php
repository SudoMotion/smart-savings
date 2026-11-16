<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; margin: 20px 0; }
        .header { text-align: center; margin-bottom: 32px; }
        h1 { color: #111827; font-size: 24px; margin: 0 0 16px 0; }
        .code-box { background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; font-family: 'Courier New', monospace; }
        .info { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify your email</h1>
        </div>
        <p>Hello {{ $name }},</p>
        <p>Thanks for signing up. Enter this verification code on the registration page to create your account for <strong>{{ $email }}</strong>:</p>
        <div class="code-box">
            <div class="code">{{ $verificationCode }}</div>
        </div>
        <div class="info">
            <strong>Important:</strong> This code expires in <strong>10 minutes</strong>.
        </div>
        <p>If you did not try to register, you can ignore this email.</p>
        <div class="footer">
            <p>{{ config('app.name') }}</p>
        </div>
    </div>
</body>
</html>