# Configure where assets are stored
config[:css_dir] = 'assets/stylesheets'
config[:js_dir] = 'assets/javascripts'
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
activate :i18n, :mount_at_root => false

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

set :markdown, fenced_code_blocks: true
set :markdown_engine, :redcarpet

# Use middleman-livereload
activate :livereload

# Minimize css/js and fix assets for Build
configure :build do
  activate :autoprefixer
  activate :gzip
  activate :minify_css
  activate :minify_javascript
  activate :minify_html
  activate :relative_assets
  activate :asset_hash, :ignore => [/^images*/]
end
