import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, Calendar, Bug, Sprout, Play, MapPin, 
  Thermometer, Droplets, FlaskConical, Scissors
} from "lucide-react";

interface CropPlanRendererProps {
  content: string;
  county: string;
}

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
  
  // Split by major section headers (lines starting with # or **📍 etc)
  const lines = content.split('\n');
  let currentSection = { type: 'intro', title: '', content: '' };
  
  for (const line of lines) {
    // Check for section headers
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

      {/* Embedded Videos Section */}
      {allVideoUrls.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allVideoUrls.slice(0, 4).map((url, index) => {
                const videoId = extractYouTubeId(url);
                if (!videoId) return null;
                return (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Training Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          ✅ Your personalized crop plan has been fully generated. 
          Save this page for offline reference using the button above.
        </p>
      </div>
    </div>
  );
};
