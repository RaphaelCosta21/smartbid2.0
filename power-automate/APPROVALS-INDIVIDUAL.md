# Fluxo de Aprovação do BID — uma aprovação nativa por aprovador + chat em grupo

Roteiro do fluxo de aprovação usando o **Approvals nativo do Teams**, com **um pedido individual
por aprovador** e um **chat em grupo** que mostra o andamento da rodada.

- O chat em grupo recebe o card de boas-vindas e o **Status card**, com todos os aprovadores em `Pending`.
- Cada aprovador recebe o **seu** pedido em particular, pela notificação do Approvals no Teams
  (e e-mail). Ninguém consegue responder o pedido de outra pessoa.
- Cada resposta, **em qualquer ordem**, atualiza o grupo (`Approved` ou `Rejected`), as Approver rows
  e o BID no SharePoint, **com o comentário** da pessoa.
- Quando **todos aprovam**, o fluxo fecha o BID e envia o card final e o e-mail.
  Uma **recusa** encerra a rodada como rejeitada.
- **Uma vez por dia**, um fluxo de lembrete menciona no chat em grupo quem ainda não respondeu.
- Toda escrita no BID usa **ETag + retry**.

Usa apenas conectores **Standard** (Approvals, SharePoint, Teams, Office 365 Users, Mail).
**Não precisa de Dataverse nem de licença Premium.**

> **Escopo:** roteiro de configuração. Não é um fluxo exportado nem testado no tenant.
> Itens marcados com **Verificar** dependem do ambiente e devem ser confirmados no primeiro teste.
> Este guia substitui o desenho de cards personalizados do [README.md](./README.md) e o desenho
> coletivo com Dataverse do [APPROVALS-NATIVE.md](./APPROVALS-NATIVE.md). Nunca rode dois desses
> fluxos para a mesma rodada.

## O que é reutilizado

| Artefato                                                       | Uso                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------- |
| [`cards/01-welcome.json`](./cards/01-welcome.json)             | Boas-vindas no chat em grupo                              |
| [`cards/02-status.json`](./cards/02-status.json)               | Status card atualizado a cada resposta                    |
| `cards/03-approver.json`                                       | **Não usar**: o pedido agora é o card nativo do Approvals |
| [`cards/04-final.json`](./cards/04-final.json)                 | Mensagem final, **somente quando todos aprovam**          |
| [`email/completion-email.html`](./email/completion-email.html) | E-mail final, **somente quando todos aprovam**            |
| [README.md §5](./README.md)                                    | Receita do write-back com ETag (detalhes e armadilhas)    |
| [README.md §7](./README.md)                                    | Solução de problemas comuns do Power Automate             |
| [README.md §10.2](./README.md)                                 | Fluxo de aviso de override no chat                        |

---

## 1. Visão geral

### 1.1 Como funciona

```mermaid
flowchart TD
    A[SPFx inicia a rodada] --> B[(SharePoint: Round row)]
    B --> C[Fluxo principal cria o chat em grupo]
    C --> D[Welcome + Status card: todos Pending]
    D --> E{Para cada aprovador, em paralelo}
    E --> F[Create an approval individual + notificacao no Teams]
    F --> G[Wait for an approval, revisando a rodada a cada 24h]
    G -->|Approve ou Reject| H[Approver rows + BID com ETag, com comentario]
    H --> I[Atualiza o Status card + mensagem no grupo]
    G -->|Rodada rejeitada ou override| X[Sai da espera]
    I --> K{Todos os ramos terminaram}
    X --> K
    K -->|Todos aprovaram| L[BID Completed + card final + e-mail]
    K -->|Alguem recusou| M[Rodada rejeitada]
    K -->|Prazo esgotado| N[Rodada expirada, sem sucesso]
    R[Fluxo de lembrete diario] -->|@mention de quem falta| C
```

### 1.2 Regras

1. **Um pedido por pessoa**, não por setor. Se a mesma pessoa representa dois setores, ela recebe
   **um** pedido, e a resposta vale para as duas responsabilidades. Os detalhes do pedido listam os
   setores dela.
2. Cada pedido tem **um único destinatário** e reatribuição desligada. O próprio serviço de Approvals
   só aceita a resposta dessa pessoa.
3. **Todos aprovam** → rodada aprovada. **Uma recusa** → rodada rejeitada. Essa regra é controlada
   pelo fluxo, porque cada pedido é independente.
4. Os pedidos **não são postados no chat em grupo**. O grupo recebe apenas informação: Welcome,
   Status card, confirmações, lembretes e mensagem final.
5. Engenheiros e analistas entram no chat para acompanhar; só aprovam se estiverem em `approvers`.
6. O comentário pertence à resposta da pessoa. Por padrão, ele é gravado no BID e **não** é publicado no chat.

### 1.3 Limitações aceitas neste desenho

- **Recusa não cancela os outros pedidos.** O conector Standard não tem ação de cancelamento. Após
  uma recusa, os pedidos ainda abertos continuam no Approvals dos outros aprovadores. O fluxo para de
  esperá-los em até 24 h, avisa no chat que podem ser ignorados e, se desejado, o dono do fluxo os
  cancela manualmente (§8.3).
- **Override** (Engineering) também não cancela os pedidos abertos automaticamente (§8.4).
- **Prazo:** uma execução de fluxo dura no máximo 30 dias. A rodada expira em 28 dias (§8.5).
- **Status card com respostas simultâneas:** se duas pessoas respondem no mesmo segundo, o card pode
  mostrar por instantes uma contagem desatualizada. A atualização final, depois do loop, sempre
  corrige o card (passo 17).

---

## 2. Pré-requisitos

### 2.1 Conexões (todas Standard)

| Conector              | Uso                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approvals             | `Create an approval`, `Wait for an approval`                                                                                                                               |
| SharePoint            | Get/Create/Update item e `Send an HTTP request to SharePoint` (ETag)                                                                                                       |
| Microsoft Teams       | `Create a chat`, `Post card in a chat or channel`, `Update an adaptive card in a chat or channel`, `Post message in a chat or channel`, `Get an @mention token for a user` |
| Office 365 Users      | `Get my profile (V2)`: identidade que cria o chat                                                                                                                          |
| Mail                  | `Send an email notification (V3)`: e-mail final                                                                                                                            |
| OneDrive for Business | Opcional, `Convert file` para o PDF final (§7)                                                                                                                             |

Use, de preferência, uma conta de serviço como dona dos fluxos e das conexões. Ela aparece como
criadora dos pedidos no Approvals.

### 2.2 Colunas da `smartbid-approvals`

As colunas abaixo já são criadas pelo app em `ApprovalService.ensureApprovalColumns()`:

| Coluna                                             | Uso neste fluxo                                     |
| -------------------------------------------------- | --------------------------------------------------- |
| `Title`, `jsondata`                                | Título (BID) e payload da Round row                 |
| `RecordType`                                       | `Round` (criada pelo app) / `Approver` (pelo fluxo) |
| `BidNumber`, `RoundNumber`                         | Filtros                                             |
| `ApproverEmail`, `ApproverName`                    | Aprovador da responsabilidade                       |
| `Sector`, `SectorLabel`                            | Setor da responsabilidade                           |
| `ApprovalStatus`                                   | Pending / Approved / Overridden (+ novas abaixo)    |
| `RespondedDate`                                    | Data da resposta                                    |
| `ChatId`, `StatusCardMessageId`                    | Chat em grupo e mensagem do Status card             |
| `ExpectedApproverCount`                            | Total de responsabilidades da rodada                |
| `OverriddenBy`, `OverriddenDate`, `OverrideReason` | Override feito pelo app                             |

Ajustes manuais (ou incluir em `ensureApprovalColumns()`):

| Item                    | Tipo                     | Onde     | Uso                                               |
| ----------------------- | ------------------------ | -------- | ------------------------------------------------- |
| Choice `ApprovalStatus` | + `Rejected`, `Expired`  | Todas    | Recusa e rodada expirada                          |
| `NativeApprovalId`      | Texto                    | Approver | ID do pedido individual da pessoa                 |
| `ApproverComments`      | Texto multilinha simples | Approver | Comentário da resposta, sem HTML (até 4000 chars) |
| `LastReminderDate`      | Data/Hora                | Round    | Último lembrete diário enviado                    |

**Colunas de data com hora.** `RespondedDate`, `OverriddenDate` e `LastReminderDate` precisam estar
com **Incluir hora = Sim** (List settings → coluna → _Date and Time Format_: **Date & Time**). Listas
antigas criadas pelo app têm essas colunas como **somente data**. Nesse formato, o SharePoint devolve
`2026-10-02T00:00:00.0000000`: sem a hora e sem o `Z` de UTC. Aí o `convertFromUtc` do passo 18.2
falha, e o e-mail final mostra 00:00. Linhas gravadas antes da mudança continuam sem hora.

Preencha **`Title` em todo Create item / Update item** (a coluna é obrigatória).

### 2.3 Payload da Round row

O app grava o `jsondata` abaixo em `ApprovalService.startApprovalRound()`:

```json
{
  "bidNumber": "REQ-2026-0010",
  "round": 1,
  "approvers": [
    {
      "sector": "project",
      "sectorLabel": "Project",
      "members": [
        {
          "name": "João Silva",
          "email": "jsilva@oceaneering.com",
          "role": "PM"
        }
      ],
      "isAutoLocked": false
    }
  ],
  "requestedBy": { "name": "Ana", "email": "ana@oceaneering.com" },
  "engineerResponsible": [
    { "name": "Raphael Costa", "email": "rcosta1@oceaneering.com" }
  ],
  "analyst": [
    { "name": "Laura Campanati", "email": "lcampanati@oceaneering.com" }
  ],
  "client": "Petrobras",
  "projectName": "Búzios 10 — ROV Support",
  "crmNumber": "CRM-123456",
  "requestedDate": "2026-07-30T12:00:00.000Z",
  "deepLink": "https://.../#/bid/REQ-2026-0010?tab=approval",
  "status": "pending",
  "capexUSD": 123456,
  "division": "SSR-ROV",
  "serviceLine": "ROV"
}
```

Exemplo só para gerar o schema; em execução, use os dados do gatilho.

### 2.4 O que o fluxo grava no BID (`smartbid-tracker/jsondata`)

As entradas são localizadas por `approvals[].round` **e** `approvals[].stakeholder.email`.
A rodada atual é o **último** item de `approvalRounds[]`. Todo o resto do JSON é preservado.

| Campo                                 | Valor                                                 | Quando                 |
| ------------------------------------- | ----------------------------------------------------- | ---------------------- |
| `approvals[].status` / `decision`     | `approved` ou `rejected`                              | Cada resposta          |
| `approvals[].comments`                | Comentário original, ou `null`                        | Cada resposta          |
| `approvals[].respondedDate`           | Data da resposta, UTC ISO 8601                        | Cada resposta          |
| `approvals[].approvedVia`             | `Approvals`                                           | Cada resposta          |
| `approvalRounds[atual].approvals`     | Cópia das entradas da rodada atual                    | Cada resposta          |
| `approvalRounds[atual].status`        | `rejected` na recusa; `approved` no fechamento        | Recusa / fechamento    |
| `approvalRounds[atual].completedDate` | Data de encerramento                                  | Fechamento             |
| `approvalStatus`                      | `rejected` na recusa; `approved` **só no fechamento** | Recusa / fechamento    |
| `currentStatus` / `currentPhase`      | `Completed` / `Close Out`                             | Só fechamento aprovado |
| `completedDate`                       | Data de encerramento                                  | Só fechamento aprovado |

> **Nunca grave `approvalStatus = approved` numa atualização parcial.** O app completa o BID
> automaticamente quando vê `approved`. Na recusa, não altere `currentStatus`, `currentPhase` nem o
> `completedDate` do BID. Nunca altere rodadas anteriores.

### 2.5 Como ler este guia

Cada ação aparece com:

- **Onde:** a posição exata (abaixo de qual ação; dentro de qual loop ou ramo).
- **Ação:** conector → nome da ação, como aparece na busca do designer.
- **Nome:** como renomear a ação (menu `...` → **Rename**). As expressões dependem desses nomes.
- Uma tabela com **cada campo**, **como preencher** e o **valor**.

**Como preencher:**

| Indicação      | O que fazer                                                                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lista**      | Escolha a opção na lista suspensa do campo.                                                                                                                                                                                |
| **Texto**      | Digite o valor exatamente como está.                                                                                                                                                                                       |
| **fx**         | Clique no campo → ícone **fx** (designer novo) ou aba **Expression** (designer clássico) → cole a expressão **sem** `@{ }` → **Add** / **OK**. O valor vira um bloco colorido.                                             |
| **Texto + fx** | Texto com trechos `@{...}`. Cole a linha inteira no campo: o designer converte cada `@{...}` num bloco. Se algum trecho continuar como texto puro, apague-o e insira pelo **fx** a expressão que estava dentro das chaves. |
| **Dinâmico**   | Conteúdo dinâmico (ícone de raio): escolha a saída indicada, da ação indicada.                                                                                                                                             |

**Conditions sempre no modo básico.** Cada linha da Condition aparece numa tabela:

| Esquerda (fx)                       | Operador        | Direita         |
| ----------------------------------- | --------------- | --------------- |
| `length(variables('varApprovers'))` | is greater than | fx `0`          |
| `toLower(string(...))`              | is equal to     | texto `pending` |

- A **Esquerda** é sempre inserida pelo **fx**.
- Na **Direita**, `fx true` / `fx 0` = insira pelo **fx** (assim o valor é booleano/número, e não
  texto). `texto pending` = digite.
- Mais de uma linha: deixe o seletor em **AND** e use **+ Add → Add row** para cada linha.
- **Filter array** e **Do until** usam o mesmo editor. Quando precisam de mais de um critério, o guia
  junta tudo numa expressão à esquerda e compara com `fx true`: funciona numa única linha, em
  qualquer versão do designer.
- **Do until:** crie primeiro as ações de dentro e só depois preencha o **Loop until**, porque ele
  cita essas ações. Ajuste sempre **Count** e **Timeout** (no designer clássico, em **Change limits**);
  os padrões (60 / `PT1H`) não servem.

**Validações que encerram o fluxo.** Nas Conditions de validação, o ramo **True fica vazio** e o
ramo **False** notifica e termina com **Terminate**. As ações seguintes ficam **abaixo da Condition,
fora dela**: como o ramo False encerra a execução, elas só rodam quando a validação passa. Assim o
fluxo não fica aninhado dentro de vários True.

**Notificação de falha.** Sempre que o guia pedir uma notificação, use **Mail → Send an email
notification (V3)**, com o nome indicado no passo:

| Campo   | Como preencher | Valor                        |
| ------- | -------------- | ---------------------------- |
| To      | fx             | `variables('varAdminEmail')` |
| Subject | Texto + fx     | indicado no passo            |
| Body    | Texto + fx     | indicado no passo            |

**Outras regras:**

- **Crases e espaços.** As crases (`` ` ``) das tabelas são só formatação do guia; não as copie. O
  campo deve conter apenas o valor ou o bloco do **fx**, sem espaço, TAB ou Enter antes. Um valor que
  chega ao Teams entre crases ou com espaços na frente aparece como bloco de código ("Text").
- **Nomes.** Espaços viram `_` nas expressões (`Get items` = `Get_items`). Ações sem **Nome** indicado
  (Initialize/Set/Append variable, Delay, Terminate) podem manter o nome padrão.
- **Select em modo texto.** No campo **Map**, clique no ícone **T** (_Switch Map to text mode_) antes
  de inserir a expressão; senão o Select só aceita pares chave/valor.
- **Configure run after.** Designer novo: selecione a ação → **Settings** → **Run after**. Clássico:
  `...` → **Configure run after**.
- **Concorrência.** Apply to each → **Settings** → **Concurrency control**. **Off** (padrão) = um item
  por vez. Só o `Apply_to_each_person` fica **On**.
- **Choice em Create/Update item.** Escolha a opção na lista. Para usar expressão, escolha **Enter
  custom value** e insira pelo **fx**. O mesmo vale para o campo **Group chat** das ações do Teams.
- **Update item.** Preencha só os campos da tabela; campos em branco não são alterados. `Title` é
  obrigatório em todo Create/Update item.
- **Variáveis.** Todas são criadas no topo (passo 4). **Dentro do `Apply_to_each_person` não use Set
  variable nem Append to array variable**: as variáveis são globais ao run e as pessoas, em paralelo,
  sobrescreveriam umas às outras. Ali dentro use só Compose. Ler variáveis é seguro.
- **Durações ISO 8601:** `P29D` (dias), `PT24H` (horas), `PT10M` (minutos). `PT28D` é inválido.
- **Aspas em filtros OData:** os filtros usam `replace(<valor>, '''', '''''')` para BIDs com apóstrofo.
- **Terminate** nunca dentro de Apply to each ou Do until.
- **Choice pode vir como objeto.** Para testar status, o guia usa
  `contains(toLower(string(item()?['ApprovalStatus'])), 'approved')`.

---

## 3. Fluxo principal — `SmartBid – Approval Round`

Crie um **Automated cloud flow** com o gatilho do passo 1. Os passos seguem a ordem em que as ações
aparecem no designer, de cima para baixo.

### 3.0 Mapa do fluxo

Use este mapa para conferir a posição de cada ação. A indentação mostra o que fica **dentro** de
loops e ramos.

```text
[1-2]   When an item is created (smartbid-approvals) + trigger condition
[3]     Parse_JSON
[4]     Initialize variable (18 ações)
[5.1]   Apply_to_each_sector
[5.2]   └─ Apply_to_each_member
[5.3]      ├─ Append to array variable → varApprovers
[5.4]      └─ Append to array variable → varApproverEmails
[5.5]   comUniqueApproverEmails
[5.6]   Condition_validate_approvers
[5.7]   └─ False: Send_fail_approvers
[5.8]            Terminate_fail_approvers
[6.1]   Do_until_bid_ready
[6.2]   ├─ Get_items
[6.3]   ├─ Condition_one_bid
[6.4]   │  └─ True: Set variable → varBidItemId
[6.5]   │           Parse_BID
[6.6]   │           comLastBidRound
[6.7]   │           Condition_round_ready
[6.8]   │           └─ True: Set variable → varBidReady
[6.9]   └─ Condition_retry_bid
        └─ True: Delay (1 minuto)
[6.10]  Condition_bid_ready
[6.11]  └─ False: Send_fail_bid
[6.12]           Terminate_fail_bid
[7]     Get my profile (V2) → Set variable → varFlowOwnerEmail
[8]     selEngineerEmails → selAnalystEmails → comAllMembers → filChatMembers
[9]     Create_a_chat → Set variable → varChatId
[10]    selWelcomeMD → joinWelcomeMD → Post_card_Welcome
[11]    Post_card_Status → Set variable → varStatusMsgId
[12]    Update_Round_chat
[13]    Apply_to_each_createrow
        └─ Create_ApproverRow
[14]    Apply_to_each_person   (Concurrency On, 50)
[14.1]  ├─ filPersonRows → selPersonSectors → comPersonName → comPersonSectors
[14.2]  ├─ Create_person_approval
[14.3]  ├─ comPersonApprovalId → Get_person_rows → Apply_to_each_row_id
        │                                            └─ Update_row_approvalid
[14.4]  ├─ (opcional) Post_card_private
[14.5]  ├─ Do_until_person_done
        │  ├─ Wait_person_approval
        │  └─ Get_Round_chk
[14.6]  └─ Condition_person_responded
           └─ True: comResponse → comDecision → comComments → comResponseDate
                    Condition_responder_ok
                    ├─ False: Send_fail_responder
                    └─ True:
[14.7]                 Do_until_write_inc   (detalhe no passo 14.7)
[14.8]                 Condition_written_inc
                       ├─ False: Send_fail_write_inc
                       └─ True:
[14.9]                    Apply_to_each_row_status
                          └─ Update_row_status
[14.10]                   Get_rows_status → filApprovedRows → filRejectedRows → selApprovedEmails
                          → comApprovedPeople → comFilled → comProgressBar → selStatusMD
                          → joinStatusMD → Update_StatusCard
[14.11]                   Condition_person_rejected
                          ├─ True: Update_Round_rejected → Post_msg_rejected
                          └─ False: Post_msg_approved
[15]    Get_Round_final → Get_rows_final → filRejected_final → filApproved_final → comFinalOutcome
[15.6]  Condition_overridden
        └─ True: Terminate_overridden
[15.7]  Condition_incomplete
        └─ True: Update_Round_incomplete → Send_fail_incomplete → Terminate_fail_incomplete
[16]    Condition_needs_close
        ├─ True: comCompletionDate → Do_until_write_final → Condition_written_final
        │                                                   ├─ True: Update_Round_closed
        │                                                   └─ False: Send_fail_close → Terminate_fail_close
        └─ False: Update_Round_expired → Post_msg_expired
[17]    selApprovedEmails_final → comApprovedPeople_final → comFilled_final → comProgressBar_final
        → selStatusMD_final → joinStatusMD_final → Update_StatusCard_final
[18]    Condition_final_approved
        └─ True: Post_card_Final → selEmailRows → joinEmailRows → filEmailCc → Send_email_V3
```

### Fase 1 — Gatilho, aprovadores e BID

#### 1) Gatilho

**Ação:** SharePoint → **When an item is created**.

| Campo        | Como preencher | Valor                                                                |
| ------------ | -------------- | -------------------------------------------------------------------- |
| Site Address | Lista          | `https://oceaneering.sharepoint.com/sites/G-OPGSSRBrazilEngineering` |
| List Name    | Lista          | `smartbid-approvals`                                                 |

#### 2) Trigger condition

1. Clique no gatilho → **Settings**.
2. Em **Trigger conditions**, clique em **+ Add** e cole, **com** o `@`:

   ```text
   @equals(triggerOutputs()?['body/RecordType/Value'], 'Round')
   ```

3. Se o fluxo nunca disparar porque a Choice vem como texto no seu ambiente, troque por
   `@equals(triggerOutputs()?['body/RecordType'], 'Round')`.

- Este campo só aceita a expressão com `@`; não existe modo básico aqui.
- **Não** ligue **Concurrency control** no gatilho: o fluxo espera dias e bloquearia os outros BIDs.
- O aviso "circular loop" do Flow checker é esperado e inofensivo ([README §7.5](./README.md)).

#### 3) `Parse_JSON` — dados da rodada

**Onde:** logo abaixo do gatilho.
**Ação:** Data Operation → **Parse JSON**. **Nome:** `Parse_JSON` (o nome padrão "Parse JSON" já serve).

| Campo   | Como preencher | Valor                                |
| ------- | -------------- | ------------------------------------ |
| Content | fx             | `triggerOutputs()?['body/jsondata']` |
| Schema  | Texto          | `{ "type": "object" }`               |

O fluxo lê todos os campos por expressão (`body('Parse_JSON')?['...']`), então o schema mínimo basta.
Se você já gerou o schema a partir do exemplo da §2.3, pode mantê-lo. Troque por
`{ "type": "object" }` se o Parse JSON falhar com _Invalid type_ ou _Required properties are missing_
(acontece quando um campo, como `division`, vem vazio).

#### 4) Variáveis

**Onde:** abaixo de `Parse_JSON`. Crie **uma ação Initialize variable por linha**, nesta ordem.
**Ação:** Variable → **Initialize variable**. O nome da ação não importa; o que importa é o campo **Name**.

| Name                | Type    | Como preencher Value | Value                                                                 |
| ------------------- | ------- | -------------------- | --------------------------------------------------------------------- |
| `varBidNumber`      | String  | fx                   | `body('Parse_JSON')?['bidNumber']`                                    |
| `varRound`          | Integer | fx                   | `int(body('Parse_JSON')?['round'])`                                   |
| `varRoundItemId`    | Integer | fx                   | `int(triggerOutputs()?['body/ID'])`                                   |
| `varDeepLink`       | String  | fx                   | `body('Parse_JSON')?['deepLink']`                                     |
| `varRequestedBy`    | String  | fx                   | `body('Parse_JSON')?['requestedBy']?['name']`                         |
| `varClient`         | String  | fx                   | `coalesce(body('Parse_JSON')?['client'], '')`                         |
| `varProjectName`    | String  | fx                   | `coalesce(body('Parse_JSON')?['projectName'], '')`                    |
| `varCrmNumber`      | String  | fx                   | `coalesce(body('Parse_JSON')?['crmNumber'], '')`                      |
| `varDivision`       | String  | fx                   | `body('Parse_JSON')?['division']`                                     |
| `varServiceLine`    | String  | fx                   | `body('Parse_JSON')?['serviceLine']`                                  |
| `varApprovers`      | Array   | fx                   | `json('[]')`                                                          |
| `varApproverEmails` | Array   | fx                   | `json('[]')`                                                          |
| `varBidItemId`      | Integer | Texto                | `0`                                                                   |
| `varBidReady`       | Boolean | fx                   | `false`                                                               |
| `varChatId`         | String  | —                    | deixe vazio                                                           |
| `varStatusMsgId`    | String  | —                    | deixe vazio                                                           |
| `varFlowOwnerEmail` | String  | —                    | deixe vazio                                                           |
| `varAdminEmail`     | String  | Texto                | e-mail de quem recebe os avisos de falha (você ou a conta de serviço) |

`varBidReady` controla a repetição do passo 6. `varAdminEmail` recebe todas as notificações de falha.

#### 5) Achatar as responsabilidades e validar

O payload agrupa os aprovadores por setor. Os dois loops abaixo montam `varApprovers`, com **uma
linha por responsabilidade** (pessoa + setor), e `varApproverEmails`, com os e-mails.

**5.1) Apply to each `Apply_to_each_sector`**

**Onde:** abaixo da última Initialize variable.
**Ação:** Control → **Apply to each**. **Nome:** `Apply_to_each_sector`.

| Campo                                | Como preencher | Valor                              |
| ------------------------------------ | -------------- | ---------------------------------- |
| Select an output from previous steps | fx             | `body('Parse_JSON')?['approvers']` |
| Settings → Concurrency control       | Lista          | **Off**                            |

**5.2) Apply to each `Apply_to_each_member`**

**Onde:** **dentro** de `Apply_to_each_sector`.
**Ação:** Control → **Apply to each**. **Nome:** `Apply_to_each_member`.

| Campo                                | Como preencher | Valor                                       |
| ------------------------------------ | -------------- | ------------------------------------------- |
| Select an output from previous steps | fx             | `items('Apply_to_each_sector')?['members']` |
| Settings → Concurrency control       | Lista          | **Off**                                     |

**5.3) Append to array variable — `varApprovers`**

**Onde:** dentro de `Apply_to_each_member`.
**Ação:** Variable → **Append to array variable**.

| Campo | Como preencher | Valor                        |
| ----- | -------------- | ---------------------------- |
| Name  | Lista          | `varApprovers`               |
| Value | Texto + fx     | bloco abaixo, colado inteiro |

```json
{
  "name": "@{items('Apply_to_each_member')?['name']}",
  "email": "@{toLower(items('Apply_to_each_member')?['email'])}",
  "role": "@{items('Apply_to_each_member')?['role']}",
  "sector": "@{items('Apply_to_each_sector')?['sector']}",
  "sectorLabel": "@{items('Apply_to_each_sector')?['sectorLabel']}"
}
```

**5.4) Append to array variable — `varApproverEmails`**

**Onde:** dentro de `Apply_to_each_member`, abaixo da 5.3.
**Ação:** Variable → **Append to array variable**.

| Campo | Como preencher | Valor                                              |
| ----- | -------------- | -------------------------------------------------- |
| Name  | Lista          | `varApproverEmails`                                |
| Value | fx             | `toLower(items('Apply_to_each_member')?['email'])` |

**5.5) Compose `comUniqueApproverEmails`**

**Onde:** **abaixo** de `Apply_to_each_sector`, fora dos dois loops.
**Ação:** Data Operation → **Compose**. **Nome:** `comUniqueApproverEmails`.

| Campo  | Como preencher | Valor                                                                   |
| ------ | -------------- | ----------------------------------------------------------------------- |
| Inputs | fx             | `union(variables('varApproverEmails'), variables('varApproverEmails'))` |

A `union()` de uma lista com ela mesma remove os repetidos: fica uma entrada por pessoa.

**5.6) Condition `Condition_validate_approvers`**

**Onde:** abaixo de `comUniqueApproverEmails`.
**Ação:** Control → **Condition**. **Nome:** `Condition_validate_approvers`. Seletor: **AND**.

| #   | Esquerda (fx)                                  | Operador        | Direita                                                   |
| --- | ---------------------------------------------- | --------------- | --------------------------------------------------------- |
| 1   | `length(variables('varApprovers'))`            | is greater than | fx `0`                                                    |
| 2   | `contains(variables('varApproverEmails'), '')` | is equal to     | fx `false`                                                |
| 3   | `length(variables('varApprovers'))`            | is equal to     | fx `int(triggerOutputs()?['body/ExpectedApproverCount'])` |

Linha 1: há aprovadores. Linha 2: nenhum e-mail vazio. Linha 3: a quantidade de responsabilidades é a
mesma que o app gravou na Round row.

- **True:** deixe vazio.
- **False:** ações 5.7 e 5.8.

**5.7) `Send_fail_approvers`** — no ramo **False**, primeira ação. E-mail de aviso para o administrador.
**Ação:** Mail → **Send an email notification (V3)** (busque por "Send an email notification").
**Nome:** `Send_fail_approvers`. **To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                                                     |
| ------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject | Texto + fx     | `SmartBid – rodada não iniciada: BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                                                       |
| Body    | Texto + fx     | `Aprovadores inválidos na Round row @{variables('varRoundItemId')}. Responsabilidades lidas: @{length(variables('varApprovers'))}. Esperadas: @{triggerOutputs()?['body/ExpectedApproverCount']}. E-mails: @{join(variables('varApproverEmails'), ', ')}` |

**5.8) `Terminate_fail_approvers`** — no ramo **False**, abaixo da 5.7.
**Ação:** Control → **Terminate**.

| Campo   | Como preencher | Valor                                                               |
| ------- | -------------- | ------------------------------------------------------------------- |
| Status  | Lista          | **Failed**                                                          |
| Code    | Texto          | `INVALID_APPROVERS`                                                 |
| Message | Texto + fx     | `Aprovadores inválidos na Round row @{variables('varRoundItemId')}` |

> O passo 6 fica **abaixo** de `Condition_validate_approvers`, fora dela. Se você colocou ações no
> ramo True, arraste-as para baixo da Condition.

#### 6) Buscar o BID e confirmar a rodada

Este passo encontra o item do BID na `smartbid-tracker`, guarda o ID dele e confirma que a **última**
rodada gravada no JSON do BID é a rodada atual, ainda `pending` e sem override.

O app cria a Round row **antes** de gravar a nova rodada no BID: `ApprovalTab` chama
`startApprovalRound()` e só depois salva o BID. Por isso a primeira leitura pode chegar cedo demais, e
a leitura fica dentro de um **Do until**: até 5 tentativas, com 1 minuto entre elas. Se não houver
exatamente um item com o número do BID, as tentativas também se repetem; no fim, o e-mail de falha
informa quantos itens foram encontrados.

**6.1) Do until `Do_until_bid_ready`**

**Onde:** abaixo de `Condition_validate_approvers`, fora dela.
**Ação:** Control → **Do until**. **Nome:** `Do_until_bid_ready`.

Loop until (preencha depois de criar as ações 6.2 a 6.9):

| Esquerda (fx)              | Operador    | Direita   |
| -------------------------- | ----------- | --------- |
| `variables('varBidReady')` | is equal to | fx `true` |

| Limite  | Como preencher | Valor   |
| ------- | -------------- | ------- |
| Count   | Texto          | `5`     |
| Timeout | Texto          | `PT10M` |

**6.2) Get items `Get_items`**

**Onde:** dentro de `Do_until_bid_ready`, primeira ação.
**Ação:** SharePoint → **Get items**. **Nome:** `Get_items`.

| Campo                              | Como preencher | Valor                                                            |
| ---------------------------------- | -------------- | ---------------------------------------------------------------- |
| Site Address                       | Lista          | site do SmartBid                                                 |
| List Name                          | Lista          | `smartbid-tracker`                                               |
| Filter Query (Advanced parameters) | Texto + fx     | `Title eq '@{replace(variables('varBidNumber'), '''', '''''')}'` |
| Top Count (Advanced parameters)    | Texto          | `2`                                                              |

Top Count `2` basta para saber se existe mais de um item com o mesmo número.

**6.3) Condition `Condition_one_bid`**

**Onde:** dentro do Do until, abaixo de `Get_items`.
**Ação:** Control → **Condition**. **Nome:** `Condition_one_bid`.

| Esquerda (fx)                         | Operador    | Direita |
| ------------------------------------- | ----------- | ------- |
| `length(body('Get_items')?['value'])` | is equal to | fx `1`  |

- **True:** ações 6.4 a 6.8.
- **False:** deixe vazio (o Do until tenta de novo).

**6.4) Set variable — `varBidItemId`**

**Onde:** ramo **True** de `Condition_one_bid`, primeira ação.
**Ação:** Variable → **Set variable**.

| Campo | Como preencher | Valor                                            |
| ----- | -------------- | ------------------------------------------------ |
| Name  | Lista          | `varBidItemId`                                   |
| Value | fx             | `int(first(body('Get_items')?['value'])?['ID'])` |

**6.5) Parse JSON `Parse_BID`** — lê o JSON do BID.

**Onde:** ramo **True** de `Condition_one_bid`, abaixo da 6.4.
**Ação:** Data Operation → **Parse JSON**. **Nome:** `Parse_BID`.

| Campo   | Como preencher | Valor                                             |
| ------- | -------------- | ------------------------------------------------- |
| Content | fx             | `first(body('Get_items')?['value'])?['jsondata']` |
| Schema  | Texto          | `{ "type": "object" }`                            |

**6.6) Compose `comLastBidRound`** — a última rodada do histórico do BID.

**Onde:** ramo **True** de `Condition_one_bid`, abaixo da 6.5.
**Ação:** Data Operation → **Compose**. **Nome:** `comLastBidRound`.

| Campo  | Como preencher | Valor                                                              |
| ------ | -------------- | ------------------------------------------------------------------ |
| Inputs | fx             | `last(coalesce(body('Parse_BID')?['approvalRounds'], json('[]')))` |

**6.7) Condition `Condition_round_ready`**

**Onde:** ramo **True** de `Condition_one_bid`, abaixo da 6.6.
**Ação:** Control → **Condition**. **Nome:** `Condition_round_ready`. Seletor: **AND**.

| #   | Esquerda (fx)                                            | Operador    | Direita                            |
| --- | -------------------------------------------------------- | ----------- | ---------------------------------- |
| 1   | `string(outputs('comLastBidRound')?['round'])`           | is equal to | fx `string(variables('varRound'))` |
| 2   | `toLower(string(outputs('comLastBidRound')?['status']))` | is equal to | texto `pending`                    |
| 3   | `empty(outputs('comLastBidRound')?['override'])`         | is equal to | fx `true`                          |

- **True:** ação 6.8.
- **False:** deixe vazio.

**6.8) Set variable — `varBidReady`**

**Onde:** ramo **True** de `Condition_round_ready`.
**Ação:** Variable → **Set variable**.

| Campo | Como preencher | Valor         |
| ----- | -------------- | ------------- |
| Name  | Lista          | `varBidReady` |
| Value | fx             | `true`        |

**6.9) Condition `Condition_retry_bid`** — espera 1 minuto só quando a tentativa falhou.

**Onde:** dentro do Do until, abaixo de `Condition_one_bid` (fora dela).
**Ação:** Control → **Condition**. **Nome:** `Condition_retry_bid`.

| Esquerda (fx)              | Operador    | Direita    |
| -------------------------- | ----------- | ---------- |
| `variables('varBidReady')` | is equal to | fx `false` |

- **True:** Schedule → **Delay** — Count `1`, Unit **Minute**.
- **False:** deixe vazio.

**6.10) Condition `Condition_bid_ready`**

**Onde:** abaixo de `Do_until_bid_ready`, fora dele.
**Ação:** Control → **Condition**. **Nome:** `Condition_bid_ready`.

| Esquerda (fx)              | Operador    | Direita   |
| -------------------------- | ----------- | --------- |
| `variables('varBidReady')` | is equal to | fx `true` |

- **True:** deixe vazio.
- **False:** ações 6.11 e 6.12.

**6.11) `Send_fail_bid`** — no ramo **False**, primeira ação. E-mail de aviso para o administrador.
**Ação:** Mail → **Send an email notification (V3)**. **Nome:** `Send_fail_bid`.
**To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                                                                                                                                                                                      |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Subject | Texto + fx     | `SmartBid – rodada não iniciada: BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                                                                                                                                                                                        |
| Body    | Texto + fx     | `Após 5 tentativas o BID não ficou pronto. Itens na smartbid-tracker com Title = @{variables('varBidNumber')}: @{length(body('Get_items')?['value'])} (esperado: 1). Última rodada no BID: @{outputs('comLastBidRound')?['round']}, status @{outputs('comLastBidRound')?['status']} (esperado: rodada @{variables('varRound')}, pending, sem override). Nenhum chat ou pedido foi criado.` |

**6.12) `Terminate_fail_bid`** — no ramo **False**, abaixo da 6.11.
**Ação:** Control → **Terminate**.

| Campo   | Como preencher | Valor                                                                         |
| ------- | -------------- | ----------------------------------------------------------------------------- |
| Status  | Lista          | **Failed**                                                                    |
| Code    | Texto          | `BID_NOT_READY`                                                               |
| Message | Texto + fx     | `BID @{variables('varBidNumber')} sem rodada @{variables('varRound')} válida` |

O ramo **True** de `Condition_bid_ready` fica **vazio**: não crie nada nele. O `varBidItemId` já foi
preenchido dentro do Do until (6.4). O passo 7 vai **abaixo** de `Condition_bid_ready`, fora dela: use
o **+** que aparece depois da Condition, e não o **+** do ramo True.

### Fase 2 — Chat em grupo e acompanhamento

Todas as ações desta fase ficam no nível principal, abaixo de `Condition_bid_ready`, uma embaixo da
outra.

#### 7) Dono do fluxo

A ação **Create a chat** sempre inclui no chat o dono da conexão. Se o e-mail dele também estiver na
lista de membros, o chat falha por membro duplicado. Por isso o fluxo descobre esse e-mail e o tira da
lista no passo 8.

**7.1) Get my profile (V2)**

**Onde:** abaixo de `Condition_bid_ready`.
**Ação:** Office 365 Users → **Get my profile (V2)**. **Nome:** mantenha `Get my profile (V2)` (nas
expressões ele aparece como `Get_my_profile_(V2)`). Não há campos obrigatórios.

**7.2) Set variable — `varFlowOwnerEmail`**

**Ação:** Variable → **Set variable**.

| Campo | Como preencher | Valor                                                                                                        |
| ----- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| Name  | Lista          | `varFlowOwnerEmail`                                                                                          |
| Value | fx             | `toLower(coalesce(body('Get_my_profile_(V2)')?['mail'], body('Get_my_profile_(V2)')?['userPrincipalName']))` |

#### 8) Membros do chat

Membros = aprovadores + engenheiros responsáveis + analistas, sem repetição e sem o dono do fluxo.

**8.1) Select `selEngineerEmails`**

**Ação:** Data Operation → **Select**. **Nome:** `selEngineerEmails`.

| Campo            | Como preencher | Valor                                                              |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| From             | fx             | `coalesce(body('Parse_JSON')?['engineerResponsible'], json('[]'))` |
| Map (modo **T**) | fx             | `toLower(item()?['email'])`                                        |

**8.2) Select `selAnalystEmails`**

**Ação:** Data Operation → **Select**. **Nome:** `selAnalystEmails`.

| Campo            | Como preencher | Valor                                                  |
| ---------------- | -------------- | ------------------------------------------------------ |
| From             | fx             | `coalesce(body('Parse_JSON')?['analyst'], json('[]'))` |
| Map (modo **T**) | fx             | `toLower(item()?['email'])`                            |

**8.3) Compose `comAllMembers`**

**Ação:** Data Operation → **Compose**. **Nome:** `comAllMembers`.

| Campo  | Como preencher | Valor                                                                                                   |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------- |
| Inputs | fx             | `union(union(outputs('comUniqueApproverEmails'), body('selEngineerEmails')), body('selAnalystEmails'))` |

**8.4) Filter array `filChatMembers`** — tira e-mails vazios e o dono do fluxo.

**Ação:** Data Operation → **Filter array**. **Nome:** `filChatMembers`.

| Campo | Como preencher | Valor                      |
| ----- | -------------- | -------------------------- |
| From  | fx             | `outputs('comAllMembers')` |

| Esquerda (fx)                                                                  | Operador    | Direita   |
| ------------------------------------------------------------------------------ | ----------- | --------- |
| `and(not(empty(item())), not(equals(item(), variables('varFlowOwnerEmail'))))` | is equal to | fx `true` |

#### 9) Criar o chat

**9.1) Create a chat `Create_a_chat`**

**Ação:** Microsoft Teams → **Create a chat**. **Nome:** `Create_a_chat`.

| Campo          | Como preencher | Valor                                                                            |
| -------------- | -------------- | -------------------------------------------------------------------------------- |
| Members to add | fx             | `join(body('filChatMembers'), ';')`                                              |
| Title          | Texto + fx     | `SmartBid Approval - @{variables('varClient')} - @{variables('varProjectName')}` |

**Verificar** no primeiro teste: o limite de membros do conector, se todos são usuários internos e se
o chat é criado como **grupo** (com um único membro além do dono, o Teams pode criar um chat 1:1).

**9.2) Set variable — `varChatId`**

**Ação:** Variable → **Set variable**.

| Campo | Como preencher | Valor                          |
| ----- | -------------- | ------------------------------ |
| Name  | Lista          | `varChatId`                    |
| Value | fx             | `body('Create_a_chat')?['id']` |

#### 10) Welcome card

**10.1) Select `selWelcomeMD`** — uma linha de Markdown por responsabilidade, todas pendentes.

**Ação:** Data Operation → **Select**. **Nome:** `selWelcomeMD`.

| Campo            | Como preencher | Valor                                                                 |
| ---------------- | -------------- | --------------------------------------------------------------------- |
| From             | fx             | `variables('varApprovers')`                                           |
| Map (modo **T**) | fx             | `concat('- ⏳ **', item()?['name'], '** — ', item()?['sectorLabel'])` |

**10.2) Join `joinWelcomeMD`** — junta as linhas, uma por linha.

**Ação:** Data Operation → **Join**. **Nome:** `joinWelcomeMD`.

| Campo     | Como preencher | Valor                       |
| --------- | -------------- | --------------------------- |
| From      | fx             | `body('selWelcomeMD')`      |
| Join With | fx             | `decodeUriComponent('%0A')` |

**10.3) Post card in a chat or channel `Post_card_Welcome`**

**Ação:** Microsoft Teams → **Post card in a chat or channel**. **Nome:** `Post_card_Welcome`.

| Campo         | Como preencher          | Valor                                                    |
| ------------- | ----------------------- | -------------------------------------------------------- |
| Post as       | Lista                   | **Flow bot**                                             |
| Post in       | Lista                   | **Group chat**                                           |
| Group chat    | Enter custom value → fx | `variables('varChatId')`                                 |
| Adaptive Card | Texto + fx              | conteúdo de `cards/01-welcome.json` com os tokens abaixo |

Tokens de `01-welcome.json` (como colar: §6):

| Token                  | Substituir por                                  |
| ---------------------- | ----------------------------------------------- |
| `[[BID_NUMBER]]`       | `@{variables('varBidNumber')}`                  |
| `[[CRM_NUMBER]]`       | `@{variables('varCrmNumber')}`                  |
| `[[CLIENT]]`           | `@{variables('varClient')}`                     |
| `[[PROJECT_NAME]]`     | `@{variables('varProjectName')}`                |
| `[[DIVISION]]`         | `@{variables('varDivision')}`                   |
| `[[SERVICE_LINE]]`     | `@{variables('varServiceLine')}`                |
| `[[REQUESTED_BY]]`     | `@{variables('varRequestedBy')}`                |
| `[[TOTAL_COUNT]]`      | `@{length(outputs('comUniqueApproverEmails'))}` |
| `[[APPROVER_LIST_MD]]` | `@{body('joinWelcomeMD')}`                      |
| `[[DEEP_LINK]]`        | `@{variables('varDeepLink')}`                   |

`[[TOTAL_COUNT]]` conta **pessoas**, não setores.

#### 11) Status card inicial

**11.1) Post card in a chat or channel `Post_card_Status`**

**Ação:** Microsoft Teams → **Post card in a chat or channel**. **Nome:** `Post_card_Status`.

| Campo         | Como preencher          | Valor                                                   |
| ------------- | ----------------------- | ------------------------------------------------------- |
| Post as       | Lista                   | **Flow bot**                                            |
| Post in       | Lista                   | **Group chat**                                          |
| Group chat    | Enter custom value → fx | `variables('varChatId')`                                |
| Adaptive Card | Texto + fx              | conteúdo de `cards/02-status.json` com os tokens abaixo |

Tokens de `02-status.json` (estado inicial):

| Token                  | Substituir por                                                                 |
| ---------------------- | ------------------------------------------------------------------------------ |
| `[[BID_NUMBER]]`       | `@{variables('varBidNumber')}`                                                 |
| `[[CLIENT]]`           | `@{variables('varClient')}`                                                    |
| `[[STATUS_BADGE]]`     | `⏳ Em andamento`                                                              |
| `[[PROGRESS_BAR]]`     | `░░░░░░░░░░`                                                                   |
| `[[APPROVED_COUNT]]`   | `0`                                                                            |
| `[[TOTAL_COUNT]]`      | `@{length(outputs('comUniqueApproverEmails'))}`                                |
| `[[APPROVER_LIST_MD]]` | `@{body('joinWelcomeMD')}`                                                     |
| `[[UPDATED_AT]]`       | `@{convertFromUtc(utcNow(), 'E. South America Standard Time', 'dd/MM HH:mm')}` |

**11.2) Set variable — `varStatusMsgId`** — guarda a mensagem do Status card para atualizá-la depois.

**Ação:** Variable → **Set variable**.

| Campo | Como preencher | Valor                                                                               |
| ----- | -------------- | ----------------------------------------------------------------------------------- |
| Name  | Lista          | `varStatusMsgId`                                                                    |
| Value | Dinâmico       | **Message ID** de `Post_card_Status` (equivale a `body('Post_card_Status')?['id']`) |

#### 12) Gravar o chat na Round row

**Ação:** SharePoint → **Update item**. **Nome:** `Update_Round_chat`.

| Campo               | Como preencher | Valor                         |
| ------------------- | -------------- | ----------------------------- |
| Site Address        | Lista          | site do SmartBid              |
| List Name           | Lista          | `smartbid-approvals`          |
| Id                  | fx             | `variables('varRoundItemId')` |
| Title               | fx             | `variables('varBidNumber')`   |
| ChatId              | fx             | `variables('varChatId')`      |
| StatusCardMessageId | fx             | `variables('varStatusMsgId')` |

O fluxo de lembretes (§4) e o de override ([README §10.2](./README.md)) leem esses dois campos.

#### 13) Criar as Approver rows

Uma linha por responsabilidade (pessoa + setor). Os lembretes, o Status card e o fechamento leem estas
linhas.

**13.1) Apply to each `Apply_to_each_createrow`**

**Ação:** Control → **Apply to each**. **Nome:** `Apply_to_each_createrow`.

| Campo                                | Como preencher | Valor                       |
| ------------------------------------ | -------------- | --------------------------- |
| Select an output from previous steps | fx             | `variables('varApprovers')` |
| Settings → Concurrency control       | Lista          | **Off**                     |

**13.2) Create item `Create_ApproverRow`**

**Onde:** dentro de `Apply_to_each_createrow`.
**Ação:** SharePoint → **Create item**. **Nome:** `Create_ApproverRow`.

| Campo                 | Como preencher | Valor                                              |
| --------------------- | -------------- | -------------------------------------------------- |
| Site Address          | Lista          | site do SmartBid                                   |
| List Name             | Lista          | `smartbid-approvals`                               |
| Title                 | fx             | `variables('varBidNumber')`                        |
| RecordType            | Lista          | `Approver`                                         |
| BidNumber             | fx             | `variables('varBidNumber')`                        |
| RoundNumber           | fx             | `variables('varRound')`                            |
| ApproverEmail         | fx             | `items('Apply_to_each_createrow')?['email']`       |
| ApproverName          | fx             | `items('Apply_to_each_createrow')?['name']`        |
| Sector                | fx             | `items('Apply_to_each_createrow')?['sector']`      |
| SectorLabel           | fx             | `items('Apply_to_each_createrow')?['sectorLabel']` |
| ApprovalStatus        | Lista          | `Pending`                                          |
| ChatId                | fx             | `variables('varChatId')`                           |
| StatusCardMessageId   | fx             | `variables('varStatusMsgId')`                      |
| ExpectedApproverCount | fx             | `length(variables('varApprovers'))`                |

`RecordType = Approver` impede que estas linhas disparem o próprio fluxo (trigger condition do passo 2).

### Fase 3 — Um pedido por aprovador, em paralelo

#### 14) Apply to each `Apply_to_each_person`

**Onde:** abaixo de `Apply_to_each_createrow`, fora dele.
**Ação:** Control → **Apply to each**. **Nome:** `Apply_to_each_person`.

| Campo                                | Como preencher | Valor                                |
| ------------------------------------ | -------------- | ------------------------------------ |
| Select an output from previous steps | fx             | `outputs('comUniqueApproverEmails')` |
| Settings → Concurrency control       | Lista          | **On**                               |
| Settings → Degree of parallelism     | Texto          | `50`                                 |

Cada volta do loop é **uma pessoa**, e todas rodam ao mesmo tempo. O item atual é o e-mail dela:
`items('Apply_to_each_person')`. **Aqui dentro, nada de Set variable / Append to array variable**
(§2.5). Todas as ações de 14.1 a 14.11 ficam dentro deste loop, na ordem abaixo.

**14.1) Setores e nome da pessoa**

a. **Filter array `filPersonRows`** — as responsabilidades da pessoa.
**Ação:** Data Operation → **Filter array**.

| Campo | Como preencher | Valor                       |
| ----- | -------------- | --------------------------- |
| From  | fx             | `variables('varApprovers')` |

| Esquerda (fx)      | Operador    | Direita                            |
| ------------------ | ----------- | ---------------------------------- |
| `item()?['email']` | is equal to | fx `items('Apply_to_each_person')` |

b. **Select `selPersonSectors`**

| Campo            | Como preencher | Valor                    |
| ---------------- | -------------- | ------------------------ |
| From             | fx             | `body('filPersonRows')`  |
| Map (modo **T**) | fx             | `item()?['sectorLabel']` |

c. **Compose `comPersonName`** — Inputs (fx): `first(body('filPersonRows'))?['name']`

d. **Compose `comPersonSectors`** — Inputs (fx): `join(body('selPersonSectors'), ', ')`

**14.2) Create an approval `Create_person_approval`**

**Ação:** Approvals → **Create an approval**. **Nome:** `Create_person_approval`.

| Campo                 | Como preencher | Valor                                                                                                     |
| --------------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| Approval type         | Lista          | **Approve/Reject - First to respond**                                                                     |
| Title                 | Texto + fx     | `SmartBid — @{variables('varBidNumber')} — Rodada @{variables('varRound')} — @{outputs('comPersonName')}` |
| Assigned to           | fx             | `items('Apply_to_each_person')`                                                                           |
| Details               | Texto + fx     | bloco abaixo                                                                                              |
| Item link             | fx             | `variables('varDeepLink')`                                                                                |
| Item link description | Texto          | `Abrir BID no SmartBid`                                                                                   |
| Requestor             | fx             | `body('Parse_JSON')?['requestedBy']?['email']` (se o campo existir na sua versão)                         |
| Enable notifications  | Lista          | **Yes** — a pessoa recebe a notificação no Teams (Approvals) e por e-mail                                 |
| Enable reassignment   | Lista          | **No**                                                                                                    |

Details:

```text
**BID:** @{variables('varBidNumber')}
**Cliente:** @{variables('varClient')}
**Divisão:** @{variables('varDivision')}
**Service line:** @{variables('varServiceLine')}
**Rodada:** @{variables('varRound')}
**Solicitado por:** @{variables('varRequestedBy')}
**Seu(s) setor(es):** @{outputs('comPersonSectors')}

Sua resposta vale para todos os seus setores nesta rodada. Inclua um comentário quando necessário.
```

> Use `Create an approval` + `Wait for an approval` (duas ações), e não
> `Start and wait for an approval`: o ID do pedido precisa ser gravado antes da espera.

**14.3) Gravar o ID do pedido nas Approver rows da pessoa**

a. **Compose `comPersonApprovalId`**

| Campo  | Como preencher | Valor                                                                                                              |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Inputs | Dinâmico       | **Approval ID** de `Create_person_approval` (**Verificar**; normalmente `body('Create_person_approval')?['name']`) |

b. **Get items `Get_person_rows`** — as Approver rows desta pessoa nesta rodada.
**Ação:** SharePoint → **Get items**.

| Campo        | Como preencher | Valor                |
| ------------ | -------------- | -------------------- |
| Site Address | Lista          | site do SmartBid     |
| List Name    | Lista          | `smartbid-approvals` |
| Filter Query | Texto + fx     | linha abaixo         |

```text
RecordType eq 'Approver' and BidNumber eq '@{replace(variables('varBidNumber'), '''', '''''')}' and RoundNumber eq @{variables('varRound')} and ApproverEmail eq '@{replace(items('Apply_to_each_person'), '''', '''''')}'
```

c. **Apply to each `Apply_to_each_row_id`**

| Campo                                | Como preencher | Valor                               |
| ------------------------------------ | -------------- | ----------------------------------- |
| Select an output from previous steps | fx             | `body('Get_person_rows')?['value']` |
| Settings → Concurrency control       | Lista          | **Off**                             |

d. **Update item `Update_row_approvalid`** — dentro de `Apply_to_each_row_id`.

| Campo            | Como preencher | Valor                                  |
| ---------------- | -------------- | -------------------------------------- |
| Site Address     | Lista          | site do SmartBid                       |
| List Name        | Lista          | `smartbid-approvals`                   |
| Id               | fx             | `items('Apply_to_each_row_id')?['ID']` |
| Title            | fx             | `variables('varBidNumber')`            |
| NativeApprovalId | fx             | `outputs('comPersonApprovalId')`       |

**14.4) (Opcional) Card particular `Post_card_private`**

Só se quiser o pedido também como card no chat da pessoa com o Flow bot. **Onde:** abaixo de
`Apply_to_each_row_id`. **Ação:** Microsoft Teams → **Post card in a chat or channel**.

| Campo         | Como preencher | Valor                                                                     |
| ------------- | -------------- | ------------------------------------------------------------------------- |
| Post as       | Lista          | **Flow bot**                                                              |
| Post in       | Lista          | **Chat with Flow bot**                                                    |
| Recipient     | fx             | `items('Apply_to_each_person')`                                           |
| Adaptive Card | Dinâmico       | **Teams Adaptive Card** de `Create_person_approval` (inteira, sem editar) |

**Verificar** se os botões funcionam no tenant; se não, a notificação do Approvals já basta. **Nunca**
poste esse card no chat em grupo.

**14.5) Esperar a resposta, revisando a rodada a cada 24 h**

a. **Do until `Do_until_person_done`**

**Onde:** abaixo da 14.3 (ou da 14.4, se usou).
**Ação:** Control → **Do until**. **Nome:** `Do_until_person_done`.

Loop until (preencha depois de criar b e c), numa linha:

| Esquerda (fx)                    | Operador    | Direita   |
| -------------------------------- | ----------- | --------- |
| expressão abaixo, colada inteira | is equal to | fx `true` |

```text
or(not(empty(body('Wait_person_approval')?['outcome'])), contains(toLower(string(body('Get_Round_chk')?['ApprovalStatus'])), 'rejected'), contains(toLower(string(body('Get_Round_chk')?['ApprovalStatus'])), 'overridden'))
```

| Limite  | Como preencher | Valor  |
| ------- | -------------- | ------ |
| Count   | Texto          | `28`   |
| Timeout | Texto          | `P29D` |

O **Count 28** (28 esperas de 24 h) é o que encerra a espera depois de 28 dias. O Timeout fica um dia
acima só para não cortar a última espera no meio.

b. **Wait for an approval `Wait_person_approval`** — dentro do Do until.
**Ação:** Approvals → **Wait for an approval**. **Nome:** `Wait_person_approval`.

| Campo                     | Como preencher | Valor                            |
| ------------------------- | -------------- | -------------------------------- |
| Approval ID               | fx             | `outputs('comPersonApprovalId')` |
| Settings → Action timeout | Texto          | `PT24H`                          |

**Verificar** se o tenant aceita timeout nesta ação.

c. **Get item `Get_Round_chk`** — dentro do Do until, abaixo da b. Relê a Round row.
**Ação:** SharePoint → **Get item**. **Nome:** `Get_Round_chk`.

| Campo                                         | Como preencher | Valor                                 |
| --------------------------------------------- | -------------- | ------------------------------------- |
| Site Address                                  | Lista          | site do SmartBid                      |
| List Name                                     | Lista          | `smartbid-approvals`                  |
| Id                                            | fx             | `variables('varRoundItemId')`         |
| Settings → Run after (`Wait_person_approval`) | marcar         | **is successful** e **has timed out** |

O loop termina quando a pessoa responde, quando outra pessoa recusou (Round row `Rejected`) ou quando
houve override (Round row `Overridden`). Após cada timeout de 24 h o loop volta a esperar **o mesmo
pedido**: nenhum pedido novo é criado. Os lembretes ficam no fluxo diário (§4).

**14.6) Houve resposta? Ela é desta pessoa?**

a. **Condition `Condition_person_responded`**

**Onde:** abaixo de `Do_until_person_done`, ainda dentro de `Apply_to_each_person`.

| Esquerda (fx)                                     | Operador    | Direita    |
| ------------------------------------------------- | ----------- | ---------- |
| `empty(body('Wait_person_approval')?['outcome'])` | is equal to | fx `false` |

- **True:** ações b a f.
- **False:** deixe vazio — a espera acabou sem resposta (recusa de outra pessoa, override ou prazo).

b–e. **Composes da resposta** — no ramo **True**, um Compose por linha, nesta ordem
(**Verificar** os nomes dos campos na primeira execução):

| Nome (Compose)    | Inputs (fx)                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `comResponse`     | `first(body('Wait_person_approval')?['responses'])`                                       |
| `comDecision`     | `if(equals(body('Wait_person_approval')?['outcome'], 'Approve'), 'approved', 'rejected')` |
| `comComments`     | `outputs('comResponse')?['comments']`                                                     |
| `comResponseDate` | `coalesce(outputs('comResponse')?['responseDate'], utcNow())`                             |

f. **Condition `Condition_responder_ok`** — no ramo **True**, abaixo dos Composes. Confere que quem
respondeu é a pessoa do pedido. Compara com o e-mail **e** com o UPN, porque o e-mail gravado no
SmartBid pode ser qualquer um dos dois.

| Esquerda (fx)                    | Operador    | Direita   |
| -------------------------------- | ----------- | --------- |
| expressão abaixo, colada inteira | is equal to | fx `true` |

```text
or(equals(toLower(string(outputs('comResponse')?['responder']?['email'])), items('Apply_to_each_person')), equals(toLower(string(outputs('comResponse')?['responder']?['userPrincipalName'])), items('Apply_to_each_person')))
```

- **True:** passos 14.7 e 14.8.
- **False:** e-mail de aviso para o administrador. **Ação:** Mail → **Send an email notification (V3)**.
  **Nome:** `Send_fail_responder`. **To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                |
| ------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject | Texto + fx     | `SmartBid – resposta não gravada: BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                 |
| Body    | Texto + fx     | `O pedido de @{items('Apply_to_each_person')} foi respondido por @{outputs('comResponse')?['responder']?['email']} (@{body('Wait_person_approval')?['outcome']}). Nada foi gravado. Confira e registre manualmente.` |

**14.7) Gravar a resposta no BID (ETag)**

Tudo de 14.7 fica no ramo **True** de `Condition_responder_ok`. Como funciona o ETag: §5.

a. **Do until `Do_until_write_inc`**

**Ação:** Control → **Do until**. **Nome:** `Do_until_write_inc`.

Loop until (preencha depois de criar b a k):

| Esquerda (fx)                                                                                         | Operador    | Direita   |
| ----------------------------------------------------------------------------------------------------- | ----------- | --------- |
| `or(equals(outputs('comCanWrite_inc'), false), equals(outputs('Send_HTTP_inc')?['statusCode'], 204))` | is equal to | fx `true` |

| Limite  | Como preencher | Valor   |
| ------- | -------------- | ------- |
| Count   | Texto          | `10`    |
| Timeout | Texto          | `PT10M` |

São mais tentativas que na README porque várias pessoas, em paralelo, podem gravar no mesmo BID.

b. **Get item `Get_BID_inc`** — dentro do Do until. Relê o BID a cada tentativa.

| Campo        | Como preencher | Valor                       |
| ------------ | -------------- | --------------------------- |
| Site Address | Lista          | site do SmartBid            |
| List Name    | Lista          | `smartbid-tracker`          |
| Id           | fx             | `variables('varBidItemId')` |

c. **Parse JSON `Parse_BID_inc`**

| Campo   | Como preencher | Valor                              |
| ------- | -------------- | ---------------------------------- |
| Content | fx             | `body('Get_BID_inc')?['jsondata']` |
| Schema  | Texto          | bloco abaixo                       |

```json
{
  "type": "object",
  "properties": {
    "approvals": { "type": "array" },
    "approvalRounds": { "type": "array" }
  }
}
```

d. **Compose `comLastRound_inc`** — Inputs (fx):

```text
last(coalesce(body('Parse_BID_inc')?['approvalRounds'], json('[]')))
```

e. **Compose `comCanWrite_inc`** — a guarda: rodada atual, sem override e ainda não aprovada.
Inputs (fx):

```text
and(equals(string(outputs('comLastRound_inc')?['round']), string(variables('varRound'))), empty(outputs('comLastRound_inc')?['override']), not(equals(string(outputs('comLastRound_inc')?['status']), 'approved')))
```

f. **Condition `Condition_can_write_inc`**

| Esquerda (fx)                | Operador    | Direita   |
| ---------------------------- | ----------- | --------- |
| `outputs('comCanWrite_inc')` | is equal to | fx `true` |

- **True:** ações g a l.
- **False:** deixe vazio (o Do until termina sem gravar).

g. **Select `selApprovals_inc`** — no ramo True. Marca a decisão em **todas** as entradas da pessoa
nesta rodada (sem filtro por setor).

| Campo            | Como preencher | Valor                                 |
| ---------------- | -------------- | ------------------------------------- |
| From             | fx             | `body('Parse_BID_inc')?['approvals']` |
| Map (modo **T**) | fx             | expressão abaixo                      |

```text
if(and(equals(string(item()?['round']), string(variables('varRound'))), equals(toLower(string(item()?['stakeholder']?['email'])), items('Apply_to_each_person'))), setProperty(setProperty(setProperty(setProperty(setProperty(item(), 'status', outputs('comDecision')), 'decision', outputs('comDecision')), 'respondedDate', outputs('comResponseDate')), 'comments', outputs('comComments')), 'approvedVia', 'Approvals'), item())
```

h. **Filter array `filRoundApprovals_inc`** — as entradas da rodada atual, já atualizadas.

| Campo | Como preencher | Valor                      |
| ----- | -------------- | -------------------------- |
| From  | fx             | `body('selApprovals_inc')` |

| Esquerda (fx)              | Operador    | Direita                            |
| -------------------------- | ----------- | ---------------------------------- |
| `string(item()?['round'])` | is equal to | fx `string(variables('varRound'))` |

i. **Select `selRounds_inc`** — copia as entradas para `approvalRounds[atual]` e, na recusa, marca a
rodada como `rejected`.

| Campo            | Como preencher | Valor                                      |
| ---------------- | -------------- | ------------------------------------------ |
| From             | fx             | `body('Parse_BID_inc')?['approvalRounds']` |
| Map (modo **T**) | fx             | expressão abaixo                           |

```text
if(equals(string(item()?['round']), string(variables('varRound'))), setProperty(setProperty(item(), 'approvals', body('filRoundApprovals_inc')), 'status', if(equals(outputs('comDecision'), 'rejected'), 'rejected', item()?['status'])), item())
```

j. **Compose `comBidInc`** — o JSON completo do BID com as alterações. Inputs (fx):

```text
setProperty(setProperty(setProperty(body('Parse_BID_inc'), 'approvals', body('selApprovals_inc')), 'approvalRounds', body('selRounds_inc')), 'approvalStatus', if(equals(outputs('comDecision'), 'rejected'), 'rejected', body('Parse_BID_inc')?['approvalStatus']))
```

Uma aprovação parcial **nunca** grava `approvalStatus = approved`.

k. **Send an HTTP request to SharePoint `Send_HTTP_inc`**
**Ação:** SharePoint → **Send an HTTP request to SharePoint**. **Nome:** `Send_HTTP_inc`.

| Campo                   | Como preencher | Valor                                                                               |
| ----------------------- | -------------- | ----------------------------------------------------------------------------------- |
| Site Address            | Lista          | site do SmartBid                                                                    |
| Method                  | Lista          | `POST`                                                                              |
| Uri                     | Texto + fx     | `_api/web/lists/getbytitle('smartbid-tracker')/items(@{variables('varBidItemId')})` |
| Headers (3 linhas)      | ver abaixo     | ver abaixo                                                                          |
| Body                    | fx             | `setProperty(json('{}'), 'jsondata', string(outputs('comBidInc')))`                 |
| Settings → Retry policy | Lista          | **None**                                                                            |

| Header (Texto)  | Valor                                    | Como preencher |
| --------------- | ---------------------------------------- | -------------- |
| `X-HTTP-Method` | `MERGE`                                  | Texto          |
| `If-Match`      | `@{body('Get_BID_inc')?['@odata.etag']}` | Texto + fx     |
| `Content-Type`  | `application/json;odata=nometadata`      | Texto          |

- No `If-Match`, nada antes do `@`: nem espaço nem TAB ([README §7.6](./README.md)).
- Use `@odata.etag` (a versão do item, no formato `"5"`). **Não** use `{ETag}`: ele não é a versão do
  item da lista, e o SharePoint responde `412` em todas as tentativas.
- O aviso "Enter a valid JSON" no Body é falso positivo ([README §7.7](./README.md)).
- Retry policy **None**: um retry automático reenviaria um ETag velho.

l. **Compose `comContinue_inc`** — absorve o `412` para o Do until tentar de novo.

| Campo                                  | Como preencher | Valor                                     |
| -------------------------------------- | -------------- | ----------------------------------------- |
| Inputs                                 | fx             | `outputs('Send_HTTP_inc')?['statusCode']` |
| Settings → Run after (`Send_HTTP_inc`) | marcar         | **is successful** e **has failed**        |

**14.8) A gravação deu certo?**

**Condition `Condition_written_inc`** — abaixo de `Do_until_write_inc`, ainda no ramo True de
`Condition_responder_ok`. Seletor: **AND**.

| #   | Esquerda (fx)                             | Operador    | Direita   |
| --- | ----------------------------------------- | ----------- | --------- |
| 1   | `outputs('comCanWrite_inc')`              | is equal to | fx `true` |
| 2   | `outputs('Send_HTTP_inc')?['statusCode']` | is equal to | fx `204`  |

- **True:** passos 14.9, 14.10 e 14.11.
- **False:** e-mail de aviso para o administrador. **Ação:** Mail → **Send an email notification (V3)**.
  **Nome:** `Send_fail_write_inc`. **To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                                                       |
| ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject | Texto + fx     | `SmartBid – resposta não gravada no BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                                                      |
| Body    | Texto + fx     | `Resposta de @{outputs('comPersonName')}: @{outputs('comDecision')}. Guarda: @{outputs('comCanWrite_inc')} (false = rodada mudou ou houve override). Último status HTTP: @{outputs('Send_HTTP_inc')?['statusCode']}. Comentário: @{outputs('comComments')}` |

Se a gravação no BID não aconteceu, o fluxo também **não** altera as Approver rows, a Round row nem o
chat. Assim, uma resposta que chega depois de um override não troca `Overridden` por `Rejected`.

**14.9) Atualizar as Approver rows da pessoa** — no ramo True de `Condition_written_inc`.

a. **Apply to each `Apply_to_each_row_status`**

| Campo                                | Como preencher | Valor                               |
| ------------------------------------ | -------------- | ----------------------------------- |
| Select an output from previous steps | fx             | `body('Get_person_rows')?['value']` |
| Settings → Concurrency control       | Lista          | **Off**                             |

b. **Update item `Update_row_status`** — dentro de `Apply_to_each_row_status`.

| Campo            | Como preencher          | Valor                                                                    |
| ---------------- | ----------------------- | ------------------------------------------------------------------------ |
| Site Address     | Lista                   | site do SmartBid                                                         |
| List Name        | Lista                   | `smartbid-approvals`                                                     |
| Id               | fx                      | `items('Apply_to_each_row_status')?['ID']`                               |
| Title            | fx                      | `variables('varBidNumber')`                                              |
| ApprovalStatus   | Enter custom value → fx | `if(equals(outputs('comDecision'), 'approved'), 'Approved', 'Rejected')` |
| RespondedDate    | fx                      | `outputs('comResponseDate')`                                             |
| ApproverComments | fx                      | `outputs('comComments')`                                                 |

**14.10) Atualizar o Status card** — no ramo True de `Condition_written_inc`, abaixo da 14.9.

a. **Get items `Get_rows_status`** — todas as Approver rows da rodada, já atualizadas.

| Campo        | Como preencher | Valor                |
| ------------ | -------------- | -------------------- |
| Site Address | Lista          | site do SmartBid     |
| List Name    | Lista          | `smartbid-approvals` |
| Filter Query | Texto + fx     | linha abaixo         |
| Order By     | Texto          | `ID asc`             |

```text
RecordType eq 'Approver' and BidNumber eq '@{replace(variables('varBidNumber'), '''', '''''')}' and RoundNumber eq @{variables('varRound')}
```

b. **Filter array `filApprovedRows`** — From (fx) `body('Get_rows_status')?['value']`:

| Esquerda (fx)                                                      | Operador    | Direita   |
| ------------------------------------------------------------------ | ----------- | --------- |
| `contains(toLower(string(item()?['ApprovalStatus'])), 'approved')` | is equal to | fx `true` |

c. **Filter array `filRejectedRows`** — From (fx) `body('Get_rows_status')?['value']`:

| Esquerda (fx)                                                      | Operador    | Direita   |
| ------------------------------------------------------------------ | ----------- | --------- |
| `contains(toLower(string(item()?['ApprovalStatus'])), 'rejected')` | is equal to | fx `true` |

d. **Select `selApprovedEmails`** — From (fx) `body('filApprovedRows')`; Map (modo **T**, fx)
`toLower(item()?['ApproverEmail'])`.

e. **Compose `comApprovedPeople`** — pessoas que já aprovaram (cada pessoa conta uma vez). Inputs (fx):
`length(union(body('selApprovedEmails'), body('selApprovedEmails')))`

f. **Compose `comFilled`** — quantos dos 10 blocos da barra ficam cheios. Inputs (fx):
`div(mul(outputs('comApprovedPeople'), 10), max(length(outputs('comUniqueApproverEmails')), 1))`

g. **Compose `comProgressBar`** — Inputs (fx):

```text
concat(substring('▓▓▓▓▓▓▓▓▓▓', 0, outputs('comFilled')), substring('░░░░░░░░░░', 0, sub(10, outputs('comFilled'))))
```

h. **Select `selStatusMD`** — From (fx) `body('Get_rows_status')?['value']`; Map (modo **T**, fx):

```text
concat(if(contains(toLower(string(item()?['ApprovalStatus'])), 'approved'), '✅', if(contains(toLower(string(item()?['ApprovalStatus'])), 'rejected'), '❌', '⏳')), ' **', item()?['ApproverName'], '** — ', item()?['SectorLabel'])
```

i. **Join `joinStatusMD`** — From (fx) `body('selStatusMD')`; Join With (fx) `decodeUriComponent('%0A')`.

j. **Update an adaptive card in a chat or channel `Update_StatusCard`**
**Ação:** Microsoft Teams → **Update an adaptive card in a chat or channel**.

| Campo         | Como preencher          | Valor                                                   |
| ------------- | ----------------------- | ------------------------------------------------------- |
| Post as       | Lista                   | **Flow bot**                                            |
| Post in       | Lista                   | **Group chat**                                          |
| Group chat    | Enter custom value → fx | `variables('varChatId')`                                |
| Message ID    | fx                      | `variables('varStatusMsgId')`                           |
| Adaptive Card | Texto + fx              | conteúdo de `cards/02-status.json` com os tokens abaixo |

| Token                  | Substituir por                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `[[BID_NUMBER]]`       | `@{variables('varBidNumber')}`                                                          |
| `[[CLIENT]]`           | `@{variables('varClient')}`                                                             |
| `[[STATUS_BADGE]]`     | `@{if(greater(length(body('filRejectedRows')), 0), '❌ Rejeitado', '⏳ Em andamento')}` |
| `[[PROGRESS_BAR]]`     | `@{outputs('comProgressBar')}`                                                          |
| `[[APPROVED_COUNT]]`   | `@{outputs('comApprovedPeople')}`                                                       |
| `[[TOTAL_COUNT]]`      | `@{length(outputs('comUniqueApproverEmails'))}`                                         |
| `[[APPROVER_LIST_MD]]` | `@{body('joinStatusMD')}`                                                               |
| `[[UPDATED_AT]]`       | `@{convertFromUtc(utcNow(), 'E. South America Standard Time', 'dd/MM HH:mm')}`          |

**14.11) Round row e mensagem no grupo** — no ramo True de `Condition_written_inc`, abaixo da 14.10.

**Condition `Condition_person_rejected`**

| Esquerda (fx)            | Operador    | Direita          |
| ------------------------ | ----------- | ---------------- |
| `outputs('comDecision')` | is equal to | texto `rejected` |

**Ramo True (recusa):**

a. **Update item `Update_Round_rejected`** — marca a rodada como rejeitada. Isso para os lembretes e
faz os outros ramos saírem da espera na próxima revisão (até 24 h).

| Campo          | Como preencher | Valor                         |
| -------------- | -------------- | ----------------------------- |
| Site Address   | Lista          | site do SmartBid              |
| List Name      | Lista          | `smartbid-approvals`          |
| Id             | fx             | `variables('varRoundItemId')` |
| Title          | fx             | `variables('varBidNumber')`   |
| ApprovalStatus | Lista          | `Rejected`                    |

b. **Post message in a chat or channel `Post_msg_rejected`**

| Campo      | Como preencher          | Valor                                                                                                                                        |
| ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Post as    | Lista                   | **Flow bot**                                                                                                                                 |
| Post in    | Lista                   | **Group chat**                                                                                                                               |
| Group chat | Enter custom value → fx | `variables('varChatId')`                                                                                                                     |
| Message    | Texto + fx              | `❌ **@{outputs('comPersonName')}** recusou. A rodada @{variables('varRound')} foi rejeitada; os pedidos ainda abertos podem ser ignorados.` |

**Ramo False (aprovação):**

c. **Post message in a chat or channel `Post_msg_approved`** — mesmos campos de b, com:

| Campo   | Como preencher | Valor                                                                                                                         |
| ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Message | Texto + fx     | `✅ **@{outputs('comPersonName')}** aprovou (@{outputs('comApprovedPeople')}/@{length(outputs('comUniqueApproverEmails'))}).` |

O comentário não é publicado no grupo: ele fica no BID e aparece no SmartBid.

### Fase 4 — Fechamento (depois do `Apply_to_each_person`)

O loop termina quando todas as pessoas saíram da espera: cada uma respondeu, alguém recusou, houve
override ou o prazo acabou. Todas as ações desta fase ficam **abaixo** de `Apply_to_each_person`,
fora dele, no nível principal.

#### 15) Estado final da rodada

**15.1) Get item `Get_Round_final`** — relê a Round row.
**Ação:** SharePoint → **Get item**. **Nome:** `Get_Round_final`.

| Campo                                         | Como preencher | Valor                                                 |
| --------------------------------------------- | -------------- | ----------------------------------------------------- |
| Site Address                                  | Lista          | site do SmartBid                                      |
| List Name                                     | Lista          | `smartbid-approvals`                                  |
| Id                                            | fx             | `variables('varRoundItemId')`                         |
| Settings → Run after (`Apply_to_each_person`) | marcar         | **is successful**, **has failed** e **has timed out** |

O Run after ampliado garante o fechamento mesmo que o ramo de alguma pessoa tenha falhado.

**15.2) Get items `Get_rows_final`** — todas as Approver rows da rodada.

| Campo        | Como preencher | Valor                |
| ------------ | -------------- | -------------------- |
| Site Address | Lista          | site do SmartBid     |
| List Name    | Lista          | `smartbid-approvals` |
| Filter Query | Texto + fx     | linha abaixo         |
| Order By     | Texto          | `ID asc`             |

```text
RecordType eq 'Approver' and BidNumber eq '@{replace(variables('varBidNumber'), '''', '''''')}' and RoundNumber eq @{variables('varRound')}
```

**15.3) Filter array `filRejected_final`** — From (fx) `body('Get_rows_final')?['value']`:

| Esquerda (fx)                                                      | Operador    | Direita   |
| ------------------------------------------------------------------ | ----------- | --------- |
| `contains(toLower(string(item()?['ApprovalStatus'])), 'rejected')` | is equal to | fx `true` |

**15.4) Filter array `filApproved_final`** — From (fx) `body('Get_rows_final')?['value']`:

| Esquerda (fx)                                                      | Operador    | Direita   |
| ------------------------------------------------------------------ | ----------- | --------- |
| `contains(toLower(string(item()?['ApprovalStatus'])), 'approved')` | is equal to | fx `true` |

**15.5) Compose `comFinalOutcome`** — o resultado da rodada numa palavra. Inputs (fx):

```text
if(contains(toLower(string(body('Get_Round_final')?['ApprovalStatus'])), 'overridden'), 'overridden', if(greater(length(body('filRejected_final')), 0), 'rejected', if(equals(length(body('filApproved_final')), length(body('Get_rows_final')?['value'])), 'approved', if(greater(ticks(utcNow()), ticks(addDays(triggerOutputs()?['body/Created'], 27))), 'expired', 'incomplete'))))
```

| Resultado    | Quando                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `overridden` | a Round row está `Overridden` (override no app)                                                             |
| `rejected`   | pelo menos uma Approver row está `Rejected`                                                                 |
| `approved`   | todas as Approver rows estão `Approved`                                                                     |
| `expired`    | ainda há pendências **e** a rodada foi criada há mais de 27 dias: o prazo de espera acabou                  |
| `incomplete` | ainda há pendências, mas o prazo **não** acabou: alguma resposta não foi gravada (veja os e-mails de falha) |

`incomplete` separa uma falha técnica de um prazo esgotado. Sem essa distinção, uma gravação que falha
faria o fluxo anunciar no chat, minutos depois, que a rodada "expirou".

**15.6) Condition `Condition_overridden`**

| Esquerda (fx)                | Operador    | Direita            |
| ---------------------------- | ----------- | ------------------ |
| `outputs('comFinalOutcome')` | is equal to | texto `overridden` |

- **True:** Control → **Terminate** `Terminate_overridden`, Status **Cancelled**. O aviso de override
  no chat é do fluxo da [README §10.2](./README.md); nada de mensagens de sucesso aqui.
- **False:** deixe vazio. O passo 15.7 fica abaixo desta Condition.

**15.7) Condition `Condition_incomplete`** — respostas não gravadas antes do prazo.

**Onde:** abaixo de `Condition_overridden`, fora dela.

| Esquerda (fx)                | Operador    | Direita            |
| ---------------------------- | ----------- | ------------------ |
| `outputs('comFinalOutcome')` | is equal to | texto `incomplete` |

- **True:** ações a, b e c abaixo. Nada é publicado no chat.
- **False:** deixe vazio. O passo 16 fica abaixo desta Condition.

a. **Update item `Update_Round_incomplete`** — no ramo **True**. Marca a Round row `Expired` só para
parar os lembretes diários (o fluxo de lembrete lê apenas rodadas `Pending`).

| Campo          | Como preencher | Valor                         |
| -------------- | -------------- | ----------------------------- |
| Site Address   | Lista          | site do SmartBid              |
| List Name      | Lista          | `smartbid-approvals`          |
| Id             | fx             | `variables('varRoundItemId')` |
| Title          | fx             | `variables('varBidNumber')`   |
| ApprovalStatus | Lista          | `Expired`                     |

b. **`Send_fail_incomplete`** — no ramo **True**, abaixo da a. E-mail de aviso para o administrador.
**Ação:** Mail → **Send an email notification (V3)**. **Nome:** `Send_fail_incomplete`.
**To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject | Texto + fx     | `SmartBid – rodada encerrada com respostas não gravadas: BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                                                                                                                                               |
| Body    | Texto + fx     | `Todas as esperas terminaram antes do prazo, mas @{sub(length(body('Get_rows_final')?['value']), length(body('filApproved_final')))} responsabilidade(s) continuam Pending na smartbid-approvals. Veja os e-mails "resposta não gravada" desta rodada e o histórico da execução. Nada foi anunciado no chat. A Round row foi marcada Expired só para parar os lembretes.` |

c. **`Terminate_fail_incomplete`** — no ramo **True**, abaixo da b. **Ação:** Control → **Terminate**.

| Campo   | Como preencher | Valor                                                                                         |
| ------- | -------------- | --------------------------------------------------------------------------------------------- |
| Status  | Lista          | **Failed**                                                                                    |
| Code    | Texto          | `ROUND_INCOMPLETE`                                                                            |
| Message | Texto + fx     | `Respostas não gravadas no BID @{variables('varBidNumber')}, rodada @{variables('varRound')}` |

Com o Terminate **Failed**, a execução aparece como falha no histórico, e não como "ran successfully".

#### 16) Fechar a rodada

**16.1) Condition `Condition_needs_close`** — aprovada ou rejeitada (grava no BID) × expirada.

| Esquerda (fx)                | Operador        | Direita         |
| ---------------------------- | --------------- | --------------- |
| `outputs('comFinalOutcome')` | is not equal to | texto `expired` |

- **True** (`approved` ou `rejected`): ações 16.2 a 16.4.
- **False** (`expired`; `overridden` e `incomplete` já terminaram antes): ações 16.5 e 16.6.

**16.2) Compose `comCompletionDate`** — no ramo **True**. Inputs (fx):

```text
if(equals(outputs('comFinalOutcome'), 'rejected'), coalesce(first(body('filRejected_final'))?['RespondedDate'], utcNow()), utcNow())
```

Na recusa, usa a data da recusa (os outros ramos podem ter levado até 24 h para sair da espera). Na
aprovação, o fechamento roda logo após a última resposta, então `utcNow()` é a data dela.

**16.3) Gravar o fechamento no BID (ETag)** — no ramo **True**, abaixo da 16.2. Mesma estrutura do
passo 14.7, com nomes `_final`.

a. **Do until `Do_until_write_final`**

Loop until (preencha depois de criar b a k):

| Esquerda (fx)                                                                                             | Operador    | Direita   |
| --------------------------------------------------------------------------------------------------------- | ----------- | --------- |
| `or(equals(outputs('comCanWrite_final'), false), equals(outputs('Send_HTTP_final')?['statusCode'], 204))` | is equal to | fx `true` |

| Limite  | Como preencher | Valor  |
| ------- | -------------- | ------ |
| Count   | Texto          | `5`    |
| Timeout | Texto          | `PT5M` |

b. **Get item `Get_BID_final`** — dentro do Do until. List Name `smartbid-tracker`, Id (fx)
`variables('varBidItemId')`.

c. **Parse JSON `Parse_BID_final`** — Content (fx) `body('Get_BID_final')?['jsondata']`; Schema (Texto):
o mesmo bloco de `Parse_BID_inc` (passo 14.7 c).

d. **Compose `comLastRound_final`** — Inputs (fx):
`last(coalesce(body('Parse_BID_final')?['approvalRounds'], json('[]')))`

e. **Filter array `filNotApprovedJson_final`** — entradas da rodada atual que ainda não estão
`approved` no JSON do BID.

| Campo | Como preencher | Valor                                                         |
| ----- | -------------- | ------------------------------------------------------------- |
| From  | fx             | `coalesce(body('Parse_BID_final')?['approvals'], json('[]'))` |

| Esquerda (fx)                                                                                                                       | Operador    | Direita   |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------- |
| `and(equals(string(item()?['round']), string(variables('varRound'))), not(equals(toLower(string(item()?['status'])), 'approved')))` | is equal to | fx `true` |

f. **Compose `comCanWrite_final`** — a guarda. Inputs (fx):

```text
and(equals(string(outputs('comLastRound_final')?['round']), string(variables('varRound'))), empty(outputs('comLastRound_final')?['override']), or(equals(outputs('comFinalOutcome'), 'rejected'), equals(length(body('filNotApprovedJson_final')), 0)))
```

Rodada atual, sem override e, para fechar como aprovada, **todas** as entradas da rodada `approved` no
JSON. Se faltar alguma, a guarda fica `false`, o BID não é fechado e o passo 16.4 notifica.

g. **Condition `Condition_can_write_final`**

| Esquerda (fx)                  | Operador    | Direita   |
| ------------------------------ | ----------- | --------- |
| `outputs('comCanWrite_final')` | is equal to | fx `true` |

- **True:** ações h a k.
- **False:** deixe vazio.

h. **Select `selRounds_final`** — From (fx) `body('Parse_BID_final')?['approvalRounds']`;
Map (modo **T**, fx):

```text
if(equals(string(item()?['round']), string(variables('varRound'))), setProperty(setProperty(item(), 'status', outputs('comFinalOutcome')), 'completedDate', outputs('comCompletionDate')), item())
```

i. **Compose `comBidFinal`** — Inputs (fx):

```text
if(equals(outputs('comFinalOutcome'), 'approved'), setProperty(setProperty(setProperty(setProperty(setProperty(body('Parse_BID_final'), 'approvalRounds', body('selRounds_final')), 'approvalStatus', 'approved'), 'currentStatus', 'Completed'), 'currentPhase', 'Close Out'), 'completedDate', outputs('comCompletionDate')), setProperty(setProperty(body('Parse_BID_final'), 'approvalRounds', body('selRounds_final')), 'approvalStatus', 'rejected'))
```

- **Aprovada:** rodada `approved` + `completedDate`; BID `approvalStatus = approved`,
  `currentStatus = Completed`, `currentPhase = Close Out`, `completedDate`.
- **Rejeitada:** rodada `rejected` + `completedDate` da rodada; no BID só `approvalStatus = rejected`.
  `currentStatus`, `currentPhase` e o `completedDate` do BID não mudam.

j. **Send an HTTP request to SharePoint `Send_HTTP_final`** — igual ao `Send_HTTP_inc` (passo 14.7 k),
trocando:

| Campo      | Valor                                                                 |
| ---------- | --------------------------------------------------------------------- |
| `If-Match` | `@{body('Get_BID_final')?['@odata.etag']}`                            |
| Body (fx)  | `setProperty(json('{}'), 'jsondata', string(outputs('comBidFinal')))` |

Retry policy **None**, como no incremental.

k. **Compose `comContinue_final`** — Inputs (fx) `outputs('Send_HTTP_final')?['statusCode']`;
Run after (`Send_HTTP_final`): **is successful** e **has failed**.

**16.4) Condition `Condition_written_final`** — no ramo True de `Condition_needs_close`, abaixo de
`Do_until_write_final`. Seletor: **AND**.

| #   | Esquerda (fx)                               | Operador    | Direita   |
| --- | ------------------------------------------- | ----------- | --------- |
| 1   | `outputs('comCanWrite_final')`              | is equal to | fx `true` |
| 2   | `outputs('Send_HTTP_final')?['statusCode']` | is equal to | fx `204`  |

**True:** Update item `Update_Round_closed`:

| Campo          | Como preencher          | Valor                                                                        |
| -------------- | ----------------------- | ---------------------------------------------------------------------------- |
| Site Address   | Lista                   | site do SmartBid                                                             |
| List Name      | Lista                   | `smartbid-approvals`                                                         |
| Id             | fx                      | `variables('varRoundItemId')`                                                |
| Title          | fx                      | `variables('varBidNumber')`                                                  |
| ApprovalStatus | Enter custom value → fx | `if(equals(outputs('comFinalOutcome'), 'approved'), 'Approved', 'Rejected')` |

**False:** duas ações. Sem fechamento gravado, nada de mensagem de sucesso.

Primeira: e-mail de aviso para o administrador. **Ação:** Mail → **Send an email notification (V3)**.
**Nome:** `Send_fail_close`. **To** (fx): `variables('varAdminEmail')`. Subject e Body:

| Campo   | Como preencher | Valor                                                                                                                                                                                                                               |
| ------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subject | Texto + fx     | `SmartBid – fechamento não gravado: BID @{variables('varBidNumber')}, rodada @{variables('varRound')}`                                                                                                                              |
| Body    | Texto + fx     | `Resultado: @{outputs('comFinalOutcome')}. Guarda: @{outputs('comCanWrite_final')}. Entradas não aprovadas no JSON: @{length(body('filNotApprovedJson_final'))}. Último status HTTP: @{outputs('Send_HTTP_final')?['statusCode']}.` |

Segunda, abaixo de `Send_fail_close`: **Ação:** Control → **Terminate**. **Nome:** `Terminate_fail_close`.

| Campo   | Como preencher | Valor                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| Status  | Lista          | **Failed**                                                   |
| Code    | Texto          | `CLOSE_FAILED`                                               |
| Message | Texto + fx     | `Fechamento não gravado no BID @{variables('varBidNumber')}` |

**16.5) Update item `Update_Round_expired`** — no ramo **False** de `Condition_needs_close`.

| Campo          | Como preencher | Valor                         |
| -------------- | -------------- | ----------------------------- |
| Site Address   | Lista          | site do SmartBid              |
| List Name      | Lista          | `smartbid-approvals`          |
| Id             | fx             | `variables('varRoundItemId')` |
| Title          | fx             | `variables('varBidNumber')`   |
| ApprovalStatus | Lista          | `Expired`                     |

**16.6) Post message in a chat or channel `Post_msg_expired`** — no ramo **False**, abaixo da 16.5.
Post as **Flow bot**, Post in **Group chat**, Group chat (Enter custom value → fx)
`variables('varChatId')`, Message (Texto + fx):

```text
⌛ A rodada @{variables('varRound')} do BID @{variables('varBidNumber')} expirou sem todas as respostas. Nenhuma decisão foi registrada no lugar de quem não respondeu. Para continuar, inicie uma nova rodada pelo SmartBid.
```

#### 17) Status card final

Abaixo de `Condition_needs_close`, fora dela. Repete o cálculo do passo 14.10 com as linhas finais,
para corrigir qualquer contagem desatualizada por respostas simultâneas.

a. **Select `selApprovedEmails_final`** — From (fx) `body('filApproved_final')`; Map (modo **T**, fx)
`toLower(item()?['ApproverEmail'])`.

b. **Compose `comApprovedPeople_final`** — Inputs (fx):
`length(union(body('selApprovedEmails_final'), body('selApprovedEmails_final')))`

c. **Compose `comFilled_final`** — Inputs (fx):
`div(mul(outputs('comApprovedPeople_final'), 10), max(length(outputs('comUniqueApproverEmails')), 1))`

d. **Compose `comProgressBar_final`** — Inputs (fx):

```text
concat(substring('▓▓▓▓▓▓▓▓▓▓', 0, outputs('comFilled_final')), substring('░░░░░░░░░░', 0, sub(10, outputs('comFilled_final'))))
```

e. **Select `selStatusMD_final`** — From (fx) `body('Get_rows_final')?['value']`; Map (modo **T**, fx):
a mesma expressão de `selStatusMD` (passo 14.10 h).

f. **Join `joinStatusMD_final`** — From (fx) `body('selStatusMD_final')`; Join With (fx)
`decodeUriComponent('%0A')`.

g. **Update an adaptive card in a chat or channel `Update_StatusCard_final`** — mesmos campos do
`Update_StatusCard` (passo 14.10 j), com estes tokens:

| Token                  | Substituir por                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[[BID_NUMBER]]`       | `@{variables('varBidNumber')}`                                                                                                                             |
| `[[CLIENT]]`           | `@{variables('varClient')}`                                                                                                                                |
| `[[STATUS_BADGE]]`     | `@{if(equals(outputs('comFinalOutcome'), 'approved'), '✅ Concluído', if(equals(outputs('comFinalOutcome'), 'rejected'), '❌ Rejeitado', '⌛ Expirado'))}` |
| `[[PROGRESS_BAR]]`     | `@{outputs('comProgressBar_final')}`                                                                                                                       |
| `[[APPROVED_COUNT]]`   | `@{outputs('comApprovedPeople_final')}`                                                                                                                    |
| `[[TOTAL_COUNT]]`      | `@{length(outputs('comUniqueApproverEmails'))}`                                                                                                            |
| `[[APPROVER_LIST_MD]]` | `@{body('joinStatusMD_final')}`                                                                                                                            |
| `[[UPDATED_AT]]`       | `@{convertFromUtc(utcNow(), 'E. South America Standard Time', 'dd/MM HH:mm')}`                                                                             |

#### 18) Card final e e-mail (somente quando todos aprovam)

**Condition `Condition_final_approved`** — abaixo de `Update_StatusCard_final`.

| Esquerda (fx)                | Operador    | Direita          |
| ---------------------------- | ----------- | ---------------- |
| `outputs('comFinalOutcome')` | is equal to | texto `approved` |

- **True:** ações 18.1 a 18.5.
- **False:** deixe vazio. Na recusa e na expiração **não** use `04-final.json` nem
  `completion-email.html`: o texto deles diz que todos aprovaram.

**18.1) Post card in a chat or channel `Post_card_Final`** — Post as **Flow bot**, Post in
**Group chat**, Group chat (Enter custom value → fx) `variables('varChatId')`, Adaptive Card (Texto + fx)
= conteúdo de `cards/04-final.json` com:

| Token                  | Substituir por                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `[[BID_NUMBER]]`       | `@{variables('varBidNumber')}`                                                                                                   |
| `[[CLIENT]]`           | `@{variables('varClient')}`                                                                                                      |
| `[[PROJECT_NAME]]`     | `@{variables('varProjectName')}`                                                                                                 |
| `[[TOTAL_COUNT]]`      | `@{length(outputs('comUniqueApproverEmails'))}`                                                                                  |
| `[[COMPLETED_AT]]`     | `@{convertFromUtc(outputs('comCompletionDate'), 'E. South America Standard Time', 'dd/MM/yyyy HH:mm')}`                          |
| `[[DURATION]]`         | `@{concat(div(sub(ticks(outputs('comCompletionDate')), ticks(body('Parse_JSON')?['requestedDate'])), 864000000000), ' dia(s)')}` |
| `[[APPROVER_LIST_MD]]` | `@{body('joinStatusMD_final')}`                                                                                                  |
| `[[DEEP_LINK]]`        | `@{variables('varDeepLink')}`                                                                                                    |

**18.2) Select `selEmailRows`** — uma linha `<tr>` por responsabilidade para a tabela do e-mail.
From (fx) `body('Get_rows_final')?['value']`; Map (modo **T**, fx):

```text
concat('<tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600">', item()?['ApproverName'], '</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0">', item()?['SectorLabel'], '</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0">', convertFromUtc(item()?['RespondedDate'], 'E. South America Standard Time', 'dd/MM/yyyy HH:mm'), '</td></tr>')
```

**18.3) Join `joinEmailRows`** — From (fx) `body('selEmailRows')`; Join With (fx)
`decodeUriComponent('%0A')`.

**18.4) Filter array `filEmailCc`** — cópia para solicitante, engenheiros e analistas, sem quem já
está no To.

| Campo | Como preencher | Valor                                                                                                                                                 |
| ----- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| From  | fx             | `union(union(body('selEngineerEmails'), body('selAnalystEmails')), createArray(toLower(coalesce(body('Parse_JSON')?['requestedBy']?['email'], ''))))` |

| Esquerda (fx)                                                                        | Operador    | Direita   |
| ------------------------------------------------------------------------------------ | ----------- | --------- |
| `and(not(empty(item())), not(contains(outputs('comUniqueApproverEmails'), item())))` | is equal to | fx `true` |

**18.5) Send an email notification (V3) `Send_email_V3`**
**Ação:** Mail → **Send an email notification (V3)**. **Nome:** `Send_email_V3`.

| Campo                | Como preencher | Valor                                                                     |
| -------------------- | -------------- | ------------------------------------------------------------------------- |
| To                   | fx             | `join(outputs('comUniqueApproverEmails'), ';')`                           |
| Subject              | Texto + fx     | `✅ BID @{variables('varBidNumber')} aprovado por todos os setores`       |
| Body                 | Texto + fx     | HTML de `email/completion-email.html`, colado no modo código (`</>`) (§6) |
| CC (Advanced params) | fx             | `join(body('filEmailCc'), ';')`                                           |

Tokens do HTML:

| Token                    | Substituir por                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `[[BID_NUMBER]]`         | `@{variables('varBidNumber')}`                                                                                                   |
| `[[CLIENT]]`             | `@{variables('varClient')}`                                                                                                      |
| `[[DIVISION]]`           | `@{variables('varDivision')}`                                                                                                    |
| `[[SERVICE_LINE]]`       | `@{variables('varServiceLine')}`                                                                                                 |
| `[[REQUESTED_BY]]`       | `@{variables('varRequestedBy')}`                                                                                                 |
| `[[COMPLETED_AT]]`       | `@{convertFromUtc(outputs('comCompletionDate'), 'E. South America Standard Time', 'dd/MM/yyyy HH:mm')}`                          |
| `[[DURATION]]`           | `@{concat(div(sub(ticks(outputs('comCompletionDate')), ticks(body('Parse_JSON')?['requestedDate'])), 864000000000), ' dia(s)')}` |
| `[[APPROVER_ROWS_HTML]]` | `@{body('joinEmailRows')}`                                                                                                       |
| `[[DEEP_LINK]]`          | `@{variables('varDeepLink')}`                                                                                                    |

Se desejar o PDF da aprovação (§7), ele entra no ramo True, abaixo de `Send_email_V3`.

---

## 4. Fluxo de lembrete diário — `SmartBid – Approval Reminders`

Um lembrete **por dia e por rodada**, no **chat em grupo**, mencionando **somente** quem ainda não
respondeu. Crie um **Scheduled cloud flow** separado.

**1) Recurrence** — o gatilho.

| Campo                                  | Como preencher | Valor                                                     |
| -------------------------------------- | -------------- | --------------------------------------------------------- |
| Interval                               | Texto          | `1`                                                       |
| Frequency                              | Lista          | **Day**                                                   |
| Time zone (Advanced parameters)        | Lista          | **(UTC-03:00) Brasilia** (E. South America Standard Time) |
| At these hours (Advanced parameters)   | Lista          | `9`                                                       |
| At these minutes (Advanced parameters) | Texto          | `0`                                                       |

**2) Initialize variable** — Name `varMentions`, Type **Array**, Value (fx) `json('[]')`.

**3) Get items `Get_open_rounds`** — rodadas ainda abertas.

| Campo        | Como preencher | Valor                                                   |
| ------------ | -------------- | ------------------------------------------------------- |
| Site Address | Lista          | site do SmartBid                                        |
| List Name    | Lista          | `smartbid-approvals`                                    |
| Filter Query | Texto          | `RecordType eq 'Round' and ApprovalStatus eq 'Pending'` |

**4) Apply to each `Apply_to_each_round`**

| Campo                                | Como preencher | Valor                               |
| ------------------------------------ | -------------- | ----------------------------------- |
| Select an output from previous steps | fx             | `body('Get_open_rounds')?['value']` |
| Settings → Concurrency control       | Lista          | **Off**                             |

Dentro do loop, nesta ordem:

**4.1) Condition `Condition_should_remind`** — Seletor **AND**.

| #   | Esquerda (fx)                                                                                                                      | Operador    | Direita    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| 1   | `empty(items('Apply_to_each_round')?['ChatId'])`                                                                                   | is equal to | fx `false` |
| 2   | `less(ticks(items('Apply_to_each_round')?['Created']), ticks(addHours(utcNow(), -20)))`                                            | is equal to | fx `true`  |
| 3   | `less(ticks(coalesce(items('Apply_to_each_round')?['LastReminderDate'], '2000-01-01T00:00:00Z')), ticks(addHours(utcNow(), -20)))` | is equal to | fx `true`  |

Linha 1: o chat existe. Linha 2: a rodada foi criada há mais de 20 h. Linha 3: não houve lembrete nas
últimas 20 h (rodada sem lembrete conta como "nunca").

- **True:** ações 4.2 a 4.6.
- **False:** deixe vazio.

**4.2) Set variable** — Name `varMentions`, Value (fx) `json('[]')`. Limpa as menções da rodada anterior.

**4.3) Get items `Get_pending_rows`** — Approver rows pendentes da rodada.

| Campo        | Como preencher | Valor                |
| ------------ | -------------- | -------------------- |
| Site Address | Lista          | site do SmartBid     |
| List Name    | Lista          | `smartbid-approvals` |
| Filter Query | Texto + fx     | linha abaixo         |

```text
RecordType eq 'Approver' and BidNumber eq '@{replace(items('Apply_to_each_round')?['BidNumber'], '''', '''''')}' and RoundNumber eq @{items('Apply_to_each_round')?['RoundNumber']} and ApprovalStatus eq 'Pending'
```

**4.4) Select `selPendingEmails`** — From (fx) `body('Get_pending_rows')?['value']`; Map (modo **T**, fx)
`toLower(item()?['ApproverEmail'])`.

**4.5) Compose `comPendingPeople`** — uma entrada por pessoa. Inputs (fx):
`union(body('selPendingEmails'), body('selPendingEmails'))`

**4.6) Condition `Condition_has_pending`**

| Esquerda (fx)                         | Operador        | Direita |
| ------------------------------------- | --------------- | ------- |
| `length(outputs('comPendingPeople'))` | is greater than | fx `0`  |

- **True:** ações 4.7 a 4.9.
- **False:** deixe vazio.

**4.7) Apply to each `Apply_to_each_pending`** — From (fx) `outputs('comPendingPeople')`;
Concurrency control **Off**. Dentro:

a. **Get an @mention token for a user `Get_mention`** — Microsoft Teams. User (fx)
`items('Apply_to_each_pending')`.

b. **Append to array variable** — Name `varMentions`; Value (Dinâmico) **@mention token** de
`Get_mention` (**Verificar**; normalmente `body('Get_mention')?['atMention']`).

**4.8) Post message in a chat or channel `Post_msg_reminder`** — abaixo de `Apply_to_each_pending`.

| Campo      | Como preencher          | Valor                                     |
| ---------- | ----------------------- | ----------------------------------------- |
| Post as    | Lista                   | **Flow bot**                              |
| Post in    | Lista                   | **Group chat**                            |
| Group chat | Enter custom value → fx | `items('Apply_to_each_round')?['ChatId']` |
| Message    | Texto + fx              | bloco abaixo                              |

```text
⏰ **Lembrete diário — BID @{items('Apply_to_each_round')?['BidNumber']} (rodada @{items('Apply_to_each_round')?['RoundNumber']})**
@{join(variables('varMentions'), ', ')}: sua aprovação ainda está pendente.
Responda pela notificação do **Approvals** no Teams ou pelo e-mail de aprovação.
```

**4.9) Update item `Update_Round_reminder`** — registra o lembrete na Round row.

| Campo            | Como preencher | Valor                                        |
| ---------------- | -------------- | -------------------------------------------- |
| Site Address     | Lista          | site do SmartBid                             |
| List Name        | Lista          | `smartbid-approvals`                         |
| Id               | fx             | `items('Apply_to_each_round')?['ID']`        |
| Title            | fx             | `items('Apply_to_each_round')?['BidNumber']` |
| LastReminderDate | fx             | `utcNow()`                                   |

Quando a rodada fica `Approved`, `Rejected`, `Overridden` ou `Expired`, ela deixa de aparecer em
`Get_open_rounds` e os lembretes param automaticamente.

---

## 5. Escrita no BID com ETag — como funciona

O JSON do BID (`smartbid-tracker/jsondata`) é um bloco único. O app e vários ramos do fluxo podem
gravá-lo ao mesmo tempo, e a escrita com ETag garante que nenhuma alteração se perca. As ações estão
detalhadas nos passos 14.7 e 16.3; esta seção explica o mecanismo.

| Papel                        | Por resposta (passo 14.7) | Fechamento (passo 16.3)   |
| ---------------------------- | ------------------------- | ------------------------- |
| Repetição                    | `Do_until_write_inc`      | `Do_until_write_final`    |
| Ler o BID e a versão         | `Get_BID_inc`             | `Get_BID_final`           |
| Ler o JSON                   | `Parse_BID_inc`           | `Parse_BID_final`         |
| Guarda (pode gravar?)        | `comCanWrite_inc`         | `comCanWrite_final`       |
| Novo JSON                    | `comBidInc`               | `comBidFinal`             |
| Gravar com `If-Match`        | `Send_HTTP_inc`           | `Send_HTTP_final`         |
| Absorver o `412`             | `comContinue_inc`         | `comContinue_final`       |
| Conferir depois da repetição | `Condition_written_inc`   | `Condition_written_final` |

A cada volta do Do until:

1. **Get item** lê o BID e a versão atual dele (`@odata.etag`).
2. A **guarda** confirma que ainda pode gravar: rodada atual e sem override. Se não puder, o Do until
   termina sem gravar.
3. O fluxo monta o **JSON novo** a partir do que acabou de ler, sem apagar o resto do BID.
4. **Send HTTP** grava com `If-Match` = ETag lido. O SharePoint só aceita se ninguém alterou o item
   nesse meio-tempo:
   - `204` → gravado; o Do until termina.
   - `412` → alguém gravou antes. O Compose `comContinue_*` absorve a falha e o Do until relê o BID e
     tenta de novo.

Confira quando algo der errado:

- **Sempre `412`, com a guarda `True`** (o e-mail `Send_fail_write_inc` mostra isso): o `If-Match` não
  está levando a versão do item. No histórico da execução, abra `Get_BID_inc` → _Show raw outputs_ e
  anote `@odata.etag` (ex.: `"5"`); depois abra `Send_HTTP_inc` → _Show raw inputs_ e confira se o
  header `If-Match` tem exatamente esse valor. Causas comuns: `{ETag}` no lugar de `@odata.etag`, ou
  espaço/TAB antes do `@`.
- `If-Match` sem espaço nem TAB antes do `@` ([README §7.6](./README.md)).
- Body como expressão que devolve objeto; o aviso "Enter a valid JSON" é falso positivo
  ([README §7.7](./README.md)).
- Retry policy **None** na ação HTTP; um retry automático reenviaria um ETag velho.
- `comContinue_*` com Run after **is successful** e **has failed**; sem isso, o `412` interrompe o Do
  until em vez de repetir.
- Count e Timeout ajustados no Do until; os padrões não servem.

Uma recusa que chega depois de outra recusa, ou uma aprovação tardia numa rodada já rejeitada, é
gravada apenas como histórico da pessoa: a guarda não reabre a rodada nem troca `rejected` por `approved`.

---

## 6. Cards e e-mail — como colar

Cada passo que posta um card ou envia o e-mail traz a sua tabela de tokens. Para preparar o conteúdo:

1. Abra o arquivo no VS Code (tabela abaixo) e copie todo o conteúdo para um arquivo temporário.
2. Troque cada `[[TOKEN]]` pelo valor da tabela do passo (**Ctrl+H**). Mantenha as aspas que já
   existem em volta do token no JSON. **Não copie as crases** (`` ` ``) que aparecem nas tabelas deste
   guia: elas são só formatação do documento. Valor entre crases, ou começando com espaço/TAB, vira
   bloco de código no Teams (um quadro com o rótulo "Text" e botão de copiar). O certo é, por exemplo:
   `{ "title": "Service Line", "value": "@{variables('varServiceLine')}" }`.
3. No HTML do e-mail, apague antes o comentário `<!-- ... -->` do topo: ele também cita os tokens.
4. Cole o resultado no campo **Adaptive Card** do Teams ou no **Body** do e-mail, este em modo código
   (`</>`). O designer converte cada `@{...}` num bloco.
5. No primeiro teste, confira se o card aparece. JSON inválido faz a ação do Teams falhar.

| Arquivo                                                        | Usado em                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`cards/01-welcome.json`](./cards/01-welcome.json)             | 10.3 `Post_card_Welcome`                                                             |
| [`cards/02-status.json`](./cards/02-status.json)               | 11.1 `Post_card_Status`, 14.10 j `Update_StatusCard`, 17 g `Update_StatusCard_final` |
| [`cards/04-final.json`](./cards/04-final.json)                 | 18.1 `Post_card_Final` — **somente quando todos aprovam**                            |
| [`email/completion-email.html`](./email/completion-email.html) | 18.5 `Send_email_V3` — **somente quando todos aprovam**                              |

Na recusa ou na expiração, **não** use `04-final.json` nem `completion-email.html`: o texto deles diz
que todos aprovaram.

---

## 7. (Opcional) PDF da aprovação

O conector Approvals não devolve o PDF gerado pelo Teams. Para anexar um comprovante ao BID, o
próprio fluxo gera o PDF depois do fechamento aprovado, no ramo True de `Condition_final_approved`,
abaixo de `Send_email_V3`. Este item opcional ainda não está detalhado ação por ação:

1. Monte um HTML com BID, rodada, aprovadores, setores, decisão, data e comentário
   (Select sobre `Get_rows_final` + Join). Escape `& < > " '` nos comentários antes de concatenar.
2. OneDrive for Business **Create file** `smartbid-tmp/@{variables('varBidNumber')}-R@{variables('varRound')}.html`.
3. OneDrive for Business **Convert file** (Target type **PDF**) — **Verificar** a disponibilidade no tenant.
4. SharePoint **Create file** na biblioteca `SmartBidAttachments`, pasta do BID.
5. Excluir o HTML temporário.
6. Registrar o anexo no BID conforme o contrato de anexos do SPFx (`IBidAttachment`), com a mesma
   escrita com ETag.

---

## 8. Recusa, override e expiração

### 8.1 Recusa

- O ramo de quem recusou grava a decisão e o comentário no BID, marca a rodada e `approvalStatus`
  como `rejected`, marca a Round row `Rejected` e avisa o grupo **na hora**.
- Os outros ramos saem da espera na próxima revisão (até 24 h).
- Quem já aprovou continua `approved`; quem não respondeu continua `pending`.

### 8.2 Resposta depois da recusa

Se alguém responder antes de o seu ramo sair da espera, a resposta é gravada só como histórico da
pessoa. A rodada continua `rejected`.

### 8.3 Pedidos que ficaram abertos

O conector Standard não cancela pedidos. Após recusa, override ou expiração, os pedidos sem resposta
continuam visíveis no Approvals de quem não respondeu. Para limpá-los:

1. Liste as Approver rows da rodada com `ApprovalStatus = Pending`; cada uma tem `NativeApprovalId`.
2. O dono do fluxo (criador dos pedidos) abre **Approvals → Enviados** no Teams e cancela cada pedido.

### 8.4 Override (Engineering)

O app grava o override no BID e marca a Round row `Overridden`. Neste fluxo:

- Os ramos saem da espera na próxima revisão (até 24 h). Se alguém responder nesse intervalo, a
  guarda do ETag impede a escrita no BID e o passo 14.8 não altera Approver rows, Round row nem chat.
- O fechamento (passo 15.6) encerra com Terminate **Cancelled**, sem mensagens de sucesso.
- O aviso no chat é feito pelo fluxo `SmartBid – Approval Override` da [README §10.2](./README.md).
- Pedidos abertos: cancelamento manual (§8.3).

### 8.5 Expiração

Após 28 dias sem todas as respostas, a rodada fica `Expired`, o Status card mostra `⌛ Expirado` e o
grupo é avisado. Nenhuma decisão é inventada. Para continuar, inicie uma nova rodada pelo SmartBid.

Se todas as esperas terminam **antes** do prazo e ainda há linhas `Pending`, alguma resposta não foi
gravada (falha técnica, não expiração). O fluxo não avisa o grupo: envia `Send_fail_incomplete` ao
administrador e termina como **Failed** (passo 15.7).

---

## 9. SPFx — como o app acompanha a rodada

| O quê                  | Onde no código                                         | Comportamento                                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decisões e comentários | `IBid.approvals`, `approvalRounds`, `approvalStatus`   | O app só lê o que o fluxo grava no JSON do BID. O comentário fica em `IBidApproval.comments`.                                                                                                                                                                                |
| Atualização sem F5     | `hooks/useApprovalSync.ts`, chamado na `BidDetailPage` | Enquanto `approvalStatus = pending`, relê o BID aberto a cada 15 s e pausa com a aba do navegador oculta. Aplica só `approvals`, `approvalRounds`, `approvalStatus`, `currentStatus`, `currentPhase` e `completedDate`. Descarta a leitura se um save local começou no meio. |
| Saves do app           | `BidService.patchByBidNumber()`                        | Grava com `If-Match` (ETag) e tenta de novo em `412`, como o fluxo. Um save do app não apaga uma decisão gravada pelo fluxo no mesmo instante (teste 14).                                                                                                                    |
| Comentários            | aba Approval e card _Approval Status_ do Overview      | Texto puro (nunca HTML), com quebras de linha preservadas.                                                                                                                                                                                                                   |
| Colunas                | `ApprovalService.ensureApprovalColumns()`              | Cria `NativeApprovalId`, `ApproverComments` (texto simples), `LastReminderDate` e as opções `Rejected` / `Expired`, se faltarem.                                                                                                                                             |

Ainda não tratado no app:

- **Rodada expirada:** o fluxo só marca a Round row `Expired`. O JSON do BID continua `pending`, e o
  app segue mostrando a rodada em andamento.
- **BID concluído pelo fluxo:** a publicação automática em Past Bids e da Technical Proposal só roda
  quando o próprio app conclui o BID. Quando o fluxo conclui, publique pela página Past Bids.

---

## 10. Testes de aceitação

1. Rodada com 3 aprovadores → 1 chat em grupo, Welcome e Status card com os 3 `Pending`, 3 pedidos
   individuais (um por pessoa), nenhum pedido postado no grupo.
2. Cada aprovador recebe a notificação do Approvals no Teams (e o e-mail).
3. Um participante tenta responder o pedido de outro → o serviço não aceita.
4. O terceiro aprovador responde primeiro → é gravado sem depender da ordem.
5. Laura aprova com comentário → Status card `1/3`, mensagem `✅ Laura aprovou`, BID com
   `approved` + comentário + data; os outros continuam `pending`; o BID não é concluído.
6. Aprovação sem comentário → `comments` vazio/nulo; nada copiado de outra pessoa.
7. Duas aprovações no mesmo minuto → as duas gravadas no BID (ETag), contagem correta no fechamento.
8. Mesma pessoa em dois setores → **um** pedido; as duas responsabilidades atualizadas; contada uma vez.
9. Uma recusa com comentário → aviso imediato no grupo, rodada e BID `rejected`, lembretes param,
   outros ramos encerram em até 24 h, sem card/e-mail de sucesso.
10. Todos aprovam → BID `Completed` / `Close Out`, Status card `✅ Concluído`, card final e e-mail.
11. Pendentes há mais de 20 h → **um** lembrete por dia no grupo, mencionando só quem falta.
12. Override durante a espera → nenhuma escrita depois do override, nenhuma mensagem de sucesso.
13. Comentário com aspas, acentos, quebras de linha e `<script>` → gravado como texto, sem executar.
14. Usuário editando o BID no SmartBid enquanto alguém aprova → nenhuma das duas alterações se perde.

---

## 11. Implantação

1. Criar a Choice `Rejected`/`Expired` e as colunas da §2.2 (ou incluí-las em `ensureApprovalColumns()`).
2. Criar o fluxo principal e o de lembrete; manter o fluxo de override da [README §10.2](./README.md).
3. Testar com um BID de teste e aprovadores de teste (§10), confirmando os itens **Verificar**.
4. **Desligar** o fluxo antigo para novas rodadas e só então ligar este. Os dois disparam pela mesma
   Round row — nunca deixe os dois ligados. Desligar não cancela execuções antigas em andamento.
5. Acompanhar as primeiras rodadas reais pelo histórico de execuções.

---

## 12. Comparação com os outros desenhos

| Aspecto                     | [README.md](./README.md) (cards personalizados) | [APPROVALS-NATIVE.md](./APPROVALS-NATIVE.md) (coletivo) | **Este guia**                           |
| --------------------------- | ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| Pedido                      | Card no grupo, um por pessoa                    | Um pedido nativo para todos                             | Um pedido nativo **por pessoa**         |
| Onde a pessoa responde      | Card no chat em grupo                           | Card coletivo / Approvals                               | **Em particular** (Approvals / e-mail)  |
| Alguém clicar pelo outro    | Possível; o fluxo precisa barrar                | Bloqueado pelo serviço                                  | Bloqueado pelo serviço                  |
| Progresso a cada resposta   | Sim                                             | Só com Dataverse                                        | **Sim**                                 |
| Comentários                 | Não                                             | Só com Dataverse (parciais)                             | **Sim**, a cada resposta                |
| Recusa                      | Não suportada                                   | Encerra o pedido coletivo                               | Encerra a rodada; pedidos abertos ficam |
| Licença Premium / Dataverse | Não                                             | Sim                                                     | **Não**                                 |
| Lembretes                   | Por card, dentro do loop                        | Fluxo agendado                                          | **1x por dia no grupo**, fluxo agendado |
