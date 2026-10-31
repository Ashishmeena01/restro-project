import Link from 'next/link';
import { QrCode, UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck, ArrowRight, Award, Sparkles } from 'lucide-react';
import { getPublicMenu } from '@/services/product.service';
import { formatPaise } from '@/lib/utils';

export default async function HomePage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  const menuData = await getPublicMenu(defaultSlug);

  const business = menuData?.business || {
    name: 'Vrindavan Pure Veg Sweets & Café',
    tagline: 'Authentic Indian Delicacies & Pure Desi Ghee Sweets',
    address: 'Shop 12, Mandir Marg, Near Banke Bihari, Vrindavan, UP 281121',
    phone: '+91 98765 43210',
    openingHours: '08:00 AM - 10:30 PM',
  };

  const previewProducts = menuData?.categories?.flatMap((c) => c.products).slice(0, 4) || [
    { id: '1', name: 'Samosa', price: 1500, description: 'Golden crispy crust filled with fragrant spiced potatoes and green peas.' },
    { id: '2', name: 'Kachori', price: 2000, description: 'Flaky khasta kachori with spiced moong dal served with hing aloo sabzi.' },
    { id: '3', name: 'Tea', price: 1000, description: 'Hot kadak ginger & cardamom spiced Indian masala chai.' },
    { id: '4', name: 'Poha', price: 2500, description: 'Steamed flattened rice with peanuts, mustard seeds, and crunchy Ratlami sev.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              V
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 leading-tight block">
                {business.name}
              </span>
              <span className="text-xs text-emerald-700 font-medium hidden sm:block">
                100% Pure Veg • FSSAI Certified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm shadow-emerald-200"
            >
              <QrCode className="w-4 h-4" />
              <span>Digital Menu</span>
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Owner Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scan • Order • Pay at Your Table</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Delicious Delicacies, <br className="hidden sm:inline" />
            <span className="text-emerald-600">Zero Wait Time.</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {business.tagline || 'Experience authentic street food and pure desi ghee sweets. Simply scan the QR code on your table, order in seconds, and pay seamlessly.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-md shadow-emerald-200 hover:shadow-lg"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>View Live Menu & Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-xl font-medium text-base border border-slate-200 shadow-sm"
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>Dine-In QR Menu</span>
            </Link>
          </div>

          {/* Quick Features Row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Contactless QR</p>
                <p className="text-[11px] text-slate-500">Order from your table</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">UPI & Cash</p>
                <p className="text-[11px] text-slate-500">Secure Razorpay or counter</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Pure Veg</p>
                <p className="text-[11px] text-slate-500">Pure Desi Cow Ghee</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Fast Kitchen</p>
                <p className="text-[11px] text-slate-500">Live order tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Preview Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Top Favorites</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Our Signature Delicacies</h2>
            </div>
            <Link
              href="/menu"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <span>Explore all items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      100% Veg
                    </span>
                    <span className="font-bold text-lg text-emerald-600">
                      {formatPaise(product.price)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Freshly Made</span>
                  <Link
                    href={`/menu`}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Business Details Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">About Vrindavan</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-1 mb-4">
                Preserving Heritage Flavors Since Inception
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Welcome to <strong>{business.name}</strong>. We are committed to serving authentic Indian snacks, street food, and authentic sweets prepared strictly in pure cow desi ghee and cold-pressed oils.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                With our modernized QR ordering system, you enjoy the freshest food served hot at your table without standing in queues or waiting for paper menus.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Address</p>
                    <p className="text-xs text-slate-600">{business.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Opening Hours</p>
                    <p className="text-xs text-slate-600">{business.openingHours} (Open All 7 Days)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Contact & Takeaway Enquiries</p>
                    <p className="text-xs text-slate-600">{business.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <QrCode className="w-16 h-16" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">Visiting Our Restaurant?</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                Each dine-in table features a dedicated QR code. Scan it directly with your smartphone camera to immediately load your table number and view today's available specialties.
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all"
              >
                <span>Launch Digital Menu Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-white">{business.name}</p>
            <p className="mt-1 text-slate-500">FSSAI Lic. {'12724001000456'} • 100% Pure Veg Delicacies</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/menu" className="hover:text-white transition-colors">Menu</Link>
            <Link href="/checkout" className="hover:text-white transition-colors">Cart</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
