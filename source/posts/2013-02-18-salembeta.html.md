---

disable_comments: false
title: "Kampanjsajt för spelet Salem"
summary: '<a href="http://beta.salemthegame.com/">Salem Beta</a> är en kampanjsajt för den pågående betatestningen av spelet <a href="http://www.salemthegame.com/">Salem</a> som vi har byggt åt <a href="http://www.paradoxplaza.com/">Paradox Interactive</a>.'
date: 2013-02-18 00:00:00 UTC
author: per
meta_title: "Kampanjsajt för spelet Salem"
description: "Salem Beta är en kampanjsajt för den pågående betatestningen av spelet Salem som vi har byggt åt Paradox Interactive."
image: /images/posts/2013/02/salembeta.jpg
image_alt: "Screenshot från kampanjsajten Salem Beta"
lang: sv
---

<p><a href="http://beta.salemthegame.com/">Salem Beta</a> är en kampanjsajt för den pågående betatestningen av spelet <a href="http://www.salemthegame.com/">Salem</a> som vi har byggt åt <a href="http://www.paradoxplaza.com/">Paradox Interactive</a>.</p>

<p>För att få vara med och provköra spelet behöver man en kod. Sajten delar ut 200 stycken nya koder var 12:e timme (kl 13 och 01 svensk tid). När klockan är slagen visas antalet koder som finns kvar i det aktuella släppet och en "Sign up"-knapp som leder till ett formulär där man får fylla i sina uppgifter. När man har bekräftat sin e-postadress så får man koden direkt.</p>

<figure>
  <img src="/images/posts/2013/02/salembeta-invites-remaining.jpg" alt="Utskick av invite-koder">
</figure>

<p>Antalet kvarvarande koder räknar ned i realtid och när den sista koden har gått åt försvinner knappen automatiskt och ersätts av en klocka som räknar ned till nästa släpp. När klockan räknat ned till noll visas "Sign up"-knappen och återstående koder igen. Cykeln nedräkning -> släpp -> nedräkning går alltså helt automatiskt varv efter varv i webbläsaren.</p>

<p>Tekniken bakom kulisserna är Ruby on Rails, Web Sockets via <a href="http://pusher.com/">Pusher</a>, Redis och PostgreSQL.</p>
