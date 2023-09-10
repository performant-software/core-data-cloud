# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_09_07_201038) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "core_data_connector_locations", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.string "locateable_type", null: false
    t.bigint "locateable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["locateable_type", "locateable_id"], name: "index_core_data_connector_locations_on_locateable"
    t.index ["place_id"], name: "index_core_data_connector_locations_on_place_id"
  end

  create_table "core_data_connector_place_names", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.string "name"
    t.boolean "primary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_core_data_connector_place_names_on_place_id"
  end

  create_table "core_data_connector_places", force: :cascade do |t|
    t.string "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "core_data_connector_projects", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "core_data_connector_user_projects", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.string "role", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_core_data_connector_user_projects_on_project_id"
    t.index ["user_id"], name: "index_core_data_connector_user_projects_on_user_id"
  end

  create_table "core_data_connector_users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false
  end

end
