require 'uglifier'

# Enable for faster dev
# ignore 'posts/*'
# ignore '/assets/fonts/*'

# Configure where assets are stored
config[:css_dir] = 'assets/stylesheets'
config[:js_dir] = 'assets/javascripts'
config[:fonts_dir] = 'assets/fonts'
config[:images_dir] = 'assets/images'
config[:images_extensions] = %w( svg jpg jpeg gif png webp )

# Pull in assets installed from Bower
@bower_config = JSON.parse(IO.read("#{root}/.bowerrc"))
bower_assets_dir = @bower_config["directory"]

activate :sprockets
sprockets.append_path File.join app.root, bower_assets_dir

masks = config[:images_extensions].map { |ext| "#{bower_assets_dir}/**/*.#{ext}" }

# Import all the images from bower assets directory to build/assets/images
Dir[*masks].each do |file_path|
  relative_path = file_path[("#{bower_assets_dir}/".length)..-1] # e.g.: "open-iconic/png/resize-width.png"
  import_file(file_path, "assets/images/#{relative_path}")
end

# Use multilanguage
activate :i18n, :mount_at_root => false, :langs => [:sv, :en, :ar]

# Blog
activate :blog do |blog|
  blog.default_extension = '.md'
  blog.paginate = true
  blog.permalink = "{lang}/{year}/{month}/{title}/index.html"
  blog.sources = "posts/{lang}/{year}-{month}-{day}-{title}.html"
end

# Custom page layouts
page 'posts/*', layout: :article
page "sv/feed.xml", :layout => false
page "en/feed.xml", :layout => false

activate :directory_indexes
activate :syntax

set :markdown, fenced_code_blocks: true, with_toc_data: true
set :markdown_engine, :redcarpet

# Use middleman-livereload
activate :livereload

# Minimize css/js and fix assets for Build
configure :build do
  activate :autoprefixer, :ignore => ['/assets/fonts/*']
  activate :gzip
  activate :minify_css, :ignore => ['/assets/fonts/*', '/assets/stylesheets/fonts/*.css']
  activate :minify_javascript, :inline => true, :ignore => [/serviceworker/]
  activate :minify_html
  #activate :relative_assets <- doesn't work with service worker
  activate :asset_hash, :ignore => [/images/, /fonts/, /serviceworker/]
end


# Helpers
helpers do

  def gravatar_for(email, size=400)
    hash = Digest::MD5.hexdigest(email.chomp.downcase)
    "http://www.gravatar.com/avatar/#{hash}?s=#{size}"
  end

  # Renders a javascript asset inline
  def inline_javascript(name)
    content_tag :script do
      src = sprockets["#{name}.js"].to_s
      Uglifier.compile(src, :output => { :inline_script => true })
    end
  end

  # Renders a SVG asset inline
  def inline_svg(name)
    file_path = "./source/assets/images/#{name}.svg"
    if File.exists?(file_path)
      File.read(file_path)
    end
  end

  # Reads current build timestamp from a file
  def get_build_time()
    File.read("./.build-time").to_s
  end

  # Links to current page in a different language
  def link_to_lang(url, locale)
    current_locale = url[1,2]
    if current_locale == 'en'
      url.sub!("/en", "/#{locale}")
      url.sub!("/work", "/projekt")
      url.sub!("/about", "/om")
      url.sub!("/colleagues", "/kollegor")
      url.sub!("/map", "/karta")
      url.sub!("/blog", "/blogg")
    elsif current_locale == 'sv'
      url.sub!("/sv", "/#{locale}")
      url.sub!("/projekt", "/work")
      url.sub!("/om", "/about")
      url.sub!("/kollegor", "/colleagues")
      url.sub!("/karta", "/map")
      url.sub!("/blogg", "/blog")
    elsif current_locale == 'ar'
      url.sub!("/ar", "/#{locale}")
    end
    url
  end

end
