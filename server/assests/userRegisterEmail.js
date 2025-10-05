export const userRegisterEmail = (params) => {
  return `<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to CCIE Course</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      color: #333333;
    }
    table {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
      padding: 20px 0;
      background-color: #f5f7fa;
    }
    .email-box {
      width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      padding: 40px 30px 20px 30px;
      text-align: center;
      background-color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #0a2540;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      color: #0a2540;
    }
    .content {
      padding: 16px 24px;
      font-size: 15px;
      line-height: 1.6;
      color: #333333;
    }
    .content ul {
      padding-left: 0;
      list-style: none;
      margin: 10px 0;
    }
    .content li {
      margin-bottom: 6px;
    }
    .content li strong {
      display: inline-block;
      width: 150px;
    }
  </style>
</head>
<body>
  <table class="container">
    <tr>
      <td align="center">
        <table class="email-box">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>User Registered !</h1>
              <p><strong>${params.name}</strong> Registered for the <strong>${params.course_name}</strong> 🎓</p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td class="content">
              <p><strong>Course Details:</strong></p>
            <ul>
                <li> <strong>Email:</strong> ${params.email}</li>
                <li> <strong>Phone:</strong> ${params.contact_number}</li>
                <li><strong>Course:</strong> ${params.course_name}</li>
                <li> <strong>Status:</strong> ${params.message}</li>

              </ul>
            </td>
          </tr>        
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
