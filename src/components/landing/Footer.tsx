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
    if (link.isRoute) {
      navigate(link.href);
    } else if (link.href.startsWith("#")) {
      const element = document.querySelector(link.href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />
      
      {/* Main footer */}
      <div className="bg-primary relative">
        {/* Subtle orbs */}
        <div className="absolute top-0 right-[20%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-primary-glow/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo size="default" />
              </div>
              <p className="text-primary-foreground/65 leading-relaxed mb-8 max-w-sm text-[15px]">
                Empowering Kenyan farmers with direct market access, real-time pricing, 
                and agricultural insights to transform their businesses.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 bg-white/[0.06] hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <social.icon className="w-5 h-5 text-primary-foreground/80" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="font-bold text-primary-foreground text-sm uppercase tracking-wider mb-5">Platform</h4>
              <ul className="space-y-3.5">
                {footerLinks.platform.map((link, i) => (
                  <li key={i}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-[15px] inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-[15px]"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h4 className="font-bold text-primary-foreground text-sm uppercase tracking-wider mb-5">Resources</h4>
              <ul className="space-y-3.5">
                {footerLinks.resources.map((link, i) => (
                  <li key={i}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-[15px] inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-[15px]"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="font-bold text-primary-foreground text-sm uppercase tracking-wider mb-5">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-primary-foreground/60 text-sm mt-2">kenkendagor3@gmail.com</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-primary-foreground/60 text-sm mt-2">+254 768 731 991</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-primary-foreground/60 text-sm mt-2">Eldoret, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40">
              <p>&copy; {new Date().getFullYear()} Kenya Pulse Connect. Building the future of Kenyan agriculture.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-accent transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="hover:text-accent transition-colors duration-300">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
