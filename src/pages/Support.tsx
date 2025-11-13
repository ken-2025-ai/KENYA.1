import { useState } from "react";
import { Search, Mail, Phone, MessageCircle, Book, Video, Users, HelpCircle, ChevronRight, Send, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const faqs = [
    {
      category: "Getting Started",
      items: [
        { q: "How do I create an account?", a: "Click the 'Sign Up' button in the top right corner and fill in your details. You'll receive a verification email to complete registration." },
        { q: "How do I list my produce?", a: "Go to Dashboard, click 'Add Listing', fill in crop details, set your price, upload photos, and publish. Your listing appears instantly in the marketplace." },
        { q: "Is the platform free to use?", a: "Yes! Creating an account and listing products is completely free. We only charge a small commission when you successfully sell." },
      ]
    },
    {
      category: "Marketplace & Selling",
      items: [
        { q: "How do I get paid?", a: "Once a buyer confirms purchase, payment is processed through M-PESA directly to your registered number within 24 hours." },
        { q: "Can I edit my listing after posting?", a: "Yes, go to your Dashboard, find your listing, and click 'Edit' to update price, quantity, description, or images." },
        { q: "Why isn't my listing appearing?", a: "Ensure you've completed all required fields and clicked 'Publish'. Check your internet connection and refresh the page." },
        { q: "How do I mark items as sold?", a: "In your Dashboard, click on your listing and select 'Mark as Sold'. This removes it from the marketplace." },
      ]
    },
    {
      category: "Weather & Farming Alerts",
      items: [
        { q: "How accurate are weather forecasts?", a: "We use OpenWeatherMap with location-based data. Forecasts are updated every 3 hours for maximum accuracy." },
        { q: "Can I customize notifications?", a: "Yes! Go to Settings > Notifications to choose which alerts you want (weather, market prices, planting reminders)." },
        { q: "How do I enable push notifications?", a: "When prompted, click 'Allow' in your browser. For mobile, ensure notifications are enabled in your device settings." },
      ]
    },
    {
      category: "AI Features",
      items: [
        { q: "How does the AI farming assistant work?", a: "Our AI analyzes your location, weather, soil type, and crop data to provide personalized advice on planting, pest control, and harvesting." },
        { q: "Are AI market prices real-time?", a: "The AI Market Board shows aggregated price trends from multiple sources, updated daily for accuracy." },
        { q: "Can I trust AI recommendations?", a: "AI suggestions are based on agricultural research and local data. Always combine with your experience and local extension officer advice." },
      ]
    },
    {
      category: "Sustainability & Certifications",
      items: [
        { q: "How do I get sustainability badges?", a: "Apply for certification in the Sustainable Farming section. Upload evidence of your practices (photos, soil tests) and a verifier will review." },
        { q: "What are carbon credits?", a: "Carbon credits reward farmers for sequestering CO₂ through sustainable practices. You can sell credits in our marketplace." },
        { q: "How is my water footprint calculated?", a: "We use FAO CropWat methodology based on your crops, area, and irrigation practices to estimate water usage." },
      ]
    },
    {
      category: "Account & Security",
      items: [
        { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. Enter your email and follow the reset link sent to your inbox." },
        { q: "Is my data secure?", a: "Yes. We use bank-level encryption and secure servers. Your payment info is never stored on our platform." },
        { q: "Can I delete my account?", a: "Go to Settings > Account > Delete Account. Note: this permanently removes all your data and listings." },
      ]
    }
  ];

  const contactOptions = [
    { icon: Mail, title: "Email Support", value: "support@eagriculture.co.ke", desc: "Response within 24 hours" },
    { icon: Phone, title: "Phone Support", value: "+254 700 123 456", desc: "Mon-Fri, 8AM-6PM EAT" },
    { icon: MessageCircle, title: "WhatsApp", value: "+254 700 123 456", desc: "Chat with us anytime" },
  ];

  const helpCategories = [
    { icon: Book, title: "Knowledge Base", desc: "Browse 50+ help articles", link: "#" },
    { icon: Video, title: "Video Tutorials", desc: "Watch step-by-step guides", link: "#" },
    { icon: Users, title: "Community Forum", desc: "Connect with other farmers", link: "#" },
    { icon: HelpCircle, title: "FAQ", desc: "Quick answers to common questions", link: "#faq" },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Our support team will respond within 24 hours.",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Can We Help You?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get instant answers or reach our support team
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, tutorials..."
              className="pl-12 h-14 text-lg bg-background shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Help Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <category.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.desc}</p>
                  <ChevronRight className="h-4 w-4 mx-auto mt-4 text-muted-foreground group-hover:text-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs defaultValue="faq" className="mb-16">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="faq">Frequently Asked</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" id="faq">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mb-8">
                {searchQuery ? `Found ${filteredFaqs.reduce((acc, cat) => acc + cat.items.length, 0)} results` : "Quick answers to common questions"}
              </p>

              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((category) => (
                  <div key={category.category} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">{category.category}</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((faq, idx) => (
                        <AccordionItem key={idx} value={`${category.category}-${idx}`}>
                          <AccordionTrigger className="text-left hover:text-primary">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try different keywords or contact our support team</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>We'll respond within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Describe your issue or question..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Options */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactOptions.map((option) => (
                      <div key={option.title} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <option.icon className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{option.title}</h3>
                          <p className="text-sm font-mono text-primary mb-1">{option.value}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">System Status</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      All systems operational
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Last updated: Just now
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Popular Guides */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Popular Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Getting Started Guide", desc: "Complete walkthrough for new users", time: "5 min read" },
              { title: "Maximize Your Sales", desc: "Tips to sell faster and at better prices", time: "8 min read" },
              { title: "Understanding AI Insights", desc: "How to use AI recommendations effectively", time: "6 min read" },
              { title: "Sustainable Certification", desc: "Step-by-step certification process", time: "10 min read" },
              { title: "Mobile App Installation", desc: "Install the PWA on your device", time: "3 min read" },
              { title: "Payment & Security", desc: "How payments work and staying safe", time: "7 min read" },
            ].map((guide) => (
              <Card key={guide.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <Book className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{guide.desc}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{guide.time}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
