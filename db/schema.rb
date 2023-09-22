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

ActiveRecord::Schema[7.0].define(version: 2023_09_20_153659) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
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

  create_table "core_data_connector_organization_names", force: :cascade do |t|
    t.bigint "organization_id"
    t.string "name"
    t.boolean "primary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_core_data_connector_organization_names_on_organization_id"
  end

  create_table "core_data_connector_organizations", force: :cascade do |t|
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_model_id"
    t.jsonb "user_defined", default: {}
    t.index ["project_model_id"], name: "index_core_data_connector_organizations_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_organizations_on_user_defined", using: :gin
  end

  create_table "core_data_connector_people", force: :cascade do |t|
    t.text "biography"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_model_id"
    t.jsonb "user_defined", default: {}
    t.index ["project_model_id"], name: "index_core_data_connector_people_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_people_on_user_defined", using: :gin
  end

  create_table "core_data_connector_person_names", force: :cascade do |t|
    t.bigint "person_id"
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.boolean "primary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_core_data_connector_person_names_on_person_id"
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
    t.bigint "project_model_id"
    t.jsonb "user_defined", default: {}
    t.index ["project_model_id"], name: "index_core_data_connector_places_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_places_on_user_defined", using: :gin
  end

  create_table "core_data_connector_project_model_relationships", force: :cascade do |t|
    t.bigint "primary_model_id", null: false
    t.bigint "related_model_id", null: false
    t.string "name"
    t.boolean "multiple"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["primary_model_id"], name: "index_cdc_project_model_relationships_on_primary_model_id"
    t.index ["related_model_id"], name: "index_cdc_project_model_relationships_on_related_model_id"
  end

  create_table "core_data_connector_project_models", force: :cascade do |t|
    t.bigint "project_id"
    t.string "name"
    t.string "model_class"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["project_id"], name: "index_core_data_connector_project_models_on_project_id"
  end

  create_table "core_data_connector_projects", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "core_data_connector_relationships", force: :cascade do |t|
    t.bigint "project_model_relationship_id"
    t.string "primary_record_type"
    t.bigint "primary_record_id"
    t.string "related_record_type"
    t.bigint "related_record_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.index ["primary_record_type", "primary_record_id"], name: "index_core_data_connector_relationships_on_primary_record"
    t.index ["project_model_relationship_id"], name: "index_cdc_relationships_on_project_model_relationship_id"
    t.index ["related_record_type", "related_record_id"], name: "index_core_data_connector_relationships_on_related_record"
    t.index ["user_defined"], name: "index_core_data_connector_relationships_on_user_defined", using: :gin
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

  create_table "user_defined_fields_user_defined_fields", force: :cascade do |t|
    t.string "defineable_type"
    t.bigint "defineable_id"
    t.string "table_name"
    t.string "column_name"
    t.string "data_type"
    t.boolean "required"
    t.boolean "allow_multiple"
    t.text "options", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "searchable", default: false, null: false
    t.integer "order", default: 0, null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["defineable_type", "defineable_id"], name: "index_user_defined_fields_on_defineable"
  end

end
