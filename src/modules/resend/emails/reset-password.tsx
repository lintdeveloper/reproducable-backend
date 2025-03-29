import { Html, Head, Body, Container, Text, Link, Section, Button } from '@react-email/components';

interface ResetPasswordEmailProps {
  firstName: string;
  resetLink: string;
}

function CustomerResetPasswordComponent({firstName, resetLink}: ResetPasswordEmailProps) {  
    return (
        <Html>
          <Head />
          <Body style={bodyStyle}>
            <Container style={containerStyle}>
              <Text style={headingStyle}>Hello {firstName},</Text>
              <Text style={paragraphStyle}>
                You recently requested to reset your password for your African Blend account. Click the
                button below to reset it:
              </Text>
              <Section style={buttonContainer}>
                <Button href={resetLink} style={buttonStyle}>
                  Reset Password
                </Button>
              </Section>
              <Text style={paragraphStyle}>
                If you did not request a password reset, please ignore this email or contact support if
                you have questions.
              </Text>
              <Text style={paragraphStyle}>
                The password reset link is only valid for the next 24 hours.
              </Text>
              <Text style={footerStyle}>Best regards,</Text>
              <Text style={footerStyle}>The African Blend Team</Text>
            </Container>
          </Body>
        </Html>
    );
}

export const CustomerResetPasswordEmail = (props: ResetPasswordEmailProps) => (
    <CustomerResetPasswordComponent {...props} />
)

// Styles
const bodyStyle = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f4f4f4',
  margin: 0,
  padding: 0,
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  fontSize: '24px',
  color: '#333333',
  marginBottom: '20px',
};

const paragraphStyle = {
  fontSize: '16px',
  color: '#555555',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '5px',
  textDecoration: 'none',
  fontSize: '16px',
};

const footerStyle = {
  fontSize: '14px',
  color: '#777777',
  marginTop: '20px',
};