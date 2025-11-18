import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Loader2
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
  const { toast } = useToast();

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
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ask AI Agronomist
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      Nearest Agrovet
                    </Button>
                    <Button variant="outline" className="gap-2">
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
    </div>
  );
};

export default HealthCenter;
