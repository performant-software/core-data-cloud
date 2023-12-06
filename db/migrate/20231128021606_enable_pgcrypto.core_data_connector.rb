# This migration comes from core_data_connector (originally 20231128015736)
class EnablePgcrypto < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'pgcrypto'
  end
end
