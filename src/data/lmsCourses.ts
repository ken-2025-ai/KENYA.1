export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  videoId?: string;
  tips: string[];
  quiz?: Quiz;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: Module[];
  color: string;
  colorAccent: string;
  certificate: string;
}

export const lmsCourses: Course[] = [
  {
    slug: "organic-farming",
    icon: "♻️",
    title: "Organic Farming",
    tagline: "Chemical-free farming for healthier crops & premium prices",
    description: "Master organic agriculture from soil preparation to certification. Learn natural pest control, composting, and how to access premium organic markets in Kenya.",
    level: "Beginner",
    duration: "6 hours",
    color: "from-green-600 to-emerald-600",
    colorAccent: "green",
    certificate: "Certified Organic Farming Practitioner",
    modules: [
      {
        id: "of-1",
        title: "Introduction to Organic Farming",
        description: "Understand the principles and benefits of organic agriculture",
        lessons: [
          {
            id: "of-1-1",
            title: "What is Organic Farming?",
            duration: "15 min",
            content: "Organic farming is an agricultural system that uses ecologically-based pest controls and biological fertilizers derived largely from animal and plant wastes and nitrogen-fixing cover crops. It excludes synthetic chemicals, GMOs, and irradiation.\n\n**Key Principles:**\n- Health: sustain soil, plant, animal, and human health\n- Ecology: work with living ecological systems and cycles\n- Fairness: ensure equity and fair relationships\n- Care: manage in a precautionary and responsible manner\n\n**Why Go Organic in Kenya?**\nKenya's growing middle class increasingly demands organic produce. Organic products command 20-40% price premiums in Nairobi supermarkets and export markets. The Kenya Organic Agriculture Network (KOAN) supports farmers transitioning to organic methods.",
            tips: ["Start with one crop to learn organic methods", "Document everything from day one for certification", "Join a local organic farming group for support"],
            quiz: {
              question: "What is NOT a principle of organic farming?",
              options: ["Health", "Ecology", "Maximum chemical use", "Fairness"],
              correctIndex: 2,
              explanation: "Organic farming avoids synthetic chemicals entirely. The four principles are Health, Ecology, Fairness, and Care."
            }
          },
          {
            id: "of-1-2",
            title: "Benefits & Market Opportunities",
            duration: "20 min",
            content: "**Health Benefits:**\n- No pesticide residues on produce\n- Higher nutritional content in many crops\n- Safer working environment for farmers\n\n**Economic Benefits:**\n- Premium prices (20-40% above conventional)\n- Lower input costs over time\n- Access to export markets (EU, US)\n- Growing local demand from health-conscious consumers\n\n**Environmental Benefits:**\n- Improved soil health and biodiversity\n- Reduced water pollution\n- Carbon sequestration\n- Protection of pollinators\n\n**Market Channels:**\n- Organic farmers' markets in Nairobi, Mombasa\n- Specialty supermarkets (Chandarana, Zucchini)\n- Export through certified aggregators\n- Direct-to-consumer delivery services",
            tips: ["Research local organic market prices before starting", "Connect with KOAN for market linkages", "Consider group marketing with other organic farmers"],
          },
          {
            id: "of-1-3",
            title: "Transitioning from Conventional Farming",
            duration: "25 min",
            content: "**The Transition Period:**\nTransitioning to organic farming typically takes 2-3 years. During this period:\n- Gradually reduce chemical inputs\n- Build soil health with organic matter\n- Learn biological pest control methods\n- Start certification process\n\n**Step-by-Step Transition Plan:**\n1. **Year 1:** Stop synthetic pesticides, start composting, plant cover crops\n2. **Year 2:** Eliminate synthetic fertilizers, establish beneficial insect habitats\n3. **Year 3:** Apply for certification, implement full organic system\n\n**Managing the Transition Dip:**\nYields may temporarily decrease by 10-20% during transition. Strategies to manage:\n- Transition field by field, not all at once\n- Use high-value crops to offset initial yield losses\n- Access transition support programs from NGOs\n- Sell as 'in-transition' produce at slight premiums",
            tips: ["Don't rush the transition—patience pays off", "Keep detailed records of all inputs and yields", "Seek mentorship from experienced organic farmers"],
            quiz: {
              question: "How long does the organic transition period typically take?",
              options: ["6 months", "1 year", "2-3 years", "5 years"],
              correctIndex: 2,
              explanation: "The standard organic transition period is 2-3 years, during which farmers gradually eliminate synthetic inputs and build soil health."
            }
          }
        ]
      },
      {
        id: "of-2",
        title: "Soil Health & Composting",
        description: "Build fertile soil naturally with composting and soil management",
        lessons: [
          {
            id: "of-2-1",
            title: "Understanding Soil Biology",
            duration: "20 min",
            content: "**The Living Soil:**\nHealthy soil teems with life—bacteria, fungi, earthworms, and countless microorganisms that form a complex web of life.\n\n**Key Soil Organisms:**\n- **Bacteria:** Break down organic matter, fix nitrogen\n- **Mycorrhizal fungi:** Extend root systems, improve nutrient uptake\n- **Earthworms:** Aerate soil, create nutrient-rich castings\n- **Nematodes:** Regulate bacterial and fungal populations\n\n**Soil Health Indicators:**\n- Dark color (rich in organic matter)\n- Crumbly texture (good aggregation)\n- Earthy smell (healthy microbial activity)\n- Presence of earthworms (biological activity)\n- Good water infiltration (proper structure)\n\n**Testing Your Soil:**\nGet soil tested at KARI or private labs for pH, nutrients, and organic matter content. Cost: KES 500-2,000 per sample.",
            tips: ["Test soil every season to track improvement", "Count earthworms—aim for 10+ per shovelful", "Avoid disturbing soil unnecessarily"],
          },
          {
            id: "of-2-2",
            title: "Making Quality Compost",
            duration: "30 min",
            content: "**Composting Basics:**\nCompost transforms farm waste into 'black gold'—rich organic fertilizer.\n\n**Materials Needed:**\n- **Greens (nitrogen-rich):** Fresh manure, green plant waste, kitchen scraps\n- **Browns (carbon-rich):** Dry leaves, straw, sawdust, corn stalks\n- **Water:** Keep moist like a wrung-out sponge\n- **Air:** Turn regularly for aerobic decomposition\n\n**Step-by-Step Composting:**\n1. Choose a shaded spot near water source\n2. Layer browns and greens (3:1 ratio)\n3. Add thin layers of soil between layers\n4. Moisten each layer thoroughly\n5. Turn pile every 2 weeks\n6. Compost is ready in 2-3 months when dark, crumbly, and earthy-smelling\n\n**Quantities:**\nApply 5-10 tonnes per acre for most crops. Start composting 3 months before planting season.",
            tips: ["Keep compost pile covered during heavy rains", "Add wood ash for extra potassium", "Use a thermometer—aim for 55-65°C in active pile"],
            quiz: {
              question: "What is the ideal ratio of browns to greens in a compost pile?",
              options: ["1:1", "2:1", "3:1", "5:1"],
              correctIndex: 2,
              explanation: "A 3:1 ratio of carbon-rich browns to nitrogen-rich greens provides the optimal balance for efficient composting."
            }
          },
          {
            id: "of-2-3",
            title: "Natural Fertilizer Recipes",
            duration: "25 min",
            content: "**Liquid Fertilizers:**\n\n**1. Compost Tea:**\n- Fill a sack with finished compost\n- Submerge in a barrel of water for 3-5 days\n- Stir daily, strain, and apply as foliar spray\n- Rich in beneficial microorganisms\n\n**2. Bokashi Juice:**\n- Fermented organic matter liquid\n- High in beneficial bacteria\n- Dilute 1:100 with water before applying\n\n**3. Green Manure Tea:**\n- Soak fresh Tithonia or Mexican sunflower in water\n- Ferment for 2 weeks\n- Rich in nitrogen and phosphorus\n- Excellent for vegetables\n\n**Solid Fertilizers:**\n- **Bone meal:** High in phosphorus for root development\n- **Wood ash:** Excellent potassium source\n- **Rock phosphate:** Slow-release phosphorus\n- **Neem cake:** Fertilizer + pest deterrent",
            tips: ["Apply liquid fertilizers in the evening to prevent leaf burn", "Tithonia grows wild across Kenya—free nitrogen source!", "Rotate between different natural fertilizers for balanced nutrition"],
          }
        ]
      },
      {
        id: "of-3",
        title: "Natural Pest & Disease Control",
        description: "Protect crops without chemicals using biological methods",
        lessons: [
          {
            id: "of-3-1",
            title: "Biological Pest Control",
            duration: "25 min",
            content: "**Beneficial Insects:**\n- **Ladybugs:** Eat aphids (one ladybug eats 5,000 aphids in its lifetime)\n- **Lacewings:** Predators of aphids, mites, and small caterpillars\n- **Parasitic wasps:** Control caterpillars and whiteflies\n- **Hoverflies:** Larvae feed on aphids\n\n**Attracting Beneficial Insects:**\n- Plant flowering borders (marigolds, sunflowers, dill)\n- Maintain hedgerows and wild areas\n- Avoid broad-spectrum pesticides\n- Provide water sources\n\n**Push-Pull Strategy:**\nDeveloped by ICIPE in Kenya, this intercropping system:\n- **Push:** Desmodium planted between rows repels stem borers\n- **Pull:** Napier grass planted around the border attracts stem borers away\n- Results: 80%+ reduction in stem borer damage in maize",
            tips: ["Plant marigolds around your vegetable garden as pest deterrents", "Learn the Push-Pull system for maize—it's proven in Kenya", "Create insect hotels from bamboo and straw"],
            quiz: {
              question: "In the Push-Pull strategy, what plant 'pushes' stem borers away from maize?",
              options: ["Napier grass", "Marigold", "Desmodium", "Sunflower"],
              correctIndex: 2,
              explanation: "Desmodium planted between maize rows repels (pushes) stem borers, while Napier grass on borders attracts (pulls) them away."
            }
          },
          {
            id: "of-3-2",
            title: "Homemade Organic Sprays",
            duration: "20 min",
            content: "**Neem Oil Spray:**\n- Mix 5ml neem oil + 2ml liquid soap per liter of water\n- Effective against: aphids, whiteflies, caterpillars, beetles\n- Apply every 7-14 days\n- Works as both pesticide and fungicide\n\n**Chili-Garlic Spray:**\n- Blend 100g hot chili + 100g garlic + 1L water\n- Strain and add 5ml liquid soap\n- Dilute 1:10 with water before spraying\n- Repels most chewing insects\n\n**Baking Soda Fungicide:**\n- Mix 1 tablespoon baking soda + 1L water + few drops liquid soap\n- Prevents and treats powdery mildew, black spot\n- Apply weekly as preventive measure\n\n**Wood Ash Solution:**\n- Mix 1 cup wood ash in 5L water\n- Spray on plants to deter soft-bodied insects\n- Also provides potassium to plants",
            tips: ["Always test sprays on a few leaves before full application", "Spray early morning or late evening for best results", "Make fresh batches—organic sprays don't store well"],
          }
        ]
      },
      {
        id: "of-4",
        title: "Organic Certification",
        description: "Navigate the certification process for premium market access",
        lessons: [
          {
            id: "of-4-1",
            title: "Certification Standards & Process",
            duration: "30 min",
            content: "**Certification Bodies in Kenya:**\n- **Encert (East Africa):** Local certification, lower cost\n- **Ecocert:** International recognition, EU/US market access\n- **KOAN PGS:** Participatory Guarantee System for local markets\n\n**Certification Steps:**\n1. Study organic standards (East African Organic Standard)\n2. Implement organic practices for 2-3 years\n3. Keep detailed records of all farm activities\n4. Apply to certification body\n5. Undergo inspection\n6. Receive certification (annual renewal)\n\n**Costs:**\n- PGS (local): KES 5,000-15,000/year\n- Encert: KES 30,000-80,000/year\n- Ecocert (international): KES 100,000-300,000/year\n\n**Group Certification:**\nSmallholders can reduce costs by 60-80% through group certification. Form a group of 10+ farmers with an Internal Control System (ICS).",
            tips: ["Start with PGS certification for local markets", "Join a farmer group to share certification costs", "Keep a daily farm diary—essential for audits"],
            quiz: {
              question: "What is the most affordable certification option for local Kenyan markets?",
              options: ["Ecocert", "USDA Organic", "KOAN PGS", "EU Organic"],
              correctIndex: 2,
              explanation: "KOAN's Participatory Guarantee System (PGS) is the most affordable option at KES 5,000-15,000/year, designed for local markets."
            }
          }
        ]
      }
    ]
  },
  {
    slug: "water-conservation",
    icon: "💧",
    title: "Water Conservation",
    tagline: "Smart irrigation for maximum yields with minimum water",
    description: "Learn efficient water management techniques including drip irrigation, rainwater harvesting, and moisture monitoring to thrive even during dry seasons.",
    level: "Intermediate",
    duration: "5 hours",
    color: "from-blue-600 to-cyan-600",
    colorAccent: "blue",
    certificate: "Water-Smart Farming Specialist",
    modules: [
      {
        id: "wc-1",
        title: "Water in Agriculture",
        description: "Understanding water needs and availability in Kenya",
        lessons: [
          {
            id: "wc-1-1",
            title: "Kenya's Water Challenge",
            duration: "20 min",
            content: "**Water Scarcity in Kenya:**\nKenya is classified as a water-scarce country with only 647 cubic meters per capita per year (global average: 6,000+). Agriculture uses 80% of available water.\n\n**Key Challenges:**\n- Unpredictable rainfall patterns due to climate change\n- Only 20% of Kenya's land receives reliable rainfall\n- Groundwater depletion in many regions\n- Competition between urban and agricultural water use\n\n**Regional Water Availability:**\n- **Highland areas:** 1,200-2,000mm rainfall — generally sufficient\n- **Semi-arid (Machakos, Kitui):** 500-800mm — irrigation essential\n- **Arid (Northern Kenya):** <300mm — specialized techniques needed\n\n**The Opportunity:**\nFarmers who master water conservation can farm profitably even in semi-arid areas, accessing land that others cannot use.",
            tips: ["Know your area's annual rainfall before choosing crops", "Every drop counts—plan water use carefully", "Consider water cost in your crop selection decisions"],
            quiz: {
              question: "What percentage of Kenya's available water is used for agriculture?",
              options: ["40%", "60%", "80%", "95%"],
              correctIndex: 2,
              explanation: "Agriculture consumes approximately 80% of Kenya's available water resources, making efficient water use critical."
            }
          },
          {
            id: "wc-1-2",
            title: "Crop Water Requirements",
            duration: "25 min",
            content: "**Understanding Crop Water Needs:**\nDifferent crops have vastly different water requirements:\n\n| Crop | Water Need (mm/season) | Classification |\n|------|----------------------|----------------|\n| Maize | 500-800 | Medium |\n| Beans | 300-500 | Low-Medium |\n| Tomatoes | 400-600 | Medium |\n| Cabbage | 380-500 | Medium |\n| Watermelon | 400-600 | Medium |\n| Sorghum | 300-500 | Low (drought-tolerant) |\n| Millet | 250-400 | Very Low |\n\n**Water-Smart Crop Selection:**\nIn water-scarce areas, prioritize:\n- Drought-tolerant varieties (e.g., KDV-1 maize)\n- Short-season crops (less total water needed)\n- High-value crops (more income per liter of water)\n- Deep-rooted crops (access deeper soil moisture)",
            tips: ["Match crop choice to available water supply", "Grow drought-tolerant crops as insurance", "Stagger planting to spread water demand"],
          }
        ]
      },
      {
        id: "wc-2",
        title: "Rainwater Harvesting",
        description: "Capture and store rainfall for dry-season farming",
        lessons: [
          {
            id: "wc-2-1",
            title: "Rooftop & Surface Harvesting",
            duration: "30 min",
            content: "**Rooftop Harvesting:**\nA standard mabati (iron sheet) roof of 100m² can harvest:\n- 50,000 liters from 500mm annual rainfall\n- Enough to irrigate 1/4 acre of vegetables\n\n**Components:**\n1. Gutters (half-round or box type)\n2. Downpipes with first-flush diverters\n3. Storage tanks (plastic, ferrocement, or underground)\n4. Filtration system for sediment removal\n\n**Surface Harvesting:**\n- **Zai pits:** Small planting pits that concentrate water and nutrients\n- **Half-moon structures:** Semicircular earth bunds on slopes\n- **Contour bunds:** Earth ridges along contour lines\n- **Road runoff capture:** Channel road water to farm ponds\n\n**Farm Ponds:**\n- Lined with dam liners (KES 150-250/m²)\n- Size: 10m × 10m × 2m = 200,000 liters\n- Can irrigate 1/2 acre for a full dry season\n- Cost: KES 50,000-100,000 including liner",
            tips: ["Clean gutters before rain season starts", "Use a first-flush diverter to keep water clean", "Cover water tanks to prevent mosquito breeding and evaporation"],
            quiz: {
              question: "How much water can a 100m² iron sheet roof harvest with 500mm annual rainfall?",
              options: ["10,000 liters", "25,000 liters", "50,000 liters", "100,000 liters"],
              correctIndex: 2,
              explanation: "100m² × 500mm = 50,000 liters (using the formula: area × rainfall × collection efficiency)."
            }
          }
        ]
      },
      {
        id: "wc-3",
        title: "Efficient Irrigation Systems",
        description: "Modern irrigation techniques for water savings",
        lessons: [
          {
            id: "wc-3-1",
            title: "Drip Irrigation Setup",
            duration: "35 min",
            content: "**Why Drip Irrigation?**\n- Uses 40-60% less water than flood irrigation\n- Delivers water directly to plant roots\n- Reduces weed growth between rows\n- Can be combined with fertigation (fertilizer through drip)\n\n**Components:**\n1. Water source (tank elevated 1-2m)\n2. Main filter (disc or screen type)\n3. Mainline pipe (32-50mm)\n4. Sub-main lines (25-32mm)\n5. Drip lines/tapes (16mm with emitters)\n6. End caps and connectors\n\n**Installation for 1/4 Acre:**\n- Cost: KES 25,000-45,000\n- Drip tape spacing: 30cm for vegetables, 60cm for maize\n- Emitter spacing: 20-30cm\n- Operating pressure: 0.5-1.0 bar (gravity fed from 2m height)\n\n**Maintenance:**\n- Flush lines weekly\n- Clean filters after each irrigation\n- Check for clogged emitters\n- Replace drip tape every 2-3 seasons",
            tips: ["Elevate your water tank at least 2 meters for gravity pressure", "Use a filter—clogged emitters are the #1 problem", "Start with a small area to learn the system"],
          },
          {
            id: "wc-3-2",
            title: "Mulching & Moisture Retention",
            duration: "20 min",
            content: "**Mulching Benefits:**\n- Reduces evaporation by 30-50%\n- Keeps soil temperature stable\n- Suppresses weeds\n- Adds organic matter as it decomposes\n\n**Mulch Materials:**\n- **Dry grass/straw:** Most available, apply 5-10cm thick\n- **Banana leaves:** Excellent moisture retention\n- **Black plastic:** Most effective but costly, not biodegradable\n- **Sawdust:** Good but use aged only (fresh sawdust robs nitrogen)\n- **Napier grass cuttings:** Readily available, decomposes quickly\n\n**Application:**\n- Apply after planting and first watering\n- Keep mulch 5cm away from plant stems (prevents rot)\n- Replenish as it decomposes\n- Combine with drip irrigation for maximum water savings (up to 70% reduction)",
            tips: ["Dry grass is free and effective—no need for expensive mulch", "Mulch between rows, not on top of plants", "Combine mulching with drip for best results"],
            quiz: {
              question: "By how much can mulching reduce water evaporation?",
              options: ["10-15%", "20-25%", "30-50%", "70-80%"],
              correctIndex: 2,
              explanation: "Mulching can reduce soil water evaporation by 30-50%, significantly reducing irrigation needs."
            }
          }
        ]
      }
    ]
  },
  {
    slug: "soil-management",
    icon: "🌾",
    title: "Soil Management",
    tagline: "Build fertile soil for generations of productivity",
    description: "Learn to build, maintain, and restore soil health through crop rotation, cover crops, no-till farming, and soil testing techniques.",
    level: "Intermediate",
    duration: "5.5 hours",
    color: "from-amber-600 to-yellow-600",
    colorAccent: "amber",
    certificate: "Soil Health Management Specialist",
    modules: [
      {
        id: "sm-1",
        title: "Understanding Your Soil",
        description: "Learn soil types, testing, and what your soil needs",
        lessons: [
          {
            id: "sm-1-1",
            title: "Soil Types in Kenya",
            duration: "25 min",
            content: "**Major Soil Types:**\n\n**1. Red Volcanic Soils (Nitisols)**\n- Found: Central Kenya highlands (Kiambu, Murang'a, Nyeri)\n- Properties: Deep, well-drained, fertile\n- Best crops: Coffee, tea, maize, vegetables\n- pH: 4.5-6.0 (slightly acidic)\n\n**2. Black Cotton Soils (Vertisols)**\n- Found: Rift Valley floor, parts of Western Kenya\n- Properties: High clay content, cracks when dry, sticky when wet\n- Best crops: Wheat, barley, sunflower\n- Challenge: Difficult to work, poor drainage\n\n**3. Sandy Soils (Arenosols)**\n- Found: Coastal areas, parts of Eastern Kenya\n- Properties: Good drainage, low nutrient retention\n- Best crops: Coconut, cashew, cassava\n- Challenge: Needs frequent fertilization and irrigation\n\n**4. Loam Soils**\n- Found: Trans-Nzoia, Uasin Gishu\n- Properties: Ideal mix of sand, silt, and clay\n- Best crops: Almost anything\n- pH: 5.5-7.0 (optimal range)",
            tips: ["Do a simple jar test: fill a jar with soil and water, shake, and let settle to see your sand/silt/clay ratio", "Red soil usually means good iron content but may need lime", "Black cotton soil needs raised beds for vegetables"],
            quiz: {
              question: "Which soil type is most commonly found in Kenya's Central Highlands?",
              options: ["Black Cotton Soils", "Sandy Soils", "Red Volcanic Soils", "Loam Soils"],
              correctIndex: 2,
              explanation: "Red Volcanic Soils (Nitisols) are characteristic of Kenya's Central Highlands and are excellent for coffee and tea production."
            }
          },
          {
            id: "sm-1-2",
            title: "Soil Testing & Interpretation",
            duration: "20 min",
            content: "**Why Test Soil?**\n- Avoid over- or under-fertilizing (saves money)\n- Identify nutrient deficiencies before they affect yields\n- Monitor soil health improvement over time\n- Meet certification requirements\n\n**What to Test:**\n- **pH:** Affects nutrient availability (ideal: 5.5-7.0)\n- **Nitrogen (N):** For leaf growth and green color\n- **Phosphorus (P):** For roots, flowers, and fruits\n- **Potassium (K):** For disease resistance and quality\n- **Organic matter:** Indicator of overall soil health\n- **Micronutrients:** Zinc, boron, manganese etc.\n\n**Where to Test:**\n- KALRO labs: KES 1,000-2,000\n- University labs (UoN, Egerton): KES 800-1,500\n- Private labs (SGS, Cropnuts): KES 2,000-5,000\n\n**Sampling Protocol:**\n1. Divide farm into uniform zones\n2. Take 10-15 sub-samples per zone at 0-20cm depth\n3. Mix sub-samples thoroughly\n4. Send 500g in a clean bag\n5. Test before each major planting season",
            tips: ["Test soil at the same time each year for consistent results", "Take samples in a zigzag pattern across the field", "Keep records of all soil test results to track trends"],
          }
        ]
      },
      {
        id: "sm-2",
        title: "Crop Rotation & Cover Crops",
        description: "Manage soil fertility through strategic planting",
        lessons: [
          {
            id: "sm-2-1",
            title: "Crop Rotation Plans",
            duration: "25 min",
            content: "**Why Rotate Crops?**\n- Breaks pest and disease cycles\n- Balances nutrient use (legumes add nitrogen)\n- Improves soil structure\n- Increases yields by 10-25%\n\n**Simple 4-Season Rotation:**\n1. **Season 1:** Heavy feeder (maize, cabbage)\n2. **Season 2:** Legume (beans, peas) — fixes nitrogen\n3. **Season 3:** Root crop (carrots, potatoes)\n4. **Season 4:** Light feeder (onions, herbs)\n\n**Kenyan Maize-Bean Rotation:**\n- Long rains: Maize (heavy feeder)\n- Short rains: Beans (nitrogen fixer)\n- Result: 20-30% higher maize yields in following season\n\n**Rules of Rotation:**\n- Never plant same family consecutively (e.g., tomato after pepper)\n- Follow heavy feeders with legumes\n- Include deep-rooted crops to break hardpan\n- Maintain rotation records",
            tips: ["The simplest rotation: alternate maize and beans every season", "Add cowpeas as a cover crop between main seasons", "Group crops by family to plan rotations easily"],
            quiz: {
              question: "By how much can crop rotation increase yields?",
              options: ["1-5%", "5-10%", "10-25%", "50-100%"],
              correctIndex: 2,
              explanation: "Well-planned crop rotation can increase yields by 10-25% through improved soil fertility and reduced pest pressure."
            }
          },
          {
            id: "sm-2-2",
            title: "Cover Crops & Green Manure",
            duration: "20 min",
            content: "**What are Cover Crops?**\nCrops grown primarily to benefit the soil rather than for harvest. They:\n- Prevent soil erosion during off-seasons\n- Add organic matter when incorporated\n- Fix nitrogen (legume cover crops)\n- Suppress weeds naturally\n\n**Best Cover Crops for Kenya:**\n\n| Crop | N-Fixing | Growth Period | Best Region |\n|------|----------|---------------|-------------|\n| Mucuna (Velvet bean) | Yes | 3-4 months | Lowlands |\n| Crotalaria | Yes | 2-3 months | All regions |\n| Cowpea | Yes | 2-3 months | Semi-arid |\n| Dolichos lablab | Yes | 3-4 months | All regions |\n| Desmodium | Yes | Perennial | Highlands |\n\n**How to Use:**\n1. Plant cover crop after main harvest\n2. Allow to grow for 6-8 weeks\n3. Cut/slash before flowering\n4. Incorporate into soil or leave as mulch\n5. Wait 2 weeks, then plant main crop",
            tips: ["Mucuna is excellent for rehabilitating degraded soils", "Leave cover crop roots in soil—they add organic matter", "Dual-purpose: cowpea gives you food AND soil improvement"],
          }
        ]
      },
      {
        id: "sm-3",
        title: "No-Till & Conservation Agriculture",
        description: "Protect soil structure with minimum tillage",
        lessons: [
          {
            id: "sm-3-1",
            title: "Minimum Tillage Techniques",
            duration: "25 min",
            content: "**Why Minimum Tillage?**\nExcessive plowing destroys soil structure, kills beneficial organisms, and increases erosion. Conservation agriculture maintains soil health through:\n\n**Three Principles:**\n1. **Minimum soil disturbance:** Direct seeding into untilled soil\n2. **Permanent soil cover:** Mulch or cover crops always on surface\n3. **Crop rotation:** Diversify crops planted\n\n**Practical Steps:**\n- Use a jab planter or dibble stick instead of plowing\n- Apply herbicide (or manual weeding) instead of tillage for weed control\n- Maintain crop residues on the surface\n- Use rip lines only where compaction is severe\n\n**Benefits Over Time:**\n- Year 1-2: Similar yields, lower costs\n- Year 3-5: Improving yields, much better soil\n- Year 5+: Higher yields, drought resilience, lower input costs\n\n**Equipment:**\n- Jab planters: KES 3,000-5,000\n- Direct seeders: KES 50,000-200,000 (tractor-mounted)\n- Hand-pulled rippers: KES 8,000-15,000",
            tips: ["Don't expect immediate results—conservation agriculture rewards patience", "Start with one field to learn the technique", "Keep residues on the surface—don't burn them"],
            quiz: {
              question: "What are the three principles of Conservation Agriculture?",
              options: [
                "Plowing, burning, mono-cropping",
                "Minimum disturbance, soil cover, crop rotation",
                "Deep tillage, irrigation, fertilization",
                "Herbicides, machinery, hybrid seeds"
              ],
              correctIndex: 1,
              explanation: "Conservation Agriculture is based on minimum soil disturbance, permanent soil cover, and crop rotation."
            }
          }
        ]
      }
    ]
  },
  {
    slug: "biodiversity",
    icon: "🐝",
    title: "Biodiversity",
    tagline: "Create thriving ecosystems that boost your farm's productivity",
    description: "Learn to create balanced farm ecosystems that support pollinators, natural pest control, and long-term agricultural sustainability.",
    level: "Intermediate",
    duration: "4 hours",
    color: "from-yellow-500 to-orange-500",
    colorAccent: "yellow",
    certificate: "Biodiversity-Positive Farming Practitioner",
    modules: [
      {
        id: "bd-1",
        title: "Farm Biodiversity Fundamentals",
        description: "Why biodiversity matters for productive farming",
        lessons: [
          {
            id: "bd-1-1",
            title: "The Business Case for Biodiversity",
            duration: "20 min",
            content: "**Why Biodiversity = Profit:**\n\n**Pollination Services:**\n- 75% of food crops depend on pollinators\n- Farms with diverse habitats have 20-30% better pollination\n- Value of pollination to Kenyan agriculture: KES 100+ billion/year\n\n**Natural Pest Control:**\n- Diverse farms have 40-60% fewer pest outbreaks\n- Beneficial insects save farmers KES 10,000-50,000/year in pesticide costs\n- Hedgerows provide habitat for pest predators\n\n**Soil Health:**\n- Diverse root systems improve soil structure\n- Different crops feed different soil organisms\n- Result: better water infiltration and nutrient cycling\n\n**Market Premium:**\n- Biodiversity-certified products command 15-25% premiums\n- Growing consumer demand for 'nature-positive' farming\n- Potential carbon credit income from biodiverse landscapes",
            tips: ["Start counting insect species on your farm—diversity indicates ecosystem health", "Don't clear all wild areas—they harbor beneficial organisms", "Diverse farms are more resilient to climate shocks"],
            quiz: {
              question: "What percentage of food crops depend on pollinators?",
              options: ["25%", "50%", "75%", "90%"],
              correctIndex: 2,
              explanation: "Approximately 75% of food crops benefit from animal pollination, making pollinator conservation crucial for agriculture."
            }
          },
          {
            id: "bd-1-2",
            title: "Companion Planting Strategies",
            duration: "25 min",
            content: "**What is Companion Planting?**\nGrowing complementary plants together for mutual benefits.\n\n**Proven Combinations for Kenya:**\n\n🌽 **Maize + Beans + Squash** (The Three Sisters)\n- Beans fix nitrogen for maize\n- Maize provides structure for climbing beans\n- Squash leaves shade soil, suppress weeds\n\n🍅 **Tomatoes + Basil + Marigolds**\n- Basil repels flies and improves tomato flavor\n- Marigolds repel nematodes and whiteflies\n\n🥕 **Carrots + Onions**\n- Carrot flies dislike onion smell\n- Onion flies dislike carrot smell\n- Mutual protection!\n\n🌶️ **Pepper + Spinach**\n- Peppers shade spinach in hot weather\n- Spinach acts as living mulch\n\n**Plants to NEVER Plant Together:**\n- Tomatoes + potatoes (share diseases)\n- Beans + onions (onions inhibit bean growth)\n- Cabbage + strawberries (attract same pests)",
            tips: ["Start with the Three Sisters—it's the easiest companion planting system", "Plant marigold borders around ALL vegetable beds", "Keep a journal of which combinations work best on your farm"],
          }
        ]
      },
      {
        id: "bd-2",
        title: "Pollinator Conservation",
        description: "Attract and support bees and other pollinators",
        lessons: [
          {
            id: "bd-2-1",
            title: "Creating Pollinator Habitats",
            duration: "25 min",
            content: "**Kenya's Key Pollinators:**\n- Honeybees (Apis mellifera scutellata)\n- Stingless bees (Meliponini)\n- Carpenter bees\n- Butterflies and moths\n- Hoverflies\n- Sunbirds\n\n**Creating Pollinator-Friendly Farms:**\n\n**1. Flower Strips:**\n- Plant flowering strips along field borders\n- Include: sunflowers, cosmos, lavender, coriander (when flowering)\n- Maintain flowers year-round with succession planting\n\n**2. Bee Hotels:**\n- Bundle bamboo stems of different diameters\n- Hang in sheltered, south-facing locations\n- Provides nesting sites for solitary bees\n\n**3. Water Sources:**\n- Shallow dishes with stones for safe landing\n- Small garden ponds with floating plants\n\n**4. Pesticide-Free Zones:**\n- Never spray during flowering\n- Maintain at least 10m buffer around pollinator habitats\n- Use targeted application methods\n\n**Income Opportunity:**\nBeekeeping alongside farming can add KES 30,000-100,000/year per hive. Kenya's honey commands premium prices.",
            tips: ["Plant sunflowers along fence lines—beautiful and attracts pollinators", "Add 2-3 beehives on your farm for pollination AND honey income", "Never spray insecticides during crop flowering"],
            quiz: {
              question: "How much additional annual income can one beehive provide?",
              options: ["KES 5,000-10,000", "KES 10,000-20,000", "KES 30,000-100,000", "KES 200,000+"],
              correctIndex: 2,
              explanation: "A well-managed beehive in Kenya can generate KES 30,000-100,000 per year from honey and other bee products."
            }
          }
        ]
      }
    ]
  },
  {
    slug: "agroforestry",
    icon: "🌳",
    title: "Agroforestry",
    tagline: "Integrate trees with crops for multiple income streams",
    description: "Learn to combine trees and crops for improved yields, environmental benefits, and diversified income through timber, fruit, and carbon credits.",
    level: "Advanced",
    duration: "6 hours",
    color: "from-emerald-700 to-green-600",
    colorAccent: "emerald",
    certificate: "Agroforestry Systems Specialist",
    modules: [
      {
        id: "af-1",
        title: "Agroforestry Systems",
        description: "Types and implementation of tree-crop systems",
        lessons: [
          {
            id: "af-1-1",
            title: "Agroforestry Models for Kenya",
            duration: "30 min",
            content: "**What is Agroforestry?**\nIntentional integration of trees and shrubs with crops and/or livestock on the same land.\n\n**Main Systems:**\n\n**1. Alley Cropping:**\n- Rows of trees with crops between them\n- Trees: Calliandra, Leucaena, Grevillea\n- Crops: Maize, beans, vegetables in alleys\n- Tree rows spaced 4-6m apart\n- Provides: Fodder, mulch, nitrogen fixation\n\n**2. Boundary Planting:**\n- Trees along farm boundaries\n- Species: Grevillea robusta, Eucalyptus, fruit trees\n- Benefits: Windbreaks, timber, boundary markers\n- Spacing: 2-3m along borders\n\n**3. Scattered Trees (Parkland):**\n- Selected trees throughout cropland\n- Species: Faidherbia albida (remarkable—drops leaves in rainy season!)\n- Maize yields increase 20-30% under Faidherbia\n- Provides: Shade for livestock, nitrogen fixation\n\n**4. Home Gardens:**\n- Intensive multi-layer planting around homestead\n- Upper: Fruit trees (mango, avocado)\n- Middle: Banana, papaya, coffee\n- Lower: Vegetables, herbs\n- Ground: Sweet potato, pumpkin as cover",
            tips: ["Start with boundary planting—least disruption to current farming", "Faidherbia albida is the 'miracle tree' for maize farmers", "Plant trees during long rains for best establishment"],
            quiz: {
              question: "Which tree species actually increases maize yields when growing in the same field?",
              options: ["Eucalyptus", "Cypress", "Faidherbia albida", "Pine"],
              correctIndex: 2,
              explanation: "Faidherbia albida uniquely drops its leaves during the rainy season, providing mulch and nitrogen to crops while not competing for light during the growing season."
            }
          },
          {
            id: "af-1-2",
            title: "Choosing the Right Trees",
            duration: "25 min",
            content: "**Tree Selection Criteria:**\n- Climate suitability for your region\n- Purpose: timber, fruit, fodder, shade, nitrogen-fixing\n- Growth rate and management needs\n- Market demand for products\n- Compatibility with crops below\n\n**Recommended Trees by Region:**\n\n**Highlands (>1,500m):**\n- Grevillea robusta: Timber, windbreak, bee forage\n- Prunus africana: Medicinal bark (high value)\n- Macadamia: Premium nuts for export\n- Avocado (Hass): Booming export market\n\n**Midlands (800-1,500m):**\n- Mango (Kent, Apple): Fruit + shade\n- Calliandra: Fodder + nitrogen fixing\n- Moringa: Superfood leaves, fast-growing\n- Neem: Pest control + medicinal\n\n**Lowlands (<800m):**\n- Cashew: Valuable nuts\n- Coconut: Multiple products\n- Casuarina: Firewood + poles\n- Melia volkensii: Drought-tolerant timber\n\n**Nursery vs. Buying Seedlings:**\n- Nursery seedlings: KES 20-50 each\n- Start your own nursery: KES 2-5 per seedling\n- Selling surplus seedlings = extra income!",
            tips: ["Match trees to your elevation and rainfall", "Hass avocado is extremely profitable—consider as primary tree crop", "Start a tree nursery as a side business"],
          }
        ]
      },
      {
        id: "af-2",
        title: "Carbon Credits from Trees",
        description: "Earn income from your trees' carbon sequestration",
        lessons: [
          {
            id: "af-2-1",
            title: "Carbon Credit Opportunities",
            duration: "25 min",
            content: "**How Carbon Credits Work:**\nTrees absorb CO₂ as they grow. This carbon sequestration can be measured and sold as 'carbon credits' to companies wanting to offset their emissions.\n\n**Potential Income:**\n- 1 hectare of agroforestry sequesters 5-20 tonnes CO₂/year\n- Current price: $5-30 per tonne CO₂\n- Potential income: KES 50,000-500,000/hectare/year\n\n**Programs Available in Kenya:**\n1. **Kenya Agricultural Carbon Project (KACP):** Western Kenya, 60,000+ farmers\n2. **Vi Agroforestry:** Carbon payments for tree planting\n3. **One Acre Fund:** Carbon credit aggregation for smallholders\n4. **Private programs:** Companies buying directly from farmer groups\n\n**Requirements:**\n- Minimum 10-year commitment\n- Accurate tree counting and measurement\n- Regular monitoring and verification\n- Usually done through farmer groups (not individual)\n\n**Getting Started:**\n1. Join or form a farmer group (minimum 50 farmers)\n2. Register interest with carbon project developers\n3. Plant and maintain specified tree species\n4. Keep records of planting and survival rates\n5. Receive payments based on verified sequestration",
            tips: ["Join a farmer group to access carbon credit programs", "Plant indigenous trees—they often qualify and support biodiversity", "Carbon credits are a long-term investment—plant now, earn for decades"],
            quiz: {
              question: "How much CO₂ can 1 hectare of agroforestry sequester per year?",
              options: ["1-2 tonnes", "5-20 tonnes", "50-100 tonnes", "200+ tonnes"],
              correctIndex: 1,
              explanation: "One hectare of agroforestry can sequester 5-20 tonnes of CO₂ per year, depending on tree species and density."
            }
          }
        ]
      }
    ]
  },
  {
    slug: "carbon-credits",
    icon: "⚡",
    title: "Carbon Credits",
    tagline: "Turn sustainable practices into additional farm income",
    description: "Understand carbon farming, credit markets, verification processes, and how to earn income from your environmental stewardship.",
    level: "Advanced",
    duration: "4.5 hours",
    color: "from-purple-600 to-indigo-600",
    colorAccent: "purple",
    certificate: "Carbon Farming & Credits Specialist",
    modules: [
      {
        id: "cc-1",
        title: "Carbon Farming Basics",
        description: "Understanding carbon in agriculture",
        lessons: [
          {
            id: "cc-1-1",
            title: "What is Carbon Farming?",
            duration: "25 min",
            content: "**Carbon Farming Defined:**\nAgricultural practices that sequester carbon in soil and biomass, removing CO₂ from the atmosphere while improving farm productivity.\n\n**How Farms Store Carbon:**\n1. **Soil organic carbon:** Composting, cover crops, reduced tillage\n2. **Above-ground biomass:** Trees, permanent crops, hedgerows\n3. **Below-ground biomass:** Deep-rooted perennials, tree roots\n\n**Carbon Farming Practices:**\n- Conservation agriculture (no-till/minimum tillage)\n- Agroforestry and tree planting\n- Cover cropping and green manures\n- Composting and organic amendments\n- Improved grazing management\n- Biochar application\n\n**The Carbon Market:**\n- **Voluntary market:** Companies buy credits to offset emissions\n- **Compliance market:** Regulated emissions trading schemes\n- **Growing demand:** Global carbon credit market worth $2 billion+ and growing\n\n**Kenya's Position:**\nKenya is a leader in African carbon markets with established infrastructure, verification bodies, and farmer aggregation programs.",
            tips: ["Every sustainable practice you already do may qualify for carbon credits", "Start measuring your farm's carbon—what gets measured gets rewarded", "The carbon credit market is growing fast—early movers benefit most"],
            quiz: {
              question: "Which of these is NOT a way farms store carbon?",
              options: ["Soil organic matter", "Tree biomass", "Burning crop residues", "Root systems"],
              correctIndex: 2,
              explanation: "Burning crop residues releases stored carbon back into the atmosphere. Carbon farming aims to keep carbon stored in soil, trees, and roots."
            }
          },
          {
            id: "cc-1-2",
            title: "Measuring Farm Carbon",
            duration: "20 min",
            content: "**Carbon Measurement Methods:**\n\n**1. Soil Carbon Testing:**\n- Laboratory analysis of soil organic carbon\n- Sample at 0-30cm and 30-60cm depths\n- Test before starting and every 2-3 years\n- Cost: KES 2,000-5,000 per sample\n\n**2. Tree Carbon Estimation:**\n- Measure diameter at breast height (DBH)\n- Use allometric equations to estimate biomass\n- Multiply biomass × 0.47 = carbon content\n- Simple tools: measuring tape, height stick\n\n**3. Digital Tools:**\n- **Farm Carbon Calculator:** Free online tool\n- **Cool Farm Tool:** Comprehensive carbon accounting\n- **Smartphone apps:** Photo-based tree measurement\n\n**Baseline Establishment:**\nBefore starting carbon farming:\n1. Map your farm boundaries (GPS or smartphone)\n2. Test soil carbon in each field\n3. Count and measure existing trees\n4. Document current farming practices\n5. This 'baseline' proves how much additional carbon you store",
            tips: ["Take good baseline measurements now—you can't go back later", "Use your smartphone GPS to map farm boundaries", "Soil carbon testing pays for itself through optimized fertilizer use"],
          }
        ]
      },
      {
        id: "cc-2",
        title: "Accessing Carbon Markets",
        description: "Navigate verification and earn from carbon credits",
        lessons: [
          {
            id: "cc-2-1",
            title: "Carbon Credit Programs for Farmers",
            duration: "30 min",
            content: "**Active Programs in Kenya:**\n\n**1. Kenya Agricultural Carbon Project (KACP)**\n- Region: Western Kenya\n- Farmers: 60,000+\n- Practice: Sustainable agriculture\n- Payment: ~KES 1,000-3,000/farmer/year\n- Managed by: Vi Agroforestry + World Bank\n\n**2. Livelihoods Carbon Fund**\n- Region: Multiple counties\n- Focus: Agroforestry and mangrove restoration\n- Payment: Based on tree survival rates\n- Duration: 20-year commitment\n\n**3. One Acre Fund Carbon**\n- Region: Western Kenya\n- Farmers: 100,000+\n- Practice: Tree planting with farming\n- Payment: Subsidized inputs + direct payments\n\n**4. Emerging Opportunities:**\n- Soil carbon credits (conservation agriculture)\n- Biochar carbon removal credits\n- Livestock methane reduction credits\n- Blue carbon (coastal mangroves)\n\n**How to Join:**\n1. Check if programs operate in your county\n2. Form or join a registered farmer group\n3. Attend training sessions\n4. Implement required practices\n5. Allow monitoring and verification\n6. Receive payments (usually annually)",
            tips: ["Ask your county agricultural extension officer about available programs", "Group formation is essential—most programs don't work with individuals", "Understand the commitment period before signing up"],
            quiz: {
              question: "What is typically required to participate in carbon credit programs?",
              options: ["Individual registration only", "Large farm (50+ acres)", "Joining a farmer group", "University degree"],
              correctIndex: 2,
              explanation: "Most carbon credit programs require farmers to be part of organized groups for efficient aggregation, monitoring, and payment distribution."
            }
          },
          {
            id: "cc-2-2",
            title: "Maximizing Carbon Income",
            duration: "25 min",
            content: "**Stacking Benefits:**\nThe best carbon farmers earn from multiple streams:\n\n1. **Carbon credits:** Direct payment for sequestration\n2. **Higher yields:** Healthy soil produces more\n3. **Lower costs:** Less need for synthetic inputs\n4. **Premium markets:** Sustainability-certified produce\n5. **Biodiversity credits:** Emerging payment for nature protection\n\n**Maximizing Carbon Sequestration:**\n\n**Quick Wins:**\n- Stop burning crop residues (immediate)\n- Apply compost instead of synthetic fertilizers\n- Plant trees on boundaries and contours\n\n**Medium-Term (1-3 years):**\n- Establish agroforestry systems\n- Implement conservation agriculture\n- Plant cover crops in off-seasons\n\n**Long-Term (3+ years):**\n- Build soil organic matter to 3%+\n- Establish diverse tree canopy\n- Create permanent grassland buffer strips\n\n**Record Keeping:**\nMaintain detailed records of:\n- Farming practices and dates\n- Input quantities and types\n- Tree planting and survival\n- Yield data\n- Soil test results\n- Photos (monthly, same locations)",
            tips: ["Stop burning crop residues—it's the easiest win for carbon farming", "Good records are worth real money in carbon verification", "Think of carbon credits as a long-term retirement fund from your farm"],
          }
        ]
      }
    ]
  }
];
