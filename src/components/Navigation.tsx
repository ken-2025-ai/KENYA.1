import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Smartphone, TrendingUp, BookOpen, Users, LogOut, X } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: "login" | "signup" }>({
    isOpen: false,
    defaultTab: "login"
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const openAuthModal = (defaultTab: "login" | "signup") => {
    setAuthModal({ isOpen: true, defaultTab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, defaultTab: "login" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-foreground">Kenya Pulse</h1>
              <p className="text-xs text-muted-foreground -mt-1 hidden sm:block">Connect</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">Features</a>
            <a href="#prices" className="text-muted-foreground hover:text-primary transition-smooth">Market Prices</a>
            <a href="#education" className="text-muted-foreground hover:text-primary transition-smooth">Learn</a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-smooth">Community</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden md:flex"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline truncate max-w-[120px]">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 bg-background border-border">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:flex"
                  onClick={() => openAuthModal("login")}
                >
                  Sign In
                </Button>
                <Button 
                  variant="hero"
                  size={isMobile ? "sm" : "default"}
                  className="min-h-[40px] touch-manipulation"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(50);
                    }
                    openAuthModal("signup");
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden min-h-[40px] min-w-[40px] touch-manipulation"
                  onClick={() => {
                    if ('vibrate' in navigator) {
                      navigator.vibrate(30);
                    }
                  }}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <a 
                    href="#features" 
                    className="text-muted-foreground hover:text-primary transition-smooth py-2 text-left border-b border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#prices" 
                    className="text-muted-foreground hover:text-primary transition-smooth py-2 text-left border-b border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Market Prices
                  </a>
                  <a 
                    href="#education" 
                    className="text-muted-foreground hover:text-primary transition-smooth py-2 text-left border-b border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Learn
                  </a>
                  <a 
                    href="#community" 
                    className="text-muted-foreground hover:text-primary transition-smooth py-2 text-left border-b border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Community
                  </a>
                  
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        className="justify-start mt-4"
                        onClick={() => {
                          navigate('/dashboard');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start"
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Profile
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="justify-start mt-4"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="justify-start mt-4"
                        onClick={() => {
                          openAuthModal("login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="hero" 
                        className="justify-start mt-2"
                        onClick={() => {
                          openAuthModal("signup");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {!user && (
        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal}
          defaultTab={authModal.defaultTab}
        />
      )}
    </nav>
  );
};