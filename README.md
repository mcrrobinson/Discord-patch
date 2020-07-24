# Discord-patch
## Introduction
Patch client for Discord. Used for my bots. Due to the fact that Discord is written with Electron it it's simply a chromium instance which means that it uses HTML, Javascript and CSS in order to draw elements on the page. This makes it easy to see the behind the scenes by opening the developer view. The bind for this is the same as in Chrome:
```
CRTL + SHIFT + I
```
This will open the developer options including the CSS navigation, API requests and the console suggesting you work for Discord. The bind is the same accross; Linux, MacOS and Windows.

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

#### API Request
https://discordapp.com/api/v6/channels/channel_id/messages

#### Payload
{
    "content":"Text sent to the text channel","nonce":"XXXXXXXXXXXXXXXXXX","tts":false
}

#### API Response
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
