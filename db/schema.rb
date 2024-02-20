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

ActiveRecord::Schema[7.0].define(version: 2024_02_15_130018) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "core_data_connector_instances", force: :cascade do |t|
    t.bigint "project_model_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.integer "z_instance_id"
    t.index ["project_model_id"], name: "index_core_data_connector_instances_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_instances_on_user_defined", using: :gin
  end

  create_table "core_data_connector_items", force: :cascade do |t|
    t.bigint "project_model_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.integer "z_item_id"
    t.index ["project_model_id"], name: "index_core_data_connector_items_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_items_on_user_defined", using: :gin
  end

  create_table "core_data_connector_manifests", force: :cascade do |t|
    t.string "manifestable_type"
    t.bigint "manifestable_id"
    t.bigint "project_model_relationship_id", null: false
    t.string "identifier"
    t.string "label"
    t.string "thumbnail"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["manifestable_type", "manifestable_id"], name: "index_core_data_connector_manifests_on_manifestable"
    t.index ["project_model_relationship_id"], name: "index_cdc_manifests_on_project_model_relationship_id"
  end

  create_table "core_data_connector_media_contents", force: :cascade do |t|
    t.bigint "project_model_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["project_model_id"], name: "index_core_data_connector_media_contents_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_media_contents_on_user_defined", using: :gin
  end

  create_table "core_data_connector_names", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "z_source_id"
    t.string "z_source_type"
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
    t.integer "z_organization_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["project_model_id"], name: "index_core_data_connector_organizations_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_organizations_on_user_defined", using: :gin
  end

  create_table "core_data_connector_people", force: :cascade do |t|
    t.text "biography"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_model_id"
    t.jsonb "user_defined", default: {}
    t.integer "z_person_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
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

  create_table "core_data_connector_place_geometries", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.geometry "geometry", limit: {:srid=>0, :type=>"geometry"}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_core_data_connector_place_geometries_on_place_id"
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_model_id"
    t.jsonb "user_defined", default: {}
    t.integer "z_place_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["project_model_id"], name: "index_core_data_connector_places_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_places_on_user_defined", using: :gin
  end

  create_table "core_data_connector_project_model_accesses", force: :cascade do |t|
    t.bigint "project_model_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_cdc_project_model_accesses_on_project_id"
    t.index ["project_model_id"], name: "index_cdc_project_model_accesses_on_project_model_id"
  end

  create_table "core_data_connector_project_model_relationships", force: :cascade do |t|
    t.bigint "primary_model_id", null: false
    t.bigint "related_model_id", null: false
    t.string "name"
    t.boolean "multiple"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.boolean "allow_inverse", default: false, null: false
    t.string "inverse_name"
    t.boolean "inverse_multiple", default: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["primary_model_id"], name: "index_cdc_project_model_relationships_on_primary_model_id"
    t.index ["related_model_id"], name: "index_cdc_project_model_relationships_on_related_model_id"
  end

  create_table "core_data_connector_project_model_shares", force: :cascade do |t|
    t.bigint "project_model_access_id"
    t.bigint "project_model_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_model_access_id"], name: "index_cdc_project_model_shares_on_project_model_access_id"
    t.index ["project_model_id"], name: "index_cdc_project_model_shares_on_project_model_id"
  end

  create_table "core_data_connector_project_models", force: :cascade do |t|
    t.bigint "project_id"
    t.string "name"
    t.string "model_class"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.boolean "allow_identifiers", default: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["project_id"], name: "index_core_data_connector_project_models_on_project_id"
  end

  create_table "core_data_connector_projects", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "discoverable", default: false, null: false
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
    t.integer "z_relationship_id"
    t.index ["primary_record_type", "primary_record_id"], name: "index_core_data_connector_relationships_on_primary_record"
    t.index ["project_model_relationship_id"], name: "index_cdc_relationships_on_project_model_relationship_id"
    t.index ["related_record_type", "related_record_id"], name: "index_core_data_connector_relationships_on_related_record"
    t.index ["user_defined"], name: "index_core_data_connector_relationships_on_user_defined", using: :gin
  end

  create_table "core_data_connector_source_titles", force: :cascade do |t|
    t.string "nameable_type"
    t.bigint "nameable_id"
    t.bigint "name_id"
    t.boolean "primary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name_id"], name: "index_core_data_connector_source_titles_on_name_id"
    t.index ["nameable_type", "nameable_id"], name: "index_core_data_connector_source_titles_on_nameable"
  end

  create_table "core_data_connector_taxonomies", force: :cascade do |t|
    t.bigint "project_model_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_taxonomy_id"
    t.index ["project_model_id"], name: "index_core_data_connector_taxonomies_on_project_model_id"
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

  create_table "core_data_connector_web_authorities", force: :cascade do |t|
    t.bigint "project_id"
    t.string "source_type"
    t.jsonb "access"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_core_data_connector_web_authorities_on_project_id"
  end

  create_table "core_data_connector_web_identifiers", force: :cascade do |t|
    t.bigint "web_authority_id"
    t.string "identifiable_type"
    t.bigint "identifiable_id"
    t.string "identifier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "extra"
    t.index ["identifiable_type", "identifiable_id"], name: "index_core_data_connector_web_identifiers_on_identifiable"
    t.index ["web_authority_id"], name: "index_core_data_connector_web_identifiers_on_web_authority_id"
  end

  create_table "core_data_connector_works", force: :cascade do |t|
    t.bigint "project_model_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.integer "z_work_id"
    t.index ["project_model_id"], name: "index_core_data_connector_works_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_works_on_user_defined", using: :gin
  end

  create_table "triple_eye_effable_resource_descriptions", force: :cascade do |t|
    t.string "resourceable_type", null: false
    t.bigint "resourceable_id", null: false
    t.string "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resourceable_type", "resourceable_id"], name: "index_resource_description_on_resourceable"
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
