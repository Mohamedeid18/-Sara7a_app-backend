export const template = (code, userName, subject) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, sans-serif;
        color: #1f2937;
      }

      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        border: 1px solid #e5e7eb;
      }

      .email-header {
        background-color:#0d6efd  !important ;
        padding: 28px 24px;
        text-align: center;
      }

      .email-header h1 {
        margin: 0;
        font-size: 28px;
        color: #ffffff !important;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .email-body {
        padding: 32px 24px;
      }

      .email-body h2 {
        margin: 0 0 18px;
        font-size: 26px;
        color: #0d6efd;
      }

      .email-body p {
        margin: 0 0 16px;
        line-height: 1.7;
        font-size: 16px;
        color: #374151;
      }

      .activation-button {
        display: inline-block;
        margin: 10px 0 18px !important;
        padding: 14px 22px;
        border-radius: 8px;
        background: #0d6efd;
        border: 1px solid #0b5ed7;
        color: #ffffff !important;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .email-footer {
        background: #f9fafb;
        padding: 20px 24px 28px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }

      .email-footer p {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
      }

      @media only screen and (max-width: 600px) {
        .email-container {
          margin: 0;
          border-radius: 0;
        }

        .email-header,
        .email-body,
        .email-footer {
          padding-left: 16px;
          padding-right: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>${subject}</h1>
      </div>
      <div class="email-body">
        <h2>Hello ${userName},</h2>
        <p>
          Thank you for signing up with Route Academy. To complete your
          registration and start using your account, please use the code below to activate it.
        </p>
        <h2 class="activation-button">${code}</h2>
        <p>If you did not sign up for this account, please ignore this email.</p>
        <p>Best regards,<br />Sara7a Application Team</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2024 Route Academy. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
