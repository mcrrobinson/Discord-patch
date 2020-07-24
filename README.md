Due to the fact that Discord is written with Electron it it's simply a chromium instance which means that it uses HTML, Javascript and CSS in order to draw elements on the page. This makes it easy to see the behind the scenes by opening the developer view. The bind for this is the same as in Chrome:
```
CRTL + SHIFT + I
```
This will open the developer options including the CSS navigation, API requests and the console suggesting you work for Discord.

# Discord-patch
Patch client for Discord. Used for my bots.

Friend View                |  Server View
:-------------------------:|:-------------------------:
![](images/discordcss.jpg)  |  ![](images/discord2css.jpg)

## Legend
<pre>
--background-primary: blue;
--background-secondary: pink;
--background-secondary-alt: green;
--background-tertiary: yellow;
--background-accent: turquoise;
</pre>

The last one in the legend - the accent,  it affects the TV icon in the servers with Camera's enabled.
