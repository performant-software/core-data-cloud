if ENV['VITE_AUTH_PROVIDER'] == 'clerk'
  require 'clerk'
end

module CoreDataConnector
  module Users
    class ClerkMigration
      def run
        clerk = Clerk::SDK.new(secret_key: ENV.fetch('CLERK_SECRET_KEY'))

        organization_list_request = Clerk::Models::Operations::ListOrganizationsRequest.new(limit: 200)
        organization_list = clerk.organizations.list(request: organization_list_request)
        sleep 1
        organizations = organization_list.organizations.data

        org_domains = Hash.new

        organizations.each do |org|
          puts "Fetching metadata for organization: #{org.name} (#{org.id})"
          domain_request = Clerk::Models::Operations::ListOrganizationDomainsRequest.new(organization_id: org.id)
          domains = clerk.organization_domains.list(request: domain_request).organization_domains.data
          sleep 1
          next if domains.empty?

          name = domains.first.name
          org_domains[name] = org.id
        end

        User.where(sso_id: nil).find_each do |user|
          begin
            puts "----------------------------------------"
            list_request = Clerk::Models::Operations::GetUserListRequest.new(email_address: [user.email])
            clerk_users = clerk.users.list(request: list_request)
            sleep 1
            clerk_user = clerk_users.user_list.first

            is_new_user = false

            email_domain = user.email.split('@').last

            if clerk_user.nil?
              is_new_user = true
              first_name, last_name = user.split_name

              is_global_admin = email_domain == ENV['CLERK_MIGRATION_GLOBAL_ADMIN_DOMAIN']

              private_metadata = {
                migrated_from: 'FairData'
              }

              if is_global_admin
                private_metadata[:is_global_admin] = true
              end

              create_request = Clerk::Models::Operations::CreateUserRequest.new(
                email_address: [user.email],
                first_name: first_name,
                last_name: last_name,
                skip_password_requirement: true,
                private_metadata: private_metadata
              )

              response = clerk.users.create(request: create_request)
              sleep 1
              clerk_user = response.user
              puts "#{user.email} created in Clerk"
            end

            org_id = org_domains[email_domain]

            if is_new_user
              needs_membership = true
            else
              membership_request = Clerk::Models::Operations::ListOrganizationMembershipsRequest.new(organization_id: org_id)
              memberships = clerk.organization_memberships.list(request: membership_request)
              sleep 1
              needs_membership = !memberships.organization_memberships.data.any? { |m| m.organization.id == org_id }
            end

            if needs_membership
              if org_id
                org_member_request_body = {
                  user_id: clerk_user.id,
                  role: 'org:member'
                }
                clerk.organization_memberships.create(body: org_member_request_body, organization_id: org_id)
                sleep 1
                puts "#{user.email} automatically added to organization based on email domain: #{org_id}"
              else
                puts "#{user.email} needs to be added to an organization. Please select one:"
                organizations.each_with_index do |org, idx|
                  puts "#{idx + 1}. #{org.name} (#{org.id})"
                end

                idx = $stdin.gets.chomp.to_i - 1

                org_member_request_body = {
                  user_id: clerk_user.id,
                  role: 'org:member'
                }
                clerk.organization_memberships.create(body: org_member_request_body, organization_id: organizations[idx].id)
                sleep 1

                puts "#{user.email} added to #{organizations[idx].name}"
              end
            end

            user.update!(sso_id: clerk_user.id)
          rescue Clerk::Models::Errors::ClerkErrors => e
            puts "Clerk API error while migrating #{user.email}: #{e.message}"
            puts e.errors.map { |error| "#{error.code}: #{error.message}" }.join("\n")
          rescue StandardError => e
            puts "Error migrating user #{user.email}: #{e.message}"
          end
        end

        puts "Migration complete! Make sure to set admin permissions to the relevant users on each organization in Clerk."
      end

      def reset
        # This task exists to make development of the run method easier.
        # It will wipe all users from the Clerk instance and remove their SSO ID.

        clerk = Clerk::SDK.new(secret_key: ENV.fetch('CLERK_SECRET_KEY'))

        request = Clerk::Models::Operations::GetUserListRequest.new(
          limit: 200
        )

        users = clerk.users.list(request: request)

        users.user_list.each do |user|
          sleep 2
          clerk.users.delete(user_id: user.id)
          puts "Deleted user #{user.id} with email #{user.email_addresses.first.email_address}"
        end

        User.update_all(sso_id: nil)
        puts "Cleared sso_id for all users"
      end
    end
  end
end