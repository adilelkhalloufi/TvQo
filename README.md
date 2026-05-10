# TvQo - Quran TV App 📖📺

A beautiful React Native TV application for listening to Quran recitations with real-time verse display and auto-scrolling. Designed specifically for TV screens with full remote control support.

## Features ✨

- **🎙️ Multiple Reciters**: Browse and select from a wide variety of Quran reciters
- **📚 Complete Quran**: Access all 114 Surahs with Arabic text
- **🎵 Audio Playback**: High-quality audio streaming with background playback support
- **📖 Verse Display**: View verses in Arabic while listening with real-time highlighting
- **🔄 Auto-Scroll**: Verses automatically scroll and highlight as the reciter reads
- **⏯️ Playback Controls**: Play, pause, and restart from beginning
- **📺 TV Optimized**: Full support for TV remote control navigation
- **🎨 Beautiful UI**: Clean, modern interface optimized for landscape TV viewing
- **🌙 Arabic First**: Right-to-left layout with Arabic typography

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm run web      # For web
   npm run android  # For Android/Android TV
   npm run ios      # For iOS/tvOS
   ```

## Technologies Used 🛠️

- **[Expo](https://expo.dev)** - React Native framework
- **[React Native](https://reactnative.dev)** - Mobile/TV framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Expo Router](https://expo.github.io/router/docs/)** - File-based routing
- **[Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)** - Audio/Video playback
- **[Axios](https://axios-http.com/)** - HTTP client

## API Credits & Acknowledgments 🙏

This application is made possible by these amazing free Quran APIs:

### MP3 Quran API

**[mp3quran.net](https://www.mp3quran.net/eng/api)**

- Provides high-quality audio recordings from various reciters
- Comprehensive list of reciters and their Mushaf collections
- Surah metadata and audio files
- API Documentation: [https://www.mp3quran.net/eng/api](https://www.mp3quran.net/eng/api)

### Al Quran Cloud API

**[alquran.cloud](https://alquran.cloud/api)**

- Provides Quranic text in Arabic
- Verse-by-verse text retrieval
- Multiple translations and languages support
- API Documentation: [https://alquran.cloud/api](https://alquran.cloud/api)

**Special thanks to the developers and maintainers of these APIs for their service to the Muslim community and making Quranic knowledge freely accessible to developers worldwide. May Allah reward them abundantly.**

## How to Use 📱

1. **Select a Reciter**: Browse the list of reciters on the home screen (القراء tab)
2. **Choose a Surah**: Navigate to the Surah list (السور tab) and select a Surah to play
3. **View Verses**: The verses modal opens automatically showing Arabic text with real-time highlighting
4. **Control Playback**: Use the floating player controls to pause, restart, or view verses
5. **TV Navigation**: Use your TV remote's arrow keys and OK button to navigate

## TV Remote Controls 🎮

- **↑↓ Arrow Keys**: Navigate through lists
- **←→ Arrow Keys**: Navigate between control buttons
- **OK/Enter**: Select item or activate button
- **Back**: Close modal or return to previous screen

## Project Structure 📁

```
TvQo/
├── app/
│   ├── (tabs)/          # Tab navigation
│   │   ├── index.tsx    # Reciter selection screen
│   │   └── explore.tsx  # Surah list and playback
│   └── _layout.tsx      # Root layout
├── components/
│   └── VerseDisplay.tsx # Verse display with auto-scroll
├── contexts/
│   └── AudioContext.tsx # Global audio state management
├── services/
│   └── quranApi.ts      # API integration
└── types/
    ├── quran.ts         # Type definitions for API
    └── verse.ts         # Type definitions for verses
```

## License

This project is open source and available under the MIT License.

## Support

If you find this project useful, please consider:

- ⭐ Starring the repository
- 🤲 Making dua for the developers and API providers
- 📢 Sharing with others who might benefit

---

**Built with ❤️ for the Muslim community**
