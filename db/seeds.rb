# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
CoreDataConnector::User.create!(name: 'Administrator', email: 'admin@example.com', password: 'Changeme1!!', password_confirmation: 'Changeme1!!', role: CoreDataConnector::User::ROLE_ADMIN)
