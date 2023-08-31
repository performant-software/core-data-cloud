namespace :core_data_cloud do

  desc 'Imports sample data.'
  task :import_sample_data => :environment do
    def load_data(filename)
      content = File.read("./test/data/#{filename}.json")
      JSON.parse(content, symbolize_names: true)
    end

    # Remove existing data
    User.where.not(email: 'admin@example.com').destroy_all
    CoreDataConnector::Place.destroy_all

    all_project_ids = Project.all.pluck(:id)

    load_data('users').each do |user_params|
      user = User.create(user_params.merge({ password: 'password', password_confirmation: 'password' }))

      project_count = rand(1..5)
      project_ids = all_project_ids.sample(project_count)

      role_pct = rand(1..100)
      role = role_pct > 70 ? UserProject::ROLE_OWNER : UserProject::ROLE_EDITOR

      project_ids.each do |project_id|
        UserProject.create(project_id: project_id, user_id: user.id, role: role)
      end
    end

    load_data('places').each do |place_name_params|
      CoreDataConnector::Place.create({
        place_names_attributes: [place_name_params.merge({ primary: true })],
        project_item_attributes: { project_id: all_project_ids.sample }
      })
    end
  end
end
