/**
 * surveyGlossary.ts - Static glossary of survey terms for the Survey Knowledge Portal.
 *
 * Reference content, bilingual pt-BR / EN. Every term carries a
 * one-liner, an analogy, optional annotated "anatomy" and a BID note. `validated: false`
 * marks a draft that a survey SME still has to confirm.
 */
import {
  IGlossaryAnatomySegment,
  ILocalizedText,
  ISurveyGlossaryTerm,
  SurveyGlossaryCategory,
} from "../models";

const t = (pt: string, en: string): ILocalizedText => ({ pt, en });
const sep = (text: string): IGlossaryAnatomySegment => ({ text });
const seg = (text: string, pt: string, en: string): IGlossaryAnatomySegment => ({
  text,
  label: t(pt, en),
});

export const SURVEY_GLOSSARY_CATEGORIES: Record<
  SurveyGlossaryCategory,
  { label: ILocalizedText; order: number }
> = {
  protocol: { label: t("Protocolos", "Protocols"), order: 0 },
  network: { label: t("Rede", "Network"), order: 1 },
  timing: { label: t("Tempo", "Timing"), order: 2 },
  positioning: { label: t("Posicionamento", "Positioning"), order: 3 },
  motion: { label: t("Rumo e movimento", "Heading & motion"), order: 4 },
  acoustic: { label: t("Acústica", "Acoustics"), order: 5 },
};

export const GLOSSARY_UI = {
  title: t("Glossário de survey", "Survey glossary"),
  search: t("Buscar termo…", "Search a term…"),
  all: t("Todos", "All"),
  terms: t("Termos", "Terms"),
  decode: t("Decode NMEA", "Decode NMEA"),
  oneLine: t("Em uma linha", "In one line"),
  analogy: t("Analogia", "Analogy"),
  anatomy: t("Anatomia", "Anatomy"),
  details: t("Detalhes", "Details"),
  bid: t("No BID", "In a BID"),
  where: t("Onde você vê", "Where you see it"),
  related: t("Relacionados", "Related"),
  draft: t("Rascunho", "Draft"),
  draftHint: t(
    "Texto ainda não confirmado por um especialista de survey.",
    "Not yet confirmed by a survey specialist.",
  ),
  noResults: t("Nenhum termo encontrado.", "No term found."),
  pickTerm: t("Escolha um termo na lista.", "Pick a term from the list."),
  tryDecode: t("Testar no Decode", "Try in Decode"),
  hoverHint: t("Toque para ver o card completo", "Click for the full card"),
  carries: t("Carrega (típico)", "Carries (typical)"),
  clickToLearn: t("clique para aprender", "click to learn"),
  labIntro: t(
    "Cole uma linha NMEA 0183 do log de um sensor e veja campo a campo o que ela diz.",
    "Paste an NMEA 0183 line from a sensor log and see field by field what it says.",
  ),
  labPlaceholder: t("$GPGGA,123519,4807.038,N,…*47", "$GPGGA,123519,4807.038,N,…*47"),
  labSamples: t("Exemplos", "Samples"),
  labDecoded: t("Resumo decodificado", "Decoded summary"),
  labFields: t("Campos", "Fields"),
  labTalker: t("Origem (talker)", "Source (talker)"),
  labSentence: t("Sentença", "Sentence"),
  labChecksum: t("Checksum", "Checksum"),
  labChecksumOk: t("válido", "valid"),
  labChecksumBad: t("inválido (esperado", "invalid (expected"),
  labChecksumNone: t("ausente", "missing"),
  labColValue: t("Valor", "Value"),
  labColField: t("Campo", "Field"),
  labColMeaning: t("Significado", "Meaning"),
  labScope: t(
    "Lê sentenças NMEA 0183 padrão; formatos proprietários ($P…) e binários não são decodificados.",
    "Reads standard NMEA 0183 sentences; proprietary ($P…) and binary formats are not decoded.",
  ),
  langLabel: t("Idioma", "Language"),
};

/** Sample lines for the NMEA lab; checksums were computed, so each one validates. */
export const NMEA_LAB_SAMPLES: {
  id: string;
  label: string;
  sentence: string;
}[] = [
  {
    id: "gga",
    label: "GGA · position",
    sentence: "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47",
  },
  {
    id: "rmc",
    label: "RMC · position + speed",
    sentence: "$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A",
  },
  {
    id: "gll",
    label: "GLL · position",
    sentence: "$GPGLL,4916.45,N,12311.12,W,225444,A,*1D",
  },
  {
    id: "vtg",
    label: "VTG · course + speed",
    sentence: "$GPVTG,054.7,T,034.4,M,005.5,N,010.2,K*48",
  },
  { id: "hdt", label: "HDT · gyro heading", sentence: "$HEHDT,274.07,T*19" },
  {
    id: "zda",
    label: "ZDA · date + time",
    sentence: "$GPZDA,123519.00,24,10,2026,00,00*6A",
  },
  { id: "dbt", label: "DBT · depth", sentence: "$SDDBT,12.3,f,3.7,M,2.0,F*30" },
];

export const SURVEY_GLOSSARY: ISurveyGlossaryTerm[] = [
  // ---- Protocols ----
  {
    id: "nmea-0183",
    term: "NMEA 0183",
    aliases: ["NMEA", "NMEA0183"],
    category: "protocol",
    fullName: t(
      "National Marine Electronics Association, padrão 0183",
      "National Marine Electronics Association, standard 0183",
    ),
    oneLiner: t(
      "O idioma dos sensores de navegação: cada mensagem é uma linha de texto padronizada que o sensor escreve e qualquer software sabe ler, porque todo mundo segue a mesma regra.",
      "The language of navigation sensors: every message is one standardised line of text that a sensor writes and any software can read, because everyone follows the same rule.",
    ),
    analogy: t(
      "Um formulário de uma linha: o tipo da mensagem vem primeiro e os campos aparecem sempre na mesma ordem, separados por vírgula.",
      "A one-line form: the message type comes first and the fields always appear in the same order, separated by commas.",
    ),
    details: [
      t(
        "Criado pela National Marine Electronics Association (associação de eletrônicos marítimos dos EUA): define como um sensor de navegação escreve o dado dele em texto.",
        "Created by the National Marine Electronics Association (the US marine electronics association): it defines how a navigation sensor writes its data as text.",
      ),
      t(
        "Cada mensagem começa com $, tem um código que diz o tipo (talker + sentença) e termina com * e um checksum.",
        "Each message starts with $, has a code that says its type (talker + sentence) and ends with * and a checksum.",
      ),
      t(
        "Exemplos: $HEHDT = heading do giro, $GPGGA = posição GPS, $--ZDA = data/hora.",
        "Examples: $HEHDT = gyro heading, $GPGGA = GPS position, $--ZDA = date/time.",
      ),
      t(
        "Esse texto normalmente viaja pelo cabo serial; o serial server o coloca na rede (TCP/IP).",
        "This text normally travels over the serial cable; the serial server puts it on the network (TCP/IP).",
      ),
      t(
        "Alguns sensores também usam sentenças proprietárias ($P...) ou formatos binários, que o Decode não lê.",
        "Some sensors also use proprietary sentences ($P...) or binary formats, which the Decode lab does not read.",
      ),
    ],
    anatomy: {
      segments: [
        seg(
          "$GPGGA",
          'Talker "GP" (GPS) + tipo "GGA" = posição + altitude GPS',
          'Talker "GP" (GPS) + type "GGA" = position + GPS altitude',
        ),
        sep(","),
        seg("123519", "Hora: 12:35:19 UTC", "Time: 12:35:19 UTC"),
        sep(","),
        seg("4807.038", "Latitude: 48° 07,038′", "Latitude: 48° 07.038′"),
        sep(","),
        seg("N", "Hemisfério (N/S)", "Hemisphere (N/S)"),
        sep(","),
        seg("01131.000", "Longitude: 11° 31,000′", "Longitude: 11° 31.000′"),
        sep(","),
        seg("E", "Hemisfério (E/W)", "Hemisphere (E/W)"),
        sep(","),
        seg("1", "Qualidade do fix (1 = GPS)", "Fix quality (1 = GPS)"),
        sep(","),
        seg("08", "Número de satélites", "Number of satellites"),
        sep(","),
        seg("0.9", "HDOP (geometria dos satélites)", "HDOP (satellite geometry)"),
        sep(","),
        seg("545.4", "Altitude", "Altitude"),
        sep(","),
        seg("M", "Unidade da altitude: metros", "Altitude unit: metres"),
        sep(","),
        seg("46.9", "Separação do geoide", "Geoid separation"),
        sep(","),
        seg("M", "Unidade: metros", "Unit: metres"),
        sep(",,"),
        seg(
          "*47",
          "Checksum (confere se a linha chegou íntegra)",
          "Checksum (proves the line arrived intact)",
        ),
      ],
    },
    bidNote: t(
      "Confira qual formato cada sensor entrega (NMEA padrão ou proprietário) e quantas portas seriais o escopo precisa.",
      "Check which format each sensor outputs (standard NMEA or proprietary) and how many serial ports the scope needs.",
    ),
    equipmentIds: [
      "cnav-x1-receiver",
      "hemisphere-vs1000-receiver",
      "octans-9",
      "gyrocompass",
      "moxa-nport",
    ],
    linkKinds: ["data", "timing"],
    related: [
      "nmea-gga",
      "nmea-hdt",
      "nmea-zda",
      "nmea-checksum",
      "serial",
      "serial-server",
      "tcp-ip",
    ],
    validated: true,
  },
  {
    id: "nmea-gga",
    term: "GGA",
    aliases: ["$GPGGA", "GPGGA", "GNGGA"],
    category: "protocol",
    fullName: t("Global Positioning System Fix Data", "Global Positioning System Fix Data"),
    oneLiner: t(
      "Sentença NMEA de posição: hora, latitude, longitude, qualidade do fix, satélites, HDOP e altitude.",
      "NMEA position sentence: time, latitude, longitude, fix quality, satellites, HDOP and altitude.",
    ),
    analogy: t(
      "O cartão de posição do GNSS: onde estou, quando, e quão confiável é esse ponto.",
      "The GNSS position card: where I am, when, and how trustworthy that point is.",
    ),
    details: [
      t(
        "Ordem dos campos: hora, lat, N/S, lon, E/W, qualidade do fix, nº de satélites, HDOP, altitude, unidade, separação do geoide.",
        "Field order: time, lat, N/S, lon, E/W, fix quality, satellite count, HDOP, altitude, unit, geoid separation.",
      ),
      t(
        "O talker mostra a origem: GP = GPS, GL = GLONASS, GA = Galileo, GN = várias constelações.",
        "The talker shows the source: GP = GPS, GL = GLONASS, GA = Galileo, GN = multiple constellations.",
      ),
    ],
    equipmentIds: ["cnav-x1-receiver", "hemisphere-vs1000-receiver", "vessel-dgps"],
    linkKinds: ["data"],
    related: ["nmea-0183", "fix-quality", "hdop", "gnss"],
    validated: false,
  },
  {
    id: "nmea-hdt",
    term: "HDT",
    aliases: ["$HEHDT", "HEHDT", "$GPHDT"],
    category: "protocol",
    fullName: t("Heading, True", "Heading, True"),
    oneLiner: t(
      "Sentença NMEA de heading verdadeiro: para onde a proa aponta, em graus a partir do Norte verdadeiro.",
      "NMEA true-heading sentence: where the bow points, in degrees from true North.",
    ),
    analogy: t(
      "A bússola digital do navio, mas apontando para o Norte geográfico e não para o magnético.",
      "The vessel's digital compass, but pointing to geographic North instead of magnetic North.",
    ),
    anatomy: {
      segments: [
        seg(
          "$HEHDT",
          'Talker "HE" (giro) + tipo "HDT" = heading verdadeiro',
          'Talker "HE" (gyro) + type "HDT" = true heading',
        ),
        sep(","),
        seg("274.07", "Heading em graus (0 a 360)", "Heading in degrees (0 to 360)"),
        sep(","),
        seg("T", "T = True (Norte verdadeiro)", "T = True (true North)"),
        seg("*19", "Checksum", "Checksum"),
      ],
    },
    equipmentIds: ["gyrocompass", "octans-9", "vessel-gyro", "hemisphere-vs1000-receiver"],
    linkKinds: ["data"],
    related: ["nmea-0183", "gyrocompass"],
    validated: false,
  },
  {
    id: "nmea-zda",
    term: "ZDA",
    aliases: ["$GPZDA", "GPZDA"],
    category: "protocol",
    fullName: t("Time & Date", "Time & Date"),
    oneLiner: t(
      "Sentença NMEA de data e hora UTC. Junto com o pulso PPS, alinha o relógio de todos os computadores e sensores.",
      "NMEA UTC date-and-time sentence. Together with the PPS pulse it aligns the clock of every computer and sensor.",
    ),
    analogy: t(
      "O PPS é o tic exato do relógio; o ZDA diz que horas são naquele tic.",
      "PPS is the exact tick of the clock; ZDA says what time it is at that tick.",
    ),
    anatomy: {
      segments: [
        seg(
          "$GPZDA",
          'Talker "GP" + tipo "ZDA" = data e hora',
          'Talker "GP" + type "ZDA" = date and time',
        ),
        sep(","),
        seg("123519.00", "Hora UTC (hhmmss.ss)", "UTC time (hhmmss.ss)"),
        sep(","),
        seg("24", "Dia", "Day"),
        sep(","),
        seg("10", "Mês", "Month"),
        sep(","),
        seg("2026", "Ano", "Year"),
        sep(","),
        seg("00", "Horas do fuso local (00 = UTC)", "Local zone hours (00 = UTC)"),
        sep(","),
        seg("00", "Minutos do fuso local", "Local zone minutes"),
        seg("*6A", "Checksum", "Checksum"),
      ],
    },
    bidNote: t(
      "Todo equipamento que grava dado sincronizado precisa receber PPS + ZDA; o PPS/ZDA Splitter distribui os dois.",
      "Every device that logs synchronised data needs PPS + ZDA; the PPS/ZDA Splitter distributes both.",
    ),
    equipmentIds: ["pps-zda-splitter", "cnav-x1-receiver"],
    linkKinds: ["timing"],
    related: ["pps", "utc", "nmea-0183"],
    validated: false,
  },
  {
    id: "nmea-checksum",
    term: "Checksum",
    aliases: ["NMEA checksum"],
    category: "protocol",
    oneLiner: t(
      "Dois dígitos hexadecimais depois do * que provam que a linha NMEA chegou sem corrupção.",
      "Two hexadecimal digits after the * that prove the NMEA line arrived uncorrupted.",
    ),
    analogy: t(
      "Como o dígito verificador do CPF: se um caractere mudar no caminho, a conta não fecha.",
      "Like the check digit on a card number: if one character changes on the way, the sum no longer adds up.",
    ),
    details: [
      t(
        "É o XOR de todos os caracteres entre o $ e o *, escrito em hexadecimal.",
        "It is the XOR of every character between $ and *, written in hexadecimal.",
      ),
      t(
        "Software de aquisição descarta linhas com checksum errado; por isso ruído no cabo serial vira dado perdido, não dado errado.",
        "Acquisition software drops lines with a bad checksum, so noise on the serial cable becomes lost data, not wrong data.",
      ),
    ],
    related: ["nmea-0183", "serial"],
    validated: false,
  },
  {
    id: "serial",
    term: "Serial",
    aliases: ["RS-232", "RS232", "RS-422", "RS422", "serial port", "porta serial", "cabo serial"],
    category: "protocol",
    fullName: t("Porta serial (RS-232 / RS-422)", "Serial port (RS-232 / RS-422)"),
    oneLiner: t(
      "Cabo ponto a ponto que leva os bits um atrás do outro; é por onde a maioria dos sensores de navegação ainda entrega NMEA.",
      "Point-to-point cable that carries bits one after another; it is still how most navigation sensors deliver NMEA.",
    ),
    analogy: t(
      "Uma fila indiana num corredor: um bit por vez, e os dois lados combinam a velocidade antes (baud rate).",
      "A single-file line in a corridor: one bit at a time, and both ends agree on the speed first (baud rate).",
    ),
    details: [
      t(
        "RS-232 é simples e de curta distância; RS-422 é diferencial, mais robusto a ruído e a distâncias maiores.",
        "RS-232 is simple and short-range; RS-422 is differential, more robust to noise and longer runs.",
      ),
      t(
        "O padrão NMEA 0183 usa 4800 baud, mas muitos sensores aceitam velocidades maiores.",
        "NMEA 0183 defaults to 4800 baud, but many sensors accept higher speeds.",
      ),
      t(
        "Os dois lados precisam do mesmo baud rate e formato; senão o texto sai embaralhado.",
        "Both ends need the same baud rate and format, otherwise the text comes out garbled.",
      ),
    ],
    equipmentIds: ["moxa-nport", "cnav-x1-receiver", "octans-9", "gyrocompass"],
    linkKinds: ["data"],
    related: ["nmea-0183", "serial-server", "tcp-ip"],
    validated: false,
  },

  // ---- Network ----
  {
    id: "tcp-ip",
    term: "TCP/IP",
    aliases: ["TCP", "TCP-IP", "IP address", "endereço IP"],
    category: "network",
    fullName: t(
      "Transmission Control Protocol / Internet Protocol",
      "Transmission Control Protocol / Internet Protocol",
    ),
    oneLiner: t(
      "O conjunto de regras que faz a internet e qualquer rede ethernet funcionarem: o IP endereça e entrega, o TCP garante que chegou inteiro e na ordem.",
      "The set of rules that makes the internet and any ethernet network work: IP addresses and delivers, TCP guarantees it arrived whole and in order.",
    ),
    analogy: t(
      "IP é o envelope com endereço (o CEP da carta); TCP é o carteiro cuidadoso que confere se a carta inteira chegou, na ordem certa, com rastreamento e confirmação.",
      "IP is the addressed envelope (the postcode of a letter); TCP is the careful postman who checks the whole letter arrived, in the right order, with tracking and confirmation.",
    ),
    details: [
      t(
        "IP: cada equipamento tem um endereço (ex.: 192.168.1.50). O IP quebra o dado em pacotes e sabe para qual endereço mandar.",
        "IP: every device has an address (e.g. 192.168.1.50). IP breaks the data into packets and knows which address to send them to.",
      ),
      t(
        "TCP: confere se todos os pacotes chegaram, na ordem e sem erro, e pede reenvio se algo se perder.",
        "TCP: checks that all packets arrived, in order and error-free, and asks for a resend if something is lost.",
      ),
      t(
        "No survey: o serial server converte o NMEA serial em TCP/IP e os PCs online leem pela rede.",
        "In survey: the serial server turns serial NMEA into TCP/IP and the online PCs read it over the network.",
      ),
    ],
    anatomy: {
      segments: [
        seg(
          "192.168.1.50",
          "Endereço IP do equipamento (ex.: o serial server)",
          "IP address of the device (e.g. the serial server)",
        ),
        sep(":"),
        seg(
          "4001",
          "Porta TCP: qual porta serial dentro do equipamento",
          "TCP port: which serial port inside the device",
        ),
      ],
      note: t(
        "Valores de exemplo; a numeração real depende da configuração de cada equipamento.",
        "Example values; the real numbers depend on each device's configuration.",
      ),
    },
    bidNote: t(
      "Switches, portas e endereços precisam fechar no escopo: cada serial server expõe várias portas seriais pela mesma rede.",
      "Switches, ports and addresses have to add up in the scope: each serial server exposes several serial ports over the same network.",
    ),
    equipmentIds: ["network-switch", "moxa-nport", "online-master-pc", "survey-server"],
    linkKinds: ["data"],
    related: ["udp", "serial-server", "nmea-0183"],
    validated: true,
  },
  {
    id: "udp",
    term: "UDP",
    aliases: ["User Datagram Protocol"],
    category: "network",
    fullName: t("User Datagram Protocol", "User Datagram Protocol"),
    oneLiner: t(
      "O primo mais leve do TCP: envia sem confirmar a entrega, mais rápido e usado onde perder uma amostra não importa porque a próxima chega logo.",
      "TCP's lighter cousin: sends without confirming delivery, faster, and used where losing one sample does not matter because the next one arrives soon.",
    ),
    analogy: t(
      "Um cartão-postal: você joga na caixa e segue; ninguém confirma se chegou.",
      "A postcard: you drop it in the box and move on; nobody confirms it arrived.",
    ),
    details: [
      t(
        "Comum em fluxos contínuos de posição ou heading: se uma sentença se perde, a seguinte a substitui.",
        "Common in continuous position or heading streams: if one sentence is lost, the next one replaces it.",
      ),
    ],
    related: ["tcp-ip", "serial-server"],
    validated: false,
  },
  {
    id: "serial-server",
    term: "Serial server",
    aliases: ["MOXA NPort", "NPort", "device server", "serial-to-ethernet"],
    category: "network",
    fullName: t("Servidor de dispositivos seriais", "Serial device server"),
    oneLiner: t(
      "Caixa que pega a porta serial dos sensores e a coloca na rede (TCP/IP), para os PCs online lerem de qualquer ponto.",
      "A box that takes the sensors' serial ports and puts them on the network (TCP/IP) so the online PCs can read them from anywhere.",
    ),
    analogy: t(
      "Um tradutor e despachante: recebe a fila indiana serial e a empacota em envelopes TCP/IP.",
      "A translator and dispatcher: takes the serial single-file line and packs it into TCP/IP envelopes.",
    ),
    details: [
      t(
        "Cada porta serial vira um número de porta TCP (ex.: 4001, 4002...).",
        "Each serial port becomes a TCP port number (e.g. 4001, 4002...).",
      ),
      t(
        "No spread completo há três: sala de survey, ponte e controle do ROV.",
        "The full spread uses three: survey room, bridge and ROV control.",
      ),
    ],
    bidNote: t(
      "Conte as portas seriais necessárias (GNSS, giro, MRU, rádio) para dimensionar o serial server.",
      "Count the serial ports needed (GNSS, gyro, MRU, radio) to size the serial server.",
    ),
    equipmentIds: ["moxa-nport", "network-switch"],
    linkKinds: ["data"],
    related: ["serial", "tcp-ip", "nmea-0183"],
    validated: false,
  },

  // ---- Timing ----
  {
    id: "pps",
    term: "PPS",
    aliases: ["1PPS", "pulse per second", "pulso por segundo"],
    category: "timing",
    fullName: t("Pulse Per Second (pulso por segundo)", "Pulse Per Second"),
    oneLiner: t(
      "Um pulso elétrico exato, uma vez por segundo, emitido pelo receptor GNSS: o tic que alinha o relógio de todos os sistemas.",
      "An exact electrical pulse, once per second, emitted by the GNSS receiver: the tick that aligns the clock of every system.",
    ),
    analogy: t(
      "O apito do árbitro marca o instante exato; o ZDA diz que hora o apito representa.",
      "The referee's whistle marks the exact instant; ZDA says which time the whistle stands for.",
    ),
    details: [
      t(
        "Não é texto NMEA: é um sinal elétrico separado, por isso o PPS/ZDA Splitter distribui os dois.",
        "It is not NMEA text: it is a separate electrical signal, which is why the PPS/ZDA Splitter distributes both.",
      ),
      t(
        "É muito mais preciso que a hora enviada por mensagem serial, que sofre atraso de transmissão.",
        "It is far more precise than the time sent in a serial message, which suffers transmission delay.",
      ),
    ],
    bidNote: t(
      "Multifeixe, USBL e PCs online que gravam dado sincronizado precisam de uma saída PPS; dimensione o splitter.",
      "Multibeam, USBL and online PCs that log synchronised data need a PPS output; size the splitter accordingly.",
    ),
    equipmentIds: ["pps-zda-splitter", "cnav-x1-receiver"],
    linkKinds: ["timing"],
    related: ["nmea-zda", "utc", "mbes"],
    validated: false,
  },
  {
    id: "utc",
    term: "UTC",
    aliases: ["Coordinated Universal Time", "hora UTC"],
    category: "timing",
    fullName: t("Tempo Universal Coordenado", "Coordinated Universal Time"),
    oneLiner: t(
      "O relógio único que todos os sensores usam, independente do fuso do navio.",
      "The single clock every sensor uses, regardless of the vessel's time zone.",
    ),
    analogy: t(
      "O fuso de referência do mundo: se todos usam a mesma hora, dados de sensores diferentes se alinham sem conversa.",
      "The world's reference time zone: if everyone uses the same time, data from different sensors lines up with no conversion.",
    ),
    details: [
      t(
        "Os dados de survey são carimbados em UTC (via ZDA + PPS) para poder cruzar posição, profundidade e vídeo.",
        "Survey data is time-stamped in UTC (via ZDA + PPS) so that position, depth and video can be matched.",
      ),
      t(
        "O tempo GPS difere do UTC por alguns segundos (leap seconds); o receptor já corrige isso.",
        "GPS time differs from UTC by a few seconds (leap seconds); the receiver already corrects for it.",
      ),
    ],
    related: ["pps", "nmea-zda"],
    validated: false,
  },

  // ---- Positioning ----
  {
    id: "gnss",
    term: "GNSS",
    aliases: ["GPS", "GLONASS", "Galileo", "BeiDou"],
    category: "positioning",
    fullName: t("Global Navigation Satellite System", "Global Navigation Satellite System"),
    oneLiner: t(
      "Nome genérico dos sistemas de satélites de navegação (GPS, GLONASS, Galileo, BeiDou): o receptor calcula a posição medindo a distância a vários satélites.",
      "Generic name for satellite navigation systems (GPS, GLONASS, Galileo, BeiDou): the receiver computes position by measuring the distance to several satellites.",
    ),
    analogy: t(
      "Como o GPS do carro, mas com antena e correções de nível profissional para chegar a decímetros ou centímetros.",
      "Like a car GPS, but with a professional antenna and corrections to reach decimetres or centimetres.",
    ),
    details: [
      t(
        "Sozinho dá precisão de metros; as correções (DGPS, RTK, PPP) refinam o resultado.",
        "On its own it gives metre-level accuracy; corrections (DGPS, RTK, PPP) refine it.",
      ),
      t(
        "Precisa de céu aberto, por isso a antena fica no mastro.",
        "It needs open sky, which is why the antenna sits on the mast.",
      ),
    ],
    equipmentIds: [
      "cnav-x1-antenna",
      "cnav-x1-receiver",
      "hemisphere-vs1000-receiver",
      "vessel-dgps",
    ],
    linkKinds: ["rf", "data"],
    related: ["dgps", "rtk", "ppp", "fix-quality", "hdop"],
    validated: false,
  },
  {
    id: "dgps",
    term: "DGPS",
    aliases: ["differential GPS", "GPS diferencial"],
    category: "positioning",
    fullName: t("Differential GPS", "Differential GPS"),
    oneLiner: t(
      "GNSS com correções diferenciais: uma referência de posição conhecida calcula o erro e transmite a correção ao receptor.",
      "GNSS with differential corrections: a reference at a known position computes the error and broadcasts the correction to the receiver.",
    ),
    analogy: t(
      "Dois navegadores no mesmo carro: um sabe exatamente onde está e avisa o outro que ele está 2 m à esquerda.",
      "Two navigators in the same car: one knows exactly where he is and tells the other he is 2 m to the left.",
    ),
    details: [
      t(
        "As correções chegam por rádio ou por satélite.",
        "Corrections arrive by radio or by satellite.",
      ),
      t(
        "Leva a precisão de alguns metros para cerca de 1 metro ou menos.",
        "It improves accuracy from a few metres to around 1 metre or better.",
      ),
    ],
    equipmentIds: ["vessel-dgps"],
    linkKinds: ["rf"],
    related: ["gnss", "rtk", "ppp", "fix-quality"],
    validated: false,
  },
  {
    id: "rtk",
    term: "RTK",
    aliases: ["Real Time Kinematic"],
    category: "positioning",
    fullName: t("Real Time Kinematic", "Real Time Kinematic"),
    oneLiner: t(
      "Correção em tempo real que usa a fase da onda portadora do sinal para chegar a centímetros; precisa de uma base ou rede próxima.",
      "Real-time correction that uses the phase of the signal's carrier wave to reach centimetres; it needs a nearby base or network.",
    ),
    analogy: t(
      "Contar as ondas do sinal em vez de só medir o tempo: é medir com régua milimetrada em vez de passos.",
      "Counting the waves of the signal instead of just timing it: like measuring with a millimetre ruler instead of paces.",
    ),
    details: [
      t(
        "Fixed (fix 4): ambiguidades resolvidas, centímetros. Float (fix 5): ainda convergindo, decímetros.",
        "Fixed (fix 4): ambiguities resolved, centimetres. Float (fix 5): still converging, decimetres.",
      ),
      t(
        "O alcance é limitado pela distância à base, por isso é menos comum offshore, longe da costa.",
        "Range is limited by the distance to the base, so it is less common offshore, far from the coast.",
      ),
    ],
    related: ["gnss", "dgps", "ppp", "fix-quality"],
    validated: false,
  },
  {
    id: "ppp",
    term: "PPP",
    aliases: ["Precise Point Positioning"],
    category: "positioning",
    fullName: t("Precise Point Positioning", "Precise Point Positioning"),
    oneLiner: t(
      "Precisão de decímetros a centímetros em qualquer lugar do mundo, usando órbitas e relógios de satélite precisos, sem estação base própria.",
      "Decimetre-to-centimetre accuracy anywhere in the world, using precise satellite orbits and clocks, with no base station of your own.",
    ),
    analogy: t(
      "Em vez de pedir ajuda a um vizinho (a base RTK), você recebe do satélite a tabela de correções do mundo todo.",
      "Instead of asking a neighbour for help (the RTK base), you receive the worldwide correction table from the satellite.",
    ),
    details: [
      t(
        "Precisa de alguns minutos de convergência depois de ligar.",
        "It needs a few minutes of convergence after switching on.",
      ),
      t(
        "Serviços comerciais, como o C-Nav, entregam essas correções por satélite.",
        "Commercial services, such as C-Nav, deliver these corrections by satellite.",
      ),
    ],
    bidNote: t(
      "Correção por satélite costuma ser assinatura ou licença, não só hardware: confirme no escopo.",
      "Satellite correction is usually a subscription or licence, not only hardware: confirm it in the scope.",
    ),
    equipmentIds: ["cnav-x1-receiver", "cnav-iridium-antenna"],
    linkKinds: ["rf"],
    related: ["gnss", "dgps", "rtk"],
    validated: false,
  },
  {
    id: "fix-quality",
    term: "Fix quality",
    aliases: ["fix type", "qualidade do fix"],
    category: "positioning",
    oneLiner: t(
      "Número no GGA que diz o tipo de solução de posição do receptor: 0 = sem fix, 1 = GPS, 2 = DGPS, 4 = RTK fixo, 5 = RTK float.",
      "Number in the GGA that says which kind of position solution the receiver has: 0 = no fix, 1 = GPS, 2 = DGPS, 4 = RTK fixed, 5 = RTK float.",
    ),
    analogy: t(
      "O selo de qualidade da posição: diz de que jeito ela foi calculada, e portanto quanto confiar nela.",
      "The position's quality stamp: it says how it was computed, and therefore how far to trust it.",
    ),
    details: [
      t(
        "No survey, o fix muda sem aviso: ver o 2 virar 1 significa que a correção diferencial caiu.",
        "In survey the fix can change without warning: seeing 2 drop to 1 means the differential correction was lost.",
      ),
    ],
    related: ["nmea-gga", "gnss", "dgps", "rtk", "hdop"],
    validated: false,
  },
  {
    id: "hdop",
    term: "HDOP",
    aliases: ["DOP", "dilution of precision"],
    category: "positioning",
    fullName: t("Horizontal Dilution of Precision", "Horizontal Dilution of Precision"),
    oneLiner: t(
      "Número que diz como a geometria dos satélites afeta a precisão horizontal: quanto menor, melhor.",
      "Number that says how the satellite geometry affects horizontal accuracy: the lower, the better.",
    ),
    analogy: t(
      "Três pessoas apontando de ângulos diferentes fecham bem a posição; todas juntas num canto, a incerteza cresce.",
      "Three people pointing from different angles pin a position down well; all bunched in one corner, the uncertainty grows.",
    ),
    details: [
      t(
        "Perto de 1 é excelente; acima de uns 5, desconfie da posição.",
        "Close to 1 is excellent; above about 5, be wary of the position.",
      ),
      t("Vem no campo 8 da sentença GGA.", "It is field 8 of the GGA sentence."),
    ],
    related: ["nmea-gga", "gnss", "fix-quality"],
    validated: false,
  },

  // ---- Heading & motion ----
  {
    id: "gyrocompass",
    term: "Gyrocompass",
    aliases: ["gyro", "giro", "girobússola", "heading sensor"],
    category: "motion",
    oneLiner: t(
      "Sensor que acha o Norte verdadeiro sozinho, pela rotação da Terra, e entrega o heading da proa sem depender de magnetismo ou de satélite.",
      "Sensor that finds true North by itself, from the Earth's rotation, and delivers the bow heading without relying on magnetism or satellites.",
    ),
    analogy: t(
      "Uma bússola que não se confunde com o aço do navio: aponta ao Norte geográfico pela rotação da Terra.",
      "A compass that is not fooled by the ship's steel: it points to geographic North using the Earth's rotation.",
    ),
    details: [
      t(
        "Normalmente entrega $HEHDT por cabo serial.",
        "It normally delivers $HEHDT over a serial cable.",
      ),
      t(
        "O heading é a base para posicionar tudo que fica deslocado da antena GNSS: USBL, multifeixe, ROV.",
        "Heading is the basis for positioning everything offset from the GNSS antenna: USBL, multibeam, ROV.",
      ),
    ],
    bidNote: t(
      "Heading preciso é crítico para USBL e multifeixe; confirme a classe de precisão do giro.",
      "Accurate heading is critical for USBL and multibeam; confirm the gyro's accuracy class.",
    ),
    equipmentIds: ["gyrocompass", "octans-9", "vessel-gyro", "rov-gyro"],
    linkKinds: ["data"],
    related: ["nmea-hdt", "mru", "ins", "usbl"],
    validated: false,
  },
  {
    id: "mru",
    term: "MRU",
    aliases: ["motion reference unit", "motion sensor"],
    category: "motion",
    fullName: t("Motion Reference Unit", "Motion Reference Unit"),
    oneLiner: t(
      "Sensor que mede o balanço do navio (heave, pitch e roll) para que os outros sensores compensem o movimento.",
      "Sensor that measures the vessel's motion (heave, pitch and roll) so the other sensors can compensate for it.",
    ),
    analogy: t(
      "O ouvido interno do navio: sente cada movimento para os outros sensores se ajustarem.",
      "The vessel's inner ear: it feels every movement so the other sensors can adjust.",
    ),
    details: [
      t(
        "Heave é subir e descer, pitch é o cabeceio e roll é o balanço lateral.",
        "Heave is up and down, pitch is bow-to-stern tilt and roll is side-to-side tilt.",
      ),
      t(
        "Sem MRU, um multifeixe desenha o fundo do mar ondulando junto com as ondas.",
        "Without an MRU, a multibeam draws the seabed rolling along with the waves.",
      ),
    ],
    equipmentIds: ["surface-mru", "vessel-mru", "octans-9"],
    linkKinds: ["data"],
    related: ["ins", "gyrocompass", "mbes", "usbl"],
    validated: false,
  },
  {
    id: "ins",
    term: "INS",
    aliases: ["inertial navigation", "inertial navigation system", "navegação inercial"],
    category: "motion",
    fullName: t("Inertial Navigation System", "Inertial Navigation System"),
    oneLiner: t(
      "Sistema que funde giros e acelerômetros (e GNSS ou DVL) para entregar posição, heading e movimento contínuos, mesmo quando o sinal cai.",
      "System that fuses gyros and accelerometers (and GNSS or DVL) to deliver continuous position, heading and motion even when the signal drops.",
    ),
    analogy: t(
      "Navegar de olhos fechados contando passos: você sabe onde está por um tempo e, ao abrir os olhos (GNSS ou DVL), corrige a deriva.",
      "Navigating with your eyes closed by counting steps: you know where you are for a while and, when you open your eyes (GNSS or DVL), you correct the drift.",
    ),
    details: [
      t(
        "Subsea, o INS do ROV mantém a posição entre as atualizações acústicas do USBL.",
        "Subsea, the ROV's INS holds the position between USBL acoustic updates.",
      ),
    ],
    equipmentIds: ["surface-mru", "subsea-heading-motion"],
    linkKinds: ["data", "subsea"],
    related: ["mru", "gyrocompass", "dvl", "usbl"],
    validated: false,
  },
  {
    id: "dvl",
    term: "DVL",
    aliases: ["Doppler Velocity Log"],
    category: "motion",
    fullName: t("Doppler Velocity Log", "Doppler Velocity Log"),
    oneLiner: t(
      "Mede a velocidade do veículo em relação ao fundo (ou à água) usando o efeito Doppler de pulsos acústicos.",
      "Measures the vehicle's speed relative to the seabed (or the water) using the Doppler effect of acoustic pulses.",
    ),
    analogy: t(
      "O velocímetro do ROV: não diz onde ele está, mas com que velocidade se move.",
      "The ROV's speedometer: it does not say where it is, only how fast it moves.",
    ),
    details: [
      t(
        "Ajuda o INS a manter a posição entre as atualizações do USBL.",
        "It helps the INS hold position between USBL updates.",
      ),
    ],
    equipmentIds: ["dvl", "subsea-heading-motion"],
    linkKinds: ["subsea"],
    related: ["ins", "usbl"],
    validated: false,
  },

  // ---- Acoustics ----
  {
    id: "usbl",
    term: "USBL",
    aliases: ["ultra-short baseline", "ultra short baseline"],
    category: "acoustic",
    fullName: t("Ultra-Short Baseline", "Ultra-Short Baseline"),
    oneLiner: t(
      "Posicionamento acústico que acha um beacon submarino medindo a direção e o tempo de ida e volta do som a partir do navio.",
      "Acoustic positioning that finds a subsea beacon by measuring the direction and round-trip time of sound from the vessel.",
    ),
    analogy: t(
      "Um GPS feito de som: o navio grita, o beacon responde, e pelo tempo do eco e pelo ângulo de chegada se sabe onde ele está.",
      "A GPS made of sound: the vessel shouts, the beacon answers, and the echo time and arrival angle say where it is.",
    ),
    details: [
      t(
        "Precisa do heading, do MRU e do GNSS do navio para transformar a medida em coordenadas.",
        "It needs the vessel's heading, MRU and GNSS to turn the measurement into coordinates.",
      ),
      t(
        "Velocidade do som errada dá distância errada, por isso se mede o SVP.",
        "A wrong sound velocity gives a wrong distance, which is why the SVP is measured.",
      ),
    ],
    bidNote: t(
      "Custo e precisão dependem do alcance (profundidade) e do número de beacons.",
      "Cost and accuracy depend on range (depth) and on the number of beacons.",
    ),
    equipmentIds: ["usbl-transceiver", "usbl-topside-unit", "ranger2-subsea-head", "mini-beacons"],
    linkKinds: ["acoustic"],
    related: ["transponder", "lbl", "sound-velocity", "gyrocompass", "mru"],
    validated: false,
  },
  {
    id: "lbl",
    term: "LBL",
    aliases: ["long baseline"],
    category: "acoustic",
    fullName: t("Long Baseline", "Long Baseline"),
    oneLiner: t(
      "Rede de transponders fixos no fundo do mar: a ferramenta mede a distância até cada um e calcula a posição por triangulação, de forma independente do navio.",
      "Network of fixed transponders on the seabed: the tool measures the distance to each one and computes position by triangulation, independent of the vessel.",
    ),
    analogy: t(
      "Faróis fixos no fundo: se você sabe a distância até três faróis, sabe exatamente onde está no mapa.",
      "Fixed lighthouses on the bottom: if you know the distance to three of them, you know exactly where you are on the map.",
    ),
    details: [
      t(
        "A rede precisa ser calibrada (posições dos transponders) antes de operar.",
        "The network has to be calibrated (transponder positions) before operating.",
      ),
    ],
    equipmentIds: ["lbl-transceiver", "compatt"],
    linkKinds: ["acoustic"],
    related: ["usbl", "transponder", "sound-velocity"],
    validated: false,
  },
  {
    id: "transponder",
    term: "Transponder",
    aliases: ["beacon", "beacons", "transponders", "transponder acústico"],
    category: "acoustic",
    fullName: t("Transponder / beacon acústico", "Acoustic transponder / beacon"),
    oneLiner: t(
      "Dispositivo acústico no fundo ou no ROV que responde quando chamado pelo navio, permitindo medir sua posição.",
      "Acoustic device on the seabed or on the ROV that answers when called by the vessel, so its position can be measured.",
    ),
    analogy: t(
      "Um eco com identidade: você grita, ele responde sou eu, e o tempo da resposta mostra a distância.",
      "An echo with an identity: you shout, it answers it's me, and the answer's timing shows the distance.",
    ),
    bidNote: t(
      "Beacons têm bateria: considere o carregador e a quantidade para o plano de operação.",
      "Beacons run on batteries: consider the charger and the quantity for the operating plan.",
    ),
    equipmentIds: ["mini-beacons", "c-node", "compatt", "beacon-charger"],
    linkKinds: ["acoustic"],
    related: ["usbl", "lbl"],
    validated: false,
  },
  {
    id: "sound-velocity",
    term: "Sound velocity",
    aliases: ["SVP", "SVS", "sound velocity profile", "sound speed", "velocidade do som"],
    category: "acoustic",
    fullName: t("Velocidade do som na água", "Speed of sound in water"),
    oneLiner: t(
      "A velocidade do som na água na profundidade medida: o dado que o USBL e o multifeixe usam para converter tempo de eco em distância.",
      "The speed of sound in water at the measured depth: the data USBL and multibeam use to convert echo time into distance.",
    ),
    analogy: t(
      "É a régua do sonar: se a régua estiver esticada ou encolhida, toda distância medida sai errada.",
      "It is the sonar's ruler: if the ruler is stretched or shrunk, every measured distance comes out wrong.",
    ),
    details: [
      t(
        "A velocidade muda com temperatura, salinidade e pressão; por isso se mede um perfil (SVP) com uma sonda ou pontualmente (SVS) junto ao transdutor.",
        "Speed changes with temperature, salinity and pressure, so a profile (SVP) is measured with a probe, or a point value (SVS) next to the transducer.",
      ),
    ],
    bidNote: t(
      "Multifeixe e USBL pedem velocidade do som: confirme se haverá perfilador e/ou sonda de superfície.",
      "Multibeam and USBL need sound velocity: confirm whether a profiler and/or a surface probe will be provided.",
    ),
    equipmentIds: ["svp", "mini-svs", "svx2"],
    linkKinds: ["data", "subsea"],
    related: ["usbl", "mbes", "lbl"],
    validated: false,
  },
  {
    id: "mbes",
    term: "MBES",
    aliases: ["multibeam", "multibeam echosounder", "multifeixe"],
    category: "acoustic",
    fullName: t("Multibeam Echosounder", "Multibeam Echosounder"),
    oneLiner: t(
      "Sonar que emite um leque de feixes e mede dezenas a centenas de profundidades de uma vez, formando um mapa 3D do fundo do mar.",
      "Sonar that emits a fan of beams and measures tens to hundreds of depths at once, building a 3D map of the seabed.",
    ),
    analogy: t(
      "Em vez de uma lanterna apontando um ponto, um farol varrendo uma faixa inteira.",
      "Instead of a torch pointing at one spot, a lighthouse sweeping a whole swath.",
    ),
    details: [
      t(
        "Para virar coordenadas precisa de posição, heading, MRU, velocidade do som e tempo (PPS): por isso o spread tem tudo isso.",
        "To become coordinates it needs position, heading, MRU, sound velocity and timing (PPS): that is why the spread has all of these.",
      ),
    ],
    equipmentIds: ["mbes", "r2sonic-heads", "naviscan-mbes-pc"],
    linkKinds: ["data", "timing"],
    related: ["sound-velocity", "mru", "gyrocompass", "pps"],
    validated: false,
  },
];
