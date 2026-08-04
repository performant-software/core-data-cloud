module CoreDataConnector
  class MediaContentsController < ApplicationController
    # Includes
    include Api::Uploadable
    include Http::Requestable
    include ManifestableController
    include MergeableController
    include OwnableController
    include RelatedColumnable
    include TripleEyeEffable::ResourceableController
    include UserDefinedFields::Queryable

    # Search attributes
    search_attributes :name

    # Actions
    before_action :set_content, only: :merge

    protected

    def set_content
      send_request(params[:media_content][:content_url], followlocation: true) do |content|
        tempfile = Tempfile.new
        tempfile.binmode
        tempfile.write(content)
        tempfile.rewind

        file = ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          type: params[:media_content][:content_type],
          filename: params[:media_content][:name]
        )

        params[:media_content][:content] = file
      end
    end
  end
end