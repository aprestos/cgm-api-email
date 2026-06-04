import { Section, Text } from 'react-email';

import { CtaButton } from '../components/cta-button';
import { EmailLayout } from '../components/email-layout';
import { styles } from '../components/email-theme';
import { InfoRow } from '../components/info-row';

interface TeamInvitationEmailProps {
  recipientName?: string;
  invitedBy?: string;
  teamName?: string;
  role?: string;
  expiresAt?: string;
  invitationUrl?: string;
}

export const TeamInvitationEmail = ({
  recipientName = 'Alex Johnson',
  invitedBy = 'Taylor Smith',
  teamName = 'City Events Ops',
  role = 'Manager',
  expiresAt = 'June 1, 2026',
  invitationUrl = 'https://example.com/invitations/accept/xyz',
}: TeamInvitationEmailProps) => (
  <EmailLayout
    preview={`You were invited to ${teamName}`}
    title="Team invitation"
    subtitle={`${invitedBy} invited you to join ${teamName} and collaborate with the team.`}
    brandName="City Events"
    logoPlaceholderText="CE"
    footerText="If you were not expecting this invitation, you can safely ignore this email."
  >
    <Section style={styles.section}>
      <Text style={styles.sectionTitle}>Invitation details</Text>
      <InfoRow label="Recipient" value={recipientName} />
      <InfoRow label="Invited by" value={invitedBy} />
      <InfoRow label="Team" value={teamName} />
      <InfoRow label="Role" value={role} />
      <InfoRow label="Expires" value={expiresAt} />
      <CtaButton href={invitationUrl} label="Accept invitation" />
    </Section>
  </EmailLayout>
);

TeamInvitationEmail.PreviewProps = {
  recipientName: 'Alex Johnson',
  invitedBy: 'Taylor Smith',
  teamName: 'City Events Ops',
  role: 'Manager',
  expiresAt: 'June 1, 2026',
  invitationUrl: 'https://example.com/invitations/accept/xyz',
} as TeamInvitationEmailProps;

export default TeamInvitationEmail;

