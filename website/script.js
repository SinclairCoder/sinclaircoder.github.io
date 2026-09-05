// Progressive disclosure for the News list.
const SITE_ROOT = document.body.dataset.root || "";

function wireShowMore(buttonSelector, itemSelector, showLabel, hideLabel) {
  const button = document.querySelector(buttonSelector);
  const items = Array.from(document.querySelectorAll(itemSelector));
  if (!button || items.length === 0) return;

  button.addEventListener("click", () => {
    const shouldShow = items.some((item) => item.hidden);
    items.forEach((item) => {
      item.hidden = !shouldShow;
    });
    button.textContent = shouldShow ? hideLabel : showLabel;
  });
}

wireShowMore(".news-more", ".news-extra", "Show more news", "Show less news");

// Keep the footer year current.
const yearSlot = document.querySelector("[data-year]");
if (yearSlot) yearSlot.textContent = String(new Date().getFullYear());

// X discussion lightbox.
// Posts are baked in as static screenshots so they render everywhere,
// including networks where platform.twitter.com is blocked.
const X_LOGO =
  '<svg class="x-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

// Each discussion is a list of real posts, baked in as screenshots. The first
// post is the author's own thread; the rest are community reactions/quotes.
const X_DISCUSSIONS = {
  octothinker: {
    title: "OctoThinker on X",
    posts: [
      {
        img: "assets/img/tweets/octothinker-1.jpg",
        url: "https://x.com/SinclairWang1/status/1938244843857449431",
        w: 1000,
        h: 1309,
        alt: "Zengzhi Wang's thread introducing OctoThinker: what makes a base model suitable for RL.",
      },
      {
        img: "assets/img/tweets/octothinker-3.jpg",
        url: "https://x.com/gm8xx8/status/1915462092582527039",
        w: 1000,
        h: 2005,
        alt: "gm8xx8 quoting the OctoThinker thread: the base model is the real constraint, not RL.",
      },
    ],
  },
  megamath: {
    title: "MegaMath on X",
    posts: [
      {
        img: "assets/img/tweets/megamath-1.jpg",
        url: "https://x.com/SinclairWang1/status/1919963021461307489",
        w: 1000,
        h: 1120,
        alt: "Zengzhi Wang's thread announcing MegaMath, the largest open-source math pre-training corpus.",
      },
      {
        img: "assets/img/tweets/megamath-2.jpg",
        url: "https://x.com/llm360/status/1910749651986505774",
        w: 1000,
        h: 1122,
        alt: "LLM360 announcing MegaMath, a 371B-token open math pre-training corpus.",
      },
      {
        img: "assets/img/tweets/megamath-3.jpg",
        url: "https://x.com/rohanpaul_ai/status/1911139506910122166",
        w: 1000,
        h: 1679,
        alt: "Rohan Paul summarizing the MegaMath paper and its two-stage data pipeline.",
      },
    ],
  },
  prox: {
    title: "ProX on X",
    posts: [
      {
        img: "assets/img/tweets/prox-1.jpg",
        url: "https://x.com/SinclairWang1/status/1839318848450769111",
        w: 1000,
        h: 2111,
        alt: "Zengzhi Wang's thread on ProX: small language models that refine pre-training data at scale.",
      },
      {
        img: "assets/img/tweets/prox-2.jpg",
        url: "https://x.com/_akhaliq/status/1839301084264935668",
        w: 1000,
        h: 1246,
        alt: "AK featuring ProX: Programming Every Example, lifting pre-training data quality at scale.",
      },
      {
        img: "assets/img/tweets/prox-3.jpg",
        url: "https://x.com/rohanpaul_ai/status/1853893576289046597",
        w: 1000,
        h: 1677,
        alt: "Rohan Paul explaining how ProX uses tiny LLMs to clean massive datasets.",
      },
    ],
  },
  mathpile: {
    title: "MathPile on X",
    posts: [
      {
        img: "assets/img/tweets/mathpile-1.jpg",
        url: "https://x.com/SinclairWang1/status/1839579474074935589",
        w: 1000,
        h: 1545,
        alt: "Zengzhi Wang's thread sharing that MathPile was accepted to NeurIPS 2024 Datasets & Benchmarks.",
      },
      {
        img: "assets/img/tweets/mathpile-2.jpg",
        url: "https://x.com/_akhaliq/status/1740571256234057798",
        w: 1000,
        h: 1602,
        alt: "AK featuring MathPile, a billion-token-scale pre-training corpus for math.",
      },
      {
        img: "assets/img/tweets/mathpile-3.jpg",
        url: "https://x.com/arankomatsuzaki/status/1740564961032556942",
        w: 1000,
        h: 1208,
        alt: "Aran Komatsuzaki sharing MathPile: a diverse, high-quality math-centric corpus.",
      },
      {
        img: "assets/img/tweets/mathpile-4.jpg",
        url: "https://x.com/Yampeleg/status/1741458951382724974",
        w: 1000,
        h: 1547,
        alt: "Yam Peleg highlighting MathPile as a high-quality math dataset.",
      },
    ],
  },
};

const xModal = document.getElementById("xModal");

if (xModal) {
  const xBody = document.getElementById("xModalBody");
  const xTitle = xModal.querySelector("[data-x-modal-title]");
  const xClose = xModal.querySelector(".x-modal-close");
  let xLastFocused = null;

  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch]
    );

  const renderPost = (post, eager) =>
    `<a class="x-post" href="${encodeURI(post.url)}" target="_blank" rel="noreferrer">` +
    `<img src="${SITE_ROOT}${post.img}" width="${post.w}" height="${post.h}" alt="${escapeHtml(post.alt)}" ` +
    `loading="${eager ? "eager" : "lazy"}" decoding="async"></a>`;

  const renderDiscussion = (data) => {
    const posts = data.posts || [];
    return posts
      .map((post, i) => {
        const divider = i === 1 ? `<p class="x-more-label">More reactions</p>` : "";
        return divider + renderPost(post, i === 0);
      })
      .join("");
  };

  const openModal = (key) => {
    const data = X_DISCUSSIONS[key];
    if (!data) return;
    xLastFocused = document.activeElement;
    if (xTitle) xTitle.textContent = data.title;
    xBody.innerHTML = renderDiscussion(data);
    xBody.scrollTop = 0;
    xModal.hidden = false;
    document.body.classList.add("x-modal-open");
    if (xClose) xClose.focus();
  };

  const closeModal = () => {
    if (xModal.hidden) return;
    xModal.hidden = true;
    document.body.classList.remove("x-modal-open");
    if (xLastFocused && typeof xLastFocused.focus === "function") xLastFocused.focus();
  };

  document.querySelectorAll(".x-disc[data-x-posts]").forEach((button) => {
    const data = X_DISCUSSIONS[button.dataset.xPosts];
    const count = button.querySelector(".x-disc-count");
    if (data && count && data.posts) count.textContent = String(data.posts.length);
    button.addEventListener("click", () => openModal(button.dataset.xPosts));
  });

  xModal.querySelectorAll("[data-x-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

// Figure zoom lightbox — click a paper figure to see it full size.
const imgZoom = document.getElementById("imgZoom");

if (imgZoom) {
  const zoomImg = document.getElementById("imgZoomImg");
  const zoomCaption = imgZoom.querySelector("[data-zoom-caption]");
  const zoomClose = imgZoom.querySelector(".img-zoom-close");
  let zoomLastFocused = null;

  const openZoom = (src, alt) => {
    if (!src) return;
    zoomLastFocused = document.activeElement;
    zoomImg.src = src;
    zoomImg.alt = alt || "";
    if (zoomCaption) zoomCaption.textContent = alt || "";
    imgZoom.hidden = false;
    document.body.classList.add("x-modal-open");
    if (zoomClose) zoomClose.focus();
  };

  const closeZoom = () => {
    if (imgZoom.hidden) return;
    imgZoom.hidden = true;
    document.body.classList.remove("x-modal-open");
    zoomImg.removeAttribute("src");
    if (zoomLastFocused && typeof zoomLastFocused.focus === "function") zoomLastFocused.focus();
  };

  document.querySelectorAll("[data-zoom-src]").forEach((el) => {
    el.addEventListener("click", () => openZoom(el.dataset.zoomSrc, el.dataset.zoomAlt));
  });

  imgZoom.querySelectorAll("[data-zoom-close]").forEach((el) => {
    el.addEventListener("click", closeZoom);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeZoom();
  });
}

// Home knowledge-network metaphor. Rotate gently until the reader interacts;
// keep a manually selected stage stable while they explore its related work.
const knowledgeNetwork = document.querySelector(".knowledge-network-section");

if (knowledgeNetwork) {
  const svgNS = "http://www.w3.org/2000/svg";
  const baseGroup = knowledgeNetwork.querySelector(".knowledge-base-edges");
  const activeGroup = knowledgeNetwork.querySelector(".knowledge-active-edges");
  const nodeGroup = knowledgeNetwork.querySelector(".knowledge-nodes");
  const stageButtons = Array.from(knowledgeNetwork.querySelectorAll("[data-network-stage]"));
  const stageTitle = knowledgeNetwork.querySelector("[data-network-title]");
  const stageCopy = knowledgeNetwork.querySelector("[data-network-copy]");
  const relatedWork = knowledgeNetwork.querySelector("[data-network-related]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stages = [
    ["Build broad knowledge", "Connect diverse knowledge units into a general representation."],
    ["Strengthen useful pathways", "Organize knowledge into longer, more reliable reasoning chains."],
    ["Shape model behavior", "Reweight the network toward helpful and dependable responses."],
  ];
  const relatedProjects = [
    [
      ["MegaMath", "research/#megamath"],
      ["ProX", "research/#prox"],
    ],
    [["OctoThinker", "research/#octothinker"]],
    [["MegaScience", "open-source/#megascience"]],
  ];

  const jitter = [0, -8, 6, -4, 9, -2, 5, -7, 3, 8, -5, 2];
  const points = [];
  const columns = 12;
  const rows = 5;

  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      points.push({
        x: 32 + column * 59 + jitter[(column + row * 2) % jitter.length],
        y: 27 + row * 48 + jitter[(column * 3 + row) % jitter.length] * 0.65,
      });
    }
  }

  const edges = new Map();
  const addEdge = (a, b, stage) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    const existing = edges.get(key);
    if (!existing || stage < existing.stage) edges.set(key, { a, b, stage });
  };

  for (let column = 0; column < columns - 1; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const current = column * rows + row;
      addEdge(current, (column + 1) * rows + row, 0);
      if (row < rows - 1) addEdge(current, (column + 1) * rows + row + 1, 0);
      if (row > 0 && (column + row) % 2 === 0) addEdge(current, (column + 1) * rows + row - 1, 0);
    }
  }

  [
    [1, 13],
    [7, 24],
    [16, 33],
    [22, 39],
    [29, 46],
    [36, 53],
    [3, 25],
    [18, 42],
  ].forEach(([a, b]) => addEdge(a, b, 1));
  [
    [0, 12],
    [12, 24],
    [24, 36],
    [36, 48],
    [48, 59],
    [4, 15],
    [15, 27],
    [27, 39],
    [39, 51],
    [51, 55],
  ].forEach(([a, b]) => addEdge(a, b, 2));

  const activeNodes = [
    new Set(points.map((_, index) => index).filter((index) => index % 3 !== 1)),
    new Set([1, 3, 7, 13, 16, 18, 22, 24, 25, 29, 33, 36, 39, 42, 46, 53]),
    new Set([0, 4, 12, 15, 24, 27, 36, 39, 48, 51, 55, 59]),
  ];

  edges.forEach(({ a, b, stage }) => {
    const start = points[a];
    const end = points[b];
    const baseLine = document.createElementNS(svgNS, "line");
    baseLine.setAttribute("x1", start.x);
    baseLine.setAttribute("y1", start.y);
    baseLine.setAttribute("x2", end.x);
    baseLine.setAttribute("y2", end.y);
    baseGroup.appendChild(baseLine);

    const activeLine = baseLine.cloneNode();
    activeLine.dataset.stage = String(stage);
    activeGroup.appendChild(activeLine);
  });

  points.forEach((point, index) => {
    const node = document.createElementNS(svgNS, "circle");
    node.setAttribute("cx", point.x);
    node.setAttribute("cy", point.y);
    node.setAttribute("r", "3.1");
    node.dataset.index = String(index);
    nodeGroup.appendChild(node);
  });

  let currentStage = 0;
  let rotationTimer = null;
  let readerInteracted = false;
  let pointerInside = false;
  let networkVisible = false;
  const stopAuto = () => {
    if (rotationTimer !== null) {
      window.clearInterval(rotationTimer);
      rotationTimer = null;
    }
  };

  const renderNetworkStage = (stage) => {
    currentStage = stage;
    stageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.networkStage) === stage));
    });
    stageTitle.textContent = stages[stage][0];
    stageCopy.textContent = stages[stage][1];
    if (relatedWork) {
      const label = document.createElement("span");
      label.textContent = "Related work";
      const links = relatedProjects[stage].map(([name, href]) => {
        const link = document.createElement("a");
        link.textContent = name;
        link.href = SITE_ROOT + href;
        return link;
      });
      relatedWork.replaceChildren(label, ...links);
    }

    Array.from(activeGroup.children).forEach((line) => {
      const begins = Number(line.dataset.stage);
      const visible = begins <= stage;
      const current = begins === stage;
      line.style.opacity = visible ? (current ? "0.88" : "0.2") : "0";
      line.style.strokeWidth = current ? "2.35" : "1.3";
    });

    Array.from(nodeGroup.children).forEach((node) => {
      const index = Number(node.dataset.index);
      const emphasized = activeNodes[stage].has(index);
      node.setAttribute("r", emphasized ? "4" : "3.1");
      node.style.fill = emphasized ? "var(--accent)" : "var(--paper)";
      node.style.stroke = emphasized ? "var(--accent)" : "var(--subtle)";
      node.style.opacity = emphasized ? "1" : "0.68";
    });
  };

  const startAuto = () => {
    if (reducedMotion || readerInteracted || pointerInside || !networkVisible || document.hidden) return;
    stopAuto();
    rotationTimer = window.setInterval(() => {
      renderNetworkStage((currentStage + 1) % stages.length);
    }, 6000);
  };

  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      readerInteracted = true;
      stopAuto();
      renderNetworkStage(Number(button.dataset.networkStage));
    });
  });

  knowledgeNetwork.addEventListener("pointerenter", () => {
    pointerInside = true;
    stopAuto();
  });
  knowledgeNetwork.addEventListener("pointerleave", () => {
    pointerInside = false;
    startAuto();
  });
  knowledgeNetwork.addEventListener("focusin", () => {
    readerInteracted = true;
    stopAuto();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  renderNetworkStage(0);

  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        networkVisible = entries.some((entry) => entry.isIntersecting);
        if (networkVisible) startAuto();
        else stopAuto();
      },
      { threshold: 0.35 }
    );
    observer.observe(knowledgeNetwork);
  }
}
