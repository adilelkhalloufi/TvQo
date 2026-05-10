export interface Reciter {
  id: string;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

export interface Moshaf {
  id: string;
  name: string;
  server: string;
  surah_list: string;
  surah_total: string;
}

export interface Surah {
  id: string;
  name: string;
  start_page: string;
  end_page: string;
  makkia: string;
}

export interface Language {
  id: string;
  language: string;
  native: string;
  surah: string;
  reciters: string;
}
