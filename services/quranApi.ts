import { Reciter, Surah } from "@/types/quran";
import { SurahText } from "@/types/verse";
import axios from "axios";

const BASE_URL = "https://mp3quran.net/api/v3";
const QURAN_TEXT_API = "https://api.alquran.cloud/v1/surah";

export const quranApi = {
  async getReciters(language: string = "ar"): Promise<Reciter[]> {
    try {
      const response = await axios.get(`${BASE_URL}/reciters`, {
        params: { language },
      });
      return response.data.reciters || [];
    } catch (error) {
      console.error("Error fetching reciters:", error);
      return [];
    }
  },

  async getSurahs(language: string = "ar"): Promise<Surah[]> {
    try {
      const response = await axios.get(`${BASE_URL}/suwar`, {
        params: { language },
      });
      return response.data.suwar || [];
    } catch (error) {
      console.error("Error fetching surahs:", error);
      return [];
    }
  },

  async getSurahText(surahNumber: string): Promise<SurahText | null> {
    try {
      const response = await axios.get(`${QURAN_TEXT_API}/${surahNumber}`);
      return response.data.data || null;
    } catch (error) {
      console.error("Error fetching surah text:", error);
      return null;
    }
  },

  getSurahUrl(serverUrl: string, surahNumber: string): string {
    // Pad surah number to 3 digits
    const paddedNumber = String(surahNumber).padStart(3, "0");
    return `${serverUrl}${paddedNumber}.mp3`;
  },
};
