"""
document_structure.py — section-aware Markdown chunking for the SmartBid docs index.

The SharePoint indexer hands the skillset one flat string per document. Splitting
that string every N characters cuts specification tables in half and fills most
chunks with the header/footer that repeats on every page — which is why retrieval
kept returning cover pages instead of the section that answers the question.

This module rebuilds the document outline (numbered clauses, all-caps titles,
appendices) as Markdown, drops the repeated boilerplate, and emits one chunk per
section so an equipment section stays together with its specification table.
"""
import re
from collections import Counter
from typing import Any, Dict, List, Optional, Sequence, Tuple

DEFAULT_MAX_CHARS = 4000
DEFAULT_MIN_CHARS = 1200
DEFAULT_OVERLAP_CHARS = 400
# Section titles name the equipment a proposal covers, so one short chunk listing
# all of them answers "which proposals used the Defender?" without depending on a
# single body chunk winning the ranking.
OUTLINE_SECTION = "Document outline"
OUTLINE_MAX_ENTRIES = 120
# A two-page datasheet yields one or two headings; listing them adds an index
# entry that says nothing the metadata header doesn't already say.
OUTLINE_MIN_ENTRIES = 3

# A heading is short by definition; anything longer is a sentence that happens to
# start with a clause number.
MAX_HEADING_CHARS = 110
MAX_TITLE_HEADING_CHARS = 80
MAX_HEADING_WORDS = 10
MAX_NUMBERED_HEADING_WORDS = 16
MIN_HEADING_LETTERS = 3
MAX_HEADING_DEPTH = 4
# Unnumbered headings ("SUBMERSIBLE", "TETHER") sit below any numbered clause so
# a datasheet block never pops the section it belongs to off the stack.
UPPER_HEADING_LEVEL = 5
TITLE_HEADING_LEVEL = 6

# Repeated header/footer detection. A line that shows up this many times, once
# page numbers are masked, is furniture rather than content.
BOILERPLATE_MIN_REPEATS = 3
BOILERPLATE_MAX_CHARS = 100
NOISE_MAX_CHARS = 200

_WHITESPACE = re.compile(r"[ \t]+")
_DIGITS = re.compile(r"\d+")
_BLANK_SPLIT = re.compile(r"\n\s*\n")
_NUMBERED_HEADING = re.compile(r"^(\d{1,2}(?:\.\d{1,3}){0,5})[.)]?\s*(\S.*)$")
_APPENDIX_HEADING = re.compile(
    r"^(appendix|annex|anexo|ap[eê]ndice|attachment|exhibit)\b", re.IGNORECASE
)
# Dot leaders only occur in a table of contents, whose entries would otherwise be
# detected as headings and create phantom sections.
_TOC_LEADER = re.compile(r"\.{4,}")
# Only unambiguous page markers. Bare numeric lines are left alone because PDF
# extraction often emits one table cell per line.
_PAGE_MARKER = re.compile(
    r"^(?:(?:page|p[aá]gina|pg|folha)\s*\.?\s*)?\d{1,4}\s*(?:of|de|/)\s*\d{1,4}$"
    r"|^[-–—]\s*\d{1,4}\s*[-–—]$",
    re.IGNORECASE,
)
_NOISE = re.compile(
    r"proprietary information"
    r"|all rights reserved"
    r"|uncontrolled when printed"
    r"|must not be copied"
    r"|n[aã]o pode ser copiado"
    r"|todos os direitos reservados",
    re.IGNORECASE,
)
# Words that turn a repeated line into page furniture rather than content.
_FURNITURE_HINT = re.compile(
    r"\b(page|p[aá]gina|folha|rev|revis[aã]o|revision|doc|document|documento)\b",
    re.IGNORECASE,
)

_METADATA_FIELDS: Tuple[Tuple[str, str], ...] = (
    ("Type", "docType"),
    ("Client/Manufacturer", "manufacturer"),
    ("Ref/Model", "docModel"),
    ("Rev", "docRevision"),
    ("Discipline", "docCategory"),
    ("Keywords", "docKeywords"),
)

_Heading = Tuple[int, str]
_Section = Tuple[List[_Heading], List[str]]


def _has_letters(line: str) -> bool:
    return line.lower() != line.upper()


def _is_upper(line: str) -> bool:
    return _has_letters(line) and line == line.upper()


def _letter_count(line: str) -> int:
    return sum(1 for ch in line if ch.isalpha())


def _has_word(line: str) -> bool:
    """Guards against all-caps noise such as the "X X X X" row of a maintenance
    matrix, which is uppercase but carries no word."""
    return any(_letter_count(word) >= 2 for word in line.split())


def _is_title_case(line: str) -> bool:
    words = [w for w in line.split() if _has_letters(w)]
    if len(words) < 2:
        return False
    capitalised = sum(1 for w in words if w[:1].isupper())
    return capitalised / len(words) >= 0.6


def _numbered_title(number: str, rest: str, prev_blank: bool, next_top: int) -> bool:
    """A single-level number is indistinguishable from a quantity in a
    specification table ("3 Vertical Thrusters"), so it needs either an all-caps
    title or to continue the document's own clause sequence after a break. A
    multi-level number is evidence enough on its own."""
    if len(rest.split()) > MAX_NUMBERED_HEADING_WORDS:
        return False
    if "." in number:
        return True
    return _is_upper(rest) or (prev_blank and number == str(next_top))


def _normalize(line: str) -> str:
    """Collapse whitespace and mask digits so "Page 3 of 19" and "Page 4 of 19"
    count as the same repeated line."""
    return _DIGITS.sub("#", _WHITESPACE.sub(" ", line.strip())).lower()


def _is_boilerplate(line: str, exact: Counter, masked: Counter) -> bool:
    """Digit masking is what catches a running footer, but it also makes a
    measurement table whose rows differ only in numbers look repetitive — so the
    masked form only counts when the line reads like page furniture."""
    if len(line) > BOILERPLATE_MAX_CHARS or not _has_letters(line):
        return False
    if exact[_WHITESPACE.sub(" ", line).lower()] >= BOILERPLATE_MIN_REPEATS:
        return True
    return (
        masked[_normalize(line)] >= BOILERPLATE_MIN_REPEATS
        and _FURNITURE_HINT.search(line) is not None
    )


def strip_boilerplate(lines: Sequence[str]) -> List[str]:
    stripped = [_WHITESPACE.sub(" ", line.strip()) for line in lines]
    exact = Counter(line.lower() for line in stripped if line)
    masked = Counter(_normalize(line) for line in stripped if line)
    kept: List[str] = []

    def separate() -> None:
        """A dropped page header still marks a boundary, so it leaves a blank line
        behind instead of gluing the last line of a page to the first of the next."""
        if kept and kept[-1]:
            kept.append("")

    for line in stripped:
        if not line:
            separate()
            continue
        if _PAGE_MARKER.match(line) or _TOC_LEADER.search(line):
            separate()
            continue
        if len(line) <= NOISE_MAX_CHARS and _NOISE.search(line):
            separate()
            continue
        if _is_boilerplate(line, exact, masked):
            separate()
            continue
        kept.append(line)
    return kept


def _heading(line: str, prev_blank: bool, next_top: int) -> Optional[_Heading]:
    """Return (level, title) when the line opens a section, else None."""
    if line.endswith((".", ",", ";", ":", "?", "!")):
        return None

    numbered = _NUMBERED_HEADING.match(line)
    if (
        numbered
        and len(line) <= MAX_HEADING_CHARS
        # A heading's first word is capitalised; "0.2 degree Static Roll/Pitch"
        # is a specification row.
        and numbered.group(2)[:1].isupper()
        and _letter_count(numbered.group(2)) >= MIN_HEADING_LETTERS
        and _numbered_title(numbered.group(1), numbered.group(2), prev_blank, next_top)
    ):
        depth = numbered.group(1).count(".") + 1
        return min(depth, MAX_HEADING_DEPTH), line

    if _APPENDIX_HEADING.match(line) and len(line) <= MAX_HEADING_CHARS:
        return 1, line

    if (
        _is_upper(line)
        and len(line) <= MAX_TITLE_HEADING_CHARS
        and _letter_count(line) >= MIN_HEADING_LETTERS
        and _has_word(line)
    ):
        return UPPER_HEADING_LEVEL, line

    if (
        prev_blank
        and len(line) <= MAX_TITLE_HEADING_CHARS
        and len(line.split()) <= MAX_HEADING_WORDS
        and _is_title_case(line)
    ):
        return TITLE_HEADING_LEVEL, line

    return None


def split_sections(lines: Sequence[str]) -> List[_Section]:
    """Walk the document once, keeping a heading stack so every section carries
    its full ancestry instead of just its own title."""
    stack: List[_Heading] = []
    sections: List[_Section] = []
    path: List[_Heading] = []
    body: List[str] = []
    prev_blank = True
    next_top = 1

    for raw in lines:
        line = raw.strip()
        if not line:
            prev_blank = True
            if body and body[-1]:
                body.append("")
            continue

        found = _heading(line, prev_blank, next_top)
        prev_blank = False
        if not found:
            body.append(line)
            continue

        if body:
            sections.append((path, body))
        level, title = found
        if level == 1:
            numbered = _NUMBERED_HEADING.match(title)
            if numbered and "." not in numbered.group(1):
                next_top = int(numbered.group(1)) + 1
        while stack and stack[-1][0] >= level:
            stack.pop()
        stack.append((level, title))
        path = list(stack)
        body = []

    if body:
        sections.append((path, body))
    return sections


def _atomic_blocks(body: str, max_chars: int) -> List[str]:
    """Paragraphs are indivisible, so a specification table extracted as one
    block is never cut in half. Only a paragraph that alone exceeds the budget
    falls back to line boundaries."""
    blocks: List[str] = []
    for paragraph in _BLANK_SPLIT.split(body):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if len(paragraph) <= max_chars:
            blocks.append(paragraph)
            continue
        current = ""
        for line in paragraph.splitlines():
            candidate = f"{current}\n{line}" if current else line
            if current and len(candidate) > max_chars:
                blocks.append(current)
                current = line
            else:
                current = candidate
            # A table can be extracted as one long line with no break to cut on,
            # which would otherwise produce a chunk too large to embed.
            while len(current) > max_chars:
                blocks.append(current[:max_chars])
                current = current[max_chars:]
        if current:
            blocks.append(current)
    return blocks


def _overlap_tail(text: str, overlap: int) -> str:
    if overlap <= 0 or len(text) <= overlap:
        return ""
    tail = text[-overlap:]
    space = tail.find(" ")
    return tail[space + 1 :].strip() if space != -1 else tail.strip()


def _split_body(body: str, max_chars: int, overlap: int) -> List[str]:
    pieces: List[str] = []
    current = ""
    for block in _atomic_blocks(body, max_chars):
        candidate = f"{current}\n\n{block}" if current else block
        if current and len(candidate) > max_chars:
            pieces.append(current)
            tail = _overlap_tail(current, overlap)
            current = f"{tail}\n\n{block}" if tail else block
        else:
            current = candidate
    if current.strip():
        pieces.append(current)
    return pieces or [body]


def _render(path: Sequence[_Heading], body: str, since: Sequence[_Heading] = ()) -> str:
    """`since` is the path already rendered earlier in the same chunk, so shared
    ancestors are written once instead of before every merged section."""
    shared = 0
    for own, previous in zip(path, since):
        if own != previous:
            break
        shared += 1
    heading = "\n".join(
        f"{'#' * min(level, 6)} {title}" for level, title in path[shared:]
    )
    return f"{heading}\n\n{body}".strip() if heading else body.strip()


def breadcrumb(path: Sequence[_Heading]) -> str:
    return " > ".join(title for _, title in path)


def outline(sections: Sequence[_Section], max_entries: int = OUTLINE_MAX_ENTRIES) -> List[str]:
    titles: List[str] = []
    seen = set()
    for path, _ in sections:
        for _, title in path:
            if title not in seen:
                seen.add(title)
                titles.append(title)
    return titles[:max_entries]


def metadata_header(metadata: Optional[Dict[str, Any]]) -> str:
    """Rendered once per chunk and fed to the embedding model. Without it the
    vector encodes the excerpt only, so a question about a client, a proposal
    number or an equipment model can never match the document that holds it."""
    if not metadata:
        return ""
    lines: List[str] = []
    title = str(metadata.get("title") or "").strip()
    if title:
        lines.append(f"Document: {title}")
    pairs = [
        f"{label}: {str(metadata.get(field)).strip()}"
        for label, field in _METADATA_FIELDS
        if str(metadata.get(field) or "").strip()
    ]
    if pairs:
        lines.append(" | ".join(pairs))
    description = str(metadata.get("docDescription") or "").strip()
    if description:
        lines.append(f"Scope: {description}")
    return "\n".join(lines)


def build_chunks(
    text: str,
    metadata: Optional[Dict[str, Any]] = None,
    *,
    max_chars: int = DEFAULT_MAX_CHARS,
    min_chars: int = DEFAULT_MIN_CHARS,
    overlap_chars: int = DEFAULT_OVERLAP_CHARS,
) -> List[Dict[str, Any]]:
    """Return one dict per chunk: `text` is what gets stored and shown to the
    model, `content` is the same text prefixed with the catalogue metadata and is
    what gets embedded."""
    lines = strip_boilerplate((text or "").splitlines())
    sections = split_sections(lines)

    units: List[Tuple[List[_Heading], str]] = []
    for path, body_lines in sections:
        body = "\n".join(body_lines).strip()
        if not body:
            continue
        heading_len = len(_render(path, ""))
        budget = max(300, max_chars - heading_len)
        for piece in _split_body(body, budget, overlap_chars):
            units.append((path, piece))

    # A document read as nothing but headings would otherwise be dropped, so its
    # text is chunked flat rather than lost.
    if not units:
        flat = "\n".join(lines).strip()
        if flat:
            units = [([], piece) for piece in _split_body(flat, max_chars, overlap_chars)]

    chunks: List[Dict[str, Any]] = []
    pending: List[str] = []
    pending_path: Optional[List[_Heading]] = None
    pending_best = 0
    last_path: List[_Heading] = []
    pending_len = 0
    header = metadata_header(metadata)

    def emit(section: str, body: str) -> None:
        chunks.append(
            {
                "ordinal": len(chunks),
                "section": section,
                "text": body,
                "content": f"{header}\n\n{body}".strip() if header else body,
            }
        )

    titles = outline(sections)
    if len(titles) >= OUTLINE_MIN_ENTRIES:
        emit(
            OUTLINE_SECTION,
            f"# {OUTLINE_SECTION}\n\nSections and items covered by this document:\n"
            + "\n".join(f"- {title}" for title in titles),
        )

    def flush() -> None:
        nonlocal pending, pending_path, pending_best, last_path, pending_len
        body = "\n\n".join(pending).strip()
        if body:
            emit(breadcrumb(pending_path or []), body)
        pending, pending_path, last_path = [], None, []
        pending_best = pending_len = 0

    for path, piece in units:
        rendered = _render(path, piece, last_path)
        if pending_len and pending_len + len(rendered) > max_chars:
            flush()
            rendered = _render(path, piece)
        # A merged chunk is named after the section that contributes most of it,
        # not the first one it happens to start with.
        if len(piece) > pending_best:
            pending_best, pending_path = len(piece), path
        pending.append(rendered)
        last_path = list(path)
        pending_len += len(rendered) + 2
        if pending_len >= min_chars:
            flush()
    flush()

    return chunks
