/**
 * nmeaDecode.ts - Pure NMEA 0183 sentence decoder for the glossary "Decode" lab.
 *
 * Reads standard talker sentences (GGA, RMC, GLL, VTG, HDT, ZDA, DBT), verifies the XOR checksum and
 * explains field by field. Proprietary ($P...) and unknown sentences get a generic field split.
 * Binary protocols are out of scope.
 */
import { ILocalizedText } from "../models";

const t = (pt: string, en: string): ILocalizedText => ({ pt, en });

export interface INmeaField {
  /** 1-based position after the header, as in the NMEA documents. */
  index: number;
  raw: string;
  label: ILocalizedText;
  meaning?: ILocalizedText;
}

export interface INmeaSummaryItem {
  label: ILocalizedText;
  value: ILocalizedText;
}

export interface INmeaChecksum {
  given: string | null;
  computed: string;
  /** null when the line carries no checksum. */
  valid: boolean | null;
}

export interface INmeaResult {
  ok: boolean;
  error?: ILocalizedText;
  /** Raw sentence code as typed, e.g. "GPGGA". */
  header: string;
  talker: string;
  talkerName?: ILocalizedText;
  sentence: string;
  sentenceName?: ILocalizedText;
  proprietary: boolean;
  fields: INmeaField[];
  checksum: INmeaChecksum;
  summary: INmeaSummaryItem[];
  warnings: ILocalizedText[];
}

const TALKERS: Record<string, ILocalizedText> = {
  GP: t("GPS", "GPS"),
  GL: t("GLONASS", "GLONASS"),
  GA: t("Galileo", "Galileo"),
  GB: t("BeiDou", "BeiDou"),
  BD: t("BeiDou", "BeiDou"),
  GN: t("Várias constelações GNSS", "Multi-constellation GNSS"),
  HE: t("Girocompasso (busca o Norte)", "Gyrocompass (north-seeking)"),
  HN: t("Giro (não busca o Norte)", "Gyro (non north-seeking)"),
  HC: t("Bússola magnética", "Magnetic compass"),
  II: t("Instrumentação integrada", "Integrated instrumentation"),
  IN: t("Navegação integrada", "Integrated navigation"),
  SD: t("Ecobatímetro", "Depth sounder"),
};

const FIX_QUALITY: Record<string, ILocalizedText> = {
  "0": t("Sem fix / inválido", "No fix / invalid"),
  "1": t("Fix GPS autônomo", "Standalone GPS fix"),
  "2": t("DGPS (correção diferencial)", "DGPS (differential correction)"),
  "3": t("Fix PPS", "PPS fix"),
  "4": t("RTK fixo (centímetros)", "RTK fixed (centimetres)"),
  "5": t("RTK float (decímetros)", "RTK float (decimetres)"),
  "6": t("Estimado (dead reckoning)", "Estimated (dead reckoning)"),
  "7": t("Entrada manual", "Manual input"),
  "8": t("Simulação", "Simulation"),
};

const STATUS: Record<string, ILocalizedText> = {
  A: t("Válido", "Valid"),
  V: t("Aviso do receptor (dado não confiável)", "Receiver warning (data not reliable)"),
};

const MODE: Record<string, ILocalizedText> = {
  A: t("Autônomo", "Autonomous"),
  D: t("Diferencial", "Differential"),
  E: t("Estimado", "Estimated"),
  F: t("RTK float", "Float RTK"),
  M: t("Manual", "Manual"),
  N: t("Sem fix", "No fix"),
  P: t("Preciso", "Precise"),
  R: t("RTK fixo", "Fixed RTK"),
  S: t("Simulador", "Simulator"),
};

const checksumOf = (body: string): string => {
  let sum = 0;
  for (let i = 0; i < body.length; i++) sum ^= body.charCodeAt(i);
  const hex = sum.toString(16).toUpperCase();
  return hex.length < 2 ? "0" + hex : hex;
};

/** ddmm.mmmm (or dddmm.mmmm) plus hemisphere to signed decimal degrees. */
const parseCoord = (raw: string, hemi: string): number | null => {
  if (!raw) return null;
  const v = parseFloat(raw);
  if (isNaN(v)) return null;
  const deg = Math.floor(v / 100);
  const min = v - deg * 100;
  if (min >= 60) return null;
  const dec = deg + min / 60;
  const h = (hemi || "").toUpperCase();
  return h === "S" || h === "W" ? -dec : dec;
};

const formatCoord = (value: number, pos: string, neg: string): string =>
  `${Math.abs(value).toFixed(6)}° ${value < 0 ? neg : pos}`;

const formatTime = (raw: string): string =>
  raw.length >= 6 ? `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4)} UTC` : raw;

const formatDate = (raw: string): string => {
  if (raw.length !== 6) return raw;
  const yy = parseInt(raw.slice(4), 10);
  const year = (yy < 80 ? 2000 : 1900) + yy;
  return `${year}-${raw.slice(2, 4)}-${raw.slice(0, 2)}`;
};

const plain = (v: string): ILocalizedText => t(v, v);

/** "code · explanation" in both languages. */
const tagged = (code: string, meaning: ILocalizedText): ILocalizedText =>
  t(`${code} · ${meaning.pt}`, `${code} · ${meaning.en}`);

const positionItem = (
  latRaw: string,
  ns: string,
  lonRaw: string,
  ew: string,
): INmeaSummaryItem[] => {
  const lat = parseCoord(latRaw, ns);
  const lon = parseCoord(lonRaw, ew);
  if (lat === null || lon === null) return [];
  return [
    {
      label: t("Posição", "Position"),
      value: plain(`${formatCoord(lat, "N", "S")}, ${formatCoord(lon, "E", "W")}`),
    },
  ];
};

const item = (pt: string, en: string, value: string): INmeaSummaryItem[] =>
  value ? [{ label: t(pt, en), value: plain(value) }] : [];

interface ISentenceSpec {
  name: ILocalizedText;
  labels: ILocalizedText[];
  /** Explains a raw value; `i` is the 0-based field index after the header. */
  meaning?: (i: number, raw: string) => ILocalizedText | undefined;
  summarize: (f: string[]) => INmeaSummaryItem[];
}

const SENTENCES: Record<string, ISentenceSpec> = {
  GGA: {
    name: t("Dados do fix GPS (posição + altitude)", "GPS fix data (position + altitude)"),
    labels: [
      t("Hora UTC", "UTC time"),
      t("Latitude (ddmm.mmmm)", "Latitude (ddmm.mmmm)"),
      t("Hemisfério N/S", "Hemisphere N/S"),
      t("Longitude (dddmm.mmmm)", "Longitude (dddmm.mmmm)"),
      t("Hemisfério E/W", "Hemisphere E/W"),
      t("Qualidade do fix", "Fix quality"),
      t("Número de satélites", "Number of satellites"),
      t("HDOP", "HDOP"),
      t("Altitude", "Altitude"),
      t("Unidade da altitude", "Altitude unit"),
      t("Separação do geoide", "Geoid separation"),
      t("Unidade da separação", "Separation unit"),
      t("Idade da correção diferencial (s)", "Age of differential correction (s)"),
      t("ID da estação de referência", "Reference station ID"),
    ],
    meaning: (i, raw) => (i === 5 ? FIX_QUALITY[raw] : undefined),
    summarize: (f) =>
      item("Hora", "Time", formatTime(f[0] || ""))
        .concat(positionItem(f[1] || "", f[2] || "", f[3] || "", f[4] || ""))
        .concat(
          f[5] !== undefined && FIX_QUALITY[f[5]]
            ? [
                {
                  label: t("Fix", "Fix"),
                  value: tagged(f[5], FIX_QUALITY[f[5]]),
                },
              ]
            : [],
        )
        .concat(item("Satélites", "Satellites", f[6] || ""))
        .concat(item("HDOP", "HDOP", f[7] || ""))
        .concat(item("Altitude", "Altitude", f[8] ? `${f[8]} ${f[9] || ""}`.trim() : "")),
  },
  RMC: {
    name: t(
      "Mínimo recomendado (posição, velocidade, rumo, data)",
      "Recommended minimum (position, speed, course, date)",
    ),
    labels: [
      t("Hora UTC", "UTC time"),
      t("Status", "Status"),
      t("Latitude (ddmm.mmmm)", "Latitude (ddmm.mmmm)"),
      t("Hemisfério N/S", "Hemisphere N/S"),
      t("Longitude (dddmm.mmmm)", "Longitude (dddmm.mmmm)"),
      t("Hemisfério E/W", "Hemisphere E/W"),
      t("Velocidade sobre o fundo (nós)", "Speed over ground (knots)"),
      t("Rumo sobre o fundo (graus verdadeiros)", "Course over ground (true degrees)"),
      t("Data (ddmmyy)", "Date (ddmmyy)"),
      t("Variação magnética", "Magnetic variation"),
      t("Direção da variação E/W", "Variation direction E/W"),
      t("Modo", "Mode"),
    ],
    meaning: (i, raw) => (i === 1 ? STATUS[raw] : i === 11 ? MODE[raw] : undefined),
    summarize: (f) => {
      const knots = parseFloat(f[6] || "");
      return item("Hora", "Time", formatTime(f[0] || ""))
        .concat(item("Data", "Date", formatDate(f[8] || "")))
        .concat(positionItem(f[2] || "", f[3] || "", f[4] || "", f[5] || ""))
        .concat(
          isNaN(knots)
            ? []
            : item("Velocidade", "Speed", `${knots} kn (${(knots * 1.852).toFixed(1)} km/h)`),
        )
        .concat(item("Rumo", "Course", f[7] ? `${f[7]}°` : ""))
        .concat(
          f[1] && STATUS[f[1]]
            ? [
                {
                  label: t("Status", "Status"),
                  value: tagged(f[1], STATUS[f[1]]),
                },
              ]
            : [],
        );
    },
  },
  GLL: {
    name: t("Posição geográfica (lat/lon)", "Geographic position (lat/lon)"),
    labels: [
      t("Latitude (ddmm.mmmm)", "Latitude (ddmm.mmmm)"),
      t("Hemisfério N/S", "Hemisphere N/S"),
      t("Longitude (dddmm.mmmm)", "Longitude (dddmm.mmmm)"),
      t("Hemisfério E/W", "Hemisphere E/W"),
      t("Hora UTC", "UTC time"),
      t("Status", "Status"),
      t("Modo", "Mode"),
    ],
    meaning: (i, raw) => (i === 5 ? STATUS[raw] : i === 6 ? MODE[raw] : undefined),
    summarize: (f) =>
      positionItem(f[0] || "", f[1] || "", f[2] || "", f[3] || "").concat(
        item("Hora", "Time", formatTime(f[4] || "")),
      ),
  },
  VTG: {
    name: t("Rumo e velocidade sobre o fundo", "Course and speed over ground"),
    labels: [
      t("Rumo verdadeiro (graus)", "True course (degrees)"),
      t("Referência T", "T reference"),
      t("Rumo magnético (graus)", "Magnetic course (degrees)"),
      t("Referência M", "M reference"),
      t("Velocidade (nós)", "Speed (knots)"),
      t("Unidade N", "Unit N"),
      t("Velocidade (km/h)", "Speed (km/h)"),
      t("Unidade K", "Unit K"),
      t("Modo", "Mode"),
    ],
    meaning: (i, raw) => (i === 8 ? MODE[raw] : undefined),
    summarize: (f) =>
      item("Rumo verdadeiro", "True course", f[0] ? `${f[0]}°` : "").concat(
        item("Velocidade", "Speed", f[4] ? `${f[4]} kn${f[6] ? ` / ${f[6]} km/h` : ""}` : ""),
      ),
  },
  HDT: {
    name: t("Heading verdadeiro", "Heading, true"),
    labels: [t("Heading (graus)", "Heading (degrees)"), t("T = verdadeiro", "T = true")],
    summarize: (f) => item("Heading verdadeiro", "True heading", f[0] ? `${f[0]}°` : ""),
  },
  ZDA: {
    name: t("Data e hora UTC", "UTC date and time"),
    labels: [
      t("Hora UTC (hhmmss.ss)", "UTC time (hhmmss.ss)"),
      t("Dia", "Day"),
      t("Mês", "Month"),
      t("Ano", "Year"),
      t("Horas do fuso local", "Local zone hours"),
      t("Minutos do fuso local", "Local zone minutes"),
    ],
    summarize: (f) => {
      const date =
        f[3] && f[2] && f[1] ? `${f[3]}-${("0" + f[2]).slice(-2)}-${("0" + f[1]).slice(-2)}` : "";
      return item("Data", "Date", date).concat(item("Hora", "Time", formatTime(f[0] || "")));
    },
  },
  DBT: {
    name: t("Profundidade sob o transdutor", "Depth below transducer"),
    labels: [
      t("Profundidade (pés)", "Depth (feet)"),
      t("Unidade f", "Unit f"),
      t("Profundidade (metros)", "Depth (metres)"),
      t("Unidade M", "Unit M"),
      t("Profundidade (braças)", "Depth (fathoms)"),
      t("Unidade F", "Unit F"),
    ],
    summarize: (f) => item("Profundidade", "Depth", f[2] ? `${f[2]} m` : ""),
  },
};

const fail = (error: ILocalizedText): INmeaResult => ({
  ok: false,
  error,
  header: "",
  talker: "",
  sentence: "",
  proprietary: false,
  fields: [],
  checksum: { given: null, computed: "", valid: null },
  summary: [],
  warnings: [],
});

export function parseNmea(input: string): INmeaResult {
  const line = (input || "").replace(/[\r\n]+/g, "").trim();
  if (!line) return fail(t("Cole uma linha NMEA.", "Paste an NMEA line."));
  if (line.charAt(0) !== "$" && line.charAt(0) !== "!") {
    return fail(t("Uma sentença NMEA começa com $.", "An NMEA sentence starts with $."));
  }

  const star = line.indexOf("*");
  const body = star >= 0 ? line.slice(1, star) : line.slice(1);
  const givenRaw = star >= 0 ? line.slice(star + 1).trim() : null;
  const computed = checksumOf(body);
  const given = givenRaw === null ? null : givenRaw.toUpperCase();
  const valid = given === null ? null : given === computed;

  const parts = body.split(",");
  const header = parts[0];
  const values = parts.slice(1);
  if (!header)
    return fail(
      t("Faltou o código da sentença (ex.: GPGGA).", "Missing the sentence code (e.g. GPGGA)."),
    );

  const warnings: ILocalizedText[] = [];
  const proprietary = header.charAt(0) === "P" && header.length > 1;
  const talker = proprietary ? "P" : header.slice(0, 2).toUpperCase();
  const type = proprietary ? header.slice(1) : header.slice(2).toUpperCase();
  const spec = !proprietary && header.length === 5 ? SENTENCES[type] : undefined;

  if (header.length !== 5 && !proprietary) {
    warnings.push(
      t(
        "O código normalmente tem 5 letras: talker (2) + tipo (3).",
        "The code normally has 5 letters: talker (2) + type (3).",
      ),
    );
  }
  if (given === null)
    warnings.push(t("A linha não traz checksum (*hh).", "The line carries no checksum (*hh)."));
  if (proprietary)
    warnings.push(
      t(
        "Sentença proprietária: campos mostrados sem tradução.",
        "Proprietary sentence: fields shown without translation.",
      ),
    );
  else if (!spec)
    warnings.push(
      t(
        "Tipo de sentença não decodificado por este laboratório.",
        "Sentence type not decoded by this lab.",
      ),
    );

  const fields: INmeaField[] = values.map((raw, i) => ({
    index: i + 1,
    raw,
    label: spec && spec.labels[i] ? spec.labels[i] : t(`Campo ${i + 1}`, `Field ${i + 1}`),
    meaning: spec && spec.meaning ? spec.meaning(i, raw) : undefined,
  }));
  if (spec && values.length > spec.labels.length) {
    warnings.push(
      t(
        "Há mais campos do que o padrão prevê.",
        "There are more fields than the standard defines.",
      ),
    );
  }

  return {
    ok: true,
    header,
    talker,
    talkerName: TALKERS[talker],
    sentence: type,
    sentenceName: spec ? spec.name : undefined,
    proprietary,
    fields,
    checksum: { given, computed, valid },
    summary: spec ? spec.summarize(values) : [],
    warnings,
  };
}
