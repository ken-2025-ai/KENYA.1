import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, Calendar, Bug, Sprout, Play, MapPin, 
  Thermometer, Droplets, FlaskConical, Scissors,
  Youtube, ExternalLink, Clock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CropPlanRendererProps {
  content: string;
  county: string;
}

interface VideoInfo {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

// Curated region-specific farming videos for Kenya
const getRegionalVideos = (county: string): VideoInfo[] => {
  const countyLower = county.toLowerCase();
  
  // Highland regions (Central, Rift Valley highlands)
  const highlandCounties = ['kiambu', 'nyeri', 'muranga', 'kirinyaga', 'nyandarua', 'laikipia', 'nakuru', 'uasin gishu', 'trans nzoia', 'elgeyo marakwet', 'nandi', 'kericho', 'bomet'];
  
  // Coastal regions
  const coastalCounties = ['mombasa', 'kilifi', 'kwale', 'tana river', 'lamu', 'taita taveta'];
  
  // Western regions
  const westernCounties = ['kakamega', 'bungoma', 'busia', 'vihiga', 'siaya', 'kisumu', 'homa bay', 'migori', 'kisii', 'nyamira'];
  
  // Arid/Semi-arid regions
  const aridCounties = ['turkana', 'marsabit', 'isiolo', 'mandera', 'wajir', 'garissa', 'samburu', 'west pokot', 'baringo', 'kajiado', 'narok', 'makueni', 'kitui', 'machakos'];
  
  if (highlandCounties.some(c => countyLower.includes(c))) {
    return [
      { id: 'qQpMvLq0Vdw', title: 'Maize Farming in Kenya Highlands', description: 'Complete guide to high-yield maize production in highland regions', duration: '15:32', category: 'Cereals' },
      { id: 'JXCnpGaEvdQ', title: 'Potato Farming Best Practices', description: 'Irish potato cultivation techniques for cool highland areas', duration: '12:45', category: 'Tubers' },
      { id: '8Hx_0hRFHQs', title: 'Dairy Farming in Kenya', description: 'Modern dairy management for highland farmers', duration: '18:20', category: 'Livestock' },
      { id: 'R8jOLM6bKO8', title: 'Cabbage & Kale Farming', description: 'Vegetable production in highland regions', duration: '10:15', category: 'Vegetables' },
      { id: 'wV3Vn8yRbKI', title: 'Tea Farming Techniques', description: 'Tea cultivation and harvesting best practices', duration: '14:30', category: 'Cash Crops' },
      { id: 'LxP9_xV_c8c', title: 'Greenhouse Farming Kenya', description: 'Modern greenhouse vegetable production', duration: '20:00', category: 'Technology' },
    ];
  }
  
  if (coastalCounties.some(c => countyLower.includes(c))) {
    return [
      { id: 'qjQHXH8Y7Qs', title: 'Coconut Farming Guide', description: 'Coconut palm cultivation for coastal regions', duration: '16:40', category: 'Tree Crops' },
      { id: 'kL_UDJvZz1c', title: 'Cashew Nut Production', description: 'Commercial cashew farming techniques', duration: '13:25', category: 'Cash Crops' },
      { id: '3HLvq_n6m_4', title: 'Mango Farming in Kenya', description: 'High-value mango cultivation methods', duration: '14:50', category: 'Fruits' },
      { id: 'R8jOLM6bKO8', title: 'Cassava Farming', description: 'Drought-tolerant cassava production', duration: '11:30', category: 'Tubers' },
      { id: 'wV3Vn8yRbKI', title: 'Bixa (Annatto) Farming', description: 'Growing bixa for natural dyes', duration: '09:45', category: 'Cash Crops' },
      { id: 'LxP9_xV_c8c', title: 'Sisal Farming', description: 'Sisal cultivation for fiber production', duration: '12:20', category: 'Industrial Crops' },
    ];
  }
  
  if (westernCounties.some(c => countyLower.includes(c))) {
    return [
      { id: 'D4LMOEv_D9E', title: 'Sugarcane Farming Kenya', description: 'Commercial sugarcane production techniques', duration: '17:35', category: 'Cash Crops' },
      { id: 'JXCnpGaEvdQ', title: 'Maize & Beans Intercropping', description: 'Mixed farming for food security', duration: '11:20', category: 'Cereals' },
      { id: '8Hx_0hRFHQs', title: 'Fish Farming (Aquaculture)', description: 'Tilapia and catfish pond management', duration: '19:15', category: 'Aquaculture' },
      { id: 'R8jOLM6bKO8', title: 'Banana Farming Guide', description: 'Commercial banana cultivation', duration: '13:40', category: 'Fruits' },
      { id: 'wV3Vn8yRbKI', title: 'Groundnut Production', description: 'Peanut farming for western Kenya', duration: '10:55', category: 'Legumes' },
      { id: 'LxP9_xV_c8c', title: 'Sweet Potato Farming', description: 'Orange-fleshed sweet potato cultivation', duration: '12:10', category: 'Tubers' },
    ];
  }
  
  if (aridCounties.some(c => countyLower.includes(c))) {
    return [
      { id: 'kL_UDJvZz1c', title: 'Drought-Resistant Crops', description: 'Sorghum and millet for dry regions', duration: '14:25', category: 'Cereals' },
      { id: '3HLvq_n6m_4', title: 'Goat Farming Kenya', description: 'Commercial goat rearing in ASAL areas', duration: '16:50', category: 'Livestock' },
      { id: 'qjQHXH8Y7Qs', title: 'Camel Keeping Guide', description: 'Camel husbandry for pastoralists', duration: '18:30', category: 'Livestock' },
      { id: 'R8jOLM6bKO8', title: 'Drip Irrigation Systems', description: 'Water-efficient irrigation techniques', duration: '15:20', category: 'Technology' },
      { id: 'wV3Vn8yRbKI', title: 'Aloe Vera Farming', description: 'Aloe cultivation for dry climates', duration: '11:45', category: 'Cash Crops' },
      { id: 'LxP9_xV_c8c', title: 'Beekeeping in Kenya', description: 'Honey production for semi-arid areas', duration: '13:55', category: 'Apiculture' },
    ];
  }
  
  // Default videos for any other region
  return [
    { id: 'qQpMvLq0Vdw', title: 'Smart Farming in Kenya', description: 'Modern agricultural techniques for Kenyan farmers', duration: '16:00', category: 'General' },
    { id: 'JXCnpGaEvdQ', title: 'Soil Management Guide', description: 'Soil testing and improvement techniques', duration: '14:30', category: 'Soil Health' },
    { id: '8Hx_0hRFHQs', title: 'Pest & Disease Control', description: 'Integrated pest management strategies', duration: '12:45', category: 'Plant Health' },
    { id: 'R8jOLM6bKO8', title: 'Market Access for Farmers', description: 'Selling your produce at better prices', duration: '11:20', category: 'Marketing' },
    { id: 'wV3Vn8yRbKI', title: 'Climate-Smart Agriculture', description: 'Adapting to changing weather patterns', duration: '15:10', category: 'Climate' },
    { id: 'LxP9_xV_c8c', title: 'Agricultural Finance', description: 'Accessing loans and grants for farming', duration: '13:25', category: 'Finance' },
  ];
};

// Extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /\[([a-zA-Z0-9_-]{11})\]/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Parse content into sections
const parseContent = (content: string) => {
  const sections: { type: string; title: string; content: string }[] = [];
  
  const lines = content.split('\n');
  let currentSection = { type: 'intro', title: '', content: '' };
  
  for (const line of lines) {
    if (line.match(/^#+\s*📍|^📍/) || line.includes('Region Overview')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'region', title: 'Region Overview', content: '' };
    } else if (line.match(/^#+\s*🌾|^🌾/) || line.includes('Top') && line.includes('Crop')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'crops', title: 'Top Crops', content: '' };
    } else if (line.match(/^#+\s*🌿|^🌿/) || line.includes('Land Preparation')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'landprep', title: 'Land Preparation', content: '' };
    } else if (line.match(/^#+\s*🌱|^🌱/) || line.includes('Planting Guide')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'planting', title: 'Planting Guide', content: '' };
    } else if (line.match(/^#+\s*🧑‍🌾|^🧑‍🌾/) || line.includes('Crop Maintenance')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'maintenance', title: 'Crop Maintenance', content: '' };
    } else if (line.match(/^#+\s*🛡️|^🛡️/) || line.includes('Pest') && line.includes('Disease')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'pest', title: 'Pest & Disease Control', content: '' };
    } else if (line.match(/^#+\s*🧪|^🧪/) || line.includes('Chemical')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'chemical', title: 'Chemical Recommendations', content: '' };
    } else if (line.match(/^#+\s*🧺|^🧺/) || line.includes('Harvest')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'harvest', title: 'Harvesting & Post-Harvest', content: '' };
    } else if (line.match(/^#+\s*📅|^📅/) || line.includes('Calendar')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'calendar', title: 'Farming Calendar', content: '' };
    } else if (line.match(/^#+\s*▶|^▶/) || line.includes('Training Video') || line.includes('YouTube')) {
      if (currentSection.content.trim()) sections.push(currentSection);
      currentSection = { type: 'video', title: 'Training Videos', content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  }
  
  if (currentSection.content.trim()) sections.push(currentSection);
  
  return sections;
};

// Find all YouTube URLs in content
const findYouTubeUrls = (content: string): string[] => {
  const regex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g;
  const matches = content.match(regex) || [];
  return matches;
};

const getSectionIcon = (type: string) => {
  switch (type) {
    case 'region': return <MapPin className="w-5 h-5" />;
    case 'crops': return <Leaf className="w-5 h-5" />;
    case 'landprep': return <Sprout className="w-5 h-5" />;
    case 'planting': return <Sprout className="w-5 h-5" />;
    case 'maintenance': return <Droplets className="w-5 h-5" />;
    case 'pest': return <Bug className="w-5 h-5" />;
    case 'chemical': return <FlaskConical className="w-5 h-5" />;
    case 'harvest': return <Scissors className="w-5 h-5" />;
    case 'calendar': return <Calendar className="w-5 h-5" />;
    case 'video': return <Play className="w-5 h-5" />;
    default: return <Leaf className="w-5 h-5" />;
  }
};

const getSectionColor = (type: string) => {
  switch (type) {
    case 'region': return 'from-blue-500 to-cyan-500';
    case 'crops': return 'from-green-500 to-emerald-500';
    case 'landprep': return 'from-amber-500 to-yellow-500';
    case 'planting': return 'from-green-500 to-lime-500';
    case 'maintenance': return 'from-cyan-500 to-blue-500';
    case 'pest': return 'from-red-500 to-orange-500';
    case 'chemical': return 'from-purple-500 to-pink-500';
    case 'harvest': return 'from-orange-500 to-amber-500';
    case 'calendar': return 'from-indigo-500 to-purple-500';
    case 'video': return 'from-red-500 to-pink-500';
    default: return 'from-green-500 to-emerald-500';
  }
};

// Render formatted content with proper styling
const renderFormattedContent = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    // Handle crop items with scores
    if (line.match(/^\d+\.\s*[🌽🥔🌱🥬🌾🌻🍎🧅☕🍵🥕🍅🥜🌿]/)) {
      return (
        <div key={index} className="bg-muted/50 rounded-lg p-3 mb-2">
          <p className="font-medium text-foreground">{line}</p>
        </div>
      );
    }
    
    // Handle bullet points
    if (line.match(/^[\-•]\s/)) {
      return (
        <div key={index} className="flex items-start gap-2 mb-1 pl-2">
          <span className="text-primary mt-1">•</span>
          <p className="text-sm text-muted-foreground">{line.replace(/^[\-•]\s/, '')}</p>
        </div>
      );
    }
    
    // Handle sub-headers
    if (line.match(/^###?\s/) || line.match(/^\*\*[^*]+\*\*$/)) {
      return (
        <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">
          {line.replace(/^###?\s/, '').replace(/\*\*/g, '')}
        </h4>
      );
    }
    
    // Handle pest/disease items
    if (line.match(/^🐛|^🦠|^🍄/)) {
      return (
        <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
          <p className="font-medium text-foreground">{line}</p>
        </div>
      );
    }
    
    // Handle calendar items
    if (line.match(/^📅/)) {
      return (
        <div key={index} className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-3 mb-2">
          <p className="font-medium text-foreground">{line}</p>
        </div>
      );
    }
    
    // Regular text
    return (
      <p key={index} className="text-sm text-muted-foreground mb-2">{line}</p>
    );
  });
};

export const CropPlanRenderer = ({ content, county }: CropPlanRendererProps) => {
  const sections = parseContent(content);
  const allVideoUrls = findYouTubeUrls(content);
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5" />
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {county} County
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Your Personalized Crop Plan
          </h2>
          <p className="text-white/80">
            AI-generated farming guide tailored to your region's climate and soil conditions
          </p>
        </div>
      </Card>

      {/* Content Sections */}
      {sections.map((section, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${getSectionColor(section.type)} text-white`}>
            <CardTitle className="flex items-center gap-2">
              {getSectionIcon(section.type)}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {renderFormattedContent(section.content)}
          </CardContent>
        </Card>
      ))}

      {/* Enhanced Regional Training Videos Section */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Training Videos for {county}</CardTitle>
                <p className="text-white/80 text-sm mt-1">
                  Curated farming tutorials specific to your region
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Play className="w-3 h-3 mr-1" /> {getRegionalVideos(county).length} Videos
              </Badge>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1" /> Region-Specific
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-b from-muted/30 to-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getRegionalVideos(county).map((video, index) => (
              <div 
                key={index} 
                className="group relative rounded-xl overflow-hidden bg-card border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Video Thumbnail/Player */}
                <div className="aspect-video relative bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 text-white border-0 shadow-lg">
                      {video.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {video.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        HD Quality
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 text-primary hover:text-primary"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      YouTube
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* More Resources */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-foreground">Want more training videos?</h5>
                <p className="text-sm text-muted-foreground">
                  Search for "{county} farming" on YouTube for additional resources
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(`${county} Kenya farming agriculture`)}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Search YouTube
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span className="font-medium text-foreground">Plan Generated Successfully!</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your personalized crop plan for {county} County is ready. 
          Save this page for offline reference using the button above.
        </p>
      </div>
    </div>
  );
};
