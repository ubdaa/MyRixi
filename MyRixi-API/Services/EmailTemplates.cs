namespace MyRixiApi.Services;

public static class EmailTemplates
{
    public static string GetEmailConfirmationTemplate(string username, string confirmationLink)
    {
        return $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Confirmation de votre compte MyRixi</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .container {{
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    padding: 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }}
                .logo {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .button {{
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .footer {{
                    font-size: 12px;
                    color: #777;
                    margin-top: 30px;
                    text-align: center;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='logo'>
                    <h1>MyRixi</h1>
                </div>
                <p>Bonjour {username},</p>
                <p>Merci de vous être inscrit sur MyRixi ! Pour finaliser votre inscription, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :</p>
                <p style='text-align: center;'>
                    <a href='{confirmationLink}' class='button'>Confirmer mon adresse e-mail</a>
                </p>
                <p>Si le bouton ne fonctionne pas, vous pouvez aussi copier et coller le lien suivant dans votre navigateur :</p>
                <p>{confirmationLink}</p>
                <p>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet e-mail.</p>
                <p>Cordialement,<br>L'équipe MyRixi</p>
                <div class='footer'>
                    <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>";
    }
}