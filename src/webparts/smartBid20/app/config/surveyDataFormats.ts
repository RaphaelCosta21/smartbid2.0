/**
 * surveyDataFormats.ts - What the data looks like at each hop of the Survey Portal "data journey".
 *
 * Reference content (bilingual pt-BR / EN), all "typical" and unvalidated: real formats depend on
 * each sensor's configuration. NMEA samples carry real checksums so they decode in the glossary lab.
 */
import { ILocalizedText, SurveyDataRole, SurveyDataType, SurveyLinkKind } from "../models";

const t = (pt: string, en: string): ILocalizedText => ({ pt, en });

export interface IDataFormat {
  label: ILocalizedText;
  /** Example payload shown on the travelling packet. */
  sample?: string;
  /** Sample is a standard NMEA sentence the glossary lab can decode. */
  decodable?: boolean;
  termIds?: string[];
}

export interface IDataOrigin {
  title: ILocalizedText;
  caption: ILocalizedText;
  format: IDataFormat;
  /** The data starts in the GNSS constellation (satellite step before the antenna). */
  satellites?: boolean;
}

/** Visual archetype of a client deliverable in the 3D scene. */
export type DeliverableVisual = "report" | "dtm" | "chart" | "video" | "points" | "calibration";

/** Step kinds of utils/surveyDataJourney.ts (kept here so the labels live with the other texts). */
export const JOURNEY_KIND_LABELS: Record<
  "origin" | "node" | "cable" | "software" | "storage" | "processing" | "deliverables" | "open",
  ILocalizedText
> = {
  origin: t("Origem", "Origin"),
  node: t("Equipamento", "Equipment"),
  cable: t("Cabo", "Cable"),
  software: t("Software", "Software"),
  storage: t("Armazenamento", "Storage"),
  processing: t("Processamento", "Processing"),
  deliverables: t("Entregáveis", "Deliverables"),
  open: t("A confirmar", "To confirm"),
};

export const DATA_TYPE_NAMES: Record<SurveyDataType, ILocalizedText> = {
  position: t("Posição", "Position"),
  heading: t("Rumo (heading)", "Heading"),
  motion: t("Movimento", "Motion"),
  depth: t("Profundidade", "Depth"),
  altitude: t("Altitude", "Altitude"),
  "sound-velocity": t("Velocidade do som", "Sound velocity"),
  bathymetry: t("Batimetria", "Bathymetry"),
  "acoustic-position": t("Posição acústica", "Acoustic position"),
  "pipe-tracking": t("Rastreamento de duto", "Pipe tracking"),
  video: t("Vídeo", "Video"),
  "time-sync": t("Sincronização de tempo", "Time sync"),
  corrections: t("Correções GNSS", "GNSS corrections"),
  comms: t("Comunicação", "Comms"),
};

export const DATA_ORIGINS: Record<SurveyDataType, IDataOrigin> = {
  position: {
    title: t("Satélites GNSS", "GNSS satellites"),
    caption: t(
      "Tudo começa no espaço: cada satélite transmite sua hora e órbita. A antena capta os sinais de vários satélites ao mesmo tempo.",
      "It all starts in space: each satellite broadcasts its time and orbit. The antenna picks up signals from several satellites at once.",
    ),
    format: { label: t("Sinal de rádio L1/L2/L5", "L1/L2/L5 radio signal"), termIds: ["gnss"] },
    satellites: true,
  },
  "time-sync": {
    title: t("Relógios atômicos dos satélites", "Satellite atomic clocks"),
    caption: t(
      "Os satélites carregam relógios atômicos. O receptor GNSS usa esse tempo para gerar o pulso PPS e a mensagem ZDA.",
      "Satellites carry atomic clocks. The GNSS receiver uses that time to generate the PPS pulse and the ZDA message.",
    ),
    format: {
      label: t("Sinal de rádio com tempo atômico", "Radio signal carrying atomic time"),
      termIds: ["gnss", "utc"],
    },
    satellites: true,
  },
  corrections: {
    title: t("Satélites de correção", "Correction satellites"),
    caption: t(
      "Um serviço de correção calcula os erros das órbitas e relógios e os retransmite por satélite (banda L / Iridium).",
      "A correction service computes orbit and clock errors and rebroadcasts them by satellite (L-band / Iridium).",
    ),
    format: {
      label: t("Correções por satélite (binário)", "Satellite corrections (binary)"),
      termIds: ["ppp", "dgps"],
    },
    satellites: true,
  },
  heading: {
    title: t("Rotação da Terra", "Earth's rotation"),
    caption: t(
      "O giro sente a rotação da Terra e descobre sozinho onde fica o Norte verdadeiro.",
      "The gyro senses the Earth's rotation and finds true North by itself.",
    ),
    format: { label: t("Fenômeno físico", "Physical phenomenon") },
  },
  motion: {
    title: t("Balanço do navio", "Vessel motion"),
    caption: t(
      "Acelerômetros e giros medem heave, pitch e roll a cada instante.",
      "Accelerometers and gyros measure heave, pitch and roll at every instant.",
    ),
    format: { label: t("Fenômeno físico", "Physical phenomenon") },
  },
  depth: {
    title: t("Pressão da água", "Water pressure"),
    caption: t(
      "Quanto mais fundo, maior a pressão: o sensor converte pressão em profundidade.",
      "The deeper, the higher the pressure: the sensor turns pressure into depth.",
    ),
    format: { label: t("Fenômeno físico", "Physical phenomenon") },
  },
  altitude: {
    title: t("Eco no fundo do mar", "Echo off the seabed"),
    caption: t(
      "O altímetro emite um pulso acústico e mede quanto tempo o eco leva para voltar.",
      "The altimeter sends an acoustic pulse and times how long the echo takes to come back.",
    ),
    format: { label: t("Pulso acústico", "Acoustic pulse") },
  },
  "sound-velocity": {
    title: t("A própria água", "The water itself"),
    caption: t(
      "A sonda mede quão rápido o som viaja na água naquele ponto (muda com temperatura, salinidade e pressão).",
      "The probe measures how fast sound travels in the water at that point (it changes with temperature, salinity and pressure).",
    ),
    format: { label: t("Fenômeno físico", "Physical phenomenon"), termIds: ["sound-velocity"] },
  },
  bathymetry: {
    title: t("Ecos do leque de feixes", "Echoes from the beam fan"),
    caption: t(
      "O multifeixe emite um leque de feixes acústicos; cada eco vira um ponto de profundidade.",
      "The multibeam sends a fan of acoustic beams; every echo becomes a depth point.",
    ),
    format: { label: t("Pulsos acústicos", "Acoustic pulses"), termIds: ["mbes"] },
  },
  "acoustic-position": {
    title: t("Ping acústico", "Acoustic ping"),
    caption: t(
      "O transceptor chama o beacon com um ping; pelo tempo e ângulo da resposta se calcula a posição.",
      "The transceiver calls the beacon with a ping; the reply's timing and angle give its position.",
    ),
    format: { label: t("Pulso acústico", "Acoustic pulse"), termIds: ["usbl", "transponder"] },
  },
  "pipe-tracking": {
    title: t("Campo magnético do duto", "The pipe's magnetic field"),
    caption: t(
      "As bobinas induzem e leem o campo magnético do duto enterrado para achar posição e cobertura.",
      "The coils induce and read the buried pipe's magnetic field to find its position and burial depth.",
    ),
    format: { label: t("Campo eletromagnético", "Electromagnetic field") },
  },
  video: {
    title: t("Luz na câmera", "Light on the camera"),
    caption: t(
      "A câmera do ROV transforma a cena submarina em sinal de vídeo.",
      "The ROV camera turns the subsea scene into a video signal.",
    ),
    format: { label: t("Imagem", "Image") },
  },
  comms: {
    title: t("Rádio", "Radio"),
    caption: t(
      "Mensagens trocadas por rádio entre equipamentos.",
      "Messages exchanged by radio between devices.",
    ),
    format: { label: t("Sinal de rádio", "Radio signal") },
  },
};

/** Placeholder for a format no specialist has confirmed yet: shown as "TBD", never decodable. */
export const TBD_FORMAT: IDataFormat = {
  label: t("Formato a confirmar", "Format to confirm"),
  sample: "TBD",
};

const ACOUSTIC_TELEGRAM_TBD: IDataFormat = {
  label: t("Posição acústica · telegrama TBD", "Acoustic position · telegram TBD"),
  sample: "TBD",
  termIds: ["usbl"],
};

/** What the sensor writes when it outputs this data type. */
export const DATA_SAMPLES: Record<SurveyDataType, IDataFormat> = {
  position: {
    label: t("NMEA 0183 · GGA", "NMEA 0183 · GGA"),
    sample: "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47",
    decodable: true,
    termIds: ["nmea-gga", "nmea-0183"],
  },
  heading: {
    label: t("NMEA 0183 · HDT", "NMEA 0183 · HDT"),
    sample: "$HEHDT,274.07,T*19",
    decodable: true,
    termIds: ["nmea-hdt", "nmea-0183"],
  },
  "time-sync": {
    label: t("Pulso PPS + NMEA ZDA", "PPS pulse + NMEA ZDA"),
    sample: "$GPZDA,123519.00,24,10,2026,00,00*6A",
    decodable: true,
    termIds: ["pps", "nmea-zda"],
  },
  altitude: {
    label: t("NMEA 0183 · DBT", "NMEA 0183 · DBT"),
    sample: "$SDDBT,12.3,f,3.7,M,2.0,F*30",
    decodable: true,
    termIds: ["nmea-0183"],
  },
  "acoustic-position": ACOUSTIC_TELEGRAM_TBD,
  motion: {
    label: t("String proprietária (ex.: TSS1)", "Proprietary string (e.g. TSS1)"),
    sample: ":00FFE2 -0012F-0123 0045",
    termIds: ["mru"],
  },
  depth: {
    label: t("String do sensor de pressão", "Pressure sensor string"),
    sample: "*0001 1523.4421",
  },
  "sound-velocity": {
    label: t("Valor em m/s (string simples)", "Value in m/s (plain string)"),
    sample: "1503.215",
    termIds: ["sound-velocity"],
  },
  bathymetry: {
    label: t("Datagrama binário via rede (UDP)", "Binary datagram over the network (UDP)"),
    sample: "BTH0 · 256 beams · binary",
    termIds: ["mbes", "udp"],
  },
  "pipe-tracking": {
    label: t("Posição e cobertura do duto · formato TBD", "Pipe position and cover · format TBD"),
    sample: "TBD",
  },
  video: {
    label: t("Sinal de vídeo (SDI / composto)", "Video signal (SDI / composite)"),
  },
  corrections: {
    label: t("Correções do serviço · formato TBD", "Service corrections · format TBD"),
    sample: "TBD",
    termIds: ["ppp", "dgps"],
  },
  comms: {
    label: t("Telemetria por rádio", "Radio telemetry"),
  },
};

/** How the cable carries the payload. */
export const LINK_FORMATS: Record<SurveyLinkKind, IDataFormat> = {
  data: { label: t("Cabo de dados", "Data cable") },
  power: { label: t("Energia (não carrega dado)", "Power (carries no data)") },
  video: { label: t("Cabo de vídeo", "Video cable") },
  rf: { label: t("Cabo coaxial de RF", "RF coaxial cable"), termIds: ["gnss"] },
  subsea: { label: t("Cabo subsea", "Subsea cable") },
  fibre: { label: t("Fibra óptica multiplexada", "Multiplexed optical fibre") },
  acoustic: { label: t("Som pela água", "Sound through the water"), termIds: ["usbl"] },
  timing: { label: t("Pulso PPS + ZDA", "PPS pulse + ZDA"), termIds: ["pps", "nmea-zda"] },
};

/** Cable label for links whose end equipment makes the generic kind label wrong (either end). */
export const LINK_FORMAT_OVERRIDES: Record<string, Partial<Record<SurveyLinkKind, IDataFormat>>> = {
  "bullet-poe": {
    rf: { label: t("Cabo Ethernet com alimentação PoE", "Ethernet cable with PoE power") },
  },
  "innova-subsea-mux": {
    subsea: { label: t("Cabo curto do ROV até o MUX subsea", "Short ROV cable to the subsea MUX") },
  },
  "ranger2-subsea-head": {
    subsea: { label: t("Cabo da cabeça USBL ao topside", "USBL head cable to the topside") },
  },
  "tss440-coils": {
    subsea: { label: t("Cabo das bobinas até a bottle", "Cable from the coils to the bottle") },
  },
};

/**
 * Per-equipment corrections of the generic journey texts (keyed by equipment id, then data type).
 * Used where the data type's default origin, sensor caption or sample would be wrong for that
 * equipment (e.g. a GNSS compass is not a gyro, a barometer does not measure water pressure).
 */
export interface IJourneyOverride {
  /** Replaces the phenomenon the data type starts from. */
  origin?: IDataOrigin;
  /** Replaces the "sensor turns what it measured into a message" line at this equipment. */
  caption?: ILocalizedText;
  /** Format this equipment outputs; later hops carry it until another override replaces it. */
  payload?: IDataFormat;
  /** Hops after this equipment follow another data type's route (e.g. corrections end as position). */
  continueAs?: SurveyDataType;
  /** No journey for this data type from this equipment. */
  skip?: boolean;
}

const PHYSICAL: IDataFormat = { label: t("Fenômeno físico", "Physical phenomenon") };

export const JOURNEY_OVERRIDES: Record<string, Partial<Record<SurveyDataType, IJourneyOverride>>> =
  {
    "hemisphere-vs1000-receiver": {
      heading: {
        origin: {
          title: t("Satélites GNSS (duas antenas)", "GNSS satellites (two antennas)"),
          caption: t(
            "Duas antenas (AFT e FWD) captam os mesmos satélites. A pequena diferença de fase do sinal entre elas dá a direção da linha que as une, ou seja, a proa.",
            "Two antennas (AFT and FWD) pick up the same satellites. The small phase difference of the signal between them gives the direction of the line joining them, i.e. the bow.",
          ),
          format: {
            label: t("Sinal de rádio dos satélites nas duas antenas", "Satellite radio signal on both antennas"),
            termIds: ["gnss"],
          },
          satellites: true,
        },
        payload: {
          label: t("NMEA 0183 · HDT (heading por GNSS)", "NMEA 0183 · HDT (GNSS heading)"),
          sample: "$GPHDT,274.07,T*03",
          decodable: true,
          termIds: ["nmea-hdt", "nmea-0183"],
        },
      },
    },
    barometer: {
      depth: {
        origin: {
          title: t("Pressão do ar", "Air pressure"),
          caption: t(
            "O barômetro mede a pressão da atmosfera no convés. Ela é a referência para tirar o peso do ar da pressão medida pelo sensor do ROV e chegar à profundidade.",
            "The barometer measures the atmospheric pressure on deck. It is the reference used to remove the weight of the air from the pressure measured by the ROV sensor and get the depth.",
          ),
          format: PHYSICAL,
        },
        payload: TBD_FORMAT,
      },
    },
    "rov-gyro": {
      motion: {
        origin: {
          title: t("Movimento do ROV", "ROV motion"),
          caption: t(
            "O giro do ROV sente a inclinação do veículo (pitch e roll) a cada instante.",
            "The ROV gyro senses the vehicle's tilt (pitch and roll) at every instant.",
          ),
          format: PHYSICAL,
        },
      },
    },
    "c-node": {
      "acoustic-position": {
        caption: t(
          "O beacon (C-Node) escuta o ping do navio e responde com um pulso acústico. Ele não gera mensagem digital.",
          "The beacon (C-Node) listens to the vessel's ping and answers with an acoustic pulse. It does not generate a digital message.",
        ),
        payload: {
          label: t("Pulso acústico de resposta", "Acoustic reply pulse"),
          termIds: ["transponder"],
        },
      },
    },
    "ranger2-subsea-head": {
      "acoustic-position": {
        caption: t(
          "A cabeça mede o tempo de ida e volta e o ângulo de chegada da resposta e envia essas medidas ao topside.",
          "The head measures the round-trip time and the arrival angle of the reply and sends those measurements to the topside.",
        ),
        payload: {
          label: t("Medidas acústicas (distância e ângulo) · TBD", "Acoustic measurements (range and angle) · TBD"),
          sample: "TBD",
          termIds: ["usbl"],
        },
      },
    },
    "usbl-topside-unit": {
      "acoustic-position": {
        caption: t(
          "O topside processa as medidas da cabeça e entrega a posição acústica à rede.",
          "The topside processes the head's measurements and delivers the acoustic position to the network.",
        ),
        payload: ACOUSTIC_TELEGRAM_TBD,
      },
    },
    "hipap-apos-interface": {
      "acoustic-position": {
        caption: t(
          "O HiPAP do navio mede as respostas dos beacons e entrega a posição acústica pela interface APOS.",
          "The vessel's HiPAP measures the beacons' replies and delivers the acoustic position through the APOS interface.",
        ),
        payload: ACOUSTIC_TELEGRAM_TBD,
      },
    },
    "tss440-coils": {
      "pipe-tracking": {
        caption: t(
          "As bobinas captam o campo magnético do duto e entregam o sinal à bottle.",
          "The coils pick up the pipe's magnetic field and hand the signal to the bottle.",
        ),
        payload: { label: t("Sinal elétrico das bobinas", "Coil electrical signal") },
      },
    },
    "tss440-bottle": {
      "pipe-tracking": {
        caption: t(
          "A bottle aciona as bobinas, digitaliza as leituras e as envia ao topside pelo MUX subsea.",
          "The bottle drives the coils, digitises the readings and sends them to the topside through the subsea MUX.",
        ),
        payload: {
          label: t("Leituras digitalizadas · TBD", "Digitised readings · TBD"),
          sample: "TBD",
        },
      },
    },
    "tss440-topside": {
      "pipe-tracking": {
        caption: t(
          "O topside do TSS 440 processa o sinal das bobinas e calcula a posição e a cobertura do duto.",
          "The TSS 440 topside processes the coil signal and computes the pipe's position and burial cover.",
        ),
      },
    },
    "green-laser": { video: { skip: true } },
    "video-telemetry-rx-antenna": {
      video: {
        origin: {
          title: t("Vídeo enviado por rádio", "Video sent over radio"),
          caption: t(
            "O transmissor de telemetria do ROV envia o vídeo por rádio; esta antena recebe o sinal e o entrega ao receptor.",
            "The ROV telemetry transmitter sends the video over radio; this antenna picks up the signal and hands it to the receiver.",
          ),
          format: { label: t("Sinal de rádio com o vídeo", "Radio signal carrying the video") },
        },
      },
    },
    "bullet-wifi-antenna": {
      comms: {
        caption: t(
          "O rádio Wi-Fi (Bullet) troca dados sem fio com a rede do navio e os entrega ao PoE por cabo Ethernet.",
          "The Wi-Fi radio (Bullet) exchanges data wirelessly with the vessel network and hands it to the PoE box over an Ethernet cable.",
        ),
      },
    },
    "cnav-x1-receiver": {
      corrections: {
        caption: t(
          "O receptor aplica as correções por dentro: elas não saem pelo cabo. O que sai é a posição já corrigida (GGA, com a qualidade do fix).",
          "The receiver applies the corrections internally: they do not leave on the cable. What comes out is the already corrected position (GGA, with the fix quality).",
        ),
        payload: DATA_SAMPLES.position,
        continueAs: "position",
      },
    },
  };

/** What each equipment role does to the data as it passes. */
export const ROLE_CAPTIONS: Record<SurveyDataRole, ILocalizedText> = {
  source: t(
    "O sensor transforma o que mediu em uma mensagem digital.",
    "The sensor turns what it measured into a digital message.",
  ),
  "rf-frontend": t(
    "A antena capta o sinal de rádio e o entrega ao receptor pelo cabo coaxial.",
    "The antenna captures the radio signal and hands it to the receiver over the coaxial cable.",
  ),
  transport: t(
    'Equipamento de transporte: repassa a mensagem sem mudar o conteúdo, só o "envelope".',
    'Transport equipment: it forwards the message without changing the content, only the "envelope".',
  ),
  compute: t(
    "Computador que recebe a mensagem e a entrega ao software de aquisição.",
    "Computer that receives the message and hands it to the acquisition software.",
  ),
  storage: t("Onde os dados brutos ficam guardados.", "Where the raw data is kept."),
  display: t("Tela que mostra o dado em tempo real.", "Screen that shows the data in real time."),
  support: t("Equipamento de apoio no caminho do dado.", "Support equipment on the data path."),
};

export const STAGE_FORMATS = {
  software: {
    label: t("Gravado e carimbado com tempo UTC", "Logged and time-stamped in UTC"),
    termIds: ["utc"],
  } as IDataFormat,
  storage: {
    label: t("Arquivos brutos do projeto", "Raw project files"),
  } as IDataFormat,
  processing: {
    label: t("Dado limpo e controlado (QC)", "Cleaned, quality-checked data"),
  } as IDataFormat,
  deliverables: {
    label: t("Entregáveis do cliente", "Client deliverables"),
  } as IDataFormat,
};

export const DELIVERABLE_RULES: {
  match: RegExp;
  visual: DeliverableVisual;
  format: ILocalizedText;
}[] = [
  {
    match: /mbes|bathym|dtm|xyz|chart/i,
    visual: "dtm",
    format: t("DTM, XYZ e cartas", "DTM, XYZ and charts"),
  },
  {
    match: /video|event/i,
    visual: "video",
    format: t("Vídeo + log de eventos", "Video + event log"),
  },
  {
    match: /calib/i,
    visual: "calibration",
    format: t("Relatório de calibração", "Calibration report"),
  },
  {
    match: /navigation data|processed nav/i,
    visual: "points",
    format: t("Arquivos de navegação", "Navigation files"),
  },
  { match: /burial|dob/i, visual: "chart", format: t("Perfis de cobertura", "Burial profiles") },
  { match: /.*/, visual: "report", format: t("Relatório (PDF)", "Report (PDF)") },
];

export const JOURNEY_UI = {
  button: t("Jornada do dado", "Data journey"),
  pick: t("Escolha o dado para seguir", "Pick the data to follow"),
  title: t("JORNADA DO DADO", "DATA JOURNEY"),
  format: t("Formato", "Format"),
  carrier: t("Meio", "Carrier"),
  decode: t("Decodificar", "Decode"),
  back: t("Voltar", "Back"),
  next: t("Avançar", "Next"),
  finish: t("Concluir", "Finish"),
  stop: t("Sair da jornada", "Exit journey"),
  typical: t("típico", "typical"),
  offline: t(
    "Etapa feita depois, fora do navio ou no escritório: não há cabo nem equipamento na cena.",
    "This step happens later, off the vessel or in the office: there is no cable or equipment in the scene.",
  ),
  open: t(
    "O uso deste dado depois da aquisição ainda não foi mapeado no catálogo.",
    "How this data is used after acquisition is not mapped in the catalog yet.",
  ),
  arrives: t("Chega em", "Arrives at"),
  leaves: t("Sai de", "Leaves"),
  hostMissing: t(
    "Este equipamento não está no diagrama: a ligação física até ele está por confirmar (TBD).",
    "This equipment is not in the diagram: its physical connection is to be confirmed (TBD).",
  ),
};
