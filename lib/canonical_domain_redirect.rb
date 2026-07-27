class CanonicalDomainRedirect

  def initialize(app)
    @app = app
    @primary_domain = ENV['PRIMARY_DOMAIN'].presence
  end

  def call(env)
    request = Rack::Request.new(env)
    return @app.call(env) unless redirect?(request)

    location = "#{request.scheme}://#{@primary_domain}#{request.fullpath}"

    # Use 308 for POST/PUT/etc requests to preserve body data
    status = request.get? || request.head? ? 301 : 308

    [status, { 'Location' => location, 'Content-Type' => 'text/html', 'Cache-Control' => 'no-cache' }, []]
  end

  private

  def redirect?(request)
    return false if @primary_domain.nil?

    host = request.host
    host.present? && host.downcase != @primary_domain.split(':').first
  end
end