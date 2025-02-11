
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator


# send email user login

def get_email_login_content(user):
    # we notice a login to your account @username
    email_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login</title>
    </head>
    <body>
        <h1>Login</h1>
        <p>Hello {user.first_name},</p>
        <p>We notice a login to your account.</p>
        <p>If it was you, you can ignore this email.</p>
        
    </body>
    </html>
    """
    return email_content

def send_email_login(user):
    msg = get_email_login_content(user)
    _send_email_login(msg, user.email)
    return user
def _send_email_login(msg, recipient_email):
    """
    Send an email.

    Args:
        msg (str): The email message (HTML content).
        recipient_email (str): The recipient's email address.
    """
    subject = "Login"
    send_mail(
        subject,
        strip_tags(msg), 
        settings.DEFAULT_FROM_EMAIL,  
        [recipient_email], 
        html_message=msg,  
    )
# send_email_verified function
def get_email_verificated_content(inactive_user):
    email_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Verified</title>
    </head>
    <body>
        <h1>Email Verified</h1>
        <p>Hello {inactive_user.first_name},</p>
        <p>Your email has been verified successfully.</p>
        <p>You can now log in to your account.</p>
    </body>
    </html>
    """
    return email_content

def send_email_verified(inactive_user):
    msg = get_email_verificated_content(inactive_user)
    _send_email_verified(msg, inactive_user.email)
    return inactive_user


def _send_email_verified(msg, recipient_email):
    """
    Send an email.

    Args:
        msg (str): The email message (HTML content).
        recipient_email (str): The recipient's email address.
    """
    subject = "Email Verified"
    send_mail(
        subject,
        strip_tags(msg), 
        settings.DEFAULT_FROM_EMAIL,  
        [recipient_email], 
        html_message=msg,  
    )
# send_email_verification_link function
def get_email_content(verification_url, inactive_user):
    """
    Generate the email content as an HTML string.

    Args:
        verification_url (str): The verification URL.
        inactive_user (User): The user to send the email to.

    Returns:
        str: The email content as an HTML string.
    """
    email_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Verification</title>
    </head>
    <body>
        <h1>Verify Your Email Address</h1>
        <p>Hello {inactive_user.first_name},</p>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <p><a href="{verification_url}">Verify Email</a></p>
        <p>If you did not create an account, please ignore this email.</p>
    </body>
    </html>
    """
    return email_content

def _send_email(msg, recipient_email):
    """
    Send an email.

    Args:
        msg (str): The email message (HTML content).
        recipient_email (str): The recipient's email address.
    """
    subject = "Verify Your Email Address"
    send_mail(
        subject,
        strip_tags(msg),  # Plain text version of the email
        settings.DEFAULT_FROM_EMAIL,  # From email (from settings)
        [recipient_email],  # Recipient email (as a list)
        html_message=msg,  # HTML version of the email
    )

"""
    This file contains utility functions for the authentication app.
    send_email_verification_link: Sends an email to the user with a verification link.
"""

token_generator = PasswordResetTokenGenerator()

def generate_verification_url(user, request=None):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    email_verification_url = settings.EMAIL_VERIFICATION_URL
    return f"{email_verification_url}/{uid}/{token}/"

def send_email_verification_link(inactive_user, request):
    """
    Send an email to the user with a verification link.

    Args:
        inactive_user (User): The user to send the email to.
        request (Request): The request object.

    Returns:
        User: The user that the email was sent to.
    """
    verification_url = generate_verification_url(inactive_user, request=request)
    msg = get_email_content(verification_url, inactive_user)
    _send_email(msg, inactive_user.email)
    return inactive_user