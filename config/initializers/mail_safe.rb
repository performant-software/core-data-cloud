if defined?(MailSafe::Config)
  if ENV['MAILSAFE_ALLOWED_DOMAIN'].present?
    allowed_domain = Regexp.new(Regexp.escape(ENV['MAILSAFE_ALLOWED_DOMAIN']))
    MailSafe::Config.internal_address_definition = allowed_domain
  end
  
  if ENV['MAILSAFE_REDIRECT_ADDRESS'].present?
    MailSafe::Config.replacement_address = ENV['MAILSAFE_REDIRECT_ADDRESS']
  end
end