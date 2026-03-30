interface EmailLinkProps {
  loopMessage?: boolean;
}

export default function EmailLink({ loopMessage = false }: EmailLinkProps) {
  void loopMessage;

  return (
    <div className="contact-email-container">
      <a href="mailto:bonitachen910@gmail.com" className="contact-email-link">
        <span className="contact-email-prefix">bonitachen910</span>
        <span className="contact-email-domain">@gmail.com</span>
      </a>
    </div>
  );
}
