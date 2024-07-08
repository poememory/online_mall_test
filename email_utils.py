# email_utils.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

def send_verification_email(receiver_email, verification_code):
    sender_email = '3269187297@qq.com'
    subject = '邮箱验证码'
    message = f'欢迎使用全员鄂人数码电商平台，您的验证码是：{verification_code}'

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = Header(subject, 'utf-8')
    msg.attach(MIMEText(message, 'plain', 'utf-8'))

    try:
        smtp_server = 'smtp.qq.com'
        smtp_port = 587

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, 'awfuphkxsrdccijh')

        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("邮件发送成功")
        return True

    except smtplib.SMTPException as e:
        print(f"邮件发送失败: {e}")
        return False

    except Exception as e:
        print(f"发生异常: {e}")
        return False
