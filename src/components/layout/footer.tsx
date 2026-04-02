import Link from "next/link";

const productLinks = [
  { label: "Analyze Your Look", href: "/analyze" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

const businessLinks = [
  { label: "Dashboard", href: "/business/dashboard" },
  { label: "Widget", href: "/business/widget" },
  { label: "Consultation Mode", href: "/business/consultation" },
];

const companyLinks = [
  { label: "Zodule Marketplace", href: "https://zodule.ai", external: true },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span>{"\ud83e\ude84"}</span>
              <span>StyleGenie AI</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              AI-powered beauty and grooming analysis. Scan. Wish. Transform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="text-sm font-semibold text-white">For Business</h3>
            <ul className="mt-4 space-y-3">
              {businessLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} StyleGenie AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Powered by{" "}
            <a
              href="https://zodule.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Zodule
            </a>{" "}
            &mdash; Scan. Wish. Transform.
          </p>
        </div>
      </div>
    </footer>
  );
}
