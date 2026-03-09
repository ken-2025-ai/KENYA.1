import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { lmsCourses, Course } from "@/data/lmsCourses";
import {
  BookOpen,
  Trophy,
  Clock,
  Flame,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Bookmark,
  FileText,
  Sparkles,
  GraduationCap,
  BarChart3,
  Play,
  Zap,
  Activity,
  Sprout,
  Stethoscope,
  MapPin,
} from "lucide-react";

interface CourseProgress {
  completedLessons: string[];
  quizResults: Record<string, boolean>;
  bookmarkedLessons: string[];
  notes: Record<string, string>;
  currentLesson: string | null;
  certificateEarned: boolean;
}

const defaultProgress: CourseProgress = {
  completedLessons: [],
  quizResults: {},
  bookmarkedLessons: [],
  notes: {},
  currentLesson: null,
  certificateEarned: false,
};

function getCourseProgress(slug: string): CourseProgress {
  try {
    const stored = localStorage.getItem(`lms-progress-${slug}`);
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function getTotalLessons(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

function getLessonTitle(course: Course, lessonId: string): string | null {
  for (const m of course.modules) {
    const l = m.lessons.find((l) => l.id === lessonId);
    if (l) return l.title;
  }
  return null;
}

interface EnrichedCourse {
  course: Course;
  progress: CourseProgress;
  totalLessons: number;
  completedCount: number;
  percent: number;
  passedQuizzes: number;
  totalQuizzes: number;
  status: "not-started" | "in-progress" | "completed";
}

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const [now] = useState(() => new Date());

  const enriched: EnrichedCourse[] = useMemo(() => {
    return lmsCourses.map((course) => {
      const progress = getCourseProgress(course.slug);
      const totalLessons = getTotalLessons(course);
      const completedCount = progress.completedLessons.length;
      const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const totalQuizzes = course.modules.reduce(
        (s, m) => s + m.lessons.filter((l) => l.quiz).length,
        0
      );
      const passedQuizzes = Object.values(progress.quizResults).filter(Boolean).length;
      const status: EnrichedCourse["status"] =
        completedCount === 0
          ? "not-started"
          : completedCount >= totalLessons
          ? "completed"
          : "in-progress";
      return { course, progress, totalLessons, completedCount, percent, passedQuizzes, totalQuizzes, status };
    });
  }, []);

  const enrolled = enriched.filter((e) => e.status !== "not-started");
  const completed = enriched.filter((e) => e.status === "completed");
  const inProgress = enriched.filter((e) => e.status === "in-progress");
  const notStarted = enriched.filter((e) => e.status === "not-started");

  const totalCompleted = enriched.reduce((s, e) => s + e.completedCount, 0);
  const totalLessonsAll = enriched.reduce((s, e) => s + e.totalLessons, 0);
  const totalBookmarks = enriched.reduce((s, e) => s + e.progress.bookmarkedLessons.length, 0);
  const totalNotes = enriched.reduce((s, e) => s + Object.keys(e.progress.notes).length, 0);
  const totalCerts = enriched.filter((e) => e.progress.certificateEarned).length;
  const overallPercent = totalLessonsAll > 0 ? Math.round((totalCompleted / totalLessonsAll) * 100) : 0;

  // Build recent activity from all courses
  const recentActivity = useMemo(() => {
    const activities: { icon: string; text: string; course: string; slug: string; time: string }[] = [];
    enriched.forEach((e) => {
      if (e.progress.certificateEarned) {
        activities.push({
          icon: "🏆",
          text: `Earned certificate`,
          course: e.course.title,
          slug: e.course.slug,
          time: "Recently",
        });
      }
      e.progress.completedLessons.slice(-2).forEach((lid) => {
        const title = getLessonTitle(e.course, lid);
        if (title) {
          activities.push({
            icon: "✅",
            text: `Completed "${title}"`,
            course: e.course.title,
            slug: e.course.slug,
            time: "Recently",
          });
        }
      });
      Object.entries(e.progress.quizResults)
        .slice(-2)
        .forEach(([lid, passed]) => {
          activities.push({
            icon: passed ? "🎯" : "❌",
            text: `${passed ? "Passed" : "Failed"} quiz in "${getLessonTitle(e.course, lid) || lid}"`,
            course: e.course.title,
            slug: e.course.slug,
            time: "Recently",
          });
        });
    });
    return activities.slice(0, 10);
  }, [enriched]);

  // Streak (simple mock based on activity)
  const streak = enrolled.length > 0 ? Math.min(enrolled.length * 2, 14) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="fixed inset-0 gradient-mesh-bg pointer-events-none" />
      <div className="relative z-10">
        <Navigation />

        {/* Hero Header */}
        <section className="bg-gradient-hero py-10 md:py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/15 backdrop-blur-sm rounded-2xl">
                      <GraduationCap className="w-8 h-8 text-accent-glow" />
                    </div>
                    <Badge className="bg-white/20 text-primary-foreground border-white/30 backdrop-blur-sm text-sm">
                      <Flame className="w-3.5 h-3.5 mr-1 text-accent-glow" />
                      {streak} Day Streak
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
                    My Learning Dashboard
                  </h1>
                  <p className="text-primary-foreground/80 text-lg">
                    Track your progress across all sustainable farming courses
                  </p>
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  className="shadow-glow-accent font-bold hover:scale-105 transition-all"
                  onClick={() => navigate("/learn")}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Courses
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Courses Started", value: enrolled.length, icon: BookOpen, color: "text-primary" },
              { label: "Lessons Done", value: totalCompleted, icon: CheckCircle, color: "text-success" },
              { label: "Overall Progress", value: `${overallPercent}%`, icon: BarChart3, color: "text-accent" },
              { label: "Certificates", value: totalCerts, icon: Award, color: "text-gold" },
              { label: "Bookmarks", value: totalBookmarks, icon: Bookmark, color: "text-primary" },
              { label: "Notes", value: totalNotes, icon: FileText, color: "text-muted-foreground" },
            ].map((stat) => (
              <Card key={stat.label} className="glass-card hover:shadow-glow-primary/20 transition-all group">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* In Progress Courses */}
              {inProgress.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-accent" />
                    <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
                    <Badge variant="outline" className="ml-auto">{inProgress.length} active</Badge>
                  </div>
                  <div className="space-y-4">
                    {inProgress.map((e) => (
                      <CourseCard key={e.course.slug} data={e} navigate={navigate} />
                    ))}
                  </div>
                </section>
              )}

              {/* Completed Courses */}
              {completed.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-gold" />
                    <h2 className="text-xl font-bold text-foreground">Completed</h2>
                    <Badge className="ml-auto bg-success/10 text-success border-success/20">{completed.length} done</Badge>
                  </div>
                  <div className="space-y-4">
                    {completed.map((e) => (
                      <CourseCard key={e.course.slug} data={e} navigate={navigate} />
                    ))}
                  </div>
                </section>
              )}

              {/* Not Started */}
              {notStarted.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-bold text-foreground">Explore New Courses</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {notStarted.map((e) => (
                      <Card
                        key={e.course.slug}
                        className="glass-card hover:shadow-glow-primary/20 transition-all cursor-pointer group border-dashed"
                        onClick={() => navigate(`/learn/course/${e.course.slug}`)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{e.course.icon}</span>
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {e.course.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{e.course.level} · {e.course.duration}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{e.course.tagline}</p>
                          <Button variant="outline" size="sm" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Play className="w-4 h-4" />
                            Start Course
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

               {/* Empty State */}
               {enrolled.length === 0 && (
                 <Card className="glass-card">
                   <CardContent className="p-12 text-center">
                     <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                     <h3 className="text-xl font-bold text-foreground mb-2">No courses started yet</h3>
                     <p className="text-muted-foreground mb-6">
                       Begin your sustainable farming journey by exploring our courses
                     </p>
                     <Button variant="hero" onClick={() => navigate("/learn")} className="gap-2">
                       <BookOpen className="w-5 h-5" />
                       Browse All Courses
                     </Button>
                   </CardContent>
                 </Card>
               )}

               {/* Specialized Management Systems */}
               <section className="mt-12">
                 <div className="flex items-center gap-2 mb-4">
                   <Sparkles className="w-5 h-5 text-accent" />
                   <h2 className="text-xl font-bold text-foreground">Specialized Management Systems</h2>
                 </div>
                 <p className="text-muted-foreground mb-6">Access our dedicated platforms for comprehensive farm management</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Animal Husbandry */}
                   <Card className="glass-card hover:shadow-glow-primary/20 transition-all group overflow-hidden cursor-pointer"
                     onClick={() => navigate("/farm-equipment")}>
                     <CardContent className="p-6">
                       <div className="flex items-start gap-4 mb-4">
                         <div className="p-3 bg-primary/10 rounded-xl">
                           <Activity className="w-6 h-6 text-primary" />
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-foreground">Animal Husbandry</h3>
                           <p className="text-sm text-muted-foreground">Complete livestock management system</p>
                         </div>
                       </div>
                       <ul className="space-y-2 mb-4">
                         {["Livestock Health Records", "Breeding & Genetics Tracking", "Feed Management & Costs", "Production Analytics"].map((item) => (
                           <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                             {item}
                           </li>
                         ))}
                       </ul>
                       <Button size="sm" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                         Manage Livestock
                         <ArrowRight className="w-4 h-4" />
                       </Button>
                     </CardContent>
                   </Card>

                   {/* Crop Management */}
                   <Card className="glass-card hover:shadow-glow-primary/20 transition-all group overflow-hidden cursor-pointer"
                     onClick={() => navigate("/crop-management")}>
                     <CardContent className="p-6">
                       <div className="flex items-start gap-4 mb-4">
                         <div className="p-3 bg-success/10 rounded-xl">
                           <Sprout className="w-6 h-6 text-success" />
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-foreground">Crop Management</h3>
                           <p className="text-sm text-muted-foreground">Advanced crop planning system</p>
                         </div>
                       </div>
                       <ul className="space-y-2 mb-4">
                         {["Planting & Harvest Planning", "Pest & Disease Management", "Irrigation & Weather Integration", "Yield & Profit Analytics"].map((item) => (
                           <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-success/50" />
                             {item}
                           </li>
                         ))}
                       </ul>
                       <Button size="sm" className="w-full gap-2 group-hover:bg-success group-hover:text-success-foreground transition-colors">
                         Manage Crops
                         <ArrowRight className="w-4 h-4" />
                       </Button>
                     </CardContent>
                   </Card>

                   {/* Agricultural Health Center */}
                   <Card className="glass-card hover:shadow-glow-primary/20 transition-all group overflow-hidden cursor-pointer"
                     onClick={() => navigate("/health-center")}>
                     <CardContent className="p-6">
                       <div className="flex items-start gap-4 mb-4">
                         <div className="p-3 bg-accent/10 rounded-xl">
                           <Stethoscope className="w-6 h-6 text-accent" />
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-foreground">Agricultural Health Center</h3>
                           <p className="text-sm text-muted-foreground">AI-powered diagnosis system</p>
                         </div>
                       </div>
                       <ul className="space-y-2 mb-4">
                         {["Plant Disease Diagnosis", "Animal Health Analysis", "Treatment Recommendations", "Prevention & Care Tips"].map((item) => (
                           <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                             {item}
                           </li>
                         ))}
                       </ul>
                       <Button size="sm" className="w-full gap-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                         Diagnose Health
                         <ArrowRight className="w-4 h-4" />
                       </Button>
                     </CardContent>
                   </Card>

                   {/* Regional Crop Planner */}
                   <Card className="glass-card hover:shadow-glow-primary/20 transition-all group overflow-hidden cursor-pointer"
                     onClick={() => navigate("/crop-planner")}>
                     <CardContent className="p-6">
                       <div className="flex items-start gap-4 mb-4">
                         <div className="p-3 bg-gold/10 rounded-xl">
                           <MapPin className="w-6 h-6 text-gold" />
                         </div>
                         <div>
                           <h3 className="font-bold text-lg text-foreground">Regional Crop Planner</h3>
                           <p className="text-sm text-muted-foreground">Personalized recommendations</p>
                         </div>
                       </div>
                       <ul className="space-y-2 mb-4">
                         {["Top 10 Crops for Your Region", "Seed Varieties & Suppliers", "Planting Calendar & Guides", "Pest Control & Chemicals"].map((item) => (
                           <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                             {item}
                           </li>
                         ))}
                       </ul>
                       <Button size="sm" className="w-full gap-2 group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                         Plan My Crops
                         <ArrowRight className="w-4 h-4" />
                       </Button>
                     </CardContent>
                   </Card>
                 </div>
               </section>
             </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Overall Progress Ring */}
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <TrendingUp className="w-5 h-5" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-6">
                  <div className="relative w-36 h-36 mb-4">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" className="stroke-muted" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallPercent / 100)}`}
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{overallPercent}%</span>
                      <span className="text-xs text-muted-foreground">Complete</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {totalCompleted} of {totalLessonsAll} lessons completed
                  </p>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No activity yet. Start a course!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/learn/course/${a.slug}`)}
                        >
                          <span className="text-lg mt-0.5">{a.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{a.text}</p>
                            <p className="text-xs text-muted-foreground">{a.course} · {a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Star className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: "🌱", label: "First Lesson", earned: totalCompleted >= 1 },
                      { icon: "📚", label: "5 Lessons", earned: totalCompleted >= 5 },
                      { icon: "🎯", label: "Quiz Master", earned: enriched.some((e) => e.passedQuizzes > 0) },
                      { icon: "🔖", label: "Bookworm", earned: totalBookmarks >= 3 },
                      { icon: "🏆", label: "Certificate", earned: totalCerts >= 1 },
                      { icon: "🔥", label: "All Courses", earned: notStarted.length === 0 },
                    ].map((a) => (
                      <div
                        key={a.label}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          a.earned
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/50 opacity-40 grayscale"
                        }`}
                      >
                        <span className="text-2xl mb-1">{a.icon}</span>
                        <span className="text-[10px] font-medium text-foreground text-center leading-tight">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ data, navigate }: { data: EnrichedCourse; navigate: (path: string) => void }) {
  const { course, percent, completedCount, totalLessons, passedQuizzes, totalQuizzes, status, progress } = data;

  return (
    <Card
      className="glass-card hover:shadow-glow-primary/20 transition-all cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/learn/course/${course.slug}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`text-4xl p-3 rounded-2xl bg-gradient-to-br ${course.color} bg-clip-padding flex items-center justify-center shrink-0`}>
            <span className="drop-shadow-md">{course.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {course.title}
              </h3>
              {status === "completed" && (
                <Badge className="bg-success/10 text-success border-success/20 shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Done
                </Badge>
              )}
              {progress.certificateEarned && (
                <Badge className="bg-gold/20 text-gold border-gold/30 shrink-0">
                  <Award className="w-3 h-3 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {course.level} · {course.duration} · {passedQuizzes}/{totalQuizzes} quizzes passed
            </p>
            <div className="flex items-center gap-3">
              <Progress value={percent} className="flex-1 h-2.5" />
              <span className="text-sm font-semibold text-primary shrink-0">{percent}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}
