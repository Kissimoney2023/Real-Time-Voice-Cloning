"""Build one self-contained menu page that works without a web server.

Reads index.html and menu.json (same folder) and writes menu-standalone.html
with the menu data built in. Run:  python build-standalone.py
Then copy menu-standalone.html to the TV box (see CLAUDE.md / the chat steps).
"""
import json, pathlib

here = pathlib.Path(__file__).resolve().parent
page = (here / "index.html").read_text(encoding="utf-8")
menu = json.loads((here / "menu.json").read_text(encoding="utf-8"))

start = page.index("const MENU = ")
end = page.index("\n};\n", start) + len("\n};\n")
block = "const MENU = " + json.dumps(menu, indent=2, ensure_ascii=False) + ";\n"
out = page[:start] + block + page[end:]

(here / "menu-standalone.html").write_text(out, encoding="utf-8")
print("Wrote menu-standalone.html with", sum(len(c["items"]) for c in menu["categories"]), "items")
