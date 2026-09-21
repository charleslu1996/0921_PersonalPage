import { RegionZone } from '../types/weather';

export interface TaiwanLocationMeta {
  name: string;
  aliases: string[];
  region: RegionZone;
  lat: number;
  lng: number;
  zoomLevel?: number;
}

export const TAIWAN_COUNTIES: Record<string, TaiwanLocationMeta> = {
  '基隆市': { name: '基隆市', aliases: ['基隆'], region: '北部', lat: 25.1276, lng: 121.7392 },
  '臺北市': { name: '臺北市', aliases: ['台北市', '台北', '臺北'], region: '北部', lat: 25.0375, lng: 121.5637 },
  '新北市': { name: '新北市', aliases: ['新北'], region: '北部', lat: 25.0117, lng: 121.4658 },
  '桃園市': { name: '桃園市', aliases: ['桃園'], region: '北部', lat: 24.9936, lng: 121.3010 },
  '新竹市': { name: '新竹市', aliases: ['新竹'], region: '北部', lat: 24.8138, lng: 120.9675 },
  '新竹縣': { name: '新竹縣', aliases: [], region: '北部', lat: 24.8387, lng: 121.0177 },
  '苗栗縣': { name: '苗栗縣', aliases: ['苗栗'], region: '中部', lat: 24.5602, lng: 120.8214 },
  '臺中市': { name: '臺中市', aliases: ['台中市', '台中', '臺中'], region: '中部', lat: 24.1627, lng: 120.6473 },
  '彰化縣': { name: '彰化縣', aliases: ['彰化'], region: '中部', lat: 24.0754, lng: 120.5445 },
  '南投縣': { name: '南投縣', aliases: ['南投'], region: '中部', lat: 23.9609, lng: 120.9719 },
  '雲林縣': { name: '雲林縣', aliases: ['雲林'], region: '中部', lat: 23.7092, lng: 120.4313 },
  '嘉義市': { name: '嘉義市', aliases: ['嘉義'], region: '南部', lat: 23.4800, lng: 120.4491 },
  '嘉義縣': { name: '嘉義縣', aliases: [], region: '南部', lat: 23.4518, lng: 120.2559 },
  '臺南市': { name: '臺南市', aliases: ['台南市', '台南', '臺南'], region: '南部', lat: 22.9997, lng: 120.2270 },
  '高雄市': { name: '高雄市', aliases: ['高雄'], region: '南部', lat: 22.6273, lng: 120.3014 },
  '屏東縣': { name: '屏東縣', aliases: ['屏東'], region: '南部', lat: 22.6828, lng: 120.4908 },
  '宜蘭縣': { name: '宜蘭縣', aliases: ['宜蘭'], region: '東部', lat: 24.7570, lng: 121.7530 },
  '花蓮縣': { name: '花蓮縣', aliases: ['花蓮'], region: '東部', lat: 23.9912, lng: 121.6196 },
  '臺東縣': { name: '臺東縣', aliases: ['台東縣', '台東', '臺東'], region: '東部', lat: 22.7583, lng: 121.1444 },
  '澎湖縣': { name: '澎湖縣', aliases: ['澎湖'], region: '離島', lat: 23.5712, lng: 119.5793 },
  '金門縣': { name: '金門縣', aliases: ['金門'], region: '離島', lat: 24.4492, lng: 118.3766 },
  '連江縣': { name: '連江縣', aliases: ['馬祖'], region: '離島', lat: 26.1505, lng: 119.9499 }
};

export function getLocationMeta(rawName: string): TaiwanLocationMeta {
  const clean = rawName.trim();
  if (TAIWAN_COUNTIES[clean]) return TAIWAN_COUNTIES[clean];

  for (const item of Object.values(TAIWAN_COUNTIES)) {
    if (item.aliases.includes(clean) || clean.includes(item.name) || item.name.includes(clean)) {
      return item;
    }
  }

  // Fallback Taiwan center
  return {
    name: clean,
    aliases: [],
    region: '中部',
    lat: 23.9738,
    lng: 120.9820
  };
}

export const REGION_ZONES: { key: RegionZone | '全部'; label: string }[] = [
  { key: '全部', label: '全台灣 (All)' },
  { key: '北部', label: '北部地區' },
  { key: '中部', label: '中部地區' },
  { key: '南部', label: '南部地區' },
  { key: '東部', label: '東部地區' },
  { key: '離島', label: '澎湖與離島' },
];
