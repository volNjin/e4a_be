const createUserTemplate = (username, email, password) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Account Information</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: #333;
      background-color: #fff;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      padding: 20px;
      border-radius: 5px;
      line-height: 1.8;
    }

    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .header a {
      font-size: 1.4em;
      color: #000;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      padding: 20px 0;
    }

    .footer {
      color: #aaa;
      font-size: 0.8em;
      line-height: 1;
      font-weight: 300;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .email-info {
      color: #666666;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      padding-top: 6px;
    }

    .email-info a {
      text-decoration: none;
      color: #00bc69;
    }
  </style>
</head>

<body>
  <!--Subject: Welcome to E4A Club - Your Account Information-->
  <div class="container">
    <div class="header">
      <div>Welcome to <b>E4A Club</b></div>
    </div>
    <br />
    <div class="content">
      <strong>Dear ${username},</strong>
      <p>
        Thank you for registering with <b>E4A Club</b>. Below are your account details:
      </p>
      <p>
        <strong>Email:</strong> ${email} <br />
        <strong>Password:</strong> ${password}
      </p>
      <p style="font-size: 0.9em">
        Please keep this information safe and do not share it with anyone. 
        You can now log in to your account and start using our services.
      </p>
      <p style="font-size: 0.9em">
        If you did not register for this account, please disregard this message.
      </p>
      <p>
        Best regards,<br />
        <strong>E4A Club</strong>
      </p>
    </div>
    <div class="footer">
      <p>This email can't receive replies.</p>
    </div>
  </div>
  <div style="text-align: center">
    <div class="email-info">
      <span>
        This email was sent to
        <a href="mailto:${email}">${email}</a>
      </span>
    </div>
  </div>
</body>
</html>`;
};

export default createUserTemplate;
