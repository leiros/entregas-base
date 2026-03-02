
# Guia de Replicação do Sistema

Este sistema foi preparado para ser facilmente replicado para novos condomínios. Siga os passos abaixo para cada nova implementação:

## 1. Configuração do Firebase
Crie um novo projeto no Firebase Console e obtenha as chaves do SDK Web.
- Copie as chaves para o arquivo `.env` (baseado no `.env.example`) ou altere diretamente em `firebaseConfig.ts`.

## 2. Identidade Visual
Abra o arquivo `src/condoConfig.ts` e altere:
- `name`: Nome completo do condomínio.
- `shortName`: Nome curto para o menu.
- `logoText`: Texto que aparece no topo do menu.

## 3. Dados Iniciais (O NOVO BANCO)
Para popular o novo banco de dados Firestore:
1. Abra `src/initialDataTemplate.ts`.
2. Defina as Torres em `NEW_CONDO_TOWERS`.
3. Defina os usuários iniciais em `NEW_CONDO_USERS`.
4. No arquivo `App.tsx`, altere a chamada do `initializeFirestore` para usar estes novos arrays.

## 4. Deploy
1. Execute `npm run build`.
2. Faça o deploy para o Firebase Hosting do novo projeto.

---
*Dica: Ao abrir o site pela primeira vez no novo domínio, o sistema detectará o banco vazio e criará toda a estrutura automaticamente baseada nos templates fornecidos.*
