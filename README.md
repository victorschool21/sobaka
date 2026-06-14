# Sobaka

Plataforma comunitária para localizar pets perdidos e conectar tutores, protetores e lares temporários — desenvolvida para o **Projeto Aplicado IV (Equipe 16)** do curso de Análise e Desenvolvimento de Sistemas do **SENAI SC**.

## Equipe

- Kalani Klug Potolowsky
- Luis Felipe Cordeiro Grimm
- Marcelo Antonio Cabral Martins
- Victor Hugo de Souza

## Sobre o projeto

A Sobaka transforma compaixão em ação imediata, permitindo:

- **RF01** — Registro e perfis de usuário (tutor, protetor, lar temporário, admin)
- **RF02/RF09** — Notificações e alertas push regionais
- **RF03** — Exibição de pet shops e veterinários
- **RF04** — Chat em tempo real entre usuários
- **RF05/RF06/RF07** — Localização, registro e atualização de ocorrências
- **RF08** — Busca e filtros
- **RF10** — Mapa interativo com Mapbox

## Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, TypeScript, Vite, PWA |
| Backend | Firebase (Auth, Firestore, Storage, FCM) |
| Mapas | Mapbox GL JS |
| Validação | Zod |
| Testes | Vitest + Testing Library |
| CI | GitHub Actions |

## Arquitetura

```
src/
├── components/     # UI reutilizável (layout, mapa, chat, ocorrências)
├── config/         # Firebase e variáveis de ambiente
├── contexts/       # AuthContext (estado global de sessão)
├── pages/          # Rotas da aplicação
├── services/       # Camada de acesso a dados (Firestore)
├── types/          # Contratos TypeScript
└── utils/          # Geolocalização, validadores, formatadores
firebase/
├── firestore.rules # Regras de segurança
├── firestore.indexes.json
└── storage.rules
```

Separação em **camadas** (UI → services → Firebase) facilita manutenção, testes unitários e evolução do sistema.

## Pré-requisitos

- Node.js 20+
- Conta [Firebase](https://console.firebase.google.com)
- Token [Mapbox](https://account.mapbox.com/access-tokens/)

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/sobaka.git
cd sobaka
```

2. Instale dependências:

```bash
npm install
```

3. Configure variáveis de ambiente:

```bash
cp .env.example .env
```

Preencha as credenciais do Firebase e o token Mapbox.

4. No Firebase Console, ative:
   - **Authentication** → E-mail/senha
   - **Firestore Database**
   - **Storage**
   - **Cloud Messaging** (para push)

5. Deploy das regras de segurança:

```bash
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

6. (Opcional) Popule locais iniciais na coleção `places` usando os dados em `src/services/placeService.ts`.

## Executar localmente

```bash
npm run dev
```

Acesse `http://localhost:5173`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run test` | Testes unitários (Vitest) |
| `npm run test:coverage` | Cobertura de testes |
| `npm run lint` | ESLint |

## Testes

O projeto inclui testes automatizados para:

- Utilitários de geolocalização (Haversine)
- Validadores Zod (login, registro, ocorrências)
- Formatadores e componentes UI
- Acessibilidade básica da landing page

```bash
npm run test
npm run test:coverage
```

Evidências de execução são geradas em `coverage/` após `test:coverage`.

## Segurança

- Autenticação via Firebase Auth
- Regras Firestore com controle por papel (RBAC)
- Storage limitado a imagens (< 5 MB)
- Validação client-side com Zod
- Denúncias e moderação administrativa
- Dados de localização associados apenas a ocorrências autorizadas

## Acessibilidade (RNF06)

- HTML semântico (`main`, `nav`, `article`, `role`)
- Labels em formulários e `aria-*` em componentes interativos
- Foco visível (`:focus-visible`)
- Suporte a `prefers-reduced-motion`
- Contraste adequado e textos alternativos em imagens

## Deploy

Build estático compatível com Firebase Hosting, Vercel ou Netlify:

```bash
npm run build
```

## Licença

Projeto acadêmico — SENAI Santa Catarina, 2026.
