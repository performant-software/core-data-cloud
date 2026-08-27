module CoreDataConnector
  module Import
    class Uploader

      attr_accessor :import_id

      def initialize(import_id)
        @import_id = import_id
      end

      def upload
        query = CoreDataConnector::MediaContent
                  .preload(project_model: :project)
                  .where(import_id:)
                  .where.not(import_url: nil)
                  .where.not(import_url_processed: true)

        query.find_each { |m| upload_attachment m }
      end

      def upload_attachment(media_content)
        # Download the file contents from the "import_url" property
        download_response = Http::Request.get(media_content.import_url)
        download_response => { data: }

        # Call the direct upload service to obtain a pre-signed URL
        blob = {
          byte_size: data.bytesize,
          checksum: Digest::MD5.base64digest(data),
          filename: media_content.name,
          metadata: {
            storage_key: media_content.storage_key
          }
        }

        direct_upload_service = TripleEyeEffable::DirectUploads.new
        response = direct_upload_service.direct_upload blob

        # Upload the data to S3 using the pre-signed URL
        url = response['direct_upload']['url']
        headers = response['direct_upload']['headers']
        signed_id = response['signed_id']

        upload_response = Http::Request.put(url, body: data, headers:)
        upload_response => { success: }

        # Save the media_contents record if the upload is successful
        if success
          media_content.content = signed_id
          media_content.import_url_processed = true
          media_content.save
        end
      end
    end
  end
end