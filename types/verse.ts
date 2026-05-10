export interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  sajda: boolean;
}

export interface SurahText {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: Verse[];
}
