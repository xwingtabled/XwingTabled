# X-Wing Tabled

### ...Because Second Edition has huge cards and too many tokens

This app will maintain your card state for The X-Wing Miniatures Game: Second Edition.
It is designed to maintain items that are off the play area - cards and shield/charge/force tokens.
This app is not a squadron builder. You can import XWS squadron data from places like
[YASB 2.0](https://raithos.github.io) or Launch Bay Next. You may also import data from YASB 2.0 URLs and
FFG SquadBuilder URLs.

This app is best viewed on a tablet screen in landscape mode.

### Using this software

You can use this software directly from [https://jychuah.github.io/XwingTabled](https://jychuah.github.io/XwingTabled).
On first use, you will be asked to "Download Data" that will be stored locally. After that, you can use the
action buttons in the lower right to import your squad data.

### Building this software

This app was built using Ionic Framework. You can build a local copy of this software with the following requirements:

- [Node JS](https://nodejs.org)
- [Ionic Framework](https://ionicframework.com) (install with `npm install -g ionic cordova`)

Once these are installed, use the following commands from within your local copy of the repo:

- `npm install`
- `ionic serve` to load a local browser preview
- `ionic cordova run [android|ios]` to build and run on your mobile device

Building the mobile version will require the appropriate SDK (Android SDK or XCode) as well as developer access
on your device. The mobile version will require a download of artwork assets directly from Fantasy Flight Games.

### Found a bug or have a suggestion?

Please submit an issue to [the XwingTabled GitHub repo](https://github.com/jychuah/XwingTabled/issues).
Better yet, if you have a fix or feature, feel free to fork the repo and submit pull requests!

### Local Data Storage<

This web app caches some data locally, such as card data or your table state.
This means you will be required to download data on first use or when 
new data is released. The advantage is that if you navigate away from
the app in the middle of the game, you don't have to worry about losing
your game state.

### Artwork and Game Text Use

This app uses artwork from Fantasy Flight's image CDN, open source card
and text data from [Guido Kessel's Xwing Data 2 project](https://github.com/guidokessels/xwing-data2),
and [GeordanR's X-Wing Miniatures Font](https://github.com/geordanr/xwing-miniatures-font).
This app is not distributed with copyright artwork or card data on its own. Data is downloaded and cached
upon first use. Artwork is hotlinked from Fantasy Flight for web versions of this application,
and downloaded and cached for mobile versions.