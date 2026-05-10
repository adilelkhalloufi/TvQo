# TvQo - TV Quran Player App

A React Native Expo app designed for TV that allows users to play Quran recitations in the background.

## Features

- 🎙️ **Multiple Reciters**: Choose from a wide selection of Quran reciters
- 📖 **All Surahs**: Access all 114 Surahs of the Quran
- 🔊 **Background Audio**: Audio continues playing in the background
- 📺 **TV Optimized**: Landscape orientation for TV viewing
- 🔍 **Search**: Quickly find your favorite reciter
- 🎨 **Arabic UI**: Full Arabic interface with right-to-left support

## API

This app uses the [MP3 Quran API](https://www.mp3quran.net/eng/api) to fetch:

- List of reciters
- List of Surahs
- Audio files for each recitation

## How to Use

1. **Select a Reciter**: Browse or search for your preferred Quran reciter on the home screen
2. **Choose a Surah**: Navigate to the Surahs tab to see all available Surahs
3. **Play Audio**: Tap on any Surah to start playing. The audio will continue in the background
4. **Pause/Resume**: Tap the playing Surah again to pause

## Development

### Install Dependencies

```bash
npm install
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on Web

```bash
npm run web
```

### Run on Android TV

```bash
npm run android -- --device
```

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Reciter selection screen
│   │   ├── explore.tsx      # Surah selection screen
│   │   └── _layout.tsx      # Tab navigation layout
│   └── _layout.tsx          # Root layout with AudioProvider
├── contexts/
│   └── AudioContext.tsx     # Audio playback context
├── services/
│   └── quranApi.ts          # API service for fetching data
└── types/
    └── quran.ts             # TypeScript types
```

## Technologies

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo AV** - Audio playback
- **Expo Router** - File-based routing
- **Axios** - HTTP client
- **TypeScript** - Type safety

## License

MIT
