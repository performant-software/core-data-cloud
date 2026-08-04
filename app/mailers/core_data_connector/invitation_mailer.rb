module CoreDataConnector
  class InvitationMailer < ApplicationMailer
    # Includes
    include PostmarkRails::TemplatedMailerMixin

    def invite_user(user:, password:, project:)
      # Setup template variables
      self.template_model = {
        product_url: ENV['HOSTNAME'],
        product_name: I18n.t('app.name'),
        name: user.name,
        project_name: project&.name,
        password: password,
        action_url: ENV['HOSTNAME'],
        company_name: I18n.t('app.company_name'),
        company_address: I18n.t('app.company_address')
      }

      # Send the email
      mail(
        postmark_template_alias: 'user-invitation',
        to: user.email,
        from: ENV['POSTMARK_FROM']
      )
    end
  end
end