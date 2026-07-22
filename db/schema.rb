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

ActiveRecord::Schema[8.1].define(version: 2026_07_21_210536) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "postgis"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "core_data_connector_events", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.uuid "import_id"
    t.string "name"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_event_id"
    t.index ["project_model_id"], name: "index_core_data_connector_events_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_events_on_user_defined", using: :gin
  end

  create_table "core_data_connector_instances", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_instance_id"
    t.index ["project_model_id"], name: "index_core_data_connector_instances_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_instances_on_user_defined", using: :gin
  end

  create_table "core_data_connector_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "faircopy_cloud_id"
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_item_id"
    t.index ["project_model_id"], name: "index_core_data_connector_items_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_items_on_user_defined", using: :gin
  end

  create_table "core_data_connector_jobs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "extra", default: {}
    t.string "job_type"
    t.bigint "project_id", null: false
    t.string "status", default: "initializing"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["project_id"], name: "index_core_data_connector_jobs_on_project_id"
    t.index ["user_id"], name: "index_core_data_connector_jobs_on_user_id"
  end

  create_table "core_data_connector_manifests", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.string "identifier"
    t.integer "item_count", default: 0, null: false
    t.string "label"
    t.bigint "manifestable_id"
    t.string "manifestable_type"
    t.bigint "project_model_relationship_id", null: false
    t.string "thumbnail"
    t.datetime "updated_at", null: false
    t.index ["manifestable_type", "manifestable_id"], name: "index_core_data_connector_manifests_on_manifestable"
    t.index ["project_model_relationship_id"], name: "index_cdc_manifests_on_project_model_relationship_id"
  end

  create_table "core_data_connector_media_contents", force: :cascade do |t|
    t.boolean "content_warning", default: false, null: false
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.string "import_url"
    t.boolean "import_url_processed", default: false, null: false
    t.string "name"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_media_content_id"
    t.index ["project_model_id"], name: "index_core_data_connector_media_contents_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_media_contents_on_user_defined", using: :gin
  end

  create_table "core_data_connector_organization_names", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.bigint "organization_id"
    t.boolean "primary"
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_core_data_connector_organization_names_on_organization_id"
  end

  create_table "core_data_connector_organizations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_organization_id"
    t.index ["project_model_id"], name: "index_core_data_connector_organizations_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_organizations_on_user_defined", using: :gin
  end

  create_table "core_data_connector_people", force: :cascade do |t|
    t.text "biography"
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_person_id"
    t.index ["project_model_id"], name: "index_core_data_connector_people_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_people_on_user_defined", using: :gin
  end

  create_table "core_data_connector_person_names", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "middle_name"
    t.bigint "person_id"
    t.boolean "primary"
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_core_data_connector_person_names_on_person_id"
  end

  create_table "core_data_connector_place_geometries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.geometry "geometry", limit: {srid: 0, type: "geometry"}
    t.bigint "place_id", null: false
    t.jsonb "properties", default: {}
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_core_data_connector_place_geometries_on_place_id"
  end

  create_table "core_data_connector_place_layers", force: :cascade do |t|
    t.string "content"
    t.datetime "created_at", null: false
    t.string "layer_type"
    t.string "name"
    t.bigint "place_id"
    t.datetime "updated_at", null: false
    t.string "url"
    t.index ["place_id"], name: "index_core_data_connector_place_layers_on_place_id"
  end

  create_table "core_data_connector_place_names", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.bigint "place_id", null: false
    t.boolean "primary"
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_core_data_connector_place_names_on_place_id"
  end

  create_table "core_data_connector_places", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_place_id"
    t.index ["project_model_id"], name: "index_core_data_connector_places_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_places_on_user_defined", using: :gin
  end

  create_table "core_data_connector_project_model_accesses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "project_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_cdc_project_model_accesses_on_project_id"
    t.index ["project_model_id"], name: "index_cdc_project_model_accesses_on_project_model_id"
  end

  create_table "core_data_connector_project_model_relationships", force: :cascade do |t|
    t.boolean "allow_inverse", default: false, null: false
    t.datetime "created_at", null: false
    t.boolean "inverse_multiple", default: false
    t.string "inverse_name"
    t.boolean "multiple"
    t.string "name"
    t.integer "order", default: 0, null: false
    t.bigint "primary_model_id", null: false
    t.bigint "related_model_id", null: false
    t.string "slug"
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["primary_model_id"], name: "index_cdc_project_model_relationships_on_primary_model_id"
    t.index ["related_model_id"], name: "index_cdc_project_model_relationships_on_related_model_id"
  end

  create_table "core_data_connector_project_model_shares", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "project_model_access_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.index ["project_model_access_id"], name: "index_cdc_project_model_shares_on_project_model_access_id"
    t.index ["project_model_id"], name: "index_cdc_project_model_shares_on_project_model_id"
  end

  create_table "core_data_connector_project_models", force: :cascade do |t|
    t.boolean "allow_identifiers", default: false
    t.datetime "created_at", null: false
    t.string "model_class"
    t.string "name"
    t.integer "order", default: 0, null: false
    t.bigint "project_id"
    t.string "slug"
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["project_id"], name: "index_core_data_connector_project_models_on_project_id"
  end

  create_table "core_data_connector_projects", force: :cascade do |t|
    t.boolean "archived", default: false, null: false
    t.datetime "created_at", null: false
    t.string "description"
    t.boolean "discoverable", default: false, null: false
    t.integer "faircopy_cloud_project_id"
    t.integer "faircopy_cloud_project_model_id"
    t.string "faircopy_cloud_url"
    t.string "map_library_url"
    t.string "name"
    t.jsonb "reconciliation_credentials", default: {}
    t.datetime "updated_at", null: false
    t.boolean "use_storage_key", default: true, null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
  end

  create_table "core_data_connector_record_merges", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "mergeable_id"
    t.string "mergeable_type"
    t.string "merged_name"
    t.string "merged_uuid"
    t.datetime "updated_at", null: false
    t.index ["mergeable_type", "mergeable_id"], name: "index_core_data_connector_record_merges_on_mergeable"
  end

  create_table "core_data_connector_relationships", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.integer "order"
    t.bigint "primary_record_id"
    t.string "primary_record_type"
    t.bigint "project_model_relationship_id"
    t.bigint "related_record_id"
    t.string "related_record_type"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_relationship_id"
    t.index ["primary_record_id", "related_record_id", "related_record_type", "primary_record_type"], name: "index_relationships_record_ids_and_types"
    t.index ["primary_record_type", "primary_record_id"], name: "index_core_data_connector_relationships_on_primary_record"
    t.index ["project_model_relationship_id"], name: "index_cdc_relationships_on_project_model_relationship_id"
    t.index ["related_record_type", "related_record_id"], name: "index_core_data_connector_relationships_on_related_record"
    t.index ["user_defined"], name: "index_core_data_connector_relationships_on_user_defined", using: :gin
  end

  create_table "core_data_connector_source_names", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.bigint "nameable_id"
    t.string "nameable_type"
    t.boolean "primary", default: false, null: false
    t.datetime "updated_at", null: false
    t.index ["nameable_type", "nameable_id"], name: "index_core_data_connector_source_names_on_nameable"
  end

  create_table "core_data_connector_taxonomies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.string "name"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_taxonomy_id"
    t.index ["project_model_id"], name: "index_core_data_connector_taxonomies_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_taxonomies_on_user_defined", using: :gin
  end

  create_table "core_data_connector_user_projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "project_id", null: false
    t.string "role", default: "editor", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["project_id"], name: "index_core_data_connector_user_projects_on_project_id"
    t.index ["user_id"], name: "index_core_data_connector_user_projects_on_user_id"
  end

  create_table "core_data_connector_users", force: :cascade do |t|
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.string "email"
    t.datetime "last_invited_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "name"
    t.string "password_digest"
    t.boolean "require_password_change", default: false, null: false
    t.string "role"
    t.string "sso_id"
    t.datetime "updated_at", null: false
    t.index ["sso_id"], name: "index_core_data_connector_users_on_sso_id", unique: true
  end

  create_table "core_data_connector_versions", force: :cascade do |t|
    t.datetime "created_at"
    t.string "event", null: false
    t.bigint "item_id", null: false
    t.string "item_type", null: false
    t.jsonb "meta"
    t.jsonb "object"
    t.jsonb "object_changes"
    t.string "request_uuid"
    t.bigint "root_id"
    t.string "root_type"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "whodunnit"
    t.index ["item_type", "item_id"], name: "index_core_data_connector_versions_on_item_type_and_item_id"
    t.index ["request_uuid"], name: "index_core_data_connector_versions_on_request_uuid"
    t.index ["root_type", "root_id"], name: "index_core_data_connector_versions_on_root_type_and_root_id"
    t.index ["whodunnit"], name: "index_core_data_connector_versions_on_whodunnit"
  end

  create_table "core_data_connector_web_authorities", force: :cascade do |t|
    t.jsonb "access"
    t.datetime "created_at", null: false
    t.bigint "project_id"
    t.string "source_type"
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_core_data_connector_web_authorities_on_project_id"
  end

  create_table "core_data_connector_web_identifiers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "extra"
    t.bigint "identifiable_id"
    t.string "identifiable_type"
    t.string "identifier"
    t.datetime "updated_at", null: false
    t.bigint "web_authority_id"
    t.integer "z_web_identifier_id"
    t.index ["identifiable_type", "identifiable_id"], name: "index_core_data_connector_web_identifiers_on_identifiable"
    t.index ["web_authority_id"], name: "index_core_data_connector_web_identifiers_on_web_authority_id"
  end

  create_table "core_data_connector_works", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "import_id"
    t.bigint "project_model_id"
    t.datetime "updated_at", null: false
    t.jsonb "user_defined", default: {}
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "z_work_id"
    t.index ["project_model_id"], name: "index_core_data_connector_works_on_project_model_id"
    t.index ["user_defined"], name: "index_core_data_connector_works_on_user_defined", using: :gin
  end

  create_table "fuzzy_dates_fuzzy_dates", force: :cascade do |t|
    t.integer "accuracy"
    t.string "attribute_name"
    t.datetime "created_at", null: false
    t.bigint "dateable_id", null: false
    t.string "dateable_type", null: false
    t.text "description"
    t.date "end_date"
    t.boolean "range"
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["dateable_id", "dateable_type", "attribute_name"], name: "index_fuzzy_dates_dateable_id_dateable_type_attribute_name"
    t.index ["dateable_type", "dateable_id"], name: "index_fuzzy_dates_fuzzy_dates_on_dateable"
  end

  create_table "triple_eye_effable_resource_descriptions", force: :cascade do |t|
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "resource_id"
    t.bigint "resourceable_id", null: false
    t.string "resourceable_type", null: false
    t.datetime "updated_at", null: false
    t.index ["resourceable_type", "resourceable_id"], name: "index_resource_description_on_resourceable"
  end

  create_table "user_defined_fields_user_defined_fields", force: :cascade do |t|
    t.boolean "allow_multiple"
    t.string "column_name"
    t.datetime "created_at", null: false
    t.string "data_type"
    t.bigint "defineable_id"
    t.string "defineable_type"
    t.text "options", default: [], array: true
    t.integer "order", default: 0, null: false
    t.boolean "required"
    t.boolean "searchable", default: false, null: false
    t.string "table_name"
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["defineable_type", "defineable_id"], name: "index_user_defined_fields_on_defineable"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
end
