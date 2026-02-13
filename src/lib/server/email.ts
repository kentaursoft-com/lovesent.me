// ===== Email Notifications =====
// Sends cute email notifications via Resend.com when a confession is accepted

interface SendEmailOptions {
	to: string;
	crushName: string;
	title: string;
	slug: string;
	apiKey: string;
}

export async function sendAcceptanceEmail(options: SendEmailOptions): Promise<boolean> {
	const { to, crushName, title, slug, apiKey } = options;

	if (!apiKey || apiKey === 're_placeholder_key') {
		console.log('📧 Email notification skipped (no API key configured)');
		return false;
	}

	const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Poppins', Arial, sans-serif; background: #fce4ec; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15); }
    h1 { color: #ec407a; font-size: 28px; margin-bottom: 8px; }
    .heart-row { font-size: 32px; margin: 16px 0; }
    p { color: #666; font-size: 16px; line-height: 1.6; }
    .highlight { color: #ec407a; font-weight: bold; }
    .btn { display: inline-block; background: linear-gradient(135deg, #ec407a, #ab47bc); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; margin-top: 24px; color: #999; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="heart-row">💖💖💖</div>
      <h1>Love Accepted! 🎉</h1>
      <p>Amazing news, lovebird! 🐦</p>
      <p><span class="highlight">${crushName}</span> said <strong>YES</strong> to your confession:<br/>"<em>${title}</em>" ❤️</p>
      <div class="heart-row">🥰✨🎊</div>
      <p>Your heart just got a whole lot fuller! Head to your dashboard to see the details and share the happy moment.</p>
      <a href="https://lovesent.me/dashboard" class="btn">View Dashboard 💕</a>
      <p style="margin-top: 24px; font-size: 14px; color: #999;">
        Confession page: <a href="https://lovesent.me/confess/${slug}" style="color: #ec407a;">lovesent.me/confess/${slug}</a>
      </p>
    </div>
    <div class="footer">
      <p>Made with 💖 by Love Sent · <a href="https://lovesent.me" style="color: #ec407a;">lovesent.me</a></p>
      <p>You're receiving this because someone used your Love Sent account to send a confession.</p>
    </div>
  </div>
</body>
</html>`;

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: 'Love Sent <love@lovesent.me>',
				to: [to],
				subject: `💖 ${crushName} said YES to "${title}"! 🎉`,
				html
			})
		});

		if (!response.ok) {
			console.error('Email send failed:', await response.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Email error:', err);
		return false;
	}
}
