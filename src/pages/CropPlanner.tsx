import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Loader2,
  Send,
  Leaf,
  Calendar,
  Droplets,
  ThermometerSun,
  Bug,
  Sprout,
  Download,
  ArrowLeft,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const kenyaCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans-Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

const CropPlanner = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [farmingType, setFarmingType] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateCropPlan = async () => {
    if (!selectedCounty) {
      toast({
        title: "Select Location",
        description: "Please select a county to generate your crop plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setHasGenerated(true);

    const userMessage = `Generate a comprehensive crop planning guide for ${selectedCounty} County, Kenya. ${farmingType ? `Farming type: ${farmingType}.` : ''} Include top 10 recommended crops, seed varieties, planting calendar, and full farmer guides.`;
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crop-planner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: userMessage }],
            county: selectedCounty,
            farmingType: farmingType
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }
        if (response.status === 402) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        }
        throw new Error(errorData.error || 'Failed to generate crop plan');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                    return updated;
                  });
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      toast({
        title: "Crop Plan Generated",
        description: "Your personalized regional crop plan is ready!",
      });
    } catch (error) {
      console.error('Crop planner error:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error generating your crop plan. Please try again." 
      }]);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate crop plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crop-planner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
            county: selectedCounty,
            farmingType: farmingType
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                    return updated;
                  });
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (messages.length === 0) return;
    
    const planData = {
      county: selectedCounty,
      farmingType: farmingType,
      messages: messages,
      generatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('cropPlan', JSON.stringify(planData));
    
    toast({
      title: "Plan Saved",
      description: "Your crop plan has been saved for offline reference.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/learn')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            🌱 Regional Crop Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized crop recommendations, planting calendars, and complete farming guides 
            tailored to your county's climate and soil conditions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Select Your Region
              </CardTitle>
              <CardDescription>
                Choose your county to get localized crop recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyaCounties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Farming Type (Optional)</label>
                <Select value={farmingType} onValueChange={setFarmingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rain-fed">Rain-fed</SelectItem>
                    <SelectItem value="irrigated">Irrigated</SelectItem>
                    <SelectItem value="greenhouse">Greenhouse</SelectItem>
                    <SelectItem value="mixed">Mixed Farming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateCropPlan} 
                disabled={isLoading || !selectedCounty}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4 mr-2" />
                    Generate Crop Plan
                  </>
                )}
              </Button>

              {hasGenerated && (
                <Button 
                  variant="outline" 
                  onClick={handleSavePlan}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save for Offline
                </Button>
              )}

              {/* Features */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground">What You'll Get:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="w-4 h-4 text-green-500" />
                    Top 10 Best Crops for Your Region
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Planting Calendar & Seasons
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    Irrigation & Water Management
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ThermometerSun className="w-4 h-4 text-orange-500" />
                    Climate & Soil Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bug className="w-4 h-4 text-red-500" />
                    Pest & Disease Management
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Play className="w-4 h-4 text-purple-500" />
                    YouTube Training Videos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-500" />
                AgroPlanner Pro
              </CardTitle>
              <CardDescription>
                Your AI agricultural extension officer for crop planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                    <Sprout className="w-16 h-16 mb-4 text-green-500/50" />
                    <h3 className="text-lg font-semibold mb-2">Welcome to AgroPlanner Pro</h3>
                    <p className="max-w-md">
                      Select your county and click "Generate Crop Plan" to get personalized 
                      crop recommendations and farming guides for your region.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Chat Input */}
              {hasGenerated && (
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask follow-up questions about your crops..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CropPlanner;
