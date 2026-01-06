import os
import cairosvg

path = os.path.dirname(os.path.abspath(__file__))

cairosvg.svg2png(
    url=os.path.join(path, "poster-large.svg"),
    write_to=os.path.join(path, "poster-large.png"),
    output_width=1400,
    output_height=560,
)

cairosvg.svg2png(
    url=os.path.join(path, "poster-small.svg"),
    write_to=os.path.join(path, "poster-small.png"),
    output_width=440,
    output_height=280,
)
