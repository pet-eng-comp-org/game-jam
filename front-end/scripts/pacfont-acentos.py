"""Gera public/fontes/pacfont-br.{ttf,woff2}: a PacFont com as letras acentuadas
do portugues.

A PacFont original tem 85 glifos e nenhum acento. No mockup (Figma, Season 4,
frame Inicio 78:81) a designer escreveu os titulos sem acento e desenhou os
acentos a mao, como retangulos vazados de contorno 1,5px sobre texto de 53px:
  agudo   Rectangle 36 (78:105): 13,05 x 11 px, girado -80 graus, 84 un acima da letra
  til     Rectangle 34 (78:103): 22 x 8 px, na horizontal, 50 un acima da letra
  cedilha Rectangle 35 (78:104): o mesmo retangulo do agudo, colado sob o C
O grave e o agudo espelhado. O circunflexo a designer nao desenhou: aqui e um
triangulo no mesmo estilo. Maiuscula (letra vazada) leva acento vazado;
minuscula (letra solida) leva acento solido, como o resto da fonte.

Uso: python3 scripts/pacfont-acentos.py   (precisa de fonttools e brotli)
"""
import math
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.boundsPen import BoundsPen

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "public/fontes/pacfont.ttf"
DESTINO = RAIZ / "public/fontes/pacfont-br"

PX = 1000 / 53          # 1 px do mockup em unidades da fonte (texto de 53px)
TRACO = 1.5 * PX        # contorno de 1,5 px


def area(pts):
    return sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1])) / 2


def horario(pts):
    # TrueType: contorno externo no sentido horario (area negativa com y para cima)
    return pts if area(pts) < 0 else pts[::-1]


def desenha(pen, pts):
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()


def retangulo(cx, cy, w, h, graus):
    t = math.radians(graus)
    c, s = math.cos(t), math.sin(t)
    return [(round(cx + x * c - y * s), round(cy + x * s + y * c))
            for x, y in [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]]


def triangulo(cx, base, w, h):
    return [(round(cx - w / 2), round(base)), (round(cx), round(base + h)), (round(cx + w / 2), round(base))]


def encolhe(pts, d):
    # Afasta cada vertice do centro na direcao da bissetriz: serve para
    # retangulo e triangulo, que e o que existe aqui.
    cx = sum(x for x, _ in pts) / len(pts)
    cy = sum(y for _, y in pts) / len(pts)
    novo = []
    n = len(pts)
    for i, (x, y) in enumerate(pts):
        (ax, ay), (bx, by) = pts[i - 1], pts[(i + 1) % n]
        u = ((x - ax), (y - ay)); v = ((bx - x), (by - y))
        lu, lv = math.hypot(*u), math.hypot(*v)
        # normais para dentro
        nu = (-u[1] / lu, u[0] / lu); nv = (-v[1] / lv, v[0] / lv)
        if (cx - x) * (nu[0] + nv[0]) + (cy - y) * (nu[1] + nv[1]) < 0:
            nu = (-nu[0], -nu[1]); nv = (-nv[0], -nv[1])
        bis = (nu[0] + nv[0], nu[1] + nv[1]); lb = math.hypot(*bis)
        cos_meio = (nu[0] * bis[0] + nu[1] * bis[1]) / lb
        k = d / cos_meio
        novo.append((round(x + bis[0] / lb * k), round(y + bis[1] / lb * k)))
    return novo


def glifo_acento(forma, vazado):
    """forma: contorno pelo meio do traco, como o Figma guarda o retangulo."""
    pen = TTGlyphPen(None)
    externo = encolhe(forma, -TRACO / 2)
    desenha(pen, horario(externo))
    if vazado:
        desenha(pen, horario(encolhe(forma, TRACO / 2))[::-1])
    return pen.glyph()


def formas():
    agudo_h = 11 * PX; agudo_w = 13.05 * PX
    # altura do agudo girado (-80 graus): ~14,76 px
    alt = 14.76 * PX
    return {
        # (forma centrada em x=0, referencia vertical: "acima" = base do acento sobre o topo da letra)
        "agudo": (retangulo(0, 0, agudo_w, agudo_h, -80), "acima", 84),
        "grave": ([(-x, y) for x, y in retangulo(0, 0, agudo_w, agudo_h, -80)], "acima", 84),
        "til": (retangulo(0, 0, 22 * PX, 8 * PX, 0), "acima", 50),
        "circunflexo": (triangulo(0, -5.5 * PX, 22 * PX, 11 * PX), "acima", 50),
        "cedilha": (retangulo(0, 0, agudo_w, agudo_h, -80), "abaixo", 32),
    }


LETRAS = {
    "á": ("a", "agudo"), "à": ("a", "grave"), "â": ("a", "circunflexo"), "ã": ("a", "til"),
    "é": ("e", "agudo"), "ê": ("e", "circunflexo"), "í": ("i", "agudo"),
    "ó": ("o", "agudo"), "ô": ("o", "circunflexo"), "õ": ("o", "til"),
    "ú": ("u", "agudo"), "ç": ("c", "cedilha"),
}


def main():
    fonte = TTFont(ORIGEM)
    glyf, hmtx, cmap = fonte["glyf"], fonte["hmtx"], fonte.getBestCmap()
    conjunto = fonte.getGlyphSet()

    def caixa(nome):
        p = BoundsPen(conjunto); conjunto[nome].draw(p); return p.bounds

    novos = {}
    for letra, (base_min, acento) in LETRAS.items():
        for car, base_car in ((letra, base_min), (letra.upper(), base_min.upper())):
            vazado = car.isupper()
            base = cmap[ord(base_car)]
            forma, lado, folga = formas()[acento]
            nome_acento = f"{acento}.{'vazado' if vazado else 'solido'}"
            if nome_acento not in glyf:
                glyf[nome_acento] = glifo_acento(forma, vazado)
                hmtx[nome_acento] = (0, 0)
            x0, y0, x1, y1 = caixa(base)
            ac = glyf[nome_acento]; ac.recalcBounds(glyf)
            dx = round((x0 + x1) / 2)
            dy = round(y1 + folga - ac.yMin) if lado == "acima" else round(y0 - folga - ac.yMax)
            pen = TTGlyphPen(glyf)
            pen.addComponent(base, (1, 0, 0, 1, 0, 0))
            pen.addComponent(nome_acento, (1, 0, 0, 1, dx, dy))
            nome = f"uni{ord(car):04X}"
            glyf[nome] = pen.glyph()
            hmtx[nome] = hmtx[base]
            novos[ord(car)] = nome

    # glyf[nome] = ... ja registra o nome na ordem da tabela; a fonte segue ela.
    fonte.setGlyphOrder(glyf.glyphOrder)
    for tabela in fonte["cmap"].tables:
        if tabela.isUnicode():
            tabela.cmap.update(novos)
    for registro in fonte["name"].names:
        if registro.nameID in (1, 4, 16):
            registro.string = str(registro.toUnicode()) + " BR"
    fonte["post"].formatType = 3.0  # sem nomes de glifo na tabela
    fonte.save(f"{DESTINO}.ttf")
    fonte.flavor = "woff2"
    fonte.save(f"{DESTINO}.woff2")
    print(f"{len(novos)} letras acentuadas -> {DESTINO}.ttf/.woff2")


if __name__ == "__main__":
    main()
