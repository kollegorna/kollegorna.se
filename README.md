This is the F/W redesign of [our website](https://www.kollegorna.se).

## Local setup

1. Make sure you have [the same Ruby version installed as the repo](https://github.com/kollegorna/kollegorna.se/blob/master/.ruby-version).
2. Install [Bundler](https://rubygems.org/gems/bundler) and [Node.js](http://nodejs.org).
3. Clone repository
4. ``$ npm install && gulp install``

## Deployment

The master branch is automatically deployed to S3 with Codeship.

[Codeship project](https://app.codeship.com/projects/186828)

[S3 bucket](http://www.kollegorna.se.s3-website-eu-west-1.amazonaws.com/)

## Gulp commands

	$ gulp install

Runs bundle install and bower install.

	$ gulp serve

Builds Middleman and create a BrowserSync server that watches all changes.

	$ gulp build

Builds Middleman.

## Writing posts

    $ middleman article NAME

Will generate a file in source/posts.
