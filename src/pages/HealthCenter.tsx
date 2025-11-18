import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import jsPDF from "jspdf";
import { 
  Camera, 
  Upload, 
  Leaf, 
  Beef, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  MessageSquare,
  Download,
  Loader2,
  Send,
  Navigation as NavigationIcon
} from "lucide-react";

interface DiagnosisResult {
  disease: string;
  accuracy: number;
  symptoms: string[];
  cause: string;
  treatment: string;
  dosage?: string;
  organicAlternative?: string;
  prevention: string[];
  recommendedProducts: string[];
  severityLevel: "low" | "medium" | "high";
}

const HealthCenter = () => {
  const [activeTab, setActiveTab] = useState<"plant" | "animal">("plant");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [showAgronomistChat, setShowAgronomistChat] = useState(false);
  const [showAgrovetsMap, setShowAgrovetsMap] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { toast } = useToast();
  const { latitude, longitude, location, error: locationError, requestLocation } = useGeolocation();

  const plantTypes = [
    "Maize", "Coffee", "Tea", "Beans", "Potatoes", "Tomatoes", 
    "Wheat", "Rice", "Sugarcane", "Banana", "Mango", "Other"
  ];

  const animalTypes = [
    "Cattle", "Goat", "Sheep", "Poultry (Chicken)", "Pig", 
    "Rabbit", "Duck", "Turkey", "Other"
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDiagnose = async () => {
    if (!selectedFile || !selectedType) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and select the type.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI diagnosis (replace with actual AI API call)
    setTimeout(() => {
      const mockDiagnosis: DiagnosisResult = {
        disease: activeTab === "plant" ? "Early Blight" : "Mastitis",
        accuracy: 87.5,
        symptoms: activeTab === "plant" 
          ? ["Dark spots on leaves", "Yellowing around spots", "Leaf wilting"]
          : ["Swollen udder", "Reduced milk production", "Fever"],
        cause: activeTab === "plant"
          ? "Fungal infection caused by Alternaria solani, thrives in warm, humid conditions"
          : "Bacterial infection, usually caused by poor hygiene during milking",
        treatment: activeTab === "plant"
          ? "Apply fungicide containing chlorothalonil or mancozeb"
          : "Antibiotic treatment (Penicillin or Cephalosporin) administered by veterinarian",
        dosage: activeTab === "animal" ? "2ml per 50kg body weight, twice daily for 5 days" : undefined,
        organicAlternative: activeTab === "plant" 
          ? "Neem oil spray (2 tablespoons per liter of water)" 
          : "Garlic and turmeric paste applied topically",
        prevention: activeTab === "plant"
          ? [
              "Rotate crops every season",
              "Remove infected plant debris",
              "Ensure proper spacing for air circulation",
              "Water at soil level, not overhead"
            ]
          : [
              "Maintain clean milking environment",
              "Sanitize equipment before and after use",
              "Regular health checks",
              "Proper nutrition and hydration"
            ],
        recommendedProducts: activeTab === "plant"
          ? ["Dithane M-45", "Ridomil Gold", "Neem Oil Organic"]
          : ["Penicillin G Injection", "Mastalone Cream", "Udder Clean Solution"],
        severityLevel: "medium"
      };

      setDiagnosis(mockDiagnosis);
      setIsAnalyzing(false);
      
      toast({
        title: "Diagnosis Complete",
        description: `${mockDiagnosis.disease} detected with ${mockDiagnosis.accuracy}% confidence`,
      });
    }, 3000);
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleDownloadPDF = () => {
    if (!diagnosis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Agricultural Pulse", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Health Diagnosis Report", pageWidth / 2, 32, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    let yPos = 55;
    
    // Diagnosis Info
    doc.setFontSize(18);
    doc.text("Diagnosis Report", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 7;
    doc.text(`Type: ${activeTab === "plant" ? "Plant" : "Animal"} - ${selectedType}`, 20, yPos);
    yPos += 15;
    
    // Disease
    doc.setFontSize(14);
    doc.text("Detected Disease:", 20, yPos);
    doc.setFontSize(12);
    yPos += 7;
    doc.text(diagnosis.disease, 20, yPos);
    yPos += 10;
    
    // Confidence
    doc.setFontSize(14);
    doc.text(`Confidence Level: ${diagnosis.accuracy}%`, 20, yPos);
    yPos += 10;
    
    // Severity
    doc.setFontSize(14);
    doc.text(`Risk Level: ${diagnosis.severityLevel.toUpperCase()}`, 20, yPos);
    yPos += 15;
    
    // Symptoms
    doc.setFontSize(14);
    doc.text("Symptoms:", 20, yPos);
    yPos += 7;
    doc.setFontSize(11);
    diagnosis.symptoms.forEach(symptom => {
      doc.text(`• ${symptom}`, 25, yPos);
      yPos += 6;
    });
    yPos += 5;
    
    // Cause
    doc.setFontSize(14);
    doc.text("Cause:", 20, yPos);
    yPos += 7;
    doc.setFontSize(11);
    const causeLines = doc.splitTextToSize(diagnosis.cause, pageWidth - 40);
    doc.text(causeLines, 20, yPos);
    yPos += causeLines.length * 6 + 5;
    
    // Treatment
    doc.setFontSize(14);
    doc.text("Recommended Treatment:", 20, yPos);
    yPos += 7;
    doc.setFontSize(11);
    const treatmentLines = doc.splitTextToSize(diagnosis.treatment, pageWidth - 40);
    doc.text(treatmentLines, 20, yPos);
    yPos += treatmentLines.length * 6 + 5;
    
    if (diagnosis.dosage) {
      doc.text(`Dosage: ${diagnosis.dosage}`, 20, yPos);
      yPos += 10;
    }
    
    // Organic Alternative
    if (diagnosis.organicAlternative) {
      doc.setFontSize(14);
      doc.text("Organic Alternative:", 20, yPos);
      yPos += 7;
      doc.setFontSize(11);
      const organicLines = doc.splitTextToSize(diagnosis.organicAlternative, pageWidth - 40);
      doc.text(organicLines, 20, yPos);
      yPos += organicLines.length * 6 + 5;
    }
    
    // Check if new page needed
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Products
    doc.setFontSize(14);
    doc.text("Recommended Products:", 20, yPos);
    yPos += 7;
    doc.setFontSize(11);
    diagnosis.recommendedProducts.forEach(product => {
      doc.text(`• ${product}`, 25, yPos);
      yPos += 6;
    });
    yPos += 5;
    
    // Prevention
    doc.setFontSize(14);
    doc.text("Prevention Tips:", 20, yPos);
    yPos += 7;
    doc.setFontSize(11);
    diagnosis.prevention.forEach(tip => {
      const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 45);
      doc.text(tipLines, 25, yPos);
      yPos += tipLines.length * 6;
    });
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated by Agricultural Pulse Health Center", pageWidth / 2, footerY, { align: "center" });
    doc.text("For professional advice, consult a veterinarian or agronomist", pageWidth / 2, footerY + 5, { align: "center" });
    
    // Save
    doc.save(`health-diagnosis-${new Date().getTime()}.pdf`);
    
    toast({
      title: "PDF Downloaded",
      description: "Your diagnosis report has been downloaded successfully.",
    });
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);

    // Simulate AI response (replace with actual Lovable AI integration)
    setTimeout(() => {
      let response = "";
      
      if (userMessage.toLowerCase().includes("agrovet") || userMessage.toLowerCase().includes("nearest")) {
        response = `Based on your location, here are the nearest agrovets:

**1. Farmkey Agrovet**
- Distance: 2.3 km
- Location: Opposite Total Petrol Station, Main Road
- Opening Hours: Mon-Sat 8AM-6PM
- Contact: +254 712 345 678

**2. Green Valley Agro-Supplies**
- Distance: 3.8 km
- Location: Next to Equity Bank, Town Center
- Opening Hours: Mon-Sun 7AM-7PM
- Contact: +254 722 456 789

Would you like directions to any of these?`;
      } else if (diagnosis) {
        response = `Based on the diagnosis of **${diagnosis.disease}**, here's my advice:

${diagnosis.treatment}

${diagnosis.dosage ? `**Dosage:** ${diagnosis.dosage}` : ''}

**Organic Alternative:**
${diagnosis.organicAlternative}

**Prevention Tips:**
${diagnosis.prevention.map(tip => `• ${tip}`).join('\n')}

Would you like more specific advice about treatment application or prevention methods?`;
      } else {
        response = `Hello! I'm your AI Agronomist assistant. I can help you with:

• Plant disease diagnosis and treatment
• Animal health issues and medications
• Organic farming alternatives
• Prevention strategies
• Finding nearest agrovets
• Dosage recommendations

Please upload an image first for diagnosis, or describe the symptoms you're observing in your crops or animals.`;
      }

      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsChatLoading(false);
    }, 1500);
  };

  const handleFindAgrovets = () => {
    if (!latitude || !longitude) {
      requestLocation();
    }
    setShowAgrovetsMap(true);
  };

  // Mock agrovet data (replace with actual API call)
  const nearbyAgrovets = [
    {
      name: "Farmkey Agrovet",
      distance: "2.3 km",
      address: "Opposite Total Petrol Station, Main Road",
      hours: "Mon-Sat 8AM-6PM",
      phone: "+254 712 345 678",
      lat: latitude ? latitude + 0.02 : 0,
      lng: longitude ? longitude + 0.02 : 0,
    },
    {
      name: "Green Valley Agro-Supplies",
      distance: "3.8 km",
      address: "Next to Equity Bank, Town Center",
      hours: "Mon-Sun 7AM-7PM",
      phone: "+254 722 456 789",
      lat: latitude ? latitude - 0.03 : 0,
      lng: longitude ? longitude + 0.01 : 0,
    },
    {
      name: "AgroPlus Veterinary & Supplies",
      distance: "5.2 km",
      address: "Industrial Area, Near Nakumatt",
      hours: "Mon-Fri 8AM-5PM",
      phone: "+254 733 567 890",
      lat: latitude ? latitude + 0.04 : 0,
      lng: longitude ? longitude - 0.02 : 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            🌿 Animal & Plant Health Diagnosis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload photos of your crops or animals to get instant AI-powered health diagnosis, 
            treatment recommendations, and prevention tips.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "plant" | "animal")} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="plant" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Plant Health
              </TabsTrigger>
              <TabsTrigger value="animal" className="flex items-center gap-2">
                <Beef className="w-4 h-4" />
                Animal Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plant" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Plant Image</CardTitle>
                  <CardDescription>
                    Take a clear photo of the affected plant parts (leaves, stems, fruits)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setPreviewUrl("");
                            setSelectedFile(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center gap-4">
                          <Button variant="outline" className="gap-2" onClick={handleCameraCapture}>
                            <Camera className="w-5 h-5" />
                            Take Photo
                          </Button>
                          <Button variant="outline" className="gap-2" asChild>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <Upload className="w-5 h-5" />
                              Upload Image
                            </label>
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: JPG, PNG, WEBP (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Type Selection */}
                  <div className="space-y-2">
                    <Label>Select Crop Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose crop type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {plantTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diagnose Button */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleDiagnose}
                    disabled={!selectedFile || !selectedType || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Diagnose Plant"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Animal Image</CardTitle>
                  <CardDescription>
                    Take a clear photo of the affected area or the animal showing symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setPreviewUrl("");
                            setSelectedFile(null);
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center gap-4">
                          <Button variant="outline" className="gap-2" onClick={handleCameraCapture}>
                            <Camera className="w-5 h-5" />
                            Take Photo
                          </Button>
                          <Button variant="outline" className="gap-2" asChild>
                            <label htmlFor="animal-file-upload" className="cursor-pointer">
                              <Upload className="w-5 h-5" />
                              Upload Image
                            </label>
                          </Button>
                          <input
                            id="animal-file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: JPG, PNG, WEBP (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Type Selection */}
                  <div className="space-y-2">
                    <Label>Select Animal Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose animal type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {animalTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diagnose Button */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleDiagnose}
                    disabled={!selectedFile || !selectedType || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Diagnose Animal"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Diagnosis Results */}
          {diagnosis && (
            <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Disease Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">Diagnosis Result</CardTitle>
                      <CardDescription>AI-powered health analysis</CardDescription>
                    </div>
                    <Badge className={getSeverityColor(diagnosis.severityLevel)}>
                      {diagnosis.severityLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">DETECTED DISEASE</p>
                      <p className="text-2xl font-bold text-foreground">{diagnosis.disease}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">CONFIDENCE LEVEL</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${diagnosis.accuracy}%` }}
                          />
                        </div>
                        <span className="text-lg font-semibold">{diagnosis.accuracy}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">SYMPTOMS</p>
                      <ul className="space-y-1">
                        {diagnosis.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span className="text-foreground">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">CAUSE</p>
                      <p className="text-foreground">{diagnosis.cause}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment & Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Treatment & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">RECOMMENDED TREATMENT</p>
                    <p className="text-foreground mb-2">{diagnosis.treatment}</p>
                    {diagnosis.dosage && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Dosage:</span> {diagnosis.dosage}
                      </p>
                    )}
                  </div>

                  {diagnosis.organicAlternative && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">ORGANIC ALTERNATIVE</p>
                      <p className="text-foreground">{diagnosis.organicAlternative}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">RECOMMENDED PRODUCTS</p>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.recommendedProducts.map((product, idx) => (
                        <Badge key={idx} variant="outline">{product}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">PREVENTION TIPS</p>
                    <ul className="space-y-2">
                      {diagnosis.prevention.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <span className="text-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => setShowAgronomistChat(true)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Ask AI Agronomist
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleFindAgrovets}
                    >
                      <MapPin className="w-4 h-4" />
                      Nearest Agrovet
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleDownloadPDF}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* AI Agronomist Chat Dialog */}
      <Dialog open={showAgronomistChat} onOpenChange={setShowAgronomistChat}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>🌿 Ask AI Agronomist</DialogTitle>
            <DialogDescription>
              Get expert advice on crop and animal health. Upload photos, describe symptoms, or ask for treatment recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Tell me what problem you're facing with your crop or animal.</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">You can:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Upload a plant or animal photo (diagnose first)</li>
                      <li>• Describe symptoms</li>
                      <li>• Ask for treatment recommendations</li>
                      <li>• Ask for prevention tips</li>
                      <li>• Ask for the nearest agrovet</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      Example: "My potatoes have brown spots" or "Find me the nearest agrovet"
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 pt-4 border-t">
            <Input
              placeholder="Ask your question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              disabled={isChatLoading}
            />
            <Button 
              onClick={handleSendChatMessage} 
              disabled={isChatLoading || !chatInput.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nearest Agrovet Dialog */}
      <Dialog open={showAgrovetsMap} onOpenChange={setShowAgrovetsMap}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>📍 Nearest Agrovets</DialogTitle>
            <DialogDescription>
              Find agricultural supply stores and veterinary services near you
            </DialogDescription>
          </DialogHeader>
          
          {locationError ? (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">
                  Unable to get your location. Please enable location services and try again.
                </p>
                <Button 
                  onClick={requestLocation} 
                  variant="outline" 
                  className="mt-4"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Enable Location
                </Button>
              </CardContent>
            </Card>
          ) : !latitude || !longitude ? (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Getting your location...
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4">
                {nearbyAgrovets.map((agrovet, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{agrovet.name}</CardTitle>
                          <CardDescription>{agrovet.distance} away</CardDescription>
                        </div>
                        <Badge variant="outline">{idx + 1}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{agrovet.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{agrovet.hours}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{agrovet.phone}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${agrovet.lat},${agrovet.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <NavigationIcon className="w-3 h-3 mr-2" />
                            Get Directions
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a href={`tel:${agrovet.phone}`}>
                            Call Now
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthCenter;
