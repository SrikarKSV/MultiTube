# MultiTube - No more extra tabs

MultiTube is a web app made to *watch all the YoutTube videos of a playlist/channel or a mix of both on the same page*🤯.

Check it out here: [MultiTube](https://getmultitube.netlify.app/)

![Demo of MultiTube](./.github/demo.gif)

You can provide a list of video links, playlist links or channel links or mix of all of them! With a click of a few buttons all of the videos from that playlist or channel can be viewed on same page, no more opening 10 tabs to keep a list of all the videos you want to watch in an evening.

## Features

You can provide it:

- Multiple video links
- Multiple playlist links
- Multiple channel links
- Any mix of the above
- Links are validated upon submission
- Invalid links are alerted to the user
- Users will be alerted if there was an error at the server
- Users will be alerted if duplicate links are provided
- Remove any video you don't want
- Scale any video for better view

> **_NOTE_** ⚠: When providing multiple links, between each link a comma(",") should be present.

<br>

## Usage:

1. Multiple video links: <br>
   `https://www.youtube.com/watch?v=mO_dS3rXDIs, www.youtube.com/watch?v=48NWaLkDcME`

2. Multiple playlist links: <br>
   `youtube.com/playlist?list=PLu8EoSxDXHP6CGK4YVJhL_VWetA865GOH, https://youtube.com/playlist?list=PLu8EoSxDXHP7v7K5nZSMo9XWidbJ_Bns3`

3. Multiple channel links: <br>
   `youtube.com/user/wesbos, www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA`

4. Go all out, mix them: <br>
   `https://youtube.com/watch?v=8rD9amRSOQY, youtube.com/playlist?list=PLu8EoSxDXHP5CIFvt9-ze3IngcdAc2xKG, www.youtube.com/channel/UCCezIgC97PvUuR4_gbFUs5g`

> **_NOTE_** ⚠: Please do not enter custom channel URL, Ex: https://www.youtube.com/c/Coreyms/ . Youtube API does not respond these links.

### Stack used:

- HTML
- CSS
- JavaScript
- Flask (Python)
