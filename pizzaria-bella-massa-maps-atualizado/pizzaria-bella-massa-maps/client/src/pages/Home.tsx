import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bike,
  Box,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type AppMode = "login" | "welcome" | "shop" | "owner";
type ShopView = "menu" | "cart" | "checkout" | "confirmed";
type OwnerView =
  | "overview"
  | "orders"
  | "products"
  | "addons"
  | "promos"
  | "finance"
  | "settings";
type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
  active: boolean;
  featured?: boolean;
  kind?: string;
};
type Addon = {
  id: string;
  name: string;
  price: number;
  free: boolean;
  active: boolean;
  category: string;
};
type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  details?: string[];
  image?: string;
};
type Order = {
  id: string;
  time: string;
  customer: string;
  items: string;
  total: number;
  status: string;
  payment: string;
  change?: string;
  delivery: string;
  date?: string;
  phone?: string;
  address?: string;
  number?: string;
  neighborhood?: string;
  location?: GeoLocation;
};
type BusinessSettings = {
  name: string;
  whatsapp: string;
  deliveryWhatsapp: string;
  address: string;
  hours: string;
  pixKey: string;
  deliveryFee: number;
  icon: string;
  iconImage?: string;
};
type Promotion = {
  name: string;
  detail: string;
  price: string;
  active: boolean;
  image: string;
};
type GeoLocation = { latitude: number; longitude: number; accuracy?: number };
type CheckoutData = {
  name: string;
  phone: string;
  address: string;
  number: string;
  neighborhood: string;
  payment: string;
  change?: string;
  delivery: string;
  location?: GeoLocation | null;
};
type LocalUser = {
  id: string;
  name: string;
  identifier: string;
  password: string;
  role: "merchant" | "client";
};

const STORAGE = {
  products: "bella-massa-demo-v2-products",
  addons: "bella-massa-demo-v2-addons",
  orders: "bella-massa-demo-v2-orders",
  storeOpen: "bella-massa-demo-v2-open",
  business: "bella-massa-demo-v2-business",
  users: "bella-massa-demo-v2-users",
  session: "bella-massa-demo-v2-session",
};
const DEMO_NOTICE =
  "Demonstração segura: nenhum pedido, pagamento ou mensagem real será enviado.";
const initialBusiness: BusinessSettings = {
  name: "Pizzaria Bella Massa",
  whatsapp: "5500000000000",
  deliveryWhatsapp: "5500000000000",
  address: "Rua Exemplo, 100 · Centro · Cidade Modelo",
  hours: "Todos os dias · 18h às 23h",
  pixKey: "pix.demo@bellamassa.invalid",
  deliveryFee: 5,
  icon: "BM",
};
const initialUsers: LocalUser[] = [
  {
    id: "merchant-demo",
    name: "Comerciante Bella Massa",
    identifier: "comerciante",
    password: "1234",
    role: "merchant",
  },
];
const IMG = {
  hero: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663948755379/SveEEKrtjMHHgWWL.jpg",
  tradicional:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663948755379/GvzzBjanqpqiKaym.jpg",
  especial:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663948755379/IxNVXFoxIAjMcXBz.jpg",
  doce: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663948755379/xXcdgxMyAgnWIBtP.jpg",
  combo:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663948755379/CypkJMgSGaHdvqap.jpg",
};

const initialProducts: Product[] = [
  {
    id: "calabresa",
    name: "Pizza Calabresa",
    category: "Pizzas Tradicionais",
    description: "Calabresa fatiada, cebola e mozzarella derretida",
    price: 39.9,
    image: IMG.tradicional,
    tag: "Mais pedida",
    active: true,
    featured: true,
    kind: "produto",
  },
  {
    id: "mussarela",
    name: "Pizza Mussarela",
    category: "Pizzas Tradicionais",
    description: "Molho de tomate, mozzarella e orégano",
    price: 37.9,
    image: IMG.tradicional,
    active: true,
    kind: "produto",
  },
  {
    id: "frango",
    name: "Frango com Catupiry",
    category: "Pizzas Especiais",
    description: "Frango desfiado, catupiry cremoso e orégano",
    price: 46.9,
    image: IMG.especial,
    tag: "Favorita",
    active: true,
    featured: true,
    kind: "produto",
  },
  {
    id: "portuguesa",
    name: "Pizza Portuguesa",
    category: "Pizzas Especiais",
    description: "Presunto, ovos, cebola, ervilha e mozzarella",
    price: 45.9,
    image: IMG.especial,
    active: true,
    kind: "produto",
  },
  {
    id: "marguerita",
    name: "Pizza Marguerita",
    category: "Pizzas Especiais",
    description: "Mozzarella, tomate, manjericão e azeite",
    price: 44.9,
    image: IMG.tradicional,
    active: true,
    kind: "produto",
  },
  {
    id: "chocolate",
    name: "Pizza de Chocolate",
    category: "Pizzas Doces",
    description: "Chocolate cremoso e raspas de chocolate",
    price: 42.9,
    image: IMG.doce,
    tag: "Doce da casa",
    active: true,
    kind: "produto",
  },
  {
    id: "bebidas",
    name: "Bebidas geladas",
    category: "Bebidas",
    description: "Refrigerante ou suco para acompanhar",
    price: 8.9,
    image: IMG.combo,
    active: true,
    kind: "produto",
  },
  {
    id: "combo",
    name: "Combo Bella Massa",
    category: "Combos",
    description: "Pizza grande + bebida 2L",
    price: 54.9,
    image: IMG.combo,
    tag: "Economize",
    active: true,
    featured: true,
    kind: "combo",
  },
];
const initialAddons: Addon[] = [
  {
    id: "borda",
    name: "Borda recheada",
    price: 8,
    free: false,
    active: true,
    category: "Adicionais",
  },
  {
    id: "queijo",
    name: "Queijo extra",
    price: 5,
    free: false,
    active: true,
    category: "Adicionais",
  },
  {
    id: "bacon",
    name: "Bacon crocante",
    price: 6,
    free: false,
    active: true,
    category: "Adicionais",
  },
  {
    id: "molho-alho",
    name: "Molho de alho",
    price: 2.5,
    free: false,
    active: true,
    category: "Molhos",
  },
  {
    id: "molho-pimenta",
    name: "Molho de pimenta",
    price: 2.5,
    free: false,
    active: true,
    category: "Molhos",
  },
  {
    id: "azeite",
    name: "Azeite temperado",
    price: 2,
    free: true,
    active: true,
    category: "Molhos",
  },
];
const initialOrders: Order[] = [
  {
    id: "#1048",
    time: "20:32",
    customer: "Marina Alves",
    items: "Pizza Grande Calabresa + borda recheada",
    total: 52.9,
    status: "Em preparo",
    payment: "Pix",
    delivery: "Entrega",
  },
  {
    id: "#1047",
    time: "20:18",
    customer: "Rafael Lima",
    items: "Combo Bella Massa",
    total: 54.9,
    status: "Novo",
    payment: "Cartão",
    delivery: "Retirada",
  },
  {
    id: "#1046",
    time: "19:54",
    customer: "Joana Souza",
    items: "Frango com Catupiry + queijo extra",
    total: 51.9,
    status: "Pronto",
    payment: "Pix",
    delivery: "Entrega",
  },
  {
    id: "#1045",
    time: "19:21",
    customer: "Lucas Martins",
    items: "Pizza Média Mussarela",
    total: 35.9,
    status: "Entregue",
    payment: "Dinheiro",
    delivery: "Retirada",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}
function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function openDeliveryRoute(order: Order) {
  if (order.delivery !== "Entrega") {
    toast.info("Este pedido é para retirada no balcão");
    return;
  }
  const hasCoordinates =
    Number.isFinite(order.location?.latitude) &&
    Number.isFinite(order.location?.longitude);
  const destination = hasCoordinates
    ? `${order.location!.latitude},${order.location!.longitude}`
    : [order.address, order.number, order.neighborhood]
        .filter(Boolean)
        .join(", ");
  if (!destination) {
    toast.error("Este pedido não tem endereço ou localização para a rota");
    return;
  }
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function pixPayload(total: number, key: string) {
  return `00020126580014BR.GOV.BCB.PIX01${String(key.length).padStart(2, "0")}${key}520400005303986540${total.toFixed(2)}5802BR5914BELLA MASSA6009SAO PAULO62070503***6304DEMO`;
}
function playNewOrderSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      980,
      context.currentTime + 0.12
    );
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.52);
    window.setTimeout(() => context.close(), 700);
  } catch {
    /* browsers may block audio until the owner interacts */
  }
}

function Brand({
  dark = false,
  name = initialBusiness.name,
  icon = initialBusiness.icon,
  iconImage,
}: {
  dark?: boolean;
  name?: string;
  icon?: string;
  iconImage?: string;
}) {
  return (
    <div className="brand-lockup">
      <div
        className={cn(
          "brand-mark",
          dark && "brand-mark-dark",
          iconImage && "brand-mark-image"
        )}
      >
        {iconImage ? <img src={iconImage} alt="" /> : icon}
      </div>
      <div>
        <strong className={dark ? "text-white" : ""}>{name}</strong>
        <small className={dark ? "text-white/55" : ""}>sabor que reúne</small>
      </div>
    </div>
  );
}
function StatusPill({ open }: { open: boolean }) {
  return (
    <span className={cn("status-pill", open ? "status-open" : "status-closed")}>
      <span className="status-dot" />
      {open ? "Aberto agora" : "Fechado agora"}
    </span>
  );
}
function IconButton({
  label,
  onClick,
  children,
  badge,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button aria-label={label} className="icon-button" onClick={onClick}>
      {children}
      {badge ? <span className="button-badge">{badge}</span> : null}
    </button>
  );
}
function SectionLabel({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() =>
    readStorage<LocalUser | null>(STORAGE.session, null)
  );
  const [mode, setMode] = useState<AppMode>(() => {
    const session = readStorage<LocalUser | null>(STORAGE.session, null);
    return session?.role === "merchant"
      ? "owner"
      : session?.role === "client"
        ? "shop"
        : "login";
  });
  const [users, setUsers] = useState<LocalUser[]>(() =>
    readStorage(STORAGE.users, initialUsers)
  );
  const [shopView, setShopView] = useState<ShopView>("menu");
  const [ownerView, setOwnerView] = useState<OwnerView>("overview");
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage(STORAGE.products, initialProducts)
  );
  const [addons, setAddons] = useState<Addon[]>(() =>
    readStorage(STORAGE.addons, initialAddons)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    readStorage(STORAGE.orders, initialOrders).map(order => ({
      ...order,
      status:
        order.status === "Novo" || order.status === "Pronto"
          ? "Em preparo"
          : order.status,
    }))
  );
  const [storeOpen, setStoreOpen] = useState(() =>
    readStorage<boolean>(STORAGE.storeOpen, true)
  );
  const [business, setBusiness] = useState<BusinessSettings>(() => ({
    ...initialBusiness,
    ...readStorage<Partial<BusinessSettings>>(STORAGE.business, {}),
  }));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE.products, JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(STORAGE.addons, JSON.stringify(addons));
  }, [addons]);
  useEffect(() => {
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem(STORAGE.storeOpen, JSON.stringify(storeOpen));
  }, [storeOpen]);
  useEffect(() => {
    localStorage.setItem(STORAGE.business, JSON.stringify(business));
  }, [business]);
  useEffect(() => {
    const syncOrders = (event: StorageEvent) => {
      if (event.key !== STORAGE.orders || !event.newValue) return;
      try {
        setOrders(JSON.parse(event.newValue) as Order[]);
      } catch {
        /* ignore malformed demo data */
      }
    };
    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, []);

  const addToCart = (
    product: Product,
    details: string[] = [],
    extra = 0,
    quantity = 1
  ) => {
    setCart(current => [
      ...current,
      {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price + extra,
        quantity,
        details,
        image: product.image,
      },
    ]);
    setConfigProduct(null);
    setCartOpen(true);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const updateQuantity = (id: string, amount: number) =>
    setCart(items =>
      items
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  const resetDemo = () => {
    setProducts(initialProducts);
    setAddons(initialAddons);
    setOrders(initialOrders);
    setStoreOpen(true);
    setBusiness(initialBusiness);
    toast.success("Dados demonstrativos restaurados");
  };
  const login = (identifier: string, password: string) => {
    const normalized = identifier.trim().toLowerCase();
    const user = users.find(
      item =>
        item.identifier.toLowerCase() === normalized &&
        item.password === password
    );
    if (!user)
      return toast.error("Login inválido", {
        description: "Confira seu usuário e senha.",
      });
    setCurrentUser(user);
    localStorage.setItem(STORAGE.session, JSON.stringify(user));
    setMode(user.role === "merchant" ? "owner" : "shop");
    setShopView("menu");
    setOwnerView("overview");
    toast.success(
      user.role === "merchant"
        ? "Painel do comércio aberto"
        : `Olá, ${user.name.split(" ")[0]}!`
    );
  };
  const registerClient = (
    name: string,
    identifier: string,
    password: string
  ) => {
    const normalized = identifier.trim().toLowerCase();
    if (users.some(item => item.identifier.toLowerCase() === normalized))
      return toast.error("Este usuário já está cadastrado");
    const user: LocalUser = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      identifier: normalized,
      password,
      role: "client",
    };
    setUsers(current => [...current, user]);
    setCurrentUser(user);
    localStorage.setItem(STORAGE.session, JSON.stringify(user));
    setMode("shop");
    setShopView("menu");
    toast.success("Conta criada", {
      description: "Você já pode escolher seus produtos.",
    });
  };
  const logout = () => {
    localStorage.removeItem(STORAGE.session);
    setCurrentUser(null);
    setMode("login");
    setShopView("menu");
    setCart([]);
    toast.success("Sessão encerrada");
  };

  const supportWhatsApp = () => {
    const phone = business.whatsapp.replace(/\D/g, "");
    if (!phone)
      return toast.error("O WhatsApp de suporte ainda não foi configurado");
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(`Olá! Preciso de suporte com meu pedido na ${business.name}.`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  if (mode === "login")
    return (
      <LoginScreen
        business={business}
        users={users}
        onLogin={login}
        onRegister={registerClient}
      />
    );
  if (mode === "welcome")
    return (
      <Welcome
        business={business}
        onClient={() => {
          setMode("shop");
          setShopView("menu");
        }}
        onOwner={() => setMode("owner")}
      />
    );
  if (mode === "owner")
    return (
      <OwnerApp
        business={business}
        setBusiness={setBusiness}
        products={products}
        setProducts={setProducts}
        addons={addons}
        setAddons={setAddons}
        orders={orders}
        setOrders={setOrders}
        storeOpen={storeOpen}
        setStoreOpen={setStoreOpen}
        view={ownerView}
        setView={setOwnerView}
        onExit={logout}
        onReset={resetDemo}
      />
    );
  return (
    <ShopApp
      business={business}
      orders={orders}
      setOrders={setOrders}
      deliveryFee={business.deliveryFee}
      storeOpen={storeOpen}
      onSupport={supportWhatsApp}
      products={products}
      addons={addons}
      cart={cart}
      cartCount={cartCount}
      cartTotal={cartTotal}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      onOpenConfig={setConfigProduct}
      onAdd={addToCart}
      configProduct={configProduct}
      onCloseConfig={() => setConfigProduct(null)}
      updateQuantity={updateQuantity}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      view={shopView}
      setView={setShopView}
      onBack={logout}
      onConfirm={data => {
        if (!storeOpen)
          return toast.error("O estabelecimento está fechado", {
            description: `Retornamos em: ${business.hours}`,
          });
        const total =
          cartTotal + (data.delivery === "Entrega" ? business.deliveryFee : 0);
        const order: Order = {
          id: `#${1050 + orders.length}`,
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          customer: data.name || "Cliente Bella Massa",
          items: cart.map(item => `${item.quantity}x ${item.name}`).join(", "),
          total,
          status: "Em preparo",
          payment: data.payment,
          change: data.change,
          delivery: data.delivery,
          date: new Date().toISOString().slice(0, 10),
          phone: data.phone,
          address: data.address,
          number: data.number,
          neighborhood: data.neighborhood,
          location: data.location || undefined,
        };
        const whatsappMessage = [
          `Olá! Quero fazer um pedido na ${business.name}.`,
          ``,
          `Pedido ${order.id}`,
          ...cart.map(
            item =>
              `- ${item.quantity}x ${item.name}${item.details?.length ? ` (${item.details.slice(0, 4).join(", ")})` : ""}`
          ),
          ``,
          `Total: ${money(total)}`,
          `Recebimento: ${data.delivery}`,
          data.address
            ? `Endereço: ${data.address}${data.number ? `, ${data.number}` : ""}${data.neighborhood ? ` · ${data.neighborhood}` : ""}`
            : "",
          data.location
            ? `Localização: https://www.google.com/maps?q=${data.location.latitude},${data.location.longitude}`
            : "",
          `Pagamento: ${data.payment}`,
          data.change ? `Troco para: ${data.change}` : "",
          data.phone ? `WhatsApp: ${data.phone}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        setOrders(current => [order, ...current]);
        toast.success("Pedido simulado com sucesso", {
          description: "Nenhuma mensagem foi enviada para o WhatsApp.",
        });
        setCart([]);
        setShopView("confirmed");
        setCartOpen(false);
      }}
      notice={notice}
      setNotice={setNotice}
    />
  );
}

function LoginScreen({
  business,
  users,
  onLogin,
  onRegister,
}: {
  business: BusinessSettings;
  users: LocalUser[];
  onLogin: (identifier: string, password: string) => void;
  onRegister: (name: string, identifier: string, password: string) => void;
}) {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (registering) {
      if (!name.trim() || !identifier.trim() || password.length < 4)
        return toast.error(
          "Preencha nome, usuário e uma senha com 4 caracteres ou mais"
        );
      onRegister(name, identifier, password);
    } else {
      if (!identifier.trim() || !password)
        return toast.error("Informe usuário e senha");
      onLogin(identifier, password);
    }
  };
  const merchant = users.find(user => user.role === "merchant");
  return (
    <div className="login-page">
      <div className="login-glow" />
      <main className="login-shell">
        <section className="login-brand-side">
          <Brand
            dark
            name={business.name}
            icon={business.icon}
            iconImage={business.iconImage}
          />
          <span className="eyebrow light-eyebrow">
            pedido simples, gestão tranquila
          </span>
          <h1>
            Seu pedido começa <em>aqui.</em>
          </h1>
          <p>
            Entre para escolher sua pizza ou acessar o painel de administração
            do comércio.
          </p>
          <div className="login-benefits">
            <span>
              <Check size={15} /> Cardápio rápido no celular
            </span>
            <span>
              <Bike size={15} /> Entrega ou retirada
            </span>
            <span>
              <Store size={15} /> Painel separado para o comércio
            </span>
          </div>
        </section>
        <section className="login-card">
          <div className="login-card-head">
            <span className="eyebrow">acesso local</span>
            <h2>
              {registering ? "Criar conta de cliente" : "Entrar na Bella Massa"}
            </h2>
            <p>
              {registering
                ? "Cadastre apenas os dados necessários para começar."
                : "O mesmo login identifica automaticamente cliente e comerciante."}
            </p>
          </div>
          <div className="login-tabs">
            <button
              className={!registering ? "active" : ""}
              onClick={() => setRegistering(false)}
            >
              Entrar
            </button>
            <button
              className={registering ? "active" : ""}
              onClick={() => setRegistering(true)}
            >
              Criar conta
            </button>
          </div>
          <form className="login-form" onSubmit={submit}>
            {registering && (
              <label>
                Seu nome
                <input
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Como podemos te chamar?"
                  autoComplete="name"
                />
              </label>
            )}
            <label>
              Usuário ou WhatsApp
              <input
                value={identifier}
                onChange={event => setIdentifier(event.target.value)}
                placeholder="ex.: seu nome ou telefone"
                autoComplete="username"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Mínimo de 4 caracteres"
                autoComplete={registering ? "new-password" : "current-password"}
              />
            </label>
            <button className="primary-button full" type="submit">
              {registering ? "Criar conta e entrar" : "Entrar"}
              <ArrowRight size={17} />
            </button>
          </form>
          {!registering && merchant && (
            <div className="login-demo-hint">
              <strong>Acesso do comerciante para teste</strong>
              <span>
                Usuário: <b>{merchant.identifier}</b> · Senha:{" "}
                <b>{merchant.password}</b>
              </span>
            </div>
          )}
          <small className="login-local-note">
            <Sparkles size={13} /> Login local deste dispositivo · os dados
            ficam no localStorage
          </small>
        </section>
      </main>
      <footer className="login-footer">
        {business.name} · {business.address}
      </footer>
    </div>
  );
}

function Welcome({
  business,
  onClient,
  onOwner,
}: {
  business: BusinessSettings;
  onClient: () => void;
  onOwner: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="welcome-page">
      <div className="welcome-texture" />
      <div className="demo-safety-bar demo-safety-bar-dark">
        <Sparkles size={13} /> Ambiente demonstrativo · nenhum dado real ou
        mensagem será enviado
      </div>
      <header className="welcome-nav">
        <Brand
          dark
          name={business.name}
          icon={business.icon}
          iconImage={business.iconImage}
        />
        <div className="nav-mini">
          <span className="nav-note">
            <Sparkles size={14} /> modelo demonstrativo
          </span>
          <button className="ghost-light" onClick={() => setShowInfo(true)}>
            Como funciona <ArrowRight size={15} />
          </button>
          <button className="nav-owner-button" onClick={onOwner}>
            <Store size={15} /> Sou comerciante
          </button>
        </div>
      </header>
      <main className="welcome-main">
        <section className="welcome-copy">
          <div className="welcome-kicker">
            <span /> um sabor que reúne todo mundo
          </div>
          <h1>
            Sua pizza,
            <br />
            <em>do seu jeito.</em>
          </h1>
          <p>
            Um modelo simples e gostoso de pedir, feito para aproximar a
            Pizzaria Bella Massa de quem ama uma pizza artesanal.
          </p>
          <div className="welcome-actions">
            <button className="primary-button large" onClick={onClient}>
              Ver cardápio <ArrowRight size={18} />
            </button>
          </div>
          <div className="welcome-trust">
            <span>
              <Check size={15} /> sem cadastro
            </span>
            <span>
              <Bike size={15} /> entrega ou retirada
            </span>
            <span>
              <MessageCircle size={15} /> pedido simulado
            </span>
          </div>
        </section>
        <section className="welcome-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="hero-bowl">
            <img src={IMG.hero} alt="Pizza com pizza artesanal" />
            <div className="hero-sticker">
              <Heart size={15} fill="currentColor" />
              <span>feito com carinho</span>
            </div>
          </div>
          <div className="floating-note top">
            <span className="mini-icon purple">
              <Zap size={14} />
            </span>
            <div>
              <b>Monte como quiser</b>
              <small>sabores + bordas + molhos</small>
            </div>
          </div>
          <div className="floating-note bottom">
            <span className="mini-icon coral">
              <Clock3 size={14} />
            </span>
            <div>
              <b>Pronto rapidinho</b>
              <small>em média 25 min</small>
            </div>
          </div>
        </section>
      </main>
      <footer className="welcome-footer">
        <span>{business.address}</span>
        <span className="footer-line" />
        <span>{business.hours}</span>
        <span className="footer-line" />
        <span>{business.name}</span>
      </footer>
      {showInfo && (
        <div className="modal-backdrop" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>
              <X size={18} />
            </button>
            <span className="eyebrow">um jeitinho diferente</span>
            <h2>
              O cliente pede.
              <br />
              <em>A proprietária cuida.</em>
            </h2>
            <div className="info-steps">
              <div>
                <b>01</b>
                <strong>Cardápio sem login</strong>
                <p>A pessoa entra, escolhe e monta o pizza sem barreiras.</p>
              </div>
              <div>
                <b>02</b>
                <strong>Pedido em poucos toques</strong>
                <p>Entrega ou retirada, Pix ou cartão — tudo simples.</p>
              </div>
              <div>
                <b>03</b>
                <strong>Gestão em uma só tela</strong>
                <p>Produtos, pedidos e financeiro no painel da loja.</p>
              </div>
            </div>
            <button
              className="primary-button full"
              onClick={() => {
                setShowInfo(false);
                onClient();
              }}
            >
              Quero ver o cardápio <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopApp({
  business,
  orders,
  setOrders,
  deliveryFee,
  storeOpen,
  onSupport,
  products,
  addons,
  cart,
  cartCount,
  cartTotal,
  selectedCategory,
  setSelectedCategory,
  onOpenConfig,
  onAdd,
  configProduct,
  onCloseConfig,
  updateQuantity,
  cartOpen,
  setCartOpen,
  view,
  setView,
  onBack,
  onConfirm,
  notice,
  setNotice,
}: {
  business: BusinessSettings;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  deliveryFee: number;
  storeOpen: boolean;
  onSupport: () => void;
  products: Product[];
  addons: Addon[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  onOpenConfig: (p: Product) => void;
  onAdd: (p: Product, d?: string[], e?: number) => void;
  configProduct: Product | null;
  onCloseConfig: () => void;
  updateQuantity: (id: string, n: number) => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  view: ShopView;
  setView: (v: ShopView) => void;
  onBack: () => void;
  onConfirm: (data: CheckoutData) => void;
  notice: string;
  setNotice: (s: string) => void;
}) {
  const categories = [
    "Todos",
    "Pizzas Tradicionais",
    "Pizzas Especiais",
    "Pizzas Doces",
    "Bebidas",
    "Combos",
  ];
  const [myOrdersOpen, setMyOrdersOpen] = useState(false);
  const filtered = products.filter(
    p =>
      p.active &&
      (selectedCategory === "Todos" || p.category === selectedCategory)
  );
  if (view === "checkout")
    return (
      <Checkout
        business={business}
        deliveryFee={deliveryFee}
        cart={cart}
        subtotal={cartTotal}
        storeOpen={storeOpen}
        onBack={() => setView("cart")}
        onConfirm={onConfirm}
      />
    );
  if (view === "confirmed")
    return <Confirmation onHome={() => setView("menu")} />;
  return (
    <div className="shop-shell">
      <header className="shop-header">
        <div className="demo-safety-bar">
          <Sparkles size={13} /> Ambiente demonstrativo · dados e pedidos
          fictícios
        </div>
        <div className="shop-header-inner">
          <button className="back-brand" onClick={onBack}>
            <span className="small-mark">{business.icon}</span>
            <span>
              <b>{business.name}</b>
              <small>sabor que reúne</small>
            </span>
          </button>
          <nav className="shop-nav">
            <a href="#cardapio">Cardápio</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#localizacao">Onde estamos</a>
          </nav>
          <div className="shop-actions">
            <StatusPill open={storeOpen} />
            <IconButton
              label="Falar com suporte pelo WhatsApp"
              onClick={onSupport}
            >
              <MessageCircle size={19} />
            </IconButton>
            <>
              <button
                className="orders-trigger"
                onClick={() => setMyOrdersOpen(true)}
              >
                <ReceiptText size={17} />
                <span>Meus pedidos</span>
              </button>
              <button
                className="cart-trigger"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBasket size={18} />
                <span>Ver Carrinho</span>
                {cartCount > 0 && <b>{cartCount}</b>}
              </button>
            </>
          </div>
        </div>
      </header>
      <main className="shop-main">
        <section className="shop-hero">
          <div className="shop-hero-copy">
            <span className="eyebrow light-eyebrow">
              o forno da praça acendeu
            </span>
            <h1>
              Monte sua pizza
              <br />
              <em>do seu jeito.</em>
            </h1>
            <p>
              Escolha a base, combine seus favoritos e receba uma pizza
              quentinha onde estiver.
            </p>
            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("cardapio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Pedir agora <ArrowRight size={17} />
            </button>
            <div className="hero-meta">
              <span>
                <Check size={14} /> ingredientes frescos
              </span>
              <span>
                <Clock3 size={14} /> 25–40 min
              </span>
            </div>
          </div>
          <div className="shop-hero-image">
            <img src={IMG.hero} alt="Pizza artesanal da Bella Massa" />
            <div className="hero-caption">
              <Sparkles size={15} />
              <span>o favorito da casa</span>
            </div>
          </div>
        </section>
        <div className="promo-strip">
          <div className="promo-copy">
            <span className="promo-label">PROMO DA CASA</span>
            <strong>Pizza Grande + bebida</strong>
            <span>
              por apenas <b>R$ 54,90</b>
            </span>
          </div>
          <button
            onClick={() => {
              const p = products.find(x => x.id === "calabresa");
              if (p) onOpenConfig(p);
            }}
          >
            Aproveitar <ArrowRight size={16} />
          </button>
        </div>
        <section className="menu-section" id="cardapio">
          <SectionLabel
            eyebrow="escolha seu sabor"
            title="Qual vai ser a sua hoje?"
            action={
              <div className="menu-search">
                <Search size={16} />
                <input
                  placeholder="Buscar no cardápio"
                  onChange={e => setNotice(e.target.value)}
                />
                <span>{notice ? `buscando “${notice}”` : ""}</span>
              </div>
            }
          />
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {(category === "Pizzas Tradicionais" ||
                  category === "Pizzas Especiais") && (
                  <span>{category === "Pizzas Tradicionais" ? 2 : 3}</span>
                )}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filtered
              .filter(
                p =>
                  !notice || p.name.toLowerCase().includes(notice.toLowerCase())
              )
              .map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() =>
                    product.category.includes("Pizzas")
                      ? onOpenConfig(product)
                      : onAdd(product)
                  }
                />
              ))}
          </div>
        </section>
        <section className="build-banner">
          <div className="build-orb" />
          <div>
            <span className="eyebrow">liberdade em cada fatia</span>
            <h2>
              Do seu jeito,
              <br />
              <em>sem complicar.</em>
            </h2>
            <p>
              Escolha tamanho, sabor e adicionais e deixe a gente cuidar do
              resto.
            </p>
          </div>
          <div className="build-list">
            <span>
              <i>01</i> Escolha o tamanho
            </span>
            <span>
              <i>02</i> Combine os sabores
            </span>
            <span>
              <i>03</i> Receba sorrindo
            </span>
          </div>
          <button
            className="outline-button light"
            onClick={() => {
              const p = products.find(x => x.id === "calabresa");
              if (p) onOpenConfig(p);
            }}
          >
            Montar minha pizza <ArrowRight size={16} />
          </button>
        </section>
        <section className="service-section" id="como-funciona">
          <SectionLabel eyebrow="é só seguir o fluxo" title="Como funciona" />
          <div className="service-grid">
            <div className="service-card">
              <span>01</span>
              <ShoppingBag size={23} />
              <h3>Escolha seus favoritos</h3>
              <p>Explore o cardápio e encontre seu próximo pedido.</p>
            </div>
            <div className="service-card">
              <span>02</span>
              <Sparkles size={23} />
              <h3>Monte do seu jeito</h3>
              <p>Personalize sua pizza com sabores, bordas e molhos.</p>
            </div>
            <div className="service-card">
              <span>03</span>
              <Bike size={23} />
              <h3>Receba ou retire</h3>
              <p>
                Você escolhe: entregamos na sua porta ou deixamos pronto no
                balcão.
              </p>
            </div>
          </div>
        </section>
        <footer className="shop-footer" id="localizacao">
          <div>
            <Brand
              name={business.name}
              icon={business.icon}
              iconImage={business.iconImage}
            />
            <p>
              Uma pizza quentinha feita com carinho
              <br />
              no coração do bairro.
            </p>
          </div>
          <div className="footer-column">
            <b>Atendimento</b>
            <span>{business.hours}</span>
            <a
              href="#demo"
              onClick={event => {
                event.preventDefault();
                toast.info(DEMO_NOTICE);
              }}
            >
              WhatsApp demonstrativo
            </a>
          </div>
          <div className="footer-column">
            <b>Onde estamos</b>
            <span>{business.address}</span>
            <a href="#localizacao">
              <MapPin size={14} /> Ver no mapa
            </a>
          </div>
          <div className="footer-bottom">
            © 2026 Pizzaria Bella Massa <span>sabor que reúne.</span>
          </div>
        </footer>
      </main>
      {myOrdersOpen && (
        <MyOrdersDrawer
          orders={orders}
          setOrders={setOrders}
          onClose={() => setMyOrdersOpen(false)}
        />
      )}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          total={cartTotal}
          storeOpen={storeOpen}
          hours={business.hours}
          onClose={() => setCartOpen(false)}
          updateQuantity={updateQuantity}
          onCheckout={() => {
            if (!cart.length) return toast.error("Seu carrinho está vazio");
            if (!storeOpen)
              return toast.error("O estabelecimento está fechado", {
                description: `Retornamos em: ${business.hours}`,
              });
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}
      {configProduct && (
        <Configurator
          product={configProduct}
          addons={addons}
          onClose={onCloseConfig}
          onAdd={onAdd}
        />
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <div className="product-image-fade" />
        {product.tag && (
          <span
            className={cn(
              "product-tag",
              product.tag === "Promoção" && "promo-tag"
            )}
          >
            {product.tag}
          </span>
        )}
        <button
          aria-label={`Adicionar ${product.name}`}
          className="quick-add"
          onClick={onAdd}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="product-card-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-card-bottom">
          <strong>{money(product.price)}</strong>
          <button onClick={onAdd}>
            {product.category.includes("Pizzas") ? "Montar" : "Adicionar"}{" "}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Configurator({
  product,
  addons,
  onClose,
  onAdd,
}: {
  product: Product;
  addons: Addon[];
  onClose: () => void;
  onAdd: (p: Product, d: string[], e: number, q?: number) => void;
}) {
  const [size, setSize] = useState("Média");
  const [flavor, setFlavor] = useState(product.name.replace("Pizza ", ""));
  const [selected, setSelected] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const sizeExtra =
    size === "Broto"
      ? -8
      : size === "Grande"
        ? 10
        : size === "Família"
          ? 20
          : 0;
  const picked = addons.filter(a => selected.includes(a.id));
  const extra = picked.reduce((sum, a) => sum + a.price, 0) + sizeExtra;
  const flavors = [
    "Calabresa",
    "Mussarela",
    "Frango com Catupiry",
    "Portuguesa",
    "Marguerita",
    "Chocolate",
  ];
  const toggle = (id: string) =>
    setSelected(items =>
      items.includes(id) ? items.filter(x => x !== id) : [...items, id]
    );
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="config-modal" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <div>
            <span className="eyebrow">personalize sua pizza</span>
            <h2>{product.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <div className="config-scroll">
          <div className="config-step">
            <div className="step-title">
              <b>01</b>
              <div>
                <strong>Escolha o tamanho</strong>
                <small>do seu apetite para a ocasião</small>
              </div>
            </div>
            <div className="choice-grid">
              {["Broto", "Média", "Grande", "Família"].map(value => (
                <button
                  key={value}
                  className={size === value ? "choice active" : "choice"}
                  onClick={() => setSize(value)}
                >
                  <strong>{value}</strong>
                  <span>
                    {value === "Média"
                      ? "padrão"
                      : size === value
                        ? sizeExtra >= 0
                          ? `+ ${money(sizeExtra)}`
                          : `- ${money(Math.abs(sizeExtra))}`
                        : value === "Broto"
                          ? "- R$ 8,00"
                          : value === "Grande"
                            ? "+ R$ 10,00"
                            : "+ R$ 20,00"}
                  </span>
                  {size === value && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
          <div className="config-step">
            <div className="step-title">
              <b>02</b>
              <div>
                <strong>Escolha o sabor</strong>
                <small>um clássico da Bella Massa</small>
              </div>
            </div>
            <div className="option-list">
              {flavors.map(value => (
                <button
                  key={value}
                  className="option-row"
                  onClick={() => setFlavor(value)}
                >
                  <span
                    className={cn("radio-dot", flavor === value && "active")}
                  />
                  Pizza {value}
                  {flavor === value && (
                    <Check size={15} className="option-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="config-step">
            <div className="step-title">
              <b>03</b>
              <div>
                <strong>
                  Adicionais <em>opcionais</em>
                </strong>
                <small>borda, queijo, bacon e molhos</small>
              </div>
            </div>
            <div className="addon-grid">
              {addons
                .filter(a => a.active)
                .map(addon => (
                  <button
                    key={addon.id}
                    className={cn(
                      "addon-chip",
                      selected.includes(addon.id) && "active"
                    )}
                    onClick={() => toggle(addon.id)}
                  >
                    <span>
                      {addon.name}{" "}
                      <small>
                        {addon.price ? `+ ${money(addon.price)}` : "grátis"}
                      </small>
                    </span>
                    {selected.includes(addon.id) ? (
                      <Check size={15} />
                    ) : (
                      <Plus size={15} />
                    )}
                  </button>
                ))}
            </div>
          </div>
          <div className="config-step observation">
            <div className="step-title">
              <b>04</b>
              <div>
                <strong>Quantidade e observação</strong>
                <small>opcional</small>
              </div>
            </div>
            <div className="quantity config-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>
            <textarea
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Ex.: capricha no orégano, por favor :)"
            />
          </div>
        </div>
        <div className="config-footer">
          <div>
            <small>total do item</small>
            <strong>{money((product.price + extra) * quantity)}</strong>
          </div>
          <button
            className="primary-button"
            onClick={() =>
              onAdd(
                product,
                [
                  size,
                  `Sabor: ${flavor}`,
                  ...picked.map(x => x.name),
                  observation,
                ].filter(Boolean),
                extra,
                quantity
              )
            }
          >
            Adicionar ao pedido <Plus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MyOrdersDrawer({
  orders,
  setOrders,
  onClose,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onClose: () => void;
}) {
  const confirmDelivered = (order: Order) => {
    setOrders(current =>
      current.map(item =>
        item.id === order.id ? { ...item, status: "Concluído" } : item
      )
    );
    toast.success("Recebimento confirmado", {
      description: "O pedido foi concluído.",
    });
  };
  const mine = orders.filter(order =>
    ["Em preparo", "Saiu para entrega", "Concluído"].includes(order.status)
  );
  return (
    <div className="drawer-layer" onClick={onClose}>
      <aside
        className="cart-drawer orders-drawer"
        onClick={e => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <span className="eyebrow">acompanhe seu pedido</span>
            <h2>
              Meus pedidos{" "}
              <span>
                {mine.length
                  ? `${mine.length} ${mine.length === 1 ? "pedido" : "pedidos"}`
                  : "está vazio"}
              </span>
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        {mine.length ? (
          <div className="drawer-items">
            {mine.map(order => (
              <div className="my-order-card" key={order.id}>
                <div className="order-card-top">
                  <b>{order.id}</b>
                  <small>{order.time}</small>
                </div>
                <strong>{order.customer}</strong>
                <p>{order.items}</p>
                <div className="order-card-meta">
                  <span>{order.status}</span>
                  <span>{money(order.total)}</span>
                </div>
                {order.status === "Saiu para entrega" && (
                  <button
                    className="primary-button full"
                    onClick={() => confirmDelivered(order)}
                  >
                    Pedido entregue <Check size={16} />
                  </button>
                )}
                {order.status === "Concluído" && (
                  <small className="done-note">Recebimento confirmado</small>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-icon">
              <ReceiptText size={25} />
            </div>
            <h3>Nenhum pedido ativo</h3>
            <p>Seus pedidos aparecerão aqui durante o preparo e a entrega.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function CartDrawer({
  cart,
  total,
  storeOpen,
  hours,
  onClose,
  updateQuantity,
  onCheckout,
}: {
  cart: CartItem[];
  total: number;
  storeOpen: boolean;
  hours: string;
  onClose: () => void;
  updateQuantity: (id: string, n: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="drawer-layer" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow">seu pedido</span>
            <h2>
              Minha sacola{" "}
              <span>
                {cart.length
                  ? `${cart.length} ${cart.length === 1 ? "item" : "itens"}`
                  : "está vazia"}
              </span>
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        {cart.length ? (
          <>
            <div className="drawer-items">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image || IMG.tradicional} alt="" />
                  <div className="cart-item-main">
                    <strong>{item.name}</strong>
                    <small>{item.details?.slice(0, 3).join(" · ")}</small>
                    <b>{money(item.price * item.quantity)}</b>
                  </div>
                  <div className="quantity">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={13} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-summary">
              {!storeOpen && (
                <div className="store-closed-notice">
                  <Store size={16} />
                  <span>
                    <b>Estabelecimento fechado</b>
                    <small>Retornamos a {hours}</small>
                  </span>
                </div>
              )}
              <div>
                <span>Subtotal</span>
                <b>{money(total)}</b>
              </div>
              <div>
                <span>Taxa de entrega</span>
                <b className="muted">calculada no próximo passo</b>
              </div>
              <div className="summary-total">
                <span>Total do pedido</span>
                <strong>{money(total)}</strong>
              </div>
              <button className="primary-button full" onClick={onCheckout}>
                Continuar pedido <ArrowRight size={17} />
              </button>
              <small className="drawer-note">
                <LockIcon /> você ainda pode revisar tudo antes de enviar
              </small>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-icon">
              <ShoppingBasket size={25} />
            </div>
            <h3>Seu pedido começa aqui</h3>
            <p>Que tal montar uma pizza bem do seu jeito?</p>
            <button className="outline-button" onClick={onClose}>
              Voltar ao cardápio
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
function LockIcon() {
  return <span className="lock-icon">✓</span>;
}

function Checkout({
  business,
  deliveryFee,
  cart,
  subtotal,
  storeOpen,
  onBack,
  onConfirm,
}: {
  business: BusinessSettings;
  deliveryFee: number;
  cart: CartItem[];
  subtotal: number;
  storeOpen: boolean;
  onBack: () => void;
  onConfirm: (data: CheckoutData) => void;
}) {
  const [delivery, setDelivery] = useState("Entrega");
  const [paymentTiming, setPaymentTiming] = useState("Agora");
  const [payment, setPayment] = useState("Pix");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [change, setChange] = useState("");
  const [copied, setCopied] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationState, setLocationState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("error");
      toast.error("Seu navegador não oferece localização");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationState("ready");
        toast.success("Localização adicionada ao pedido");
      },
      () => {
        setLocationState("error");
        toast.error("Não foi possível obter sua localização");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };
  const configuredDeliveryFee = Number.isFinite(deliveryFee) ? deliveryFee : 5;
  const fee = delivery === "Entrega" ? configuredDeliveryFee : 0;
  const total = subtotal + fee;
  const canSubmit = Boolean(
    storeOpen &&
      name.trim() &&
      phone.trim() &&
      (delivery === "Retirada" || (address.trim() && number.trim() && location))
  );
  const submitOrder = () => {
    if (!storeOpen)
      return toast.error("O estabelecimento está fechado", {
        description: `Retornamos em: ${business.hours}`,
      });
    if (!name.trim() || !phone.trim())
      return toast.error("Preencha seu nome e WhatsApp");
    if (delivery === "Entrega" && (!address.trim() || !number.trim()))
      return toast.error("Preencha endereço e número para a entrega");
    if (delivery === "Entrega" && !location)
      return toast.error("Compartilhe sua localização para a entrega");
    onConfirm({
      name,
      phone,
      address,
      number,
      neighborhood,
      change: payment === "Dinheiro" ? change : undefined,
      payment:
        paymentTiming === "Agora"
          ? "Pix (pago agora)"
          : `${payment} (pagar na entrega)`,
      delivery,
      location,
    });
  };
  const payload = pixPayload(total, business.pixKey);
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(payload)}&size=220&margin=1`;
  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success("Código Pix copiado");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Não foi possível copiar automaticamente");
    }
  };
  return (
    <div className="checkout-page">
      <header className="simple-header">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={17} /> Voltar para o pedido
        </button>
        <Brand
          name={business.name}
          icon={business.icon}
          iconImage={business.iconImage}
        />
      </header>
      <main className="checkout-main">
        <div className="checkout-title">
          <span className="eyebrow">quase lá</span>
          <h1>Finalizar pedido</h1>
          <p>Sem cadastro. Só o necessário para a gente cuidar da sua pausa.</p>
        </div>
        <div className="checkout-grid">
          <section className="checkout-form">
            <div className="form-card">
              <div className="form-card-title">
                <span>01</span>
                <div>
                  <h3>Como você quer receber?</h3>
                  <p>Escolha a opção mais confortável</p>
                </div>
              </div>
              <div className="delivery-toggle">
                <button
                  className={delivery === "Entrega" ? "active" : ""}
                  onClick={() => setDelivery("Entrega")}
                >
                  <Bike size={19} />
                  <span>
                    <b>Entrega</b>
                    <small>em até 40 min</small>
                  </span>
                </button>
                <button
                  className={delivery === "Retirada" ? "active" : ""}
                  onClick={() => setDelivery("Retirada")}
                >
                  <Store size={19} />
                  <span>
                    <b>Retirar no balcão</b>
                    <small>em até 25 min</small>
                  </span>
                </button>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-title">
                <span>02</span>
                <div>
                  <h3>Seus dados</h3>
                  <p>Para a gente te encontrar</p>
                </div>
              </div>
              <div className="form-grid">
                <label>
                  Seu nome
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </label>
                {delivery === "Entrega" && (
                  <>
                    <label className="wide">
                      Endereço
                      <input
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Rua, avenida..."
                      />
                    </label>
                    <label>
                      Número
                      <input
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                        placeholder="123"
                      />
                    </label>
                    <label>
                      Bairro
                      <input
                        value={neighborhood}
                        onChange={e => setNeighborhood(e.target.value)}
                        placeholder="Seu bairro"
                      />
                    </label>
                    <div className="location-card">
                      <div className="location-card-copy">
                        <MapPin size={17} />
                        <span>
                          <b>Localização para entrega</b>
                          <small>
                            {locationState === "ready"
                              ? "Localização adicionada ao pedido."
                              : "Ajuda a encontrar você com mais precisão."}
                          </small>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="outline-button small"
                        onClick={requestLocation}
                        disabled={locationState === "loading"}
                      >
                        {locationState === "loading"
                          ? "Obtendo..."
                          : locationState === "ready"
                            ? "Atualizar localização"
                            : "Compartilhar localização"}
                      </button>
                      {locationState === "error" && (
                        <small className="location-error">
                          Permita o acesso à localização no navegador e tente
                          novamente.
                        </small>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-title">
                <span>03</span>
                <div>
                  <h3>Forma de pagamento</h3>
                  <p>Você paga na entrega ou retirada</p>
                </div>
              </div>
              <div className="payment-timing">
                <span className="payment-label">Quando você quer pagar?</span>
                <div className="payment-timing-options">
                  <button
                    className={paymentTiming === "Agora" ? "active" : ""}
                    onClick={() => {
                      setPaymentTiming("Agora");
                      setPayment("Pix");
                    }}
                  >
                    <Zap size={16} />
                    <span>
                      <b>Pagar agora</b>
                      <small>Pix com confirmação</small>
                    </span>
                  </button>
                  <button
                    className={paymentTiming === "Na entrega" ? "active" : ""}
                    onClick={() => {
                      setPaymentTiming("Na entrega");
                      setPayment("Dinheiro");
                    }}
                  >
                    <ReceiptText size={16} />
                    <span>
                      <b>Pagar na entrega</b>
                      <small>Dinheiro, Pix ou cartão</small>
                    </span>
                  </button>
                </div>
              </div>
              {paymentTiming === "Na entrega" && (
                <div className="payment-options">
                  {["Dinheiro", "Pix", "Cartão na entrega"].map(option => (
                    <button
                      key={option}
                      className={payment === option ? "active" : ""}
                      onClick={() => setPayment(option)}
                    >
                      {option === "Dinheiro" ? (
                        <ReceiptText size={18} />
                      ) : option === "Pix" ? (
                        <Zap size={18} />
                      ) : (
                        <CreditCard size={18} />
                      )}
                      <span>{option}</span>
                      {payment === option && <Check size={15} />}
                    </button>
                  ))}
                </div>
              )}
              {paymentTiming === "Agora" && (
                <div className="pix-card">
                  <div className="pix-copy">
                    <div className="pix-title">
                      <Zap size={16} />
                      <b>Pix copia e cola</b>
                      <span>pagamento demonstrativo</span>
                    </div>
                    <p>
                      Escaneie o QR Code ou copie a chave abaixo para simular o
                      pagamento.
                    </p>
                    <div className="pix-key">
                      <code>{payload}</code>
                      <button onClick={copyPix}>
                        {copied ? <Check size={15} /> : <CopyIcon size={15} />}
                        {copied ? "Copiado" : "Copiar código"}
                      </button>
                    </div>
                    <small>
                      Chave Pix da loja: <b>{business.pixKey}</b>
                    </small>
                    <small className="pix-demo-note">
                      Pagamento demonstrativo · o cliente informa a opção
                      escolhida no pedido.
                    </small>
                  </div>
                  <img
                    className="pix-qr"
                    src={qrUrl}
                    alt="QR Code Pix demonstrativo"
                  />
                </div>
              )}
              {payment === "Dinheiro" && (
                <input
                  className="change-input"
                  value={change}
                  onChange={e => setChange(e.target.value)}
                  inputMode="decimal"
                  placeholder="Troco para quanto? (opcional)"
                />
              )}
            </div>
          </section>
          <aside className="checkout-summary">
            <div className="summary-card">
              <span className="eyebrow">resumo da sacola</span>
              <h3>Seu pedido</h3>
              {cart.map(item => (
                <div className="summary-item" key={item.id}>
                  <span>
                    <b>{item.quantity}x</b> {item.name}
                    <small>{item.details?.slice(0, 2).join(" · ")}</small>
                  </span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>
                <div>
                  <span>Entrega</span>
                  <b>{fee ? money(fee) : "Grátis"}</b>
                </div>
              </div>
              <div className="big-total">
                <span>Total</span>
                <strong>{money(total)}</strong>
              </div>
              <button
                className="primary-button full"
                disabled={!canSubmit}
                onClick={submitOrder}
              >
                Simular pedido <MessageCircle size={17} />
              </button>
              <small className="whatsapp-hint">
                <MessageCircle size={13} /> resumo simulado · nenhum envio
                externo
              </small>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
function CopyIcon({ size }: { size: number }) {
  return <span style={{ fontSize: size }}>⧉</span>;
}

function Confirmation({ onHome }: { onHome: () => void }) {
  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-mark">
          <Check size={28} />
        </div>
        <span className="eyebrow">pedido recebido</span>
        <h1>
          Já começamos
          <br />
          <em>a preparar.</em>
        </h1>
        <p>
          O pedido foi registrado no protótipo e a loja já pode acompanhar tudo
          pelo painel da proprietária.
        </p>
        <div className="confirmation-detail">
          <span>
            <Clock3 size={17} /> tempo estimado
          </span>
          <b>25–40 min</b>
        </div>
        <button className="primary-button full" onClick={onHome}>
          Voltar ao cardápio <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function OwnerApp({
  business,
  setBusiness,
  products,
  setProducts,
  addons,
  setAddons,
  orders,
  setOrders,
  storeOpen,
  setStoreOpen,
  view,
  setView,
  onExit,
  onReset,
}: {
  business: BusinessSettings;
  setBusiness: React.Dispatch<React.SetStateAction<BusinessSettings>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addons: Addon[];
  setAddons: React.Dispatch<React.SetStateAction<Addon[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  storeOpen: boolean;
  setStoreOpen: (b: boolean) => void;
  view: OwnerView;
  setView: (v: OwnerView) => void;
  onExit: () => void;
  onReset: () => void;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(orders.length);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  useEffect(() => {
    if (orders.length > lastOrderCount) {
      setNewOrderAlert(orders[0]);
      playNewOrderSound();
      setLastOrderCount(orders.length);
    }
  }, [orders.length, lastOrderCount]);
  const nav: Array<{ id: OwnerView; label: string; icon: React.ReactNode }> = [
    {
      id: "overview",
      label: "Visão geral",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "orders", label: "Pedidos", icon: <ReceiptText size={18} /> },
    { id: "products", label: "Produtos", icon: <Box size={18} /> },
    { id: "addons", label: "Adicionais", icon: <Sparkles size={18} /> },
    { id: "promos", label: "Promoções", icon: <Tag size={18} /> },
    { id: "finance", label: "Financeiro", icon: <BarChart3 size={18} /> },
  ];
  const viewTitle: Record<OwnerView, string> = {
    overview: "Visão geral",
    orders: "Pedidos",
    products: "Produtos",
    addons: "Adicionais",
    promos: "Promoções",
    finance: "Financeiro",
    settings: "Configurações",
  };
  return (
    <div className="owner-shell">
      <aside className={cn("owner-sidebar", mobileNav && "mobile-open")}>
        <div className="owner-brand">
          <Brand
            dark
            name={business.name}
            icon={business.icon}
            iconImage={business.iconImage}
          />
          <button className="sidebar-close" onClick={() => setMobileNav(false)}>
            <X size={18} />
          </button>
        </div>
        <button
          className="owner-context"
          onClick={() => setProfileMenu(value => !value)}
        >
          <span className="owner-avatar">AP</span>
          <div>
            <b>Administração</b>
            <small>modo proprietária</small>
          </div>
          <ChevronDown size={15} />
        </button>
        {profileMenu && (
          <div className="profile-menu">
            <button
              onClick={() => {
                setView("settings");
                setProfileMenu(false);
              }}
            >
              <Settings size={14} /> Editar dados do comércio
            </button>
            <button onClick={onExit}>
              <LogOut size={14} /> Sair do painel
            </button>
          </div>
        )}
        <nav className="owner-nav">
          <span className="owner-nav-label">GESTÃO DA LOJA</span>
          {nav.map(item => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => {
                setView(item.id);
                setMobileNav(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "orders" && (
                <b className="nav-count">
                  {orders.filter(o => o.status === "Em preparo").length}
                </b>
              )}
            </button>
          ))}
          <span className="owner-nav-label spaced">SISTEMA</span>
          <button
            className={view === "settings" ? "active" : ""}
            onClick={() => {
              setView("settings");
              setMobileNav(false);
            }}
          >
            <Settings size={18} />
            <span>Configurações</span>
          </button>
        </nav>
        <div className="sidebar-store-status">
          <span
            className={storeOpen ? "store-status-icon on" : "store-status-icon"}
          >
            <Store size={17} />
          </span>
          <div>
            <small>status da loja</small>
            <strong>
              {storeOpen ? "Aberta e recebendo" : "Fechada no momento"}
            </strong>
          </div>
          <button onClick={() => setStoreOpen(!storeOpen)}>
            {storeOpen ? "Fechar" : "Abrir"}
          </button>
        </div>
        <button className="owner-logout" onClick={onExit}>
          <LogOut size={17} /> Sair do painel
        </button>
      </aside>
      <div className="owner-content">
        {newOrderAlert && (
          <NewOrderAlert
            order={newOrderAlert}
            onClose={() => setNewOrderAlert(null)}
            onOpenOrders={() => {
              setNewOrderAlert(null);
              setView("orders");
            }}
          />
        )}
        <header className="owner-topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)}>
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Painel</span>
            <ArrowRight size={13} />
            <b>{viewTitle[view]}</b>
          </div>
          <div className="topbar-actions">
            <button
              className="store-switch"
              onClick={() => setStoreOpen(!storeOpen)}
            >
              <span className={storeOpen ? "pulse-dot" : "pulse-dot off"} />
              {storeOpen ? "Loja aberta" : "Loja fechada"}
              <ChevronDown size={14} />
            </button>
            <IconButton label="Notificações">
              <Bell size={19} />
            </IconButton>
            <button
              className="top-avatar top-avatar-button"
              aria-label="Abrir configurações do perfil"
              onClick={() => setView("settings")}
            >
              DA
            </button>
          </div>
        </header>
        <main className="owner-main">
          {view === "overview" && (
            <Overview
              orders={orders}
              storeOpen={storeOpen}
              setStoreOpen={setStoreOpen}
              onOrders={() => setView("orders")}
              onAddProduct={() => {
                setEditProduct(null);
                setShowProductForm(true);
              }}
            />
          )}
          {view === "orders" && (
            <OrdersPage orders={orders} setOrders={setOrders} />
          )}
          {view === "products" && (
            <ProductsPage
              products={products}
              setProducts={setProducts}
              onAdd={() => {
                setEditProduct(null);
                setShowProductForm(true);
              }}
              onEdit={p => {
                setEditProduct(p);
                setShowProductForm(true);
              }}
            />
          )}
          {view === "addons" && (
            <AddonsPage addons={addons} setAddons={setAddons} />
          )}
          {view === "promos" && <PromosPage products={products} />}
          {view === "finance" && <FinancePage orders={orders} />}
          {view === "settings" && (
            <SettingsPage
              business={business}
              setBusiness={setBusiness}
              storeOpen={storeOpen}
              setStoreOpen={setStoreOpen}
              onReset={onReset}
            />
          )}
        </main>
      </div>
      {showProductForm && (
        <ProductForm
          product={editProduct}
          onClose={() => setShowProductForm(false)}
          onSave={data => {
            setProducts(current =>
              editProduct
                ? current.map(p =>
                    p.id === editProduct.id ? { ...p, ...data } : p
                  )
                : [
                    ...current,
                    {
                      ...data,
                      id: `p-${Date.now()}`,
                      active: true,
                      image: IMG.tradicional,
                      kind: "produto",
                    },
                  ]
            );
            setShowProductForm(false);
            toast.success(
              editProduct ? "Produto atualizado" : "Produto adicionado"
            );
          }}
        />
      )}
    </div>
  );
}

function NewOrderAlert({
  order,
  onClose,
  onOpenOrders,
}: {
  order: Order;
  onClose: () => void;
  onOpenOrders: () => void;
}) {
  return (
    <div className="new-order-alert">
      <div className="alert-pulse">
        <Bell size={21} />
      </div>
      <div className="alert-copy">
        <span>novo pedido recebido</span>
        <strong>
          {order.id} · {order.customer}
        </strong>
        <small>
          {order.items} · {money(order.total)}
        </small>
      </div>
      <button className="alert-action" onClick={onOpenOrders}>
        Ver pedido <ArrowRight size={14} />
      </button>
      <button
        className="alert-close"
        aria-label="Fechar alerta"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
}

function OwnerHeading({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="owner-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
function StatCard({
  label,
  value,
  change,
  icon,
  accent,
}: {
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="stat-card">
      <div className={cn("stat-icon", accent)}>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      {change && (
        <small className="stat-change">
          <TrendingUp size={13} /> {change}
        </small>
      )}
    </div>
  );
}
function Overview({
  orders,
  storeOpen,
  setStoreOpen,
  onOrders,
  onAddProduct,
}: {
  orders: Order[];
  storeOpen: boolean;
  setStoreOpen: (open: boolean) => void;
  onOrders: () => void;
  onAddProduct: () => void;
}) {
  return (
    <>
      <OwnerHeading
        eyebrow="quinta-feira, 10 de setembro"
        title="Bom dia, dona Ana ✦"
        desc="Um resumo do que está acontecendo na sua loja hoje."
        action={
          <div className="heading-actions">
            <button className="outline-button" onClick={onOrders}>
              <Eye size={16} /> Ver pedidos
            </button>
            <button className="primary-button" onClick={onAddProduct}>
              <Plus size={16} /> Adicionar produto
            </button>
          </div>
        }
      />
      <div className="demo-alert">
        <Sparkles size={16} />
        <span>
          <b>Modo demonstração ativo.</b> Estes números são ilustrativos e ficam
          salvos só neste navegador.
        </span>
        <button>Entendi</button>
      </div>
      <div className="stat-grid">
        <StatCard
          label="Vendas de hoje"
          value="R$ 486,50"
          change="12,8% vs. ontem"
          icon={<TrendingUp size={19} />}
          accent="green"
        />
        <StatCard
          label="Pedidos hoje"
          value="28"
          change="4 pedidos novos"
          icon={<ShoppingBag size={19} />}
          accent="purple"
        />
        <StatCard
          label="Ticket médio"
          value="R$ 17,38"
          change="R$ 2,10 vs. ontem"
          icon={<ReceiptText size={19} />}
          accent="coral"
        />
        <StatCard
          label="Mais vendido"
          value="Pizza 500 ml"
          change="12 unidades hoje"
          icon={<Sparkles size={19} />}
          accent="gold"
        />
      </div>
      <div className="owner-grid two-col">
        <section className="owner-panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">últimos 7 dias</span>
              <h2>Vendas da semana</h2>
            </div>
            <button className="filter-button">
              Esta semana <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-wrap">
            <div className="chart-y">
              <span>R$ 300</span>
              <span>R$ 200</span>
              <span>R$ 100</span>
              <span>R$ 0</span>
            </div>
            <div className="bar-chart">
              {[
                ["Seg", 42],
                ["Ter", 58],
                ["Qua", 49],
                ["Qui", 72],
                ["Sex", 63],
                ["Sáb", 88],
                ["Dom", 66],
              ].map(([day, height]) => (
                <div className="bar-column" key={String(day)}>
                  <div
                    className={cn("bar", day === "Qui" && "highlight")}
                    style={{ height: `${Number(height)}%` }}
                  >
                    <span>{day === "Qui" ? "R$ 240" : ""}</span>
                  </div>
                  <small>{day}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="owner-panel recent-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">agora há pouco</span>
              <h2>Pedido mais recente</h2>
            </div>
            <button className="text-button" onClick={onOrders}>
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          {orders.slice(0, 3).map(order => (
            <div className="recent-order" key={order.id}>
              <span className="recent-order-icon">
                <ShoppingBag size={16} />
              </span>
              <div>
                <b>
                  {order.id} · {order.customer}
                </b>
                <small>{order.items}</small>
              </div>
              <strong>{money(order.total)}</strong>
            </div>
          ))}
          <div className={cn("open-banner", storeOpen ? "" : "closed")}>
            <span className="open-banner-dot" />
            <div>
              <b>
                {storeOpen ? "Sua loja está aberta" : "Sua loja está fechada"}
              </b>
              <small>
                {storeOpen
                  ? "Recebendo pedidos normalmente"
                  : "Abra quando estiver pronta"}
              </small>
            </div>
            <button onClick={() => setStoreOpen(!storeOpen)}>
              {storeOpen ? "Desativar loja" : "Ativar loja"}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function OrdersPage({
  orders,
  setOrders,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const [filter, setFilter] = useState("Em preparo");
  const [historyFilter, setHistoryFilter] = useState("Entregues");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [historyDate, setHistoryDate] = useState("");
  const matchesSearch = (order: Order) =>
    `${order.id} ${order.customer} ${order.items}`
      .toLowerCase()
      .includes(search.toLowerCase());
  const orderDate = (order: Order) => order.date || "2026-09-10";
  const advance = (order: Order) => {
    if (order.status !== "Em preparo") return;
    const next = "Saiu para entrega";
    setOrders(current =>
      current.map(o => (o.id === order.id ? { ...o, status: next } : o))
    );
    setSelectedOrder(current =>
      current?.id === order.id ? { ...current, status: next } : current
    );
    toast.success(`Pedido ${order.id} saiu para entrega`, {
      description: "Aguardando confirmação do cliente.",
    });
  };
  const updateOrder = (updated: Order) => {
    setOrders(current =>
      current.map(order => (order.id === updated.id ? updated : order))
    );
    setSelectedOrder(updated);
    toast.success(`Pedido ${updated.id} atualizado`);
  };
  const cancelOrder = (order: Order) => {
    const cancelled = { ...order, status: "Cancelado" };
    setOrders(current =>
      current.map(item => (item.id === order.id ? cancelled : item))
    );
    setSelectedOrder(cancelled);
    toast.success(`Pedido ${order.id} cancelado`);
  };
  const activeStatuses = ["Em preparo", "Saiu para entrega", "Concluído"];
  const count = (status: string) =>
    orders.filter(order => order.status === status).length;
  const delivered = orders.filter(
    order =>
      order.status === "Entregue" &&
      matchesSearch(order) &&
      (!historyDate || orderDate(order) === historyDate)
  );
  const cancelled = orders.filter(
    order =>
      order.status === "Cancelado" &&
      matchesSearch(order) &&
      (!historyDate || orderDate(order) === historyDate)
  );
  const visibleHistory = historyFilter === "Entregues" ? delivered : cancelled;
  const filterButton = (value: string, label: string, amount: number) => (
    <button
      className={filter === value ? "active" : ""}
      onClick={() => setFilter(value)}
    >
      {label} <b>{amount}</b>
    </button>
  );
  return (
    <>
      <OwnerHeading
        eyebrow="operação em tempo real"
        title="Pedidos"
        desc="Acompanhe o preparo, a entrega e a confirmação do cliente."
        action={
          <button
            className="outline-button"
            onClick={() => toast.success("Pedidos atualizados")}
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        }
      />
      <div className="order-toolbar">
        <div className="order-filters">
          {filterButton("Em preparo", "Em preparo", count("Em preparo"))}
          {filterButton(
            "Saiu para entrega",
            "Saiu para entrega",
            count("Saiu para entrega")
          )}
          {filterButton("Concluído", "Concluídos", count("Concluído"))}
          <button
            className={filter === "Histórico" ? "active" : ""}
            onClick={() => setFilter("Histórico")}
          >
            Histórico <b>{delivered.length + cancelled.length}</b>
          </button>
        </div>
        <div className="order-search">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar pedido ou cliente"
          />
        </div>
      </div>
      {filter === "Histórico" ? (
        <section className="order-history">
          <div className="history-heading">
            <div>
              <span className="eyebrow">histórico</span>
              <h2>Pedidos arquivados</h2>
              <p>Consulte os pedidos entregues e cancelados.</p>
            </div>
            <div className="history-controls">
              <button
                className={
                  historyFilter === "Entregues"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setHistoryFilter("Entregues")}
              >
                Entregues <b>{delivered.length}</b>
              </button>
              <button
                className={
                  historyFilter === "Cancelados"
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setHistoryFilter("Cancelados")}
              >
                Cancelados <b>{cancelled.length}</b>
              </button>
              <label>
                Data
                <input
                  type="date"
                  value={historyDate}
                  onChange={e => setHistoryDate(e.target.value)}
                />
              </label>
              {historyDate && (
                <button
                  className="text-button"
                  onClick={() => setHistoryDate("")}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
          {visibleHistory.length ? (
            <div className="history-list">
              {visibleHistory.map(order => (
                <HistoryOrder
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          ) : (
            <div className="orders-empty">
              <ReceiptText size={22} />
              <strong>Nenhum pedido encontrado</strong>
              <span>
                Os pedidos aparecerão aqui após serem entregues ou cancelados.
              </span>
            </div>
          )}
        </section>
      ) : (
        <div className="orders-board">
          {[filter].map(status => (
            <div className="order-column" key={status}>
              <div className="column-title">
                <span
                  className={cn(
                    "column-dot",
                    status === "Em preparo"
                      ? "yellow"
                      : status === "Saiu para entrega"
                        ? "green"
                        : "pink"
                  )}
                />
                <b>{status === "Concluído" ? "Concluídos" : status}</b>
                <span>{count(status)}</span>
              </div>
              {orders
                .filter(o => o.status === status && matchesSearch(o))
                .map(order => (
                  <div
                    className="order-card"
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-card-top">
                      <b>{order.id}</b>
                      <small>{order.time}</small>
                      <button
                        aria-label="Abrir detalhes"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <strong>{order.customer}</strong>
                    <p>{order.items}</p>
                    <div className="order-card-meta">
                      <span>{order.payment}</span>
                      <span>
                        {order.delivery === "Entrega" ? (
                          <Bike size={13} />
                        ) : (
                          <Store size={13} />
                        )}
                        {order.delivery}
                      </span>
                    </div>
                    <div className="order-card-bottom">
                      <b>{money(order.total)}</b>
                      {status === "Em preparo" && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            advance(order);
                          }}
                        >
                          Saiu para entrega <ArrowRight size={13} />
                        </button>
                      )}
                      {status === "Saiu para entrega" &&
                        order.delivery === "Entrega" && (
                          <button
                            className="route-button"
                            onClick={e => {
                              e.stopPropagation();
                              openDeliveryRoute(order);
                            }}
                          >
                            Abrir rota <MapPin size={13} />
                          </button>
                        )}{" "}
                    </div>
                  </div>
                ))}
              {!orders.some(o => o.status === status && matchesSearch(o)) && (
                <div className="column-empty">Nenhum pedido nesta etapa</div>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAdvance={() => advance(selectedOrder)}
          onSave={updateOrder}
          onCancel={() => cancelOrder(selectedOrder)}
        />
      )}
    </>
  );
}
function HistoryOrder({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) {
  return (
    <button className="history-row" onClick={onClick}>
      <span className="history-check">
        <Check size={15} />
      </span>
      <span className="history-main">
        <strong>
          {order.id} · {order.customer}
        </strong>
        <span>{order.items}</span>
      </span>
      <span className="history-date">{order.date || "10/09/2026"}</span>
      <b>{money(order.total)}</b>
      <span className="history-status">Entregue</span>
    </button>
  );
}
function OrderDetailsModal({
  order,
  onClose,
  onAdvance,
  onSave,
  onCancel,
}: {
  order: Order;
  onClose: () => void;
  onAdvance: () => void;
  onSave: (order: Order) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(order);
  const editable = !["Concluído", "Entregue", "Cancelado"].includes(
    order.status
  );
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="order-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <div>
            <span className="eyebrow">detalhes do pedido</span>
            <h2>
              {order.id} · {order.customer}
            </h2>
            <small>
              {order.date || "10/09/2026"} · {order.time}
            </small>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <div className="order-detail-body">
          <div className="detail-status">
            <span
              className={cn(
                "status-dot-large",
                order.status === "Cancelado"
                  ? "cancelled"
                  : order.status === "Entregue"
                    ? "done"
                    : "active"
              )}
            />
            {order.status}
            <span className="detail-total">{money(order.total)}</span>
          </div>
          <div className="detail-grid">
            <label>
              Cliente
              <input
                value={draft.customer}
                disabled={!editable}
                onChange={e => setDraft({ ...draft, customer: e.target.value })}
              />
            </label>
            <label>
              Telefone
              <input
                value={draft.phone || ""}
                disabled={!editable}
                onChange={e => setDraft({ ...draft, phone: e.target.value })}
                placeholder="Não informado"
              />
            </label>
            <label className="wide">
              Itens e observações
              <textarea
                value={draft.items}
                disabled={!editable}
                onChange={e => setDraft({ ...draft, items: e.target.value })}
              />
            </label>
            <label>
              Total
              <input
                type="number"
                value={draft.total}
                disabled={!editable}
                onChange={e =>
                  setDraft({ ...draft, total: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Pagamento
              <select
                value={draft.payment}
                disabled={!editable}
                onChange={e => setDraft({ ...draft, payment: e.target.value })}
              >
                <option>Pix</option>
                <option>Dinheiro</option>
                <option>Cartão na entrega</option>
              </select>
            </label>
            <label>
              Recebimento
              <select
                value={draft.delivery}
                disabled={!editable}
                onChange={e => setDraft({ ...draft, delivery: e.target.value })}
              >
                <option>Entrega</option>
                <option>Retirada</option>
              </select>
            </label>
            {draft.delivery === "Entrega" && (
              <label className="wide">
                Endereço
                <input
                  value={`${draft.address || ""}${draft.number ? `, ${draft.number}` : ""}${draft.neighborhood ? ` · ${draft.neighborhood}` : ""}`}
                  disabled={!editable}
                  onChange={e =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                />
              </label>
            )}
          </div>
        </div>
        <div className="detail-actions">
          <button className="outline-button" onClick={onClose}>
            Fechar
          </button>
          {editable && (
            <>
              <button className="danger-button" onClick={onCancel}>
                Cancelar pedido
              </button>
              <button className="primary-button" onClick={() => onSave(draft)}>
                Salvar alterações
              </button>
              <button className="primary-button" onClick={onAdvance}>
                Avançar etapa <ArrowRight size={15} />
              </button>
            </>
          )}
          {order.delivery === "Entrega" &&
            !["Cancelado", "Entregue", "Concluído"].includes(order.status) && (
              <button
                className="route-button detail-route-button"
                onClick={() => openDeliveryRoute(order)}
              >
                <MapPin size={15} /> Abrir rota no Google Maps
              </button>
            )}
          {order.status === "Cancelado" && (
            <span className="cancelled-note">Pedido cancelado</span>
          )}
          {(order.status === "Concluído" || order.status === "Entregue") && (
            <span className="done-note">Pedido concluído</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductsPage({
  products,
  setProducts,
  onAdd,
  onEdit,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onAdd: () => void;
  onEdit: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const visible = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <OwnerHeading
        eyebrow="seu cardápio"
        title="Produtos"
        desc="Tudo que aparece para o cliente, em um só lugar."
        action={
          <button className="primary-button" onClick={onAdd}>
            <Plus size={16} /> Novo produto
          </button>
        }
      />
      <div className="table-toolbar">
        <div className="table-search">
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto"
          />
        </div>
        <button className="filter-button">
          Todas as categorias <ChevronDown size={14} />
        </button>
      </div>
      <div className="data-table">
        <div className="table-head">
          <span>Produto</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        {visible.map(product => (
          <div className="table-row" key={product.id}>
            <div className="table-product">
              <img src={product.image} alt="" />
              <span>
                <b>{product.name}</b>
                <small>{product.description}</small>
              </span>
            </div>
            <span className="table-category">{product.category}</span>
            <strong>{money(product.price)}</strong>
            <button
              className={cn("active-switch", !product.active && "off")}
              onClick={() =>
                setProducts(current =>
                  current.map(p =>
                    p.id === product.id ? { ...p, active: !p.active } : p
                  )
                )
              }
            >
              <span />
              {product.active ? "Ativo" : "Inativo"}
            </button>
            <div className="row-actions">
              <button onClick={() => onEdit(product)} aria-label="Editar">
                <Pencil size={15} />
              </button>
              <button
                onClick={() => {
                  setProducts(current =>
                    current.filter(p => p.id !== product.id)
                  );
                  toast.success("Produto excluído");
                }}
                aria-label="Excluir"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AddonsPage({
  addons,
  setAddons,
}: {
  addons: Addon[];
  setAddons: React.Dispatch<React.SetStateAction<Addon[]>>;
}) {
  return (
    <>
      <OwnerHeading
        eyebrow="personalização"
        title="Adicionais"
        desc="Monte a lista de complementos que deixa cada pedido único."
        action={
          <button
            className="primary-button"
            onClick={() =>
              toast.success("Formulário de adicional aberto", {
                description:
                  "No protótipo, você pode testar a ativação dos itens abaixo.",
              })
            }
          >
            <Plus size={16} /> Novo adicional
          </button>
        }
      />
      <div className="addon-admin-grid">
        {addons.map(addon => (
          <div className="addon-admin-card" key={addon.id}>
            <div className="addon-admin-icon">
              {addon.free ? <Sparkles size={17} /> : <Plus size={17} />}
            </div>
            <div>
              <b>{addon.name}</b>
              <small>
                {addon.category} · {addon.free ? "Grátis" : money(addon.price)}
              </small>
            </div>
            <button
              className={cn("active-switch", !addon.active && "off")}
              onClick={() =>
                setAddons(current =>
                  current.map(a =>
                    a.id === addon.id ? { ...a, active: !a.active } : a
                  )
                )
              }
            >
              <span />
            </button>
            <button className="edit-mini">
              <Edit3 size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="tip-panel">
        <Sparkles size={18} />
        <div>
          <b>Dica para vender mais</b>
          <p>
            Adicionais gratuitos aumentam a sensação de valor. Deixe os pagos
            mais irresistíveis com nomes apetitosos e fotos próximas do produto.
          </p>
        </div>
      </div>
    </>
  );
}
function PromosPage({ products }: { products: Product[] }) {
  const initialPromos: Promotion[] = [
    {
      name: "Pizza 300 ml + 2 adicionais",
      detail: "válida até 30/09/2026",
      price: "R$ 15,00",
      active: true,
      image: IMG.tradicional,
    },
    {
      name: "Combo da tarde",
      detail: "válida todos os dias · 15h–18h",
      price: "R$ 20,00",
      active: true,
      image: IMG.doce,
    },
    {
      name: "Na compra de 2 pizzas",
      detail: "ganhe 1 adicional",
      price: "benefício",
      active: false,
      image: IMG.tradicional,
    },
  ];
  const [promos, setPromos] = useState(initialPromos);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const savePromo = (promo: Promotion) => {
    setPromos(current =>
      current.some(item => item.name === editing?.name)
        ? current.map(item => (item.name === editing?.name ? promo : item))
        : [...current, promo]
    );
    setEditing(null);
    toast.success("Promoção salva", { description: promo.name });
  };
  return (
    <>
      <OwnerHeading
        eyebrow="ofertas que dão vontade"
        title="Promoções"
        desc="Crie motivos para o cliente voltar mais vezes."
        action={
          <button
            className="primary-button"
            onClick={() =>
              setEditing({
                name: "",
                detail: "válida até 30/09/2026",
                price: "R$ 15,00",
                active: true,
                image: IMG.tradicional,
              })
            }
          >
            <Plus size={16} /> Nova promoção
          </button>
        }
      />
      <div className="promo-admin-list">
        {promos.map(promo => (
          <div className="promo-admin-card" key={promo.name}>
            <img src={promo.image} alt="" />
            <div className="promo-admin-copy">
              <span
                className={promo.active ? "active-label" : "inactive-label"}
              >
                {promo.active ? "Ativa" : "Pausada"}
              </span>
              <h3>{promo.name}</h3>
              <p>{promo.detail}</p>
            </div>
            <strong>{promo.price}</strong>
            <button
              className="edit-mini"
              aria-label="Editar promoção"
              onClick={() => setEditing(promo)}
            >
              <Pencil size={15} />
            </button>
            <button
              className="more-admin"
              aria-label="Mais opções da promoção"
              onClick={() => setEditing(promo)}
            >
              <MoreHorizontal size={17} />
            </button>
          </div>
        ))}
      </div>
      <div className="promo-create-card">
        <div className="promo-deco">%</div>
        <div>
          <span className="eyebrow">destaque da semana</span>
          <h2>Uma boa oferta conta uma história.</h2>
          <p>Use fotos, títulos curtos e uma condição fácil de entender.</p>
        </div>
        <button
          className="outline-button"
          onClick={() =>
            setEditing({
              name: "",
              detail: "válida todos os dias",
              price: "R$ 20,00",
              active: true,
              image: IMG.tradicional,
            })
          }
        >
          Criar oferta <ArrowRight size={15} />
        </button>
      </div>
      {editing && (
        <PromotionModal
          promo={editing}
          onClose={() => setEditing(null)}
          onSave={savePromo}
        />
      )}
    </>
  );
}
function PromotionModal({
  promo,
  onClose,
  onSave,
}: {
  promo: Promotion;
  onClose: () => void;
  onSave: (promo: Promotion) => void;
}) {
  const [draft, setDraft] = useState(promo);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="promo-modal" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <div>
            <span className="eyebrow">editor de oferta</span>
            <h2>{promo.name ? "Editar promoção" : "Nova promoção"}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <div className="promo-form">
          <label>
            Nome da promoção
            <input
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
              placeholder="Ex.: Pizza + bolo por R$ 20"
            />
          </label>
          <label>
            Descrição e validade
            <input
              value={draft.detail}
              onChange={e => setDraft({ ...draft, detail: e.target.value })}
            />
          </label>
          <label>
            Preço ou benefício
            <input
              value={draft.price}
              onChange={e => setDraft({ ...draft, price: e.target.value })}
              placeholder="R$ 15,00"
            />
          </label>
          <label className="promo-check">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={e => setDraft({ ...draft, active: e.target.checked })}
            />{" "}
            Promoção ativa no painel
          </label>
        </div>
        <div className="form-modal-footer">
          <button className="outline-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="primary-button"
            onClick={() =>
              draft.name.trim()
                ? onSave(draft)
                : toast.error("Informe o nome da promoção")
            }
          >
            Salvar promoção <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FinancePage({ orders }: { orders: Order[] }) {
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [appliedStartDate, setAppliedStartDate] = useState("2026-09-01");
  const [appliedEndDate, setAppliedEndDate] = useState("2026-09-30");
  const rangeOrders = orders.filter(order => {
    const orderDate = order.date || "2026-09-15";
    return orderDate >= appliedStartDate && orderDate <= appliedEndDate;
  });
  const total = rangeOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = rangeOrders.length;
  const average = orderCount ? total / orderCount : 0;
  const paymentCount = (label: string) =>
    rangeOrders.filter(order => order.payment.toLowerCase().includes(label))
      .length;
  const paymentTotal =
    paymentCount("pix") + paymentCount("cartão") + paymentCount("dinheiro") ||
    1;
  const paymentPercent = (label: string) =>
    Math.round((paymentCount(label) / paymentTotal) * 100);
  const dateLabel = (value: string) =>
    value ? new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR") : "—";
  const rangeLabel = `${dateLabel(appliedStartDate)} a ${dateLabel(appliedEndDate)}`;
  return (
    <>
      <OwnerHeading
        eyebrow="números para decidir melhor"
        title="Financeiro"
        desc="Escolha um período para analisar os resultados da sua operação."
        action={
          <div className="finance-date-filter">
            <label>
              Data inicial
              <input
                type="date"
                value={startDate}
                max={endDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </label>
            <span>até</span>
            <label>
              Data final
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </label>
            <button
              className="primary-button finance-filter-button"
              onClick={() => {
                if (startDate > endDate)
                  return toast.error(
                    "A data inicial deve ser anterior à data final"
                  );
                setAppliedStartDate(startDate);
                setAppliedEndDate(endDate);
                toast.success("Filtro financeiro aplicado");
              }}
            >
              Filtrar
            </button>
          </div>
        }
      />
      <div className="finance-range-label">
        Período analisado: <b>{rangeLabel}</b>
      </div>
      <div className="stat-grid finance-stats">
        <StatCard
          label="Vendas no período"
          value={money(total)}
          change={`${orderCount} ${orderCount === 1 ? "pedido" : "pedidos"} encontrados`}
          icon={<TrendingUp size={19} />}
          accent="green"
        />
        <StatCard
          label="Pedidos no período"
          value={String(orderCount)}
          change="conforme as datas selecionadas"
          icon={<ShoppingBag size={19} />}
          accent="purple"
        />
        <StatCard
          label="Ticket médio"
          value={money(average)}
          change="média por pedido"
          icon={<ReceiptText size={19} />}
          accent="coral"
        />
      </div>
      <div className="owner-grid two-col">
        <section className="owner-panel chart-panel large-chart">
          <div className="panel-header">
            <div>
              <span className="eyebrow">resumo do período</span>
              <h2>Vendas selecionadas</h2>
            </div>
            <span className="chart-total">{money(total)}</span>
          </div>
          <div className="finance-summary-box">
            <TrendingUp size={24} />
            <div>
              <strong>
                {orderCount
                  ? "Período com movimento"
                  : "Nenhum pedido no período"}
              </strong>
              <small>
                {orderCount
                  ? `${orderCount} pedidos somam ${money(total)} entre as datas escolhidas.`
                  : "Amplie o intervalo para consultar outros pedidos."}
              </small>
            </div>
          </div>
          <div className="finance-chart">
            <div className="line-chart">
              <span className="chart-area" />
              <span className="chart-line" />
              <i className="point p1" />
              <i className="point p2" />
              <i className="point p3" />
              <i className="point p4" />
              <i className="point p5" />
            </div>
            <div className="chart-axis">
              <span>{dateLabel(appliedStartDate)}</span>
              <span>{dateLabel(appliedEndDate)}</span>
            </div>
          </div>
        </section>
        <section className="owner-panel payment-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">como seus clientes pagam</span>
              <h2>Formas de pagamento</h2>
            </div>
          </div>
          <div className="donut-wrap">
            <div className="donut">
              <strong>{orderCount}</strong>
              <small>pedidos</small>
            </div>
            <div className="donut-legend">
              <span>
                <i className="legend-purple" /> Pix{" "}
                <b>{paymentPercent("pix")}%</b>
              </span>
              <span>
                <i className="legend-coral" /> Cartão{" "}
                <b>{paymentPercent("cartão")}%</b>
              </span>
              <span>
                <i className="legend-gold" /> Dinheiro{" "}
                <b>{paymentPercent("dinheiro")}%</b>
              </span>
            </div>
          </div>
        </section>
      </div>
      <div className="demo-footnote">
        <Sparkles size={15} /> Os dados são calculados com base nos pedidos
        registrados no intervalo escolhido.
      </div>
    </>
  );
}
function SettingsPage({
  business,
  setBusiness,
  storeOpen,
  setStoreOpen,
  onReset,
}: {
  business: BusinessSettings;
  setBusiness: React.Dispatch<React.SetStateAction<BusinessSettings>>;
  storeOpen: boolean;
  setStoreOpen: (b: boolean) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(business);
  const save = () => {
    if (
      !draft.name.trim() ||
      !draft.whatsapp.trim() ||
      !draft.deliveryWhatsapp.trim() ||
      !draft.pixKey.trim() ||
      !draft.icon.trim() ||
      draft.deliveryFee < 0
    )
      return toast.error("Preencha nome, contatos, ícone e chave Pix");
    setBusiness(draft);
    toast.success("Informações do comércio salvas");
  };
  return (
    <>
      <OwnerHeading
        eyebrow="ajustes rápidos"
        title="Configurações"
        desc="Edite as informações que aparecem no cardápio e no checkout."
      />
      <div className="settings-grid">
        <section className="settings-card settings-edit-card">
          <div className="settings-card-head">
            <div className="settings-icon coral-bg">
              <Settings size={18} />
            </div>
            <div>
              <h3>Dados do comércio</h3>
              <p>
                Essas informações alimentam o suporte via WhatsApp e o Pix do
                checkout.
              </p>
            </div>
          </div>
          <div className="settings-form">
            <label>
              Nome da loja
              <input
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="contact-setting-field">
              WhatsApp para suporte
              <input
                value={draft.whatsapp}
                onChange={e => setDraft({ ...draft, whatsapp: e.target.value })}
                placeholder="5500000000000"
              />
              <small>Contato aberto no botão de suporte ao cliente.</small>
              <button
                type="button"
                className="outline-button small settings-test-button"
                onClick={() => {
                  const phone = draft.whatsapp.replace(/\D/g, "");
                  if (!phone)
                    return toast.error("Informe o WhatsApp de suporte");
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent("Olá! Este é um teste do suporte da loja.")}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Testar suporte
              </button>
            </label>
            <label className="contact-setting-field">
              WhatsApp para pedidos
              <input
                value={draft.deliveryWhatsapp}
                onChange={e =>
                  setDraft({ ...draft, deliveryWhatsapp: e.target.value })
                }
                placeholder="5500000000000"
              />
              <small>
                Contato usado para testar o atendimento das entregas.
              </small>
              <button
                type="button"
                className="outline-button small settings-test-button"
                onClick={() => {
                  const phone = draft.deliveryWhatsapp.replace(/\D/g, "");
                  if (!phone)
                    return toast.error("Informe o WhatsApp de pedidos");
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent("Olá! Este é um teste do WhatsApp de pedidos da loja.")}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Testar pedidos
              </button>
            </label>
            <label>
              Ícone do estabelecimento
              <input
                value={draft.icon}
                onChange={e =>
                  setDraft({ ...draft, icon: e.target.value.slice(0, 3) })
                }
                placeholder="BM"
              />
              <small>
                Use até 3 caracteres. Ele aparecerá em todos os locais da marca.
              </small>
            </label>
            <label className="brand-image-setting">
              Imagem do estabelecimento
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () =>
                    setDraft({ ...draft, iconImage: String(reader.result) });
                  reader.readAsDataURL(file);
                }}
              />
              <small>
                Opcional: a imagem substituirá o texto do ícone em todos os
                locais.
              </small>
              {draft.iconImage && (
                <button
                  type="button"
                  className="outline-button small settings-test-button"
                  onClick={() => setDraft({ ...draft, iconImage: undefined })}
                >
                  Remover imagem
                </button>
              )}
            </label>
            <label>
              Chave Pix
              <input
                value={draft.pixKey}
                onChange={e => setDraft({ ...draft, pixKey: e.target.value })}
              />
              <small>No protótipo, o QR Code é demonstrativo.</small>
            </label>
            <label>
              Taxa de entrega
              <input
                type="number"
                min="0"
                step="0.50"
                value={draft.deliveryFee}
                onChange={e =>
                  setDraft({ ...draft, deliveryFee: Number(e.target.value) })
                }
              />
              <small>
                Valor cobrado somente quando o cliente esfatia Entrega.
              </small>
            </label>
            <label className="wide">
              Endereço
              <input
                value={draft.address}
                onChange={e => setDraft({ ...draft, address: e.target.value })}
              />
            </label>
            <label className="wide">
              Dias e horários de funcionamento
              <input
                value={draft.hours}
                onChange={e => setDraft({ ...draft, hours: e.target.value })}
              />
            </label>
            <button className="primary-button" onClick={save}>
              Salvar informações <Check size={16} />
            </button>
          </div>
        </section>
        <section className="settings-card">
          <div className="settings-card-head">
            <div className="settings-icon">
              <Store size={18} />
            </div>
            <div>
              <h3>Funcionamento da loja</h3>
              <p>Controle quando seus clientes podem pedir.</p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <b>Receber pedidos agora</b>
              <small>
                {storeOpen
                  ? "Sua loja aparece como aberta no cardápio."
                  : "Seu cardápio informa que a loja está fechada."}
              </small>
            </div>
            <button
              className={cn("big-switch", storeOpen && "active")}
              onClick={() => setStoreOpen(!storeOpen)}
            >
              <span />
            </button>
          </div>
          <div className="settings-row">
            <div>
              <b>Horário atual</b>
              <small>{business.hours}</small>
            </div>
            <button
              className="text-button"
              onClick={() =>
                document
                  .querySelector(".settings-edit-card")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Editar <Pencil size={13} />
            </button>
          </div>
        </section>
        <section className="settings-card danger-card">
          <div className="settings-card-head">
            <div className="settings-icon">
              <RefreshCw size={18} />
            </div>
            <div>
              <h3>Dados de demonstração</h3>
              <p>Restaure os produtos e pedidos iniciais do modelo.</p>
            </div>
          </div>
          <button className="outline-button" onClick={onReset}>
            Restaurar dados de demonstração
          </button>
        </section>
      </div>
    </>
  );
}

function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "active" | "image" | "kind">) => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(
    product?.category || "Pizzas Tradicionais"
  );
  const [price, setPrice] = useState(String(product?.price || ""));
  const [description, setDescription] = useState(product?.description || "");
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="form-modal" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <div>
            <span className="eyebrow">cadastro de cardápio</span>
            <h2>{product ? "Editar produto" : "Novo produto"}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <div className="product-form">
          <label>
            Nome do produto
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex.: Pizza 700 ml"
            />
          </label>
          <div className="form-grid">
            <label>
              Categoria
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Pizzas Tradicionais</option>
                <option>Bebidas</option>
                <option>Pizzas Doces</option>
                <option>Combos</option>
              </select>
            </label>
            <label>
              Preço
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0,00"
              />
            </label>
          </div>
          <label>
            Descrição
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Uma descrição curta e apetitosa"
            />
          </label>
          <div className="image-upload">
            <ImagePlus size={19} />
            <div>
              <b>Imagem do produto</b>
              <small>O protótipo usa uma imagem demonstrativa</small>
            </div>
            <button className="outline-button small" type="button">
              Esfatia imagem
            </button>
          </div>
        </div>
        <div className="form-modal-footer">
          <button className="outline-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="primary-button"
            onClick={() => {
              if (!name || !price) return toast.error("Preencha nome e preço");
              onSave({
                name,
                category,
                price: Number(price),
                description,
                featured: false,
              });
            }}
          >
            Salvar produto <Check size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
