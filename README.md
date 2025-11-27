# Landing Page Vero

Landing page estática otimizada para conversão da Vero Internet, utilizando HTML5 semântico, CSS3 moderno e JavaScript vanilla com foco em performance e SEO.

## Estrutura
```
index.html
css/styles.css
js/
  animations.js
  form-validation.js
  main.js
images/
  logo-vero.svg
  hero-bg.webp (com fallback .jpg)
  icons/ e placeholders/
assets/fonts/ (reservado para fontes locais)
```

## Como usar
1. Faça o download/clonagem deste diretório.
2. Abra `index.html` em qualquer navegador moderno ou sirva os arquivos com um servidor estático (`npx serve`, `python3 -m http.server`, etc.).
3. Ajuste os textos específicos de cidade/telefone no HTML, se necessário.

## Tecnologias e libs
- HTML5 semântico com meta tags completas, Schema.org e OG tags.
- CSS3 com Grid/Flexbox, variáveis, gradientes e estados responsivos mobile-first.
- JavaScript modular para navegação, formulários, lazy loading e animações.
- AOS (Animate On Scroll) via CDN para animações suaves.

## Funcionalidades chave
- Consulta de disponibilidade por CEP com máscara, validação e mock de integração.
- Formulário de leads com honeypot, feedback em tempo real e estado de envio.
- Lazy loading com IntersectionObserver, scroll suave, botão flutuante do WhatsApp e CTA de topo.
- Cards responsivos de benefícios, planos, diferenciais, depoimentos e FAQ com accordion.

## Personalização
- Atualize cores/tipografia via variáveis em `css/styles.css`.
- Substitua as imagens da pasta `images/` pelos assets definitivos (preferencialmente WebP + fallback).
- Integre o formulário com seu backend substituindo o mock de `setTimeout` em `js/form-validation.js`.
- Configure o número do WhatsApp e URLs de redes sociais diretamente no HTML.

## Boas práticas atendidas
- SEO on-page e acessibilidade (labels, aria, contraste, navegação por teclado).
- Scripts carregados com `defer`, CSS crítico inline e assets leves.
- Responsividade para mobile, tablet, desktop e telas largas.
- Código pronto para deploy em qualquer serviço de hosting estático.
