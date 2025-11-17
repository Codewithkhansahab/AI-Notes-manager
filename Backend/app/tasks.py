import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.celery_app import celery_app
from app.config import settings


@celery_app.task(bind=True, max_retries=3)
def send_welcome_email(self, email: str, username: str):
    """Send welcome email after successful registration"""
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Welcome to Our Platform!"
        msg["From"] = settings.FROM_EMAIL
        msg["To"] = email

        # Email body
        text = f"""
        Hi {username},

        Welcome to our platform! Your account has been successfully created.

        Thank you for joining us!

        Best regards,
        The Team
        """

       html = f"""
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table cellpadding="0" cellspacing="0" width="100%" style="
            max-width: 600px; 
            background: #ffffff; 
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          ">
            
            <!-- Logo Header -->
            <tr>
              <td align="center" style="padding: 20px; background: #1a73e8;">
                <img src="https://dummyimage.com/120x50/ffffff/000.png&text=Your+Logo" 
                  alt="Logo"
                  style="max-width:120px; height:auto;">
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 30px;">

                <h2 style="color:#333; font-weight:600; margin-top:0;">
                  Welcome, {username}! 🎉
                </h2>

                <p style="font-size:16px; color:#555;">
                  Your account has been successfully created. We're excited to have you on board!
                </p>
                
                <p style="font-size:16px; color:#555;">
                  Click the button below to verify your email address and get started.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin: 30px 0;">
                  <a href="{verification_link}"
                    style="
                      background:#1a73e8;
                      color:#ffffff;
                      padding: 12px 24px;
                      border-radius: 6px;
                      text-decoration:none;
                      font-size:16px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Verify Email
                  </a>
                </div>

                <p style="font-size:14px; color:#777;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break: break-all; color:#1a73e8; font-size:14px;">
                  {verification_link}
                </p>

                <br>

                <p style="font-size:16px; color:#333;">
                  Best regards,<br>
                  <strong>The Team</strong>
                </p>

              </td>
            </tr>

          </table>
          <!-- End Card -->

        </td>
      </tr>
    </table>
  </body>
</html>
"""


        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        msg.attach(part1)
        msg.attach(part2)

        # Send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.send_message(msg)

        return {"status": "success", "email": email}

    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3)
def send_login_notification(self, email: str, username: str):
    """Send login notification email (optional)"""
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "New Login to Your Account"
        msg["From"] = settings.FROM_EMAIL
        msg["To"] = email

        # Email body
        text = f"""
        Hi {username},

        We detected a new login to your account.

        If this was you, you can safely ignore this email.
        If you didn't log in, please secure your account immediately.

        Best regards,
        The Team
        """

       html = f"""
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table cellpadding="0" cellspacing="0" width="100%" style="
            max-width: 600px; 
            background: #ffffff; 
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          ">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 20px; background: #d93025;">
                <h2 style="color:#fff; margin:0; font-weight:600;">
                  ⚠ New Login Detected
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px;">

                <h3 style="color:#333; margin-top:0;">Hi {username},</h3>

                <p style="font-size:16px; color:#555;">
                  We detected a <strong>new login</strong> to your account.
                </p>

                <p style="font-size:16px; color:#555;">
                  If this was you, you can safely ignore this email.
                </p>

                <p style="font-size:16px; color:#d93025; font-weight:bold;">
                  If you didn’t log in, someone else might be accessing your account.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin: 30px 0;">
                  <a href="{secure_link}"
                    style="
                      background:#d93025;
                      color:#ffffff;
                      padding: 12px 24px;
                      border-radius: 6px;
                      text-decoration:none;
                      font-size:16px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Secure Your Account
                  </a>
                </div>

                <p style="font-size:14px; color:#777;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break: break-all; color:#d93025; font-size:14px;">
                  {secure_link}
                </p>

                <br>

                <p style="font-size:16px; color:#333;">
                  Best regards,<br>
                  <strong>The Team</strong>
                </p>

              </td>
            </tr>

          </table>
          <!-- End Card -->

        </td>
      </tr>
    </table>
  </body>
</html>
"""


        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        msg.attach(part1)
        msg.attach(part2)

        # Send email
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
            server.send_message(msg)

        return {"status": "success", "email": email}

    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
