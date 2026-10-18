# Guia do catálogo do Survey Portal (passo a passo)

Este guia ensina qualquer pessoa a **criar famílias, equipamentos, apelidos, conexões, sistemas e diagramas** do Survey Portal, sem mexer em código. Tudo é feito editando **um único arquivo** e importando no portal.

> Arquivo que você vai editar: `templates/survey-catalog/survey-catalog.seed.json`
> Modelo pronto para novos diagramas: `templates/survey-catalog/new-spread-template.jsonc`

---

## 1. Como as peças se encaixam

```text
survey-catalog.seed.json
├── families[]    Famílias (ex.: "Positioning & Acoustics")
├── equipment[]   Equipamentos, cada um dentro de UMA família
├── systems[]     Sistemas = grupos de equipamentos que trabalham juntos
└── spreads[]     Diagramas (ex.: "Full Survey Spread")
    ├── categories[]  Grupos de BID (Topside, Subsea / ROV, Infrastructure)
    ├── zones[]       Zonas = "salas" do diagrama (Mast, Survey Online, Bridge...)
    │   └── lines[]   Equipamentos da zona + quantidade
    ├── links[]       Cabos/conexões entre equipamentos
    └── pipeline[]    Etapas depois do hardware (software, storage, entregável)
```

Fluxo de trabalho: **editar o seed → validar → importar no portal → conferir**.

| Quero... | Vá para |
| --- | --- |
| Criar uma família | [Seção 4](#4-criar-uma-família) |
| Criar um equipamento | [Seção 5](#5-criar-um-equipamento) |
| Adicionar apelidos (aliases) | [Seção 6](#6-adicionar-apelidos-aliases) |
| Ligar equipamentos entre si (aliados / filhos) | [Seção 7](#7-conectar-equipamentos-aliados-e-filhos) |
| Colocar foto no equipamento | [Seção 8](#8-foto-do-equipamento) |
| Criar um sistema | [Seção 9](#9-criar-um-sistema) |
| Criar um diagrama (spread) | [Seção 10](#10-criar-um-diagrama-spread) |
| Criar grupo de diagrama (categoria ou zona) | [Seção 11](#11-grupos-do-diagrama-categorias-e-zonas) |
| Publicar no portal | [Seção 12](#12-importar-no-portal) |
| Resolver problemas | [Seção 14](#14-problemas-comuns) |

---

## 2. Antes de começar

1. Trabalhe sempre na branch do projeto (`feat/survey-knowledge-portal`), nunca direto na `main`.
2. Abra `templates/survey-catalog/survey-catalog.seed.json` no VS Code.
3. Regras do JSON (o erro mais comum é aqui):
   - Todo texto vai entre **aspas duplas** `"..."`.
   - Itens de uma lista são separados por **vírgula**, mas **o último item não tem vírgula** depois dele.
   - Não pode haver comentários (`//`) dentro do `survey-catalog.seed.json`. Comentários só existem no arquivo de modelo `.jsonc`.
   - Todo `id` é em minúsculas, **sem espaços e sem acentos**, com hífen (ex.: `video-recorder`). **O id nunca deve mudar depois de importado.**
4. Dica: use `Shift + Alt + F` para formatar o arquivo e conferir a indentação.

### Validar o arquivo (sempre antes de importar)

No terminal, na raiz do projeto:

```powershell
node -e "const c=JSON.parse(require('fs').readFileSync('templates/survey-catalog/survey-catalog.seed.json','utf8'));const ids=c.equipment.map(e=>e.id);console.log('equipamentos',ids.length,'ids duplicados',ids.filter((x,i)=>ids.indexOf(x)!==i))"
```

- Se aparecer erro de sintaxe, há vírgula ou aspas faltando perto da linha indicada.
- `ids duplicados []` (lista vazia) significa que está tudo certo.

---

## 3. Listas de valores permitidos

Use estas listas ao preencher os campos. Valores fora delas não quebram o portal, mas o item não aparecerá no lugar certo.

### `sceneAnchor` (onde o equipamento aparece no 3D)

| Valor | Local |
| --- | --- |
| `mast` | Mastro (antenas) |
| `bridge` | Ponte |
| `survey-online` | Sala Survey Online |
| `rov-control` | Sala de controle do ROV |
| `vessel` | Embarcação em geral (cai na sala Survey Online) |
| `vessel-hull` | Casco (ex.: cabeça do USBL) |
| `umbilical` | Umbilical |
| `rov` | No ROV |
| `beacons` | Beacons no leito |
| `seabed` | Leito marinho |
| `subsea-target` | Alvo subsea |
| `gnss` | Satélites GNSS |

### `sceneShape` (forma 3D do equipamento)

`monitor`, `workstation`, `rack`, `switch`, `serial-box`, `receiver`, `gnss-dome`, `whip-antenna`, `panel-antenna`, `radio`, `ups`, `printer`, `gyro`, `probe`, `subsea-bottle`, `sonar-head`, `camera`, `laser`, `coil-frame`, `transponder`, `fibre-reel`, `network-cloud`, `software`, `system-core`

Se deixar vazio, o portal tenta escolher uma forma pelo nome. Prefira sempre preencher.

### `dataRole` (papel do equipamento no fluxo de dados)

| Valor | Significado |
| --- | --- |
| `source` | Sensor que origina o dado |
| `rf-frontend` | Antena ou rádio |
| `transport` | Transporta o dado (rede, cabo, MUX) |
| `compute` | Processa (PC, software) |
| `storage` | Armazena |
| `display` | Mostra (monitor) |
| `support` | Apoio (energia, carregador) |

### `dataTypes` (o que o equipamento produz ou carrega)

`position`, `heading`, `motion`, `depth`, `altitude`, `sound-velocity`, `bathymetry`, `acoustic-position`, `pipe-tracking`, `video`, `time-sync`, `corrections`, `comms`

Equipamento que não gera dado (ex.: carregador) deixa `dataTypes` vazio ou omite o campo.

---

## 4. Criar uma família

Família é a categoria do equipamento. Veja as existentes no início do seed (`"families"`).

**Passo a passo**

1. Role até o início do arquivo, dentro de `"families": [ ... ]`.
2. Copie um bloco existente e cole depois do último (lembre da vírgula entre os blocos).
3. Preencha:

```json
{
  "id": "video-systems",
  "title": "Video Systems",
  "description": "Gravação, overlay e distribuição de vídeo do ROV.",
  "order": 11
}
```

| Campo | Regra |
| --- | --- |
| `id` | Único, minúsculo, com hífen. É o que os equipamentos usam em `familyId`. |
| `title` | Nome mostrado no portal. |
| `description` | Uma frase explicando a família. |
| `order` | Posição na lista. Use o próximo número livre (hoje vai até 10). |

4. Valide o arquivo ([seção 2](#validar-o-arquivo-sempre-antes-de-importar)) e importe ([seção 12](#12-importar-no-portal)).

---

## 5. Criar um equipamento

**Passo a passo**

1. Dentro de `"equipment": [ ... ]`, copie um equipamento parecido com o que você quer criar (mesma família ou mesmo tipo).
2. Cole no final da lista (depois da vírgula do último) ou ao lado de equipamentos relacionados.
3. Troque **todos** os campos pelos do novo equipamento.
4. Mude o `id` para um valor novo e único. Duplicar `id` sobrescreve o equipamento antigo.

### Modelo completo (copie e preencha)

```json
{
  "id": "video-recorder",
  "dataRole": "compute",
  "dataTypes": ["video"],
  "sceneShape": "workstation",
  "familyId": "data-acquisition",
  "title": "Video Recorder",
  "technology": "VIDEO",
  "aliases": ["DVR", "Video overlay PC"],
  "summary": "Frase curta que aparece no card.",
  "whatIsIt": "O que é o equipamento, em linguagem simples.",
  "whatDoesItDo": "O que ele faz no sistema (o que recebe e o que entrega).",
  "partNumber": "",
  "manufacturer": "",
  "model": "",
  "divisions": ["SSR-Survey", "SSR-ROV"],
  "serviceLines": ["Survey", "IMR"],
  "status": "Active",
  "usedIn": ["Pipeline Inspection"],
  "connectsTo": ["ROV Camera Feeds", "RAID Video Storage"],
  "whereItFits": [
    { "label": "ROV Cameras" },
    { "label": "Video Recorder", "equipmentId": "video-recorder" },
    { "label": "RAID Storage" }
  ],
  "bidConsiderations": ["Channel count", "Storage"],
  "sceneAnchor": "survey-online",
  "imageUrl": null,
  "datasheetUrl": null,
  "order": 3
}
```

### O que cada campo faz

| Campo | Obrigatório | Explicação |
| --- | --- | --- |
| `id` | Sim | Identificador único. Nunca mude depois de importar. |
| `familyId` | Sim | `id` de uma família existente ([seção 4](#4-criar-uma-família)). |
| `title` | Sim | Nome mostrado no portal. |
| `technology` | Sim | Tag em maiúsculas acima do título (ex.: `ACOUSTIC POSITIONING`). |
| `aliases` | Não | Apelidos ([seção 6](#6-adicionar-apelidos-aliases)). |
| `summary` | Sim | Uma frase curta para o card. |
| `whatIsIt` | Sim | O que é. Escreva para quem nunca viu o equipamento. |
| `whatDoesItDo` | Sim | O que faz, **o que recebe e o que entrega**. É o texto mais importante para o aprendizado. |
| `partNumber`, `manufacturer`, `model` | Não | Deixe `""` se não souber. O `partNumber` também ajuda a achar o equipamento nos BIDs. |
| `divisions`, `serviceLines` | Não | Divisões e linhas de serviço que usam o equipamento. |
| `status` | Sim | Use `"Active"`. |
| `usedIn` | Não | Operações onde é usado (ex.: `"Pipeline Inspection"`). |
| `connectsTo` | Não | Com quem se conecta ([seção 7](#7-conectar-equipamentos-aliados-e-filhos)). |
| `whereItFits` | Não | Cadeia "onde ele se encaixa" ([seção 7](#7-conectar-equipamentos-aliados-e-filhos)). |
| `bidConsiderations` | Não | O que influencia o escopo e o preço no BID (licença, quantidade, bateria...). |
| `sceneAnchor` | Sim | Onde aparece no 3D (lista na [seção 3](#3-listas-de-valores-permitidos)). |
| `sceneShape` | Recomendado | Forma 3D (lista na seção 3). |
| `dataRole`, `dataTypes` | Recomendado | Papel no fluxo de dados (lista na seção 3). Alimenta o "Trace" de sinal. |
| `imageUrl`, `datasheetUrl` | Não | Deixe `null`. Foto: [seção 8](#8-foto-do-equipamento). |
| `order` | Sim | Posição dentro da família. Use o próximo número livre da família. |

### Onde o equipamento novo aparece

- No catálogo e na busca do cabeçalho do portal.
- Na **composição livre** (vessel em branco): basta buscar pelo nome e adicionar ao pacote.
- Em um diagrama (spread) **só se** você adicionar uma linha para ele ([seção 10](#10-criar-um-diagrama-spread)). Sem isso, ele fica "só no catálogo".

---

## 6. Adicionar apelidos (aliases)

Apelidos são outros nomes pelos quais as pessoas conhecem o equipamento.

```json
"aliases": ["DVR", "Video overlay PC", "vMix PC"]
```

Para que servem:

1. **Busca:** o campo de busca do cabeçalho encontra o equipamento pelo apelido.
2. **Links entre equipamentos:** se um `connectsTo` ou `whereItFits` usa o apelido, o portal reconhece o equipamento.
3. **Cruzamento com BIDs:** o portal marca o equipamento como "já considerado" quando o título ou um apelido aparece no Scope of Supply do BID.

Regras de ouro:

- Apelidos de **uma palavra curta e genérica** (ex.: `USBL`, `UPS`) servem para a busca, mas **não** entram no cruzamento com BIDs. Para entrar, o apelido precisa ter **número, espaço ou 6 letras ou mais** (ex.: `HPT 5000`, `Ranger 2`, `Transponder`).
- Não repita o mesmo apelido em equipamentos diferentes, para não gerar confusão na busca.
- Pode incluir siglas, nomes comerciais e nomes em outros idiomas.

---

## 7. Conectar equipamentos (aliados e filhos)

Há três formas de relacionar um equipamento com outros.

### 7.1 `connectsTo`: com quem ele conversa

Lista de nomes, escrita com o **título ou um apelido** do outro equipamento:

```json
"connectsTo": ["USBL Topside Unit", "C-Node"]
```

- Escreva o nome **exatamente** como o título ou apelido do outro equipamento. Assim ele vira um item reconhecido no painel.
- Se um dos equipamentos mudar de título, ajuste a lista nos outros que o citam.
- Para a conexão aparecer nos dois lados, escreva-a nos dois equipamentos (ex.: o C-Node cita o Beacon Charger e o Beacon Charger cita o C-Node).

### 7.2 `whereItFits`: a cadeia "onde ele se encaixa"

É uma linha do tempo, da esquerda para a direita, até chegar no equipamento:

```json
"whereItFits": [
  { "label": "Vessel deck" },
  { "label": "Beacon Charger", "equipmentId": "beacon-charger" },
  { "label": "Beacons", "stack": ["Beacon", "Beacon", "Beacon"] }
]
```

- `label`: texto do passo.
- `equipmentId`: opcional. Use para tornar o passo clicável e marcar "este equipamento".
- `stack`: opcional. Mostra itens empilhados (ex.: 3 beacons).

### 7.3 Equipamento "filho" (acessório de outro)

O catálogo não tem um campo "pai". O filho é montado com `connectsTo` e `whereItFits`:

1. Crie o equipamento filho ([seção 5](#5-criar-um-equipamento)) com `connectsTo` apontando para o pai.
2. No pai, adicione o nome do filho em `connectsTo`.
3. No pai, se fizer sentido, adicione o filho no **fim** do `whereItFits`:
   `{ "label": "Beacon Charger", "equipmentId": "beacon-charger" }`.
4. No pai, adicione o filho em `bidConsiderations` quando for item de escopo (ex.: `"Battery charger"`).

### 7.4 Conexões por cabo (só em diagramas)

Cabos reais ficam nos `links` do diagrama ([seção 10](#10-criar-um-diagrama-spread)). Não crie cabo para equipamentos que só se ligam em momentos específicos (ex.: carregador no convés).

---

## 8. Foto do equipamento

Duas formas:

**A) Pelo portal (mais simples)**

1. Abra o equipamento no portal.
2. Clique na foto grande, em **Upload photo**.
3. Escolha PNG, JPG ou WEBP de até 5 MB. Só quem tem permissão de edição em Templates vê esse botão. O equipamento precisa já ter sido importado.

**B) Junto com a importação**

1. Nomeie o arquivo com o **id do equipamento**: `video-recorder.png`.
2. Na hora de importar ([seção 12](#12-importar-no-portal)), selecione o JSON **e** as fotos juntos.

---

## 9. Criar um sistema

Sistema agrupa equipamentos que trabalham juntos (ex.: "Survey - Surface Navigation").

```json
{
  "id": "sys-video",
  "familyId": "data-acquisition",
  "title": "Survey - Video Recording",
  "description": "Câmeras, gravação com overlay e armazenamento do vídeo.",
  "components": ["ROV Camera Feeds", "Video Recorder", "vMix", "RAID Video Storage"],
  "equipmentIds": ["rov-camera-feeds", "video-recorder", "vmix", "raid-storage"],
  "sceneAnchor": "vessel",
  "order": 11
}
```

| Campo | Explicação |
| --- | --- |
| `components` | Lista de texto exibida no painel do sistema (pode incluir itens sem cadastro). |
| `equipmentIds` | `id` dos equipamentos que pertencem ao sistema. Todos precisam existir em `equipment`. |
| `sceneAnchor` | Onde o sistema aparece no 3D. |
| `order` | Próximo número livre (hoje vai até 10). |

Cole o bloco dentro de `"systems": [ ... ]`.

---

## 10. Criar um diagrama (spread)

Diagrama é um desenho completo do spread (ex.: "Full Survey Spread", desenho 803038098 rev A). Ele aparece no seletor **DIAGRAM** do cabeçalho do portal.

**Passo a passo**

1. Abra `templates/survey-catalog/new-spread-template.jsonc`. Ele tem todos os campos explicados em comentários.
2. Copie **só o objeto `{ ... }`**, sem as linhas de comentário `//`.
3. Cole dentro de `"spreads": [ ... ]` no seed, depois do último diagrama, separado por vírgula.
4. Preencha na ordem:
   1. **Identificação:** `id` único, `title`, `drawingNo`, `revision`, `description`, `order` (o próximo número livre; hoje existem 1 e 2).
   2. **Categorias** (grupos de BID): [seção 11](#11-grupos-do-diagrama-categorias-e-zonas).
   3. **Zonas** (salas) e suas **linhas** (equipamentos): [seção 11](#11-grupos-do-diagrama-categorias-e-zonas).
   4. **Links** (cabos entre equipamentos).
   5. **Pipeline** (opcional, pode ficar `[]`).
5. Valide e importe.

### Linhas (equipamentos da zona)

```json
{ "equipmentId": "network-switch", "qty": 1, "qtyLabel": "#1", "instances": [1], "category": "topside" }
```

| Campo | Explicação |
| --- | --- |
| `equipmentId` | `id` de um equipamento **já existente** em `equipment`. |
| `qty` | Quantidade (número). |
| `qtyLabel` | Opcional. Texto livre quando não é contagem simples (`"AFT + FWD"`, `"1 set"`). |
| `instances` | Opcional. Use quando o mesmo equipamento aparece em salas diferentes (ex.: switch `[1]` no Survey Online, `[2]` na ponte). |
| `vesselSupplied` | Opcional. `true` = fornecido pelo navio: entra no escopo, mas não é precificado. |
| `category` | `id` de uma categoria deste diagrama. |

### Links (cabos)

```json
{ "from": "usbl-topside-unit", "to": "ranger2-subsea-head", "kind": "subsea", "cable": "SPD001" }
```

| Campo | Explicação |
| --- | --- |
| `from`, `to` | `id` dos equipamentos. Se o equipamento tem `instances`, use o sufixo `#N` (ex.: `network-switch#1`). Sem instances, use só o `id`. |
| `kind` | `data`, `power`, `video`, `rf`, `subsea`, `fibre`, `acoustic` ou `timing`. Define a cor do cabo e o fluxo no 3D. |
| `cable` | Opcional. Código do cabo no desenho (ex.: `SD036`). |

Regras:

- Só crie links entre equipamentos que **estão nas zonas do mesmo diagrama**. Link para equipamento ausente é ignorado.
- Vídeo só flui de `from` para `to`. Os outros tipos funcionam nos dois sentidos.
- Cabos `timing` (PPS/ZDA) não contam como caminho de sinal no "Trace".

### Pipeline (opcional)

Etapas lógicas depois do hardware: software, armazenamento, processamento e entregável.

```json
{
  "id": "sw-video",
  "title": "Video Recording & Overlay",
  "stage": "software",
  "hostEquipmentId": "video-recorder",
  "description": "Grava os canais de câmera com o overlay de dados.",
  "consumes": ["video"],
  "feeds": ["store-server"],
  "displays": ["survey-online-monitors"],
  "validated": false
}
```

- `stage`: `software`, `storage`, `processing` ou `deliverable`.
- `hostEquipmentId`: equipamento onde a etapa roda.
- `consumes`: tipos de dado que a etapa recebe (lista da seção 3).
- `feeds`: `id` das próximas etapas.
- `validated`: `false` enquanto não foi confirmado por um especialista de survey.

---

## 11. Grupos do diagrama: categorias e zonas

Dentro de um diagrama existem **dois tipos de grupo**.

### 11.1 Categorias: grupos de BID

Agrupam as linhas por tipo de escopo no BID.

```json
"categories": [
  { "id": "topside", "title": "Topside" },
  { "id": "subsea-rov", "title": "Subsea / ROV" },
  { "id": "infrastructure", "title": "Infrastructure" }
]
```

- Pode manter as três do modelo ou criar novas (`id` único dentro do diagrama).
- Toda linha precisa ter `category` igual a um `id` desta lista.

### 11.2 Zonas: as "salas" do diagrama

Cada zona é um cômodo ou área do desenho, e vira uma sala no 3D.

```json
{
  "id": "rov-control",
  "title": "ROV Control Room",
  "sceneAnchor": "rov-control",
  "description": "Um parágrafo explicando a sala. Vira a legenda do tour guiado.",
  "lines": [
    { "equipmentId": "rov-remote-helmsman", "qty": 1, "category": "topside" }
  ]
}
```

| Campo | Explicação |
| --- | --- |
| `id` | Único dentro do diagrama. |
| `title` | Título no painel. |
| `sceneAnchor` | `mast`, `survey-online`, `bridge`, `rov-control`, `vessel-hull` ou `rov`. **Vazio (`""`) = grupo só de BID**, que não aparece no 3D (ex.: "Integration & Systems"). |
| `description` | Um parágrafo, usado como legenda do tour guiado. |
| `lines` | Equipamentos da zona (veja a seção 10). |

Para **criar um novo grupo**: adicione um objeto na lista `categories` (grupo de BID) ou na lista `zones` (sala), e use o `id` novo nas linhas.

---

## 12. Importar no portal

O seed só vale no portal depois de importado para o SharePoint (lista `smartbid-survey-catalog`).

1. Salve o `survey-catalog.seed.json` e valide ([seção 2](#validar-o-arquivo-sempre-antes-de-importar)).
2. Abra o Survey Portal (SmartBID 2.0, menu Survey).
3. No cabeçalho, clique em **Import catalog**.
4. Selecione `survey-catalog.seed.json`. Se quiser, selecione junto as fotos (nomeadas com o `id`).
5. Aguarde o aviso verde **"Survey catalog imported"**, com o número de linhas gravadas.
6. O portal recarrega os dados sozinho. Confira o resultado ([seção 13](#13-conferir-o-resultado)).

**Como a importação funciona (importante)**

- Ela **cria ou atualiza**, usando o par tipo + `id`. Mudar o texto de um item existente atualiza o item.
- Ela **não apaga**. Remover algo do JSON **não remove** do portal.
- Se você mudar o `id` de um item, o portal cria um item novo e **mantém o antigo**.
- A importação sobrescreve o conteúdo do item com o do JSON. Mantenha o seed atualizado para não desfazer edições de outras pessoas.
- Na primeira importação o portal cria a lista e as colunas. Isso exige permissão de edição no site.

**Como remover ou desativar um item**

1. Abra a lista `smartbid-survey-catalog` no SharePoint.
2. Encontre a linha (colunas `SurveyItemType` e `SurveyItemKey`).
3. Mude `IsActive` para **Não**. O item deixa de aparecer no portal. A coluna pode precisar ser adicionada à visualização.
4. Remova também o item do seed, para ele não voltar com a próxima importação.

---

## 13. Conferir o resultado

| O que criou | Como conferir |
| --- | --- |
| Família | Os equipamentos com esse `familyId` aparecem agrupados sob ela no portal, ordenados por `order`. |
| Equipamento | Digite o nome ou apelido na busca do cabeçalho. Abra o detalhe e confira "Where does it fit?" e "Connects to". |
| Equipamento na composição livre | Selecione "Free composition (blank vessel)" no seletor DIAGRAM, busque o item e adicione. Ele deve aparecer na sala do `sceneAnchor`. |
| Sistema | Procure o sistema no portal e confira se os equipamentos de `equipmentIds` estão listados. |
| Diagrama | Abra o seletor **DIAGRAM** e escolha o novo diagrama. Clique em cada sala, confira os cabos e rode o **Tour**. |

---

## 14. Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| "Import failed" com mensagem de JSON | Vírgula ou aspa faltando | Rode a validação da [seção 2](#validar-o-arquivo-sempre-antes-de-importar) e corrija a linha indicada. |
| "Expected { families, equipment, systems } arrays" | Arquivo errado ou chaves apagadas | Use o `survey-catalog.seed.json` completo. |
| Equipamento novo não aparece | Não importou, ou `familyId` não existe | Importe de novo e confira se o `familyId` é de uma família real. |
| Equipamento aparece duplicado | Mudou o `id` depois de importar | Desative o item antigo no SharePoint ([seção 12](#12-importar-no-portal)). |
| Conexão não vira link clicável | O nome no `connectsTo` não bate com título ou apelido | Escreva o nome exato ou adicione o apelido ao equipamento. |
| Equipamento não aparece no diagrama | Faltou a linha dele em uma zona | Adicione em `lines` da zona ([seção 10](#10-criar-um-diagrama-spread)). |
| Cabo não aparece no 3D | `from` ou `to` fora das zonas, ou falta o `#N` | Confira os `id` e o sufixo `#N` dos equipamentos com `instances`. |
| Zona não aparece no 3D | `sceneAnchor` vazio ou inválido | Use um valor da [seção 11.2](#112-zonas-as-salas-do-diagrama). |
| Equipamento sem forma correta no 3D | `sceneShape` vazio | Preencha com um valor da [seção 3](#3-listas-de-valores-permitidos). |
| Foto não aparece | Arquivo não tem o nome do `id`, ou passa de 5 MB | Renomeie para `id.png` e importe de novo, ou use o botão **Upload photo**. |

---

## 15. Checklist rápido

**Novo equipamento**

- [ ] `id` novo, único e sem espaços
- [ ] `familyId` aponta para uma família existente
- [ ] `whatIsIt` e `whatDoesItDo` escritos para quem não conhece
- [ ] `aliases`, `connectsTo` e `whereItFits` preenchidos
- [ ] `sceneAnchor`, `sceneShape`, `dataRole` e `dataTypes` preenchidos
- [ ] `order` é o próximo número livre da família
- [ ] Arquivo validado e importado
- [ ] Conferido na busca e no detalhe do portal

**Novo diagrama**

- [ ] `id` e `order` únicos
- [ ] `categories` definidas e usadas em todas as linhas
- [ ] Cada zona tem `sceneAnchor` e `description`
- [ ] Todos os `equipmentId` existem em `equipment`
- [ ] `links` só entre equipamentos presentes nas zonas, com `#N` quando necessário
- [ ] Arquivo validado e importado
- [ ] Conferido no seletor DIAGRAM, com tour e cabos
