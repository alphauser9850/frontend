export const paymentSuccessEmail = () => {
  return `
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to CCIE LAB</title>
  </head>
  <body style="margin:0; padding:0; font-family:'Segoe UI', Arial, sans-serif; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f6f8; padding:40px 0;">
      <tr>
        <td align="center">
          <!-- Container -->
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#0a2540; padding:25px 20px;">
                <h2 style="color:#ffffff; font-size:22px; margin:0;">Payment Successful</h2>
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td align="center" style="padding:40px 30px 10px 30px;">
                <h1 style="color:#0a2540; font-size:24px; margin:0; font-weight:700;">Welcome to Your CCIE Journey</h1>
                <p style="color:#555555; font-size:16px; margin:10px 0 0 0;">Hi <strong>{{params.name}}</strong>,</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:10px 30px 30px 30px; color:#333333; font-size:15px; line-height:1.7;">
                <p>Thank you for your payment! We’re thrilled to have you enrolled in the <strong>CCIE Enterprise Infrastructure Course</strong> at <strong>CCIE LAB</strong>! 
                You’ve taken a big step toward mastering advanced networking and elevating your career.</p>

                <div style="margin:25px 0;">
                  <h3 style="color:#0a2540; font-size:18px; margin-bottom:10px;">Enrollment Details:</h3>
                  <table cellpadding="0" cellspacing="0" style="width:100%; background:#f9fafb; border-radius:8px; padding:15px;">
                   <tr>
                      <td style="padding:8px 0;">✅ <strong>Transaction ID:</strong> {{ params.payment_id }}</td>
                    </tr>
                  <tr>
                      <td style="padding:8px 0;">✅ <strong>Course Name:</strong> {{ params.package }}</td>
                    </tr>
                     <tr>
                      <td style="padding:8px 0;">✅ <strong>Course Plan:</strong> {{ params.package_plan }}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">✅ <strong>Duration:</strong> {{ params.duration }}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">✅ <strong>Amount Paid:</strong> $ {{ params.amount }}</td>
                    </tr>
                  </table>
                </div>

               <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:20px;">
              <a href="https://ccielab.net/welcome-onboard" 
                 style="background:#0a7cff; color:#ffffff; padding:12px 30px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">
                Access Course Portal
              </a>
            </td>
          </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f0f2f5; padding:25px 20px; color:#777777; font-size:13px; border-top:1px solid #e2e6ea;">
                <p style="margin:0;">© ${new Date().getFullYear()} CCIE LAB — <a href="https://ccielab.net" style="color:#0a7cff; text-decoration:none;">ccielab.net</a></p>
                <p style="margin:6px 0 0 0;">Need help? Email us at 
                  <a href="mailto:Support@ccielab.net" style="color:#0a7cff; text-decoration:none;">Support@ccielab.net</a>
                </p>
              </td>
            </tr>
          </table>
          <!-- End Container -->
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
