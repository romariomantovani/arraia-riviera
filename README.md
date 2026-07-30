# Arraiá Riviera

Landing page do Arraiá Riviera — sábado, 8 de agosto de 2026, a partir das 18h, na Praça do Bosque,
em Colatina/ES. Entrada gratuita.

Realização dos **Amigos do Riviera**. Todo valor arrecadado é doado integralmente à construção da
**Igreja Nossa Senhora das Graças**, no Riviera.

HTML, CSS e JavaScript puros. Sem build, sem dependências, sem `node_modules`.

```
index.html    conteúdo e ícones (SVG desenhados no próprio arquivo)
styles.css    cores, tipografia e layout
script.js     CONFIG + contagem + varal + vídeo + mapa
assets/       fotos, vídeo e logos de patrocinador (ver assets/README.md)
favicon.svg   ícone da aba
```

## As seções, na ordem

| Seção | Fundo | O que tem |
|---|---|---|
| Hero | papel | Placa, selo da música ao vivo, selo da doação, ficha do evento e a **contagem regressiva em destaque** |
| O convite | papel-2 | Texto de chamada |
| Como foi em 2025 | noite | Vídeo (só toca no clique) e as duas fotos do arraiá passado |
| O que vai ter | papel | Grade de atrações |
| Música ao vivo | noite | Um bloco largo por atração: Cristian & Anderson e Lucas Comério |
| Área Kids | verde | Tio Wilsinho |
| A causa | azul | Amigos do Riviera e a doação integral para a igreja |
| Patrocinadores | papel-2 | Os 12 logos |
| Onde e quando | noite | Dados, avisos e o **mapa** |
| Rodapé | vermelho | Realização e a doação |

## O CONFIG

O bloco no topo do `script.js` é o único lugar que precisa de edição para mudar dados do evento:

```js
const CONFIG = {
  dataHora: '2026-08-08T18:00:00-03:00',
  duracaoHoras: 7,
  local: 'Praça do Bosque',
  endereco: 'Riviera',                    // EDITAR: acrescente a rua se quiser
  cidade: 'Colatina/ES',
  coordenadas: '-19.504598,-40.617779',   // o ponto exato da praça
  organizador: 'Amigos do Riviera'
};
```

`coordenadas` é quem aponta o mapa e o botão "Como chegar" — é o dado preciso. `endereco` e `cidade`
só alimentam o texto que aparece na tela. Para trocar o ponto: abra a praça no Google Maps, copie os
números depois do `@` na URL e cole como `'latitude,longitude'`. Se `coordenadas` ficar vazio, o mapa
volta a buscar por texto (funciona, mas pode cair na praça errada).

## O que ainda falta preencher

Marcado no código com `EDITAR`. Para achar tudo de uma vez:

```bash
grep -rn "EDITAR" index.html script.js
```

| O quê | Onde | Efeito |
|---|---|---|
| Rua da praça | `CONFIG.endereco` em `script.js` | Só o texto na tela; o mapa já aponta certo |
| `og:image` absoluta | `<head>` do `index.html` | Miniatura no WhatsApp (depende do domínio da Vercel) |

## Trocar ou incluir conteúdo

**Patrocinador novo:** coloque o logo em `assets/patrocinadores/` e copie um `<li class="patros__item">`
na seção "PATROCINADORES" do `index.html`, trocando `src`, `alt`, `width` e `height`. Fundo do logo pode
ser qualquer um — o cartão é uma placa branca e o logo entra inteiro, sem recorte nem distorção.

**Logo que chegou em PDF** não funciona em `<img>`. Converta antes:

```bash
pdftoppm -png -r 200 -singlefile assets/patrocinadores/nome.pdf assets/patrocinadores/nome
```

**Poster do vídeo** (o quadro que aparece antes do play) — para escolher outro segundo:

```bash
ffmpeg -y -ss 8 -i assets/imagens/video1.mp4 -frames:v 1 -q:v 3 assets/imagens/video1-poster.jpg
```

## Rodar localmente

```bash
python3 -m http.server 4321
```

Depois abra <http://localhost:4321>. Abrir o `index.html` direto pelo Finder também funciona.

## Publicar na Vercel

1. Crie o repositório e suba:

```bash
git init && git add -A && git commit -m "Landing page do Arraiá Riviera" && git branch -M main
```

2. Crie o repo no GitHub e faça o push:

```bash
gh repo create arraia-riviera --public --source=. --push
```

3. Na Vercel: **Add New → Project → Import** o repositório, com estas opções:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio

Site estático — a Vercel serve os arquivos direto, sem etapa de build. Cada push na `main` republica.

4. Depois que a Vercel gerar o domínio, volte no `index.html` e troque a `og:image` pela URL
   completa, senão o WhatsApp não mostra a miniatura ao compartilhar o link:

```html
<meta property="og:image" content="https://arraia-riviera.vercel.app/assets/imagens/foto2.jpeg">
```

## Detalhes que valem saber antes de mexer

- **A contagem regressiva se resolve sozinha.** Antes do evento mostra dias/horas/min/seg; durante,
  "É hoje! A fogueira já está acesa"; depois, uma despedida. Nada de números negativos.
- **O varal de bandeirinhas é gerado pelo `script.js`**, redesenhado no `resize` e balança conforme
  a velocidade do scroll. A quantidade e o tamanho das bandeirinhas se ajustam à largura da tela.
- **O vídeo nunca começa sozinho.** Sem autoplay e sem áudio silenciado: o visitante clica no play e
  ouve o som. O atributo `controls` está no HTML (quem estiver sem JS consegue dar play mesmo assim);
  com o JS de pé, a barra do navegador sai de baixo do poster e volta no primeiro play.
- **O mapa é carregado só depois do clique.** Até alguém pedir, o `iframe` do Google Maps não existe —
  página mais leve e nenhum cookie do Maps em quem não quis ver o mapa.
- **O mural de 2025 alinha pela matemática das colunas**, não por altura fixa: o vídeo 9:16 fica em
  `3fr` e a foto retrato 3:4 em `4fr`, o que dá `5.333u` de altura para os dois em qualquer largura de
  tela. Se mexer nessas frações, o alinhamento quebra.
- **Fotos tortas usam `--tilt`**, não `transform` direto — a revelação no scroll também escreve no
  `transform`, e o `--tilt` é o que faz as duas coisas conviverem. As fotos das atrações ficam retas de
  propósito: é o que separa "foto oficial do artista" de "registro da festa passada".
- **Na seção de música ao vivo, a foto troca de lado por `grid-column`**, não por `order`. Assim o que
  se lê na tela e o que o leitor de tela anuncia seguem a mesma ordem: 1ª atração, depois 2ª.
- **As fotos das atrações entram na proporção do arquivo** (`width`/`height` no HTML + `height:auto`).
  As duas têm formato e fundo diferentes, e nenhuma moldura única servia para as duas sem cortar gente
  ou deixar borda cinza — então cada uma fica no seu formato, com o mesmo tratamento de moldura.
- **Quem prefere menos movimento não vê animação nenhuma** (`prefers-reduced-motion`): sem balanço no
  varal, sem revelação e sem foto torta.
- **Todos os ícones são SVG escritos à mão** dentro do `index.html`, no bloco "Sprite de ícones".
  Nenhuma imagem externa, nenhuma biblioteca de ícones.
- **As únicas requisições externas são as fontes do Google** (Alfa Slab One, Caveat, Nunito) — e o
  mapa, se o visitante clicar.
