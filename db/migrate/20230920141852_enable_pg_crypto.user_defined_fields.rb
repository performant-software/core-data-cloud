# This migration comes from user_defined_fields (originally 20230920110724)
class EnablePgCrypto < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'pgcrypto'
  end
end
