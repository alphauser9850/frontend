export const welcomeEmail = () => {
    return `<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to CCIE Course</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; padding:20px 0;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          
          <!-- Hero -->
          <tr>
            <td align="center" style="padding:40px 30px 20px 30px;">
              <h1 style="color:#0a2540; font-size:24px; margin:0;">Welcome to Your CCIE Journey </h1>
              <p style="color:#555555; font-size:16px; margin:10px 0 0 0;">Hi <strong>{{params.name}}</strong>,</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:0 30px 20px 30px; color:#333333; font-size:15px; line-height:1.6;">
              <p>We are excited to welcome you to the <strong>CCIE Enterprise Infrastructure Course</strong> at <strong>CCIE LAB</strong>! 
              You have taken a big step toward mastering advanced networking and building a career that stands out in the industry.</p>

              <p><strong>Course Details:</strong></p>
              <ul style="padding-left:20px; margin:10px 0;">
                 ✅ <strong>Package:</strong> {{ params.package}} <br>
              </ul>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f0f2f5; padding:20px; color:#777777; font-size:13px;">
              <p style="margin:0;">CCIE LAB | https://ccielab.net/</p>
              <p style="margin:5px 0 0 0;">Need help? Email us at <a href="mailto:Support@ccielab.net " style="color:#0a7cff;">Support@ccielab.net</a></p>
            </td>
          </tr>
        </table>
        <!-- End Container -->
      </td>
    </tr>
  </table>
</body>
</html>`;
}