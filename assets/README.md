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
| `cristian-anderson.jpg` | 900 × 717 — **derivado**, ver abaixo | Bloco da 1ª atração |
| `cantores-cristian-anderson.jpg` | 900 × 900 — o original que veio da dupla | Não é usado no site; fica guardado |
| `cantor-lucas-comerio.jpeg` | 432 × 462 — entra como veio | Bloco da 2ª atração |

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

- `capixaba-vassoura.jpg` está cortado na origem — o nome "VASSOURAS CAPIXABA" tem as pontas fora do
  quadro. Vale pedir o logo inteiro.
- `nextcom.webp` é o logo da **NEXTCON** Engenharia (o nome do arquivo engana).

## Trocar a ordem das atrações

Na seção "MÚSICA AO VIVO" do `index.html`, troque o par de classes `ato--impar` / `ato--par` entre os
dois `<article>` — é isso que decide de que lado a foto aparece. Lembre de trocar também o texto da
pílula ("1ª atração" / "2ª atração").
