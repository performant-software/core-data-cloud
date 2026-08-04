module CoreDataConnector
  class MapLibrary
    include Http::Requestable

    def initialize(map_library_url)
      @map_library_url = map_library_url
    end

    def fetch_library
      params = {}
      send_request(@map_library_url, method: :get, params: params) do |body|
        JSON.parse(body)
      end
    end
  end
end
