This is [our website](https://www.kollegorna.se).

## Local setup

1. Make sure you have [the same Ruby version installed as the repo](https://github.com/kollegorna/kollegorna.se/blob/master/.ruby-version).
2. Install [Bundler](https://rubygems.org/gems/bundler) and [Node.js](http://nodejs.org).
3. Clone repository
4. ``$ npm install && gulp install``

## Deployment

The master branch is automatically deployed to our VPS on Digital Ocean with Codeship.

## Gulp commands

	$ gulp install

Runs bundle install, bower install and bower update.

    $ gulp middleman

Runs bundle exec middleman.

	$ gulp serve

Builds Middleman and create a BrowserSync server that watches all changes.

	$ gulp build

Builds Middleman.

## Writing posts

    $ bundle exec middleman article NAME

Will generate a file in source/posts.

## Managing Service Worker

Service Worker file is located `/source/serviceworker.js.erb`. Worker's version number is updated via Gulp. When making a build it writes current timestamp into `/.build-time` file whose value is then used in serviceworker.js.erb file. When making changes for the website make sure the changes are synced with the worker's file.
