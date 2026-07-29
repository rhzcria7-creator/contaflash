# ⚡ ContaFlash - Serviços Digitais Premium

Site profissional multipage para a ContaFlash, empresa especializada em contas premium de streaming, inteligência artificial, música e jogos.

## 🚀 Tecnologias

- **HTML5** semântico
- **CSS3** com Glass Morphism e animações
- **JavaScript puro** (sem frameworks)
- **Font Awesome 6** para ícones
- **Google Fonts (Inter)** para tipografia
- **Tailwind CSS** (CDN)

## 📁 Estrutura do Projeto

```
├── index.html                 # Página principal
├── pages/
│   ├── produtos.html          # Catálogo de produtos
│   ├── sobre.html             # Sobre a empresa
│   ├── faq.html               # Perguntas frequentes
│   └── contato.html           # Página de contato
├── css/
│   └── style.css              # Estilos principais
├── js/
│   └── main.js                # JavaScript principal
├── manifest.json              # PWA Manifest
├── vercel.json                # Configuração Vercel
└── README.md                  # Este arquivo
```

## ✨ Funcionalidades

### Design
- Glass Morphism (efeito vidro)
- Tema escuro com gradientes roxo/azul
- Partículas flutuantes animadas
- Loading screen animada
- Cards com hover effects
- Design 100% responsivo (mobile, tablet, desktop)

### JavaScript
- Partículas flutuantes no fundo
- Header com efeito de scroll (blur ao rolar)
- Menu mobile hamburger animado
- Contadores numéricos animados
- Slider de depoimentos com auto-play
- Validação de formulário com proteção XSS
- Máscara de telefone brasileiro (XX) XXXXX-XXXX
- Newsletter com validação de email
- FAQ com accordion e busca funcional
- Filtros de produtos por categoria
- Modal de cookies (GDPR)
- Toast notifications
- Smooth scroll
- Fade-in animations ao scroll

### SEO & Performance
- Meta tags otimizadas
- Open Graph para compartilhamento
- Semantic HTML5
- Acessibilidade (ARIA labels)
- PWA ready

## 🛠️ Como Executar

1. Clone o repositório ou faça download dos arquivos
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Pronto! Não requer servidor ou dependências externas

### Deploy

O site pode ser hospedado em qualquer serviço de hosting estático:

- **Vercel**: `vercel.json` já configurado
- **Netlify**: Basta fazer upload da pasta
- **GitHub Pages**: Ative nas configurações do repositório
- **Qualquer hospedagem**: Upload dos arquivos via FTP

## 🎨 Customização

### Design System (estilo editorial / ChatGPT)
O site usa uma paleta limpa e profissional — fundo quente neutro, tipografia
editorial (Inter + Instrument Serif itálico para destaques) e o verde ChatGPT
como acento. Edite as variáveis em `css/style.css`:

```css
:root {
  --bg: #FAF9F5;          /* Fundo principal (papel quente) */
  --bg-card: #FFFFFF;     /* Cards */
  --bg-subtle: #F4F2EC;   /* Seções alternadas */
  --ink: #171717;         /* Texto / botões escuros */
  --accent: #10A37F;      /* Verde ChatGPT (acento) */
  --accent-2: #0E8A6B;    /* Verde escuro */
}
```

**Animações incluídas:** mesh gradient animado no hero, marquee de marcas,
partículas sutis, scroll-reveal com stagger, contadores, slider de depoimentos,
hover transforms, ripple do WhatsApp e loading screen minimalista.

### WhatsApp
Altere o número de WhatsApp em todos os arquivos HTML:
```
https://wa.me/5511999999999 → Seu número com código do país
```

### Produtos
Adicione, remova ou edite produtos em `pages/produtos.html`.

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Wide (1280px+)

## 🔒 Segurança

- Headers de segurança configurados (vercel.json)
- Proteção XSS nos formulários
- Content Security Policy
- HTTPS obrigatório (configurar no hosting)

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

Feito com ❤️ pela **ContaFlash**
