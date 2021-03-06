---
title: "Consistent use of double or single quotes in HTML"
date: 2015-01-26 00:00 UTC
author: per
disable_comments: false
meta_description: "Being consistent when using double or single quotes in HTML will result in smaller file size when gzipping. "
---

I’m a very systematic person who have strong opinions about consistency when writing code. Working with HTML where attributes are set with both double and singles quotes has always bothered me. I’ve always preferred to use double quotes (I don’t think it’s a bold statement to say most of us who writes HTML does).

But apart from being pedantic there’s also a <small><del>small</del> microscopic</small> performance win when being consistent in the use of quotes.
If you’re gzipping your HTML files (and you should) you’ll be serving larger files when you’re inconsistent as this results in lower compression rates. [See this repository for an example](https://github.com/kollegorna/using-quotes-consistent-in-html).

So stop being sloppy (there, I said it!) and lose some weight.
All victories should be honored, no matter the size.

Remember this the next time you copy and paste the code snippet from Google Fonts…

![screenshot from Google Fonts](/images/posts/double-single-quotes-html/google-fonts.png)

*Update 2015-01-26: [This clever pull request](https://github.com/kollegorna/using-quotes-consistent-in-html/pull/1) points out that not using quotes at all shakes off even more weight. Well played sir.*
