namespace :core_data_connector do

  namespace :data do
    desc 'Calls the before_create method for each web_identifier record'
    task :reset_web_identifiers => :environment do
      CoreDataConnector::WebIdentifier.all.find_each do |web_identifier|
        service = CoreDataConnector::Authority::Base.create_service(web_identifier.web_authority)
        service.before_create(web_identifier)
        web_identifier.save
      end
    end
  end

  namespace :iiif do
    desc 'Resets IIIF manifests for all records.'
    task :reset_manifests => :environment do
      service = CoreDataConnector::Iiif::Manifest.new
      service.reset_manifests
    end
  end

  namespace :users do
    desc 'Migrates local users to Clerk.'
    task :migrate_to_clerk => :environment do
      service = CoreDataConnector::Users::ClerkMigration.new
      service.run
    end

    desc 'Reset Clerk data'
    task :reset => :environment do
      service = CoreDataConnector::Users::ClerkMigration.new
      service.reset
    end
  end
end
