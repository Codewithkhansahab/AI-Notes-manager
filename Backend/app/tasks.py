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
        <html>
          <body>
            <h2>Hi {username},</h2>
            <p>Welcome to our platform! Your account has been successfully created.</p>
            <p>Thank you for joining us!</p>
            <br>
            <p>Best regards,<br>The Team</p>
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
        <html>
          <body>
            <h2>Hi {username},</h2>
            <p>We detected a new login to your account.</p>
            <p>If this was you, you can safely ignore this email.</p>
            <p>If you didn't log in, please secure your account immediately.</p>
            <br>
            <p>Best regards,<br>The Team</p>
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
