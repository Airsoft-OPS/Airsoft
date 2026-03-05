# 🎯 Airsoft OPS

Plataforma completa de eventos de airsoft em Portugal, construída com **Next.js 15**, **PostgreSQL** e **Prisma**.

---

## Stack

| Tecnologia | Uso |
|---|---|
| **Next.js 15** (App Router) | Frontend + API Routes |
| **PostgreSQL** | Base de dados |
| **Prisma** | ORM + migrations |
| **NextAuth v5** | Autenticação (JWT) |
| **MB Way / SIBS** | Pagamentos |
| **UploadThing** | Upload de imagens |
| **Zod** | Validação de esquemas |
| **React Hook Form** | Formulários |
| **Tailwind CSS** | Estilos |
| **Sonner** | Notificações toast |

---

## Estrutura do Projeto

```
airsoft-events/
├── prisma/
│   ├── schema.prisma          # Todos os modelos de dados
│   └── seed.ts                # Dados iniciais (admin, eventos demo)
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Rotas de autenticação (login, register)
│   │   ├── (public)/          # Páginas públicas (eventos, homepage)
│   │   ├── (dashboard)/       # Dashboard autenticado
│   │   │   ├── admin/         # Painel de administração
│   │   │   ├── organizer/     # Painel do organizador
│   │   │   └── user/          # Painel do utilizador
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth + register
│   │       ├── events/        # CRUD eventos + inscrições
│   │       ├── admin/         # Endpoints admin
│   │       └── webhooks/mbway # Webhook de pagamentos MB Way
│   │
│   ├── lib/
│   │   ├── auth/config.ts     # NextAuth configuração
│   │   ├── db/client.ts       # Prisma client singleton
│   │   ├── mbway/client.ts    # Integração MB Way / SIBS
│   │   └── validations/       # Schemas Zod
│   │
│   ├── types/index.ts         # Types TypeScript + tier hierarchy
│   └── middleware.ts          # Proteção de rotas por role
```

---

## Modelos de Dados

### User
- `role`: FREE | BASIC | PREMIUM | ORGANIZER | ADMIN
- `airsoftPermitId`: obrigatório no registo (único)
- `permitVerified`: validado pelo admin
- `status`: ACTIVE | SUSPENDED | PENDING_VERIFICATION

### Event
- Campos: título, descrição, local, datas, capacidade, taxa
- `requiredTier`: tier mínimo para inscrição
- `status`: DRAFT | PUBLISHED | FULL | CANCELLED | COMPLETED
- `customFields`: campos dinâmicos configurados pelo organizador

### EventCustomField
Campos personalizados por evento: TEXT, TEXTAREA, NUMBER, DATE, SELECT, MULTISELECT, BOOLEAN

### Registration
- `status`: PENDING_PAYMENT | CONFIRMED | CANCELLED | WAITLISTED | REFUNDED
- Guarda respostas dos campos personalizados

### Payment
- `method`: MBWAY | BANK_TRANSFER | CASH
- `status`: PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED | CANCELLED
- Campos MB Way: `mbwayPhone`, `mbwayRequestId`, `mbwayAlias`

---

## Tiers de Utilizadores

| Tier | Nível | Descrição |
|---|---|---|
| FREE | 0 | Pode ver e inscrever-se em eventos gratuitos/públicos |
| BASIC | 1 | Acesso a eventos Basic+ (pago) |
| PREMIUM | 2 | Acesso a todos os eventos de jogadores |
| ORGANIZER | 3 | Pode criar e gerir eventos |
| ADMIN | 4 | Acesso total ao sistema |

---

## Setup e Instalação

### 1. Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Conta SIBS (para MB Way em produção)
- Conta UploadThing (para uploads)

### 2. Clonar e instalar dependências

```bash
git clone <repo>
cd airsoft-events
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edita o `.env` com as tuas credenciais:
- `DATABASE_URL` — URL da tua base de dados PostgreSQL
- `NEXTAUTH_SECRET` — gera com `openssl rand -base64 32`
- `MBWAY_*` — credenciais SIBS (ver abaixo)
- `SMTP_*` — credenciais de email
- `UPLOADTHING_*` — credenciais UploadThing

### 4. Criar a base de dados

```bash
# Criar as tabelas
npm run db:migrate

# Ou em desenvolvimento sem criar migration files:
npm run db:push

# Inserir dados iniciais
npm run db:seed
```

### 5. Arrancar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Contas de Teste (após seed)

| Email | Password | Role |
|---|---|---|
| admin@airsoftevents.pt | Admin@123! | ADMIN |
| organizer@airsoftevents.pt | Organizer@123! | ORGANIZER |
| player@airsoftevents.pt | User@123! | FREE |

---

## Integração MB Way (SIBS Gateway)

### Credenciais necessárias
1. Cria conta em [developer.sibsgateway.com](https://developer.sibsgateway.com)
2. Obtém: `MBWAY_MERCHANT_ID`, `MBWAY_TERMINAL_ID`, `MBWAY_BEARER_TOKEN`
3. Configura webhook URL: `https://teu-dominio.pt/api/webhooks/mbway`

### Fluxo de pagamento
```
Utilizador submete inscrição
    ↓
POST /api/events/[id]/register
    ↓
Cria Registration (PENDING_PAYMENT) + Payment (PENDING)
    ↓
Chama SIBS API → envia pedido MB Way para o telemóvel
    ↓
Utilizador confirma na app MB Way
    ↓
SIBS envia webhook para /api/webhooks/mbway
    ↓
Atualiza Registration (CONFIRMED) + Event.currentParticipants++
```

### Sandbox / Testes
Em desenvolvimento, define `MBWAY_API_URL=https://sandbox.sibsgateway.com`

---

## Campos Personalizados por Evento

Os organizadores podem adicionar campos dinâmicos:

```typescript
// Exemplos de tipos disponíveis:
{ type: "TEXT",        label: "Nome da equipa" }
{ type: "SELECT",      label: "Fação", options: ["Alpha", "Bravo"] }
{ type: "MULTISELECT", label: "Equipamento extra" }
{ type: "BOOLEAN",     label: "Tens rádio?" }
{ type: "TEXTAREA",    label: "Experiência prévia" }
{ type: "NUMBER",      label: "Número de FPS da réplica" }
```

---

## Deployment

### Vercel (recomendado)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
# Dockerfile incluído na raiz
docker build -t airsoft-events .
docker run -p 3000:3000 airsoft-events
```

### Base de dados em produção
Recomendado: [Supabase](https://supabase.com), [Neon](https://neon.tech), ou [Railway](https://railway.app)

```bash
# Em produção, usa migrate deploy (não dev)
npm run db:migrate:prod
```

---

## Próximos Passos / TODOs

- [ ] Email de verificação de conta (nodemailer)
- [ ] Email de confirmação de inscrição
- [ ] Upload de imagem de capa do evento (UploadThing)
- [ ] Upload de foto da licença de airsoft
- [ ] Página pública de detalhes do evento (`/events/[slug]`)
- [ ] Formulário de inscrição com campos dinâmicos
- [ ] Painel do organizador — lista de inscritos + exportar CSV
- [ ] Sistema de waitlist
- [ ] Reembolsos via SIBS
- [ ] Notificações push / SMS
- [ ] Mapa de localização dos eventos
- [ ] API de verificação de licenças (integração federação)
- [ ] Stripe como alternativa de pagamento (cartão)
- [ ] Subscrições recorrentes (tiers pagos)

---

## Licença

MIT
