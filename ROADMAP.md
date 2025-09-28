# ✅ Roadmap / Tasks – Projeto Next.js + Google Cloud Translate + Shadcn

## 🗂️ Setup do Projeto
- [x] Criar projeto Next.js 14 com TypeScript (`npx create-next-app@latest`).
- [x] Configurar App Router.
- [x] Instalar Tailwind CSS e configurar.
- [x] Instalar Shadcn/UI e gerar componentes base (Button, Input, Select etc.).
- [x] Criar arquivo `.env.local` para variáveis de ambiente.

## 🔑 Integração Google Cloud Translate
- [x] Criar projeto no Google Cloud Console.
- [x] Ativar a API Cloud Translate.
- [x] Criar chave de API e copiar para `.env.local` (`GOOGLE_API_KEY`).
- [x] Criar utilitário `lib/google.ts` para chamar a API Cloud Translate.

## 🖥️ Backend / Server Actions ou API Routes
- [x] Escolher abordagem: Server Actions **ou** API Routes.
- [ ] Implementar função/endpoint `translate` que recebe texto + idioma destino e retorna tradução.
- [x] Garantir que a chave da API fique segura no servidor.

## 🎨 Frontend
- [ ] Criar tela com:
  - Botões de idioma
  - Textarea
- [ ] Conectar formulário à API Route.
- [ ] Implementar feedback de loading/erro no envio.
- [ ] Ajustar responsividade com Tailwind/Shadcn.

## 📚 Funcionalidades Extras (Opcional)
- [ ] Criar página ou componente para histórico de traduções (localStorage ou banco de dados).
- [ ] Adicionar botão “Copiar tradução” na página.
- [ ] Suporte a internacionalização da interface (i18n).

## 🚀 Deploy
- [ ] Fazer deploy no Vercel.
- [ ] Configurar variáveis de ambiente no painel da Vercel.
- [ ] Testar fluxo completo (input → tradução → exibição).

## 🧪 Testes / Qualidade
- [ ] Testar traduções com diferentes idiomas.
- [ ] Testar responsividade em dispositivos móveis.
- [ ] Testar mensagens de erro (sem chave API, limites da API etc.).
