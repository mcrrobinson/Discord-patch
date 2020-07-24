# Discord-patch
## Introduction
Patch client for Discord. Used for my bots. Due to the fact that Discord is written with Electron it it's simply a chromium instance which means that it uses HTML, Javascript and CSS in order to draw elements on the page. This makes it easy to see the behind the scenes by opening the developer view. The bind for this is the same as in Chrome:
```
CRTL + SHIFT + I
```
This will open the developer options including the CSS navigation, API requests and the console suggesting you work for Discord. The bind is the same accross; Linux, MacOS and Windows.

## Reverse Engineering Discord
### How to unpack
Copy the contents from the desktop core folder to the current directory then extract the contents using asar into a folder called "src".
```
cp ~/.config/discord/0.0.10/modules/discord_desktop_core/core.asar .
asar extract core.asar src
```

### How to repack and load
Pack the source folder into a asar file.
```
asar pack src core.asar
```

Make a backup of the file in case your changes break the application.
```
cp ~/.config/discord/0.0.10/modules/discord_desktop_core/core.asar ~/.config/discord/0.0.10/modules/discord_desktop_core/core_backup.asar
```
Finally copy the edited discord application to the directory containing it.
```
cp core.asar ~/.config/discord/0.0.10/modules/discord_desktop_core
```

## CSS Main Elements
### Views

Friend View                |  Server View
:-------------------------:|:-------------------------:
![](images/discordcss.jpg)  |  ![](images/discord2css.jpg)

### Legend
<pre>
--background-primary: blue;
--background-secondary: pink;
--background-secondary-alt: green;
--background-tertiary: yellow;
--background-accent: turquoise;
</pre>

The last one in the legend - the accent,  it affects the TV icon in the servers with Camera's enabled.

## API
#### API Request
https://discordapp.com/api/v6/channels/channel_id/messages

#### Payload
<pre>
{
    "content":"Text sent to the text channel","nonce":"XXXXXXXXXXXXXXXXXX","tts":false
}
</pre>

#### API Response
<pre>
{
    "id": "XXXXXXXXXXXXXXXXXX", 
    "type": 0, 
    "content": "Text sent to the text channel.", 
    "channel_id": "XXXXXXXXXXXXXXXXX", 
    "author": 
    {
        "id": "XXXXXXXXXXXXXXXXXX", 
        "username": "Username", 
        "avatar": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 
        "discriminator": "XXXX", 
        "public_flags": 0
    }, 
    "attachments": [], 
    "embeds": [], 
    "mentions": [], 
    "mention_roles": [], 
    "pinned": false, 
    "mention_everyone": false, 
    "tts": false, 
    "timestamp": "2020-07-24T10:32:09.501000+00:00", 
    "edited_timestamp": null, 
    "flags": 0, 
    "nonce": "XXXXXXXXXXXXXXXXXXXX"
}
</pre>
