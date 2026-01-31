import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo size="default" />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6 max-w-sm">
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
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-primary-foreground/70 hover:text-accent transition-colors"
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
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, i) => (
                <li key={i}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-primary-foreground/70 hover:text-accent transition-colors"
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
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/70 text-sm">kenkendagor3@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/70 text-sm">+254 768 731 991</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/70 text-sm">Eldoret, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Kenya Pulse Connect. Building the future of Kenyan agriculture.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
