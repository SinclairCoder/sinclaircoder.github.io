"""Check the static release's local navigation and resource references."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "website"
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.references = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                errors.append(f"{self.path.relative_to(ROOT)}: duplicate id {attrs['id']}")
            self.ids.add(attrs["id"])
        for attr in ("href", "src", "data-zoom-src"):
            if attrs.get(attr):
                self.references.append(attrs[attr])


pages = {path.resolve(): Page(path) for path in ROOT.rglob("*.html")}


def check_reference(source, value):
    url = urlsplit(value)
    if url.netloc or url.scheme:
        return
    path = unquote(url.path)
    target = ((ROOT / path.lstrip("/")) if path.startswith("/") else source.parent / path).resolve()
    if not path:
        target = source.resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        errors.append(f"{source.relative_to(ROOT)}: reference leaves website directory: {value}")
        return
    if target.is_dir():
        target /= "index.html"
    if not target.is_file():
        errors.append(f"{source.relative_to(ROOT)}: missing target {value}")
    elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
        errors.append(f"{source.relative_to(ROOT)}: missing anchor {value}")


for path, page in pages.items():
    for reference in page.references:
        check_reference(path, reference)

for path in ROOT.rglob("*.css"):
    for reference in re.findall(r"url\(\s*['\"]?([^)'\"]+)", path.read_text()):
        check_reference(path, reference.strip())

for path in ROOT.rglob("*.js"):
    for reference in re.findall(r"['\"](assets/[^'\"]+)['\"]", path.read_text()):
        check_reference(ROOT / "index.html", reference)

for route in ("index.html", "research/index.html", "publications/index.html", "open-source/index.html", "updates/index.html", ".nojekyll"):
    if not (ROOT / route).is_file():
        errors.append(f"Missing deployment entry point: {route}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"Validated {len(pages)} pages and their local links, anchors, CSS assets, and dynamic images.")
