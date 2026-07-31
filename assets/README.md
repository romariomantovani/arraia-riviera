# Assets

## `imagens/`

### O mural "Como foi em 2025"

| Arquivo | O que é | Onde aparece |
|---|---|---|
| `video1.mp4` | Vídeo vertical (9:16) gravado na praça, 32s | Mural de 2025 — só toca no clique |
| `video1-poster.jpg` | Quadro do vídeo mostrado antes do play | Mural de 2025 |
| `foto1.jpeg` | Retrato (3:4) do grupo de amigos | Mural de 2025, coluna do meio |
| `foto2.jpeg` | Paisagem (4:3) da turma da quadrilha | Faixa larga do mural **e** miniatura do link no WhatsApp (`og:image`) |

### As atrações

| Arquivo | O que é | Onde aparece |
|---|---|---|
| `cantor-lucas-comerio.jpeg` | 432 × 462 — entra como veio | Bloco da **1ª atração** |
| `cristian-anderson.jpg` | 900 × 717 — **derivado**, ver abaixo | Bloco da **2ª atração** |
| `cantores-cristian-anderson.jpg` | 900 × 900 — o original que veio da dupla | Não é usado no site; fica guardado |

O original da dupla é um avatar de YouTube: tem uma tarja embaixo onde o nome aparece **cortado nas
duas pontas** ("RISTIAN & ANDERSON"), que no site pareceria erro de digitação. O arquivo usado é o
recorte que joga essa tarja fora — o nome escrito certo já vem do `<h3>` do bloco:

```bash
python3 -c "from PIL import Image; Image.open('assets/imagens/cantores-cristian-anderson.jpg').crop((0,0,900,717)).save('assets/imagens/cristian-anderson.jpg', quality=88, optimize=True)"
```

Cada foto de atração entra na **proporção do próprio arquivo** — os `width`/`height` no HTML mais
`height:auto` no CSS. Se trocar uma foto, atualize esses dois números; sem eles a página pula enquanto
a imagem carrega.

A foto do Lucas tem só 432px de largura, e aparece com cerca de 330px na tela do celular — ou seja, é
esticada umas 1,5× numa tela retina. Fica aceitável para foto de pessoa, mas um arquivo maior deixaria
o bloco dele mais nítido (e permitiria ampliá-lo).

O vídeo entra na proporção 9:16 e a `foto1` em 3:4 — é o que faz as duas colunas terminarem na mesma
altura. Se trocar por arquivos de outra proporção, ajuste os `aspect-ratio` em `styles.css`.

A `foto2` aparece recortada em 3:2 no desktop (o céu vazio do topo sai) e inteira no celular.

**Poster novo**, se quiser outro segundo do vídeo:

```bash
ffmpeg -y -ss 8 -i assets/imagens/video1.mp4 -frames:v 1 -q:v 3 assets/imagens/video1-poster.jpg
```

## `patrocinadores/` — os 12 logos

Fundo do logo pode ser qualquer um (branco, preto, vermelho, azul): o cartão do site é uma placa
branca e o logo entra inteiro por dentro, sem recorte e sem distorcer.

Para incluir um patrocinador: jogue o arquivo aqui e copie um `<li class="patros__item">` na seção
"PATROCINADORES" do `index.html`, trocando `src`, `alt`, `width` e `height`.

**Logo em PDF não funciona em `<img>`** — converta primeiro:

```bash
pdftoppm -png -r 200 -singlefile assets/patrocinadores/nome.pdf assets/patrocinadores/nome
```

Foi assim que saíram `brunetti.png` e `george-veiculos.png`; os PDFs originais ficaram na pasta.

Dois pontos de atenção nos arquivos atuais:

- **Vassouras Capixaba tem dois arquivos.** O site usa o `capixaba-vassoura.webp` (1360 × 464), que
  traz o logo inteiro. O `capixaba-vassoura.jpg` antigo estava cortado — o nome tinha as pontas fora
  do quadro — e ficou na pasta sem uso; pode apagar quando quiser.
- `nextcom.webp` é o logo da **NEXTCON** Engenharia (o nome do arquivo engana).

Todo logo entra na placa com `object-fit: contain`, sem cortar nem distorcer, e a placa é sempre do
mesmo tamanho: fundo e formato do arquivo não importam.

## `imagens-projeto-igreja/` — os renders 3D da igreja

São 15 PNGs vindos do escritório de projeto, somando **42 MB** — bons de guardar, impossíveis de
publicar. Ficam intactos na pasta; o site usa só a subpasta `web/`, com **6 ângulos escolhidos**
convertidos para WebP em duas larguras (1400px e 800px, para o `srcset`). Os 6 juntos dão 478 KB no
desktop e 180 KB no celular.

| Original | Vira | O que mostra |
|---|---|---|
| `1F.png` | `igreja-fachada` | A fachada em perspectiva, no fim de tarde |
| `1A.png` | `igreja-fachada-frente` | A fachada de frente, com o Alfa e o Ômega |
| `1.png` | `igreja-nave` | A nave vista de quem entra |
| `6.png` | `igreja-nave-altar` | A nave vista do altar |
| `5.png` | `igreja-altar` | O altar e o crucifixo |
| `2.png` | `igreja-vitrais` | A lateral com as janelas em arco |

Para trocar ou incluir um render, gere as duas larguras a partir do PNG original:

```bash
python3 -c "
from PIL import Image
im = Image.open('assets/imagens-projeto-igreja/1F.png').convert('RGB')
for w in (1400, 800):
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(f'assets/imagens-projeto-igreja/web/igreja-fachada-{w}.webp', 'WEBP', quality=82, method=6)
"
```

Depois ajuste `src`, `srcset`, `alt`, `width` e `height` no `index.html`. Se o recorte cortar algo que
importa (uma cruz, o crucifixo), use a variável `--recorte` no `style` da imagem — ela alimenta o
`object-position`. Foi o que resolveu a fachada, que no corte centralizado perdia as três cruzes.

## `Cardapio_Arraia_Final.pdf` — fonte, não é publicado

É o cardápio original feito no Canva, guardado aqui como referência. **Não é linkado em lugar nenhum
do site**, por dois motivos: tem 3,4 MB (pesado de abrir no celular) e já nasceu desatualizado — traz
o Quentão de 80 ml, que deu lugar ao Cachamel.

O cardápio que vale é a página **`cardapio.html`**, na raiz do projeto. Para mexer nos itens ou nos
preços, edite lá mesmo: cada item é uma linha `<li class="item">`, e para incluir um novo basta copiar
uma linha e trocar o nome e o preço. Se o item tiver um detalhe (o volume, a marca), ele vai num
`<span class="item__nota">` **depois** do preço — é o que faz a nota cair sozinha na linha de baixo,
com a linha pontilhada ligando nome e preço em cima.

## Trocar a ordem das atrações

Na seção "MÚSICA AO VIVO" do `index.html`, troque o par de classes `ato--impar` / `ato--par` entre os
dois `<article>` — é isso que decide de que lado a foto aparece. Lembre de trocar também o texto da
pílula ("1ª atração" / "2ª atração") e a ordem dos nomes no selo do hero e no cartão "Show ao vivo".
