# Mapeamento de Requisitos — Sobaka

Documento de rastreabilidade entre o PDF do sistema e a implementação.

## Requisitos Funcionais

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RF01 | Registro e Perfis de Usuário | `RegisterPage`, `ProfilePage`, `authService`, roles: tutor/protector/temporary_home/admin |
| RF02 | Notificações e Alertas | `NotificationsPage`, `notificationService`, alertas Firestore em tempo real |
| RF03 | Pet Shops e Veterinários | `PlacesPage`, `placeService`, mapa + lista de locais |
| RF04 | Conexão entre Usuários | `ChatPanel`, `chatService`, mensagens por ocorrência |
| RF05 | Localização de Pets | Geolocalização em ocorrências, `getCurrentPosition`, Mapbox |
| RF06 | Registrar Ocorrências | `CreateOccurrencePage`, upload de fotos, Firestore |
| RF07 | Atualizar Ocorrências | `OccurrenceDetailPage`, status resolved/archived |
| RF08 | Buscar e Filtrar | `OccurrenceFiltersBar`, `listOccurrences` com filtros client/server |
| RF09 | Push regional | `requestPushPermission`, `createRegionalNotifications` por raio km |
| RF10 | Mapa de ocorrências | `OccurrenceMap`, `MapPage`, markers coloridos por tipo |

## Requisitos Não Funcionais

| ID | Requisito | Implementação |
|----|-----------|---------------|
| RNF01 | Compatibilidade multiplataforma | PWA (Vite PWA), layout responsivo, React web |
| RNF02 | Integridade dos dados | Firestore rules, validação Zod, timestamps |
| RNF03 | Escalabilidade | Firebase serverless, listeners em tempo real |
| RNF04 | Segurança | Auth Firebase, RBAC, storage rules, moderação admin |
| RNF05 | Usabilidade | UI intuitiva, fluxo de reporte rápido, dashboard |
| RNF06 | Acessibilidade | ARIA, foco visível, HTML semântico, reduced-motion |

## Atores

| Ator | Funcionalidades |
|------|-----------------|
| Tutor | Cadastro pet perdido, alertas, chat, mapa |
| Protetor/Solidário | Reportar avistamento, notificações regionais |
| Lar temporário | Tipo `temporary_care`, coordenação via chat |
| Administrador | Painel métricas, moderação denúncias |

## Evidências de Testes

Execute:

```bash
npm run test
npm run test:coverage
```

Cobertura atual: utilitários, validadores, formatadores e componentes UI.
