import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "For Farmers", href: "#" },
    { label: "For Buyers", href: "#" },
    { label: "Market Prices", href: "#prices" },
    { label: "Equipment Leasing", href: "/machinery", isRoute: true },
  ],
  resources: [
    { label: "Farming Guides", href: "/learn", isRoute: true },
    { label: "Weather Reports", href: "/weather-climate", isRoute: true },
    { label: "Pest Control", href: "/pest-control", isRoute: true },
    { label: "Support", href: "/support", isRoute: true },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Success Stories", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (link: { href: string; isRoute?: boolean }) => {
    if (link.isRoute) navigate(link.href);
    else if (link.href.startsWith("#")) {
      const element = document.querySelector(link.href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent)/0.3)] to-transparent" />
      
      <div className="bg-[hsl(var(--primary))] relative">
        {/* Subtle orbs */}
        <div className="absolute top-0 right-[20%] w-[400px] h-[400px] bg-[hsl(var(--accent)/0.04)] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-[hsl(var(--primary-glow)/0.08)] rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6"><Logo size="default" /></div>
              <p className="text-[hsl(var(--primary-foreground))]/60 leading-relaxed mb-8 max-w-sm text-[15px]">
                Empowering Kenyan farmers with direct market access, real-time pricing, 
                and agricultural insights to grow their businesses.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.2] rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon className="w-5 h-5 text-white/70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Platform</h4>
              <ul className="space-y-3.5">
                {footerLinks.platform.map((link, i) => (
                  <li key={i}>
                    {link.isRoute ? (
                      <Link to={link.href} className="text-white/50 hover:text-[hsl(var(--accent))] transition-colors duration-300 text-[15px] inline-flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <button onClick={() => handleLinkClick(link)} className="text-white/50 hover:text-[hsl(var(--accent))] transition-colors duration-300 text-[15px]">
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Resources</h4>
              <ul className="space-y-3.5">
                {footerLinks.resources.map((link, i) => (
                  <li key={i}>
                    {link.isRoute ? (
                      <Link to={link.href} className="text-white/50 hover:text-[hsl(var(--accent))] transition-colors duration-300 text-[15px] inline-flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <button onClick={() => handleLinkClick(link)} className="text-white/50 hover:text-[hsl(var(--accent))] transition-colors duration-300 text-[15px]">
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-300">
                    <Mail className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <span className="text-white/50 text-sm mt-2">kenkendagor3@gmail.com</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-300">
                    <Phone className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <span className="text-white/50 text-sm mt-2">+254 768 731 991</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-[hsl(var(--accent))]" />
                  </div>
                  <span className="text-white/50 text-sm mt-2">Eldoret, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/35">
              <p>&copy; {new Date().getFullYear()} Kenya Pulse Connect. Building Kenya's agricultural future.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-[hsl(var(--accent))] transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-[hsl(var(--accent))] transition-colors duration-300">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
