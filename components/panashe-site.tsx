"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { products, categories, Product } from "@/data/products";
const PHONE = "263774390516",
  CALL = "0781250017";
const wa = (s: string) =>
    `https://wa.me/${PHONE}?text=${encodeURIComponent(s)}`,
  money = (n: number) => `US$${n.toFixed(2)}`;
const nav = [
  ["Home", "/"],
  ["Products", "/products"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Bulk Orders", "/bulk-orders"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
const pics = [
  [
    "/projects/farm-chain-link-green-field.jpeg",
    "Agricultural boundary",
    "Agricultural",
  ],
  [
    "/projects/residential-chain-link.jpeg",
    "Residential boundary",
    "Residential",
  ],
  [
    "/projects/game-fence-installation.jpeg",
    "Game fence installation",
    "Agricultural",
  ],
  [
    "/projects/open-land-chain-link.jpeg",
    "Open-land installation",
    "Installations",
  ],
  [
    "/projects/urban-chain-link-detail.jpeg",
    "Urban mesh installation",
    "Commercial",
  ],
  ["/projects/custom-double-gate.jpeg", "Custom double gate", "Gates"],
  [
    "/projects/security-gate-barbed-wire.jpeg",
    "Security gate & barbed wire",
    "Gates",
  ],
  ["/projects/long-farm-boundary.jpeg", "Long farm boundary", "Agricultural"],
  [
    "/products/galvanised-gate-frames.jpeg",
    "Fabricated gate stock",
    "Material supply",
  ],
  [
    "/products/diamond-mesh-yard-stock.jpeg",
    "Diamond mesh stock",
    "Material supply",
  ],
] as const;
function go(p: string) {
  history.pushState({}, "", p);
  dispatchEvent(new PopStateEvent("popstate"));
  scrollTo({ top: 0, behavior: "smooth" });
}
function Link({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={className} onClick={() => go(to)}>
      {children}
    </button>
  );
}
export default function Site({ initialPath = "/" }: { initialPath?: string }) {
  const [path, setPath] = useState(initialPath),
    [menu, setMenu] = useState(false),
    [quote, setQuote] = useState<Record<string, number>>({}),
    [drawer, setDrawer] = useState(false),
    [light, setLight] = useState<string | null>(null);
  useEffect(() => {
    const f = () => setPath(location.pathname);
    f();
    addEventListener("popstate", f);
    const q = localStorage.getItem("panashe-quote");
    if (q) setQuote(JSON.parse(q));
    return () => removeEventListener("popstate", f);
  }, []);
  useEffect(
    () => localStorage.setItem("panashe-quote", JSON.stringify(quote)),
    [quote],
  );
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => {
      const nodes = [
        ...document.querySelectorAll(
          "main section:not(.hero):not(.catalogue-head):not(.page-head):not(.projects-head):not(.bulk-hero):not(.contact-head), .product, .tile, .gallery>button, .service-list>article, .process article",
        ),
      ];
      nodes.forEach((node, i) => {
        node.classList.add("jaeger-reveal", i % 2 ? "from-down" : "from-up");
        (node as HTMLElement).style.setProperty(
          "--reveal-delay",
          `${Math.min(i % 4, 3) * 70}ms`,
        );
      });
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -7%" },
      );
      nodes.forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    }, 40);
    return () => clearTimeout(timer);
  }, [path]);
  const add = (id: string) =>
      setQuote((q) => ({ ...q, [id]: (q[id] || 0) + 1 })),
    count = Object.values(quote).reduce((a, b) => a + b, 0);
  let page = path.startsWith("/products/") ? (
    <Detail slug={path.split("/")[2]} add={add} />
  ) : path === "/products" ? (
    <Catalogue add={add} />
  ) : path === "/services" ? (
    <Services />
  ) : path === "/projects" ? (
    <Projects open={setLight} />
  ) : path === "/bulk-orders" ? (
    <Bulk />
  ) : path === "/about" ? (
    <About />
  ) : path === "/contact" ? (
    <Contact />
  ) : (
    <Home add={add} open={setLight} />
  );
  return (
    <div>
      <Header
        path={path}
        menu={menu}
        setMenu={setMenu}
        count={count}
        open={() => setDrawer(true)}
      />
      {page}
      <Footer />
      <a
        className="float-wa"
        href={wa(
          "Hello Panashe Fencing & Hardware Solutions, I would like to make an enquiry.",
        )}
        target="_blank"
      >
        WA <b>WhatsApp</b>
      </a>
      <div className="mobile-actions">
        <a href={`tel:${CALL}`}>Call</a>
        <a
          href={wa("Hello Panashe, I would like to make an enquiry.")}
          target="_blank"
        >
          WhatsApp
        </a>
        <button onClick={() => setDrawer(true)}>
          Quote {count ? `(${count})` : ""}
        </button>
      </div>
      {drawer && (
        <Drawer q={quote} setQ={setQuote} close={() => setDrawer(false)} />
      )}{" "}
      {light && (
        <div className="lightbox" onClick={() => setLight(null)}>
          <button>
            <X />
          </button>
          <img src={light} alt="Enlarged Panashe project" />
        </div>
      )}
    </div>
  );
}
function Brand() {
  return (
    <span className="brand">
      <img
        src="/brand/panashe-logo.png"
        alt="Panashe Fencing & Hardware Solutions"
      />
    </span>
  );
}
function Header({
  path,
  menu,
  setMenu,
  count,
  open,
}: {
  path: string;
  menu: boolean;
  setMenu: (v: boolean) => void;
  count: number;
  open: () => void;
}) {
  const [hide, setHide] = useState(false),
    [scroll, setScroll] = useState(false);
  useEffect(() => {
    let last = 0;
    const f = () => {
      setScroll(scrollY > 20);
      setHide(scrollY > last && scrollY > 160);
      last = scrollY;
    };
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <header
      className={`topbar ${hide ? "hidden" : ""} ${scroll ? "scrolled" : ""}`}
    >
      <div className="nav">
        <button onClick={() => go("/")}>
          <Brand />
        </button>
        <nav>
          {nav.map(([n, p]) => (
            <button
              className={path === p ? "active" : ""}
              onClick={() => go(p)}
              key={p}
            >
              {n}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button onClick={open}>
            <ShoppingBag /> Quote {count > 0 && <em>{count}</em>}
          </button>
          <Link to="/contact" className="btn red">
            Get a quote
          </Link>
          <button className="hamb" onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menu && (
        <div className="mobile-menu">
          {nav.map(([n, p]) => (
            <button
              key={p}
              onClick={() => {
                go(p);
                setMenu(false);
              }}
            >
              {n}
              <ArrowRight />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
function Home({
  add,
  open,
}: {
  add: (id: string) => void;
  open: (s: string) => void;
}) {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Fencing materials · Gates · Installation</p>
          <h1>
            Strong fences.
            <br />
            <span>Safe spaces.</span>
            <br />
            Secure futures.
          </h1>
          <p className="lead">
            Quality fencing materials, gates and professional installation for
            homes, farms, businesses and projects across Zimbabwe.
          </p>
          <div className="buttons">
            <Link to="/products" className="btn red">
              View products <ArrowRight />
            </Link>
            <Link to="/contact" className="btn dark">
              Get a quote
            </Link>
            <a
              href={wa("Hello Panashe, I would like help with fencing.")}
              target="_blank"
            >
              WhatsApp us
            </a>
          </div>
        </div>
        <div className="hero-media">
          <img
            src="/projects/security-gate-barbed-wire.jpeg"
            alt="Panashe chain-link gate installation with barbed wire"
          />
          <aside>
            <small>01 / FIELD PROOF</small>
            <b>Installed by Panashe</b>
            <span>Real project photography</span>
          </aside>
          <i />
        </div>
      </section>
      <div className="ticker">
        DIAMOND MESH <i /> CUSTOM GATES <i /> GAME FENCE <i /> SECURITY TOPPING{" "}
        <i /> PROFESSIONAL INSTALLATION
      </div>
      <Categories />
      <section className="intro">
        <div className="intro-img">
          <img
            src="/projects/long-farm-boundary.jpeg"
            alt="Long Panashe chain-link boundary beside crops"
          />
          <b>BUILT TO LAST · MADE TO PROTECT</b>
        </div>
        <div>
          <p className="eyebrow">Panashe Fencing &amp; Hardware Solutions</p>
          <h2>
            Fencing built
            <br />
            for real conditions.
          </h2>
          <p>
            Panashe supplies reliable fencing materials and provides
            professional installations for residential, agricultural, commercial
            and project requirements.
          </p>
          <p>
            From diamond mesh and gates to security fencing, poles and
            accessories, we help customers choose practical solutions built
            around the property, purpose and budget.
          </p>
          <Link to="/about" className="text-link">
            About Panashe <ArrowRight />
          </Link>
        </div>
      </section>
      <Proof />
      <section className="section">
        <Title
          kicker="Current catalogue"
          title={
            <>
              Popular products.
              <br />
              <span>Ready for your quote.</span>
            </>
          }
          link="/products"
        />
        <div className="product-row">
          {products
            .filter((p) => p.featured)
            .slice(0, 4)
            .map((p) => (
              <Card p={p} add={add} key={p.id} />
            ))}
        </div>
      </section>
      <section className="service-story">
        <div>
          <p className="eyebrow">Supply + fabrication + installation</p>
          <h2>
            From a roll
            <br />
            to a secure line.
          </h2>
          <p>
            We define the requirement, prepare the materials and complete the
            installation.
          </p>
          <Link to="/services" className="btn white">
            Explore services
          </Link>
        </div>
        <figure>
          <img
            src="/products/large-diamond-mesh-rolls.jpeg"
            alt="Diamond mesh rolls in stock"
          />
          <img
            src="/projects/farm-chain-link-green-field.jpeg"
            alt="Completed fence line"
          />
        </figure>
      </section>
      <section className="bulk-slab">
        <div>
          <p className="eyebrow">Volume pricing</p>
          <h2>
            Bulk buy
            <br />= big savings.
          </h2>
        </div>
        <p>
          The more you buy, the more you save. For farms, contractors,
          developments and full-property projects.
        </p>
        <Link to="/bulk-orders" className="btn white">
          Request bulk quote
        </Link>
      </section>
      <section className="section">
        <Title
          kicker="Real work. Real sites."
          title={
            <>
              Work built
              <br />
              <span>to last.</span>
            </>
          }
          link="/projects"
        />
        <div className="masonry">
          {pics.slice(0, 6).map(([s, t, c], i) => (
            <button className={`tile t${i}`} key={s} onClick={() => open(s)}>
              <img src={s} alt={t} />
              <span>
                <small>{c}</small>
                <b>{t}</b>
              </span>
            </button>
          ))}
        </div>
      </section>
      <Process />
      <Location />
      <Final />
    </main>
  );
}
function Categories() {
  const c = [
    ["Diamond mesh fencing", "/products/diamond-mesh-yard-stock.jpeg"],
    ["Razor & barbed wire", "/projects/security-gate-barbed-wire.jpeg"],
    ["Electric fencing", "/brand/bulk-buy-flyer.jpeg"],
    ["Poles & accessories", "/products/galvanised-gate-frames.jpeg"],
    ["Gates & installations", "/projects/custom-double-gate.jpeg"],
    ["Game / security fencing", "/projects/game-fence-installation.jpeg"],
    ["Hardware & other stock", "/products/office-chairs.jpeg"],
  ];
  return (
    <section className="section">
      <Title
        kicker="What we supply"
        title={
          <>
            The right material.
            <br />
            <span>The right boundary.</span>
          </>
        }
      />
      <div className="category-rail">
        {c.map((x, i) => (
          <button onClick={() => go("/products")} key={x[0]}>
            <img src={x[1]} alt="" />
            <span>
              <em>0{i + 1}</em>
              <b>{x[0]}</b>
              <small>View products</small>
              <ArrowRight />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
const claims = [
  "Maximum security",
  "Heavy-duty materials",
  "Built to withstand all conditions",
  "Professional installation",
  "Bulk order savings",
  "Custom fencing solutions",
];
function Proof() {
  return (
    <section className="proof">
      <div>
        <p className="eyebrow">Why Panashe</p>
        <h2>
          Practical protection.
          <br />
          No empty claims.
        </h2>
      </div>
      <ol>
        {claims.map((x, i) => (
          <li key={x}>
            <span>0{i + 1}</span>
            <b>{x}</b>
            <Check />
          </li>
        ))}
      </ol>
    </section>
  );
}
function Catalogue({ add }: { add: (id: string) => void }) {
  const [q, setQ] = useState(""),
    [cat, setCat] = useState("All"),
    [sort, setSort] = useState("Featured");
  const list = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (cat === "All" || p.category === cat) &&
            `${p.name} ${p.category} ${p.specification || ""}`
              .toLowerCase()
              .includes(q.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "Price Low to High"
            ? a.currentPrice - b.currentPrice
            : sort === "Price High to Low"
              ? b.currentPrice - a.currentPrice
              : Number(b.featured) - Number(a.featured),
        ),
    [q, cat, sort],
  );
  return (
    <main className="catalogue">
      <section className="catalogue-head">
        <div>
          <p className="eyebrow">15 current listings · Quote, don’t checkout</p>
          <h1>
            Find the fence.
            <br />
            <span>Build the quote.</span>
          </h1>
        </div>
        <img
          src="/products/diamond-mesh-rolls-stock.jpeg"
          alt="Diamond mesh rolls"
        />
      </section>
      <section className="controls">
        <label>
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, heights, categories…"
          />
        </label>
        <label>
          <SlidersHorizontal />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Featured</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
            <option>Newest</option>
          </select>
        </label>
      </section>
      <div className="chips">
        {categories.map((x) => (
          <button
            className={cat === x ? "active" : ""}
            onClick={() => setCat(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <section className="catalogue-grid">
        {list.map((p) => (
          <Card key={p.id} p={p} add={add} />
        ))}
      </section>
      {!list.length && (
        <div className="empty">
          <Search />
          <h2>No matching products</h2>
          <button
            className="btn dark"
            onClick={() => {
              setQ("");
              setCat("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
function Card({ p, add }: { p: Product; add: (id: string) => void }) {
  return (
    <article className="product">
      <button className="p-img" onClick={() => go(`/products/${p.slug}`)}>
        <img src={p.images[0]} alt={p.name} />
        <span>{p.category}</span>
      </button>
      <div>
        <small>{p.specification || "Specification available on request"}</small>
        <h3>{p.name}</h3>
        <p className="price">
          <b>{money(p.currentPrice)}</b>
          {p.oldPrice && <del>{money(p.oldPrice)}</del>}
          <em>{p.unit || "unit not confirmed"}</em>
        </p>
        <div className="p-actions">
          <button onClick={() => add(p.id)}>
            <Plus /> Add to quote
          </button>
          <button onClick={() => go(`/products/${p.slug}`)}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </article>
  );
}
function Detail({ slug, add }: { slug: string; add: (id: string) => void }) {
  const p = products.find((x) => x.slug === slug);
  const [qty, setQty] = useState(1);
  if (!p)
    return (
      <main className="empty">
        <h1>Product not found.</h1>
        <Link to="/products" className="btn dark">
          Back to products
        </Link>
      </main>
    );
  return (
    <main className="detail">
      <button className="back" onClick={() => go("/products")}>
        <ChevronLeft /> Product catalogue
      </button>
      <section>
        <div className="detail-gallery">
          {p.images.map((x) => (
            <img src={x} alt={p.name} key={x} />
          ))}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <p className="big-price">
            <b>{money(p.currentPrice)}</b>
            {p.oldPrice && <del>{money(p.oldPrice)}</del>}
          </p>
          <p>{p.description}</p>
          <dl>
            <div>
              <dt>Specification</dt>
              <dd>{p.specification || "Confirm with Panashe"}</dd>
            </div>
            <div>
              <dt>Price unit</dt>
              <dd>{p.unit || "Not confirmed in source catalogue"}</dd>
            </div>
            <div>
              <dt>Bulk price</dt>
              <dd>{p.bulkAvailable ? "Available on request" : "Ask sales"}</dd>
            </div>
          </dl>
          <div className="qty">
            <span>Quantity</span>
            <button onClick={() => setQty(Math.max(1, qty - 1))}>
              <Minus />
            </button>
            <b>{qty}</b>
            <button onClick={() => setQty(qty + 1)}>
              <Plus />
            </button>
          </div>
          <button
            className="btn red full"
            onClick={() => {
              for (let i = 0; i < qty; i++) add(p.id);
            }}
          >
            Add {qty} to quote
          </button>
          <a
            className="btn dark full"
            href={wa(
              `Hello Panashe, I would like to order ${p.name} × ${qty}. Please confirm the price unit and availability.`,
            )}
            target="_blank"
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
function Services() {
  const s = [
    [
      "Fence supply",
      "Materials selected around the property, purpose and requested budget.",
      "/products/diamond-mesh-yard-stock.jpeg",
    ],
    [
      "Fence installation",
      "Professional boundary installation for homes, farms, businesses and projects.",
      "/projects/farm-chain-link-green-field.jpeg",
    ],
    [
      "Gate fabrication / installation",
      "Sliding, pedestrian and double-gate solutions fabricated for access requirements.",
      "/projects/custom-double-gate.jpeg",
    ],
    [
      "Game fencing",
      "Open-land and agricultural fencing with practical post and mesh systems.",
      "/projects/game-fence-installation.jpeg",
    ],
    [
      "Security fencing",
      "Diamond mesh, barbed-wire topping and related security boundary work.",
      "/projects/security-gate-barbed-wire.jpeg",
    ],
    [
      "Custom fencing projects",
      "A supply-and-install approach for projects that do not fit a catalogue item.",
      "/projects/urban-chain-link-detail.jpeg",
    ],
  ];
  return (
    <main>
      <section className="page-head services-head">
        <div>
          <p className="eyebrow">Services</p>
          <h1>
            One boundary.
            <br />
            <span>Every stage.</span>
          </h1>
          <p>Supply, fabrication and installation—built around the site.</p>
        </div>
        <img
          src="/products/galvanised-gate-frames.jpeg"
          alt="Galvanised gate frames"
        />
      </section>
      <section className="service-list">
        {s.map((x, i) => (
          <article className={i % 2 ? "reverse" : ""} key={x[0]}>
            <em>0{i + 1}</em>
            <img src={x[2]} alt={x[0]} />
            <div>
              <p className="eyebrow">Supply / install</p>
              <h2>{x[0]}</h2>
              <p>{x[1]}</p>
              <b>Homes · Farms · Businesses · Projects</b>
              <Link to="/contact" className="btn dark">
                Get a quote
              </Link>
            </div>
          </article>
        ))}
      </section>
      <Process />
      <Final />
    </main>
  );
}
function Projects({ open }: { open: (s: string) => void }) {
  const [f, setF] = useState("All"),
    fs = [
      "All",
      "Residential",
      "Commercial",
      "Agricultural",
      "Gates",
      "Material supply",
      "Installations",
    ];
  const shown = pics.filter((x) => f === "All" || x[2] === f);
  return (
    <main>
      <section className="projects-head">
        <p className="eyebrow">Installed, fabricated and supplied by Panashe</p>
        <h1>
          Proof is in
          <br />
          <span>the fence line.</span>
        </h1>
        <p>Real photographs from real materials and project sites.</p>
      </section>
      <div className="chips project-chips">
        {fs.map((x) => (
          <button
            key={x}
            className={f === x ? "active" : ""}
            onClick={() => setF(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <section className="gallery">
        {shown.map(([s, t, c], i) => (
          <button className={`g${i % 5}`} key={s} onClick={() => open(s)}>
            <img src={s} alt={t} />
            <span>
              <small>{c}</small>
              <b>{t}</b>
              <em>
                View project <Plus />
              </em>
            </span>
          </button>
        ))}
      </section>
      <Final />
    </main>
  );
}
function Field({
  n,
  l,
  type = "text",
  req = false,
}: {
  n: string;
  l: string;
  type?: string;
  req?: boolean;
}) {
  return (
    <label>
      {l}
      <input name={n} type={type} required={req} />
    </label>
  );
}
function Bulk() {
  return (
    <main>
      <section className="bulk-hero">
        <img src="/brand/bulk-buy-flyer.jpeg" alt="Panashe bulk-buy flyer" />
        <div>
          <p className="eyebrow">Volume orders</p>
          <h1>
            Buy more.
            <br />
            <span>Save more.</span>
          </h1>
          <p>
            Bulk-order pricing across selected fencing materials, gates, poles
            and accessories.
          </p>
          <a className="btn white" href="#bulk-form">
            Request bulk quote
          </a>
        </div>
      </section>
      <div className="audience">
        {[
          "Farms",
          "Homes",
          "Businesses",
          "Contractors",
          "Developments",
          "Projects",
        ].map((x, i) => (
          <div key={x}>
            <span>0{i + 1}</span>
            <b>{x}</b>
          </div>
        ))}
      </div>
      <section id="bulk-form" className="form-section">
        <div>
          <p className="eyebrow">Tell us the scale</p>
          <h2>
            Build a bulk
            <br />
            order request.
          </h2>
          <p>
            Send an approximate quantity. Panashe will confirm the exact details
            and applicable price unit.
          </p>
        </div>
        <Form bulk />
      </section>
    </main>
  );
}
function Form({ bulk = false }: { bulk?: boolean }) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    open(
      wa(
        `Hello Panashe,\nName: ${d.get("name")}\nPhone: ${d.get("phone")}\nLocation: ${d.get("location")}\nNeed: ${d.get("need") || d.get("product")}\nQuantity: ${d.get("quantity") || ""}\nInstallation: ${d.get("install") || ""}\nMessage: ${d.get("message")}`,
      ),
      "_blank",
    );
  };
  return (
    <form onSubmit={submit} className="form-grid">
      <Field n="name" l="Name" req />
      <Field n="company" l="Company" />
      <Field n="phone" l="Phone / WhatsApp" req />
      <Field n="email" l="Email" type="email" />
      <Field n="location" l="Location" req />
      {bulk ? (
        <>
          <Field n="product" l="Product" req />
          <Field n="quantity" l="Approximate quantity" req />
          <Field n="type" l="Project type" />
          <label>
            Installation required?
            <select name="install">
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
        </>
      ) : (
        <label className="wide">
          What do you need?
          <select name="need">
            <option>Fencing Materials</option>
            <option>Fence Installation</option>
            <option>Gate</option>
            <option>Electric Fence</option>
            <option>Security Fence</option>
            <option>Bulk Order</option>
            <option>Hardware</option>
            <option>Other</option>
          </select>
        </label>
      )}
      <label className="wide">
        Message
        <textarea name="message" rows={5} required />
      </label>
      <button className="btn red wide">
        {bulk ? "Request quote" : "Send enquiry"} <ArrowRight />
      </button>
    </form>
  );
}
function About() {
  return (
    <main>
      <section className="page-head about-head">
        <div>
          <p className="eyebrow">About Panashe</p>
          <h1>
            Built around
            <br />
            <span>security &amp; reliability.</span>
          </h1>
        </div>
        <img
          src="/projects/open-land-chain-link.jpeg"
          alt="Panashe fence installation"
        />
      </section>
      <section className="about-story">
        <div>
          <b>144</b>
          <small>
            Daniel St
            <br />
            Harare
          </small>
        </div>
        <div>
          <p className="lead">
            Panashe Fencing &amp; Hardware Solutions serves customers looking
            for practical, durable fencing materials and professional
            installation.
          </p>
          <p>
            We supply products for homes, farms, businesses and projects while
            also providing custom gate and fencing installation services.
          </p>
          <p>
            For products with incomplete specifications in the source catalogue,
            our sales team confirms the exact unit and requirement before
            quoting.
          </p>
        </div>
      </section>
      <section className="source">
        <img
          src="/brand/whatsapp-profile.jpeg"
          alt="Panashe WhatsApp business profile"
        />
        <div>
          <p className="eyebrow">A real local business</p>
          <h2>
            Made visible.
            <br />
            Made easier to reach.
          </h2>
          <p>
            This site extends the company’s existing catalogue into a clearer
            product, quote and project experience.
          </p>
        </div>
      </section>
      <section className="catalogue-proof">
        <div>
          <p className="eyebrow">Where the catalogue began</p>
          <h2>
            Existing stock.
            <br />
            <span>A clearer way to browse.</span>
          </h2>
          <p>
            The website preserves the products and visible pricing already
            shared through the company’s WhatsApp catalogue.
          </p>
        </div>
        <div>
          {[
            "/brand/business-details.jpeg",
            "/products/catalogue-top.jpeg",
            "/products/catalogue-gates.jpeg",
            "/products/catalogue-installations.jpeg",
          ].map((s, i) => (
            <img
              key={s}
              src={s}
              alt={`Panashe source catalogue view ${i + 1}`}
            />
          ))}
        </div>
      </section>
      <Proof />
      <Final />
    </main>
  );
}
function Contact() {
  return (
    <main>
      <section className="contact-head">
        <div>
          <p className="eyebrow">Contact Panashe</p>
          <h1>
            Tell us what
            <br />
            <span>you need secured.</span>
          </h1>
        </div>
        <div className="contact-cards">
          <a href={`tel:+${PHONE}`}>
            <Phone />
            <span>
              WhatsApp / primary<b>+263 77 439 0516</b>
            </span>
          </a>
          <a href={`tel:${CALL}`}>
            <Phone />
            <span>
              Call-only sales line<b>{CALL}</b>
            </span>
          </a>
          <a href="mailto:panashepetani4@gmail.com">
            <Mail />
            <span>
              Email<b>panashepetani4@gmail.com</b>
            </span>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=144+Daniel+St+Harare+Zimbabwe"
            target="_blank"
          >
            <MapPin />
            <span>
              Directions<b>144 Daniel St, Harare</b>
            </span>
          </a>
        </div>
      </section>
      <section className="contact-layout">
        <Form />
        <div className="map-card">
          <MapPin />
          <h2>144 Daniel St</h2>
          <p>Harare, Zimbabwe</p>
          <a
            className="btn dark"
            target="_blank"
            href="https://www.google.com/maps/search/?api=1&query=144+Daniel+St+Harare+Zimbabwe"
          >
            Get directions <ExternalLink />
          </a>
          <p>
            <b>Business hours</b>
            <br />
            Listed as open 24 hours. Please call to confirm availability.
          </p>
        </div>
      </section>
    </main>
  );
}
function Process() {
  return (
    <section className="section process">
      <Title
        kicker="How it works"
        title={
          <>
            From need
            <br />
            <span>to installed.</span>
          </>
        }
      />
      <div>
        {[
          [
            "01",
            "Tell us what you need",
            "Send measurements, location or product requirements.",
          ],
          [
            "02",
            "Get a quote",
            "We confirm materials, quantities, installation and pricing.",
          ],
          [
            "03",
            "Supply / install",
            "Materials are supplied or our team completes the installation.",
          ],
          [
            "04",
            "Project complete",
            "The fencing or gate is checked and handed over.",
          ],
        ].map((x) => (
          <article key={x[0]}>
            <span>{x[0]}</span>
            <h3>{x[1]}</h3>
            <p>{x[2]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function Location() {
  return (
    <section className="location">
      <div className="map-grid">
        <MapPin />
        <b>144 Daniel St</b>
        <span>Harare · Zimbabwe</span>
      </div>
      <div>
        <p className="eyebrow">Visit or enquire</p>
        <h2>
          A direct line
          <br />
          to Panashe.
        </h2>
        <a href={`tel:+${PHONE}`}>+263 77 439 0516</a>
        <a href="mailto:panashepetani4@gmail.com">panashepetani4@gmail.com</a>
        <a
          className="btn dark"
          target="_blank"
          href="https://www.google.com/maps/search/?api=1&query=144+Daniel+St+Harare+Zimbabwe"
        >
          Get directions
        </a>
      </div>
    </section>
  );
}
function Final() {
  return (
    <section className="final">
      <p className="eyebrow">Your next project starts here</p>
      <h2>
        Need fencing
        <br />
        <span>for your next project?</span>
      </h2>
      <p>
        From a few metres to a full property or bulk material order, tell us
        what you need.
      </p>
      <div className="buttons">
        <Link to="/contact" className="btn white">
          Get a quote
        </Link>
        <a
          className="btn outline"
          href={wa("Hello Panashe, I need fencing for my next project.")}
          target="_blank"
        >
          WhatsApp us
        </a>
        <a href={`tel:${CALL}`}>Call sales</a>
      </div>
    </section>
  );
}
function Title({
  kicker,
  title,
  link,
}: {
  kicker: string;
  title: React.ReactNode;
  link?: string;
}) {
  return (
    <div className="title">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-link">
          View all <ArrowRight />
        </Link>
      )}
    </div>
  );
}
function Drawer({
  q,
  setQ,
  close,
}: {
  q: Record<string, number>;
  setQ: (q: Record<string, number>) => void;
  close: () => void;
}) {
  const lines = Object.entries(q)
    .map(([id, n]) => [products.find((p) => p.id === id), n] as const)
    .filter((x) => x[0]);
  const msg = `Hello Panashe Fencing & Hardware Solutions,\n\nI'd like a quotation for:\n\n${lines.map(([p, n]) => `- ${p!.name} × ${n}`).join("\n")}\n\nName:\nLocation:\nAdditional details:`;
  return (
    <div className="backdrop" onClick={close}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>
          <X />
        </button>
        <p className="eyebrow">Quote basket</p>
        <h2>Your project list.</h2>
        {lines.length ? (
          <>
            <div className="quote-lines">
              {lines.map(([p, n]) => (
                <div key={p!.id}>
                  <img src={p!.images[0]} alt="" />
                  <span>
                    <b>{p!.name}</b>
                    <small>{money(p!.currentPrice)} · unit to confirm</small>
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        setQ({ ...q, [p!.id]: Math.max(1, n - 1) })
                      }
                    >
                      <Minus />
                    </button>
                    <b>{n}</b>
                    <button onClick={() => setQ({ ...q, [p!.id]: n + 1 })}>
                      <Plus />
                    </button>
                    <button
                      onClick={() => {
                        const z = { ...q };
                        delete z[p!.id];
                        setQ(z);
                      }}
                    >
                      <X />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <a className="btn red full" href={wa(msg)} target="_blank">
              Request quote on WhatsApp
            </a>
            <p>
              Prices and units are confirmed by Panashe before an order is
              final.
            </p>
          </>
        ) : (
          <div className="empty">
            <ShoppingBag />
            <h3>Your quote is empty</h3>
            <button
              className="btn dark"
              onClick={() => {
                close();
                go("/products");
              }}
            >
              Browse products
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <Brand />
        <p>
          Strong fences.
          <br />
          Safe spaces.
          <br />
          Secure futures.
        </p>
        <div>
          {nav.slice(1).map(([n, p]) => (
            <button onClick={() => go(p)} key={p}>
              {n}
            </button>
          ))}
        </div>
        <address>
          <a href={`tel:+${PHONE}`}>+263 77 439 0516</a>
          <a href={`tel:${CALL}`}>{CALL}</a>
          <a href="mailto:panashepetani4@gmail.com">panashepetani4@gmail.com</a>
          <span>144 Daniel St, Harare</span>
        </address>
      </div>
      <div className="footer-base">
        <span>© 2026 Panashe Fencing &amp; Hardware Solutions</span>
        <a href="https://wa.me/263789937251" target="_blank">
          Website built &amp; developed by Jaeger Media
        </a>
      </div>
    </footer>
  );
}
