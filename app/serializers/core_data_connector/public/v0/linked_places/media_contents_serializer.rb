module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class MediaContentsSerializer < Base
          annotation_attributes(:id) { |media_content| "#{base_url}/media_contents/#{media_content.uuid}" }
          annotation_attributes(:record_id) { |media_content| media_content.id }
          annotation_attributes(:title) { |media_content| media_content.name }
          annotation_attributes(:type) { 'MediaContent' }
          annotation_attributes :uuid, :content_url, :content_download_url, :content_iiif_url, :content_preview_url,
                                :content_thumbnail_url, :manifest_url, user_defined: UserDefinedSerializer
        end
      end
    end
  end
end