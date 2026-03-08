import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { lmsCourses } from "@/data/lmsCourses";
import { useLmsProgress } from "@/hooks/useLmsProgress";
import { LmsSidebar } from "@/components/lms/LmsSidebar";
import { LmsLessonView } from "@/components/lms/LmsLessonView";
import { LmsCertificate } from "@/components/lms/LmsCertificate";
import { LmsSearch } from "@/components/lms/LmsSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowLeft,
  Menu,
  BookOpen,
  Clock,
  Award,
  GraduationCap,
  Bookmark,
  Play,
  BarChart3,
  Target,
  Search,
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

type TabType = "learn" | "overview" | "bookmarks" | "certificate" | "search";

export default function LmsCourse() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const course = lmsCourses.find((c) => c.slug === slug);

  const {
    progress,
    completeLesson,
    setQuizResult,
    toggleBookmark,
    setNote,
    setCurrentLesson,
    earnCertificate,
  } = useLmsProgress(slug || "");

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  }, [course]);

  const currentLessonData = useMemo(() => {
    if (!progress.currentLesson) return null;
    return allLessons.find((l) => l.id === progress.currentLesson) ?? null;
  }, [allLessons, progress.currentLesson]);

  const currentLessonIndex = useMemo(() => {
    if (!progress.currentLesson) return -1;
    return allLessons.findIndex((l) => l.id === progress.currentLesson);
  }, [allLessons, progress.currentLesson]);

  const handleSelectLesson = useCallback(
    (lessonId: string) => {
      setCurrentLesson(lessonId);
      setActiveTab("learn");
      setSidebarOpen(false);
    },
    [setCurrentLesson]
  );

  const handleStartLearning = useCallback(() => {
    const firstIncomplete = allLessons.find((l) => !progress.completedLessons.includes(l.id));
    const target = firstIncomplete ?? allLessons[0];
    if (target) {
      setCurrentLesson(target.id);
      setActiveTab("learn");
    }
  }, [allLessons, progress.completedLessons, setCurrentLesson]);

  const handlePrev = currentLessonIndex > 0
    ? () => handleSelectLesson(allLessons[currentLessonIndex - 1].id)
    : null;

  const handleNext = currentLessonIndex < allLessons.length - 1
    ? () => handleSelectLesson(allLessons[currentLessonIndex + 1].id)
    : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/learn")}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  const progressPercent = allLessons.length > 0
    ? Math.round((progress.completedLessons.length / allLessons.length) * 100)
    : 0;

  const bookmarkedLessonsData = allLessons.filter((l) =>
    progress.bookmarkedLessons.includes(l.id)
  );

  const sidebarContent = (
    <LmsSidebar
      course={course}
      currentLessonId={progress.currentLesson}
      completedLessons={progress.completedLessons}
      bookmarkedLessons={progress.bookmarkedLessons}
      onSelectLesson={handleSelectLesson}
      totalLessons={allLessons.length}
    />
  );

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Layers },
    { id: "learn" as TabType, label: "Lessons", icon: Play },
    { id: "search" as TabType, label: "Search", icon: Search },
    { id: "bookmarks" as TabType, label: "Saved", icon: Bookmark },
    { id: "certificate" as TabType, label: "Certificate", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ═══════ PREMIUM HERO HEADER ═══════ */}
      <div className="relative overflow-hidden">
        {/* Background layers */}
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMwMC5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwSDI4VjBoNHYzNHptLTggMEgyMFYwaDR2MzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-6 right-[10%] w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-4 left-[15%] w-24 h-24 rounded-full bg-white/5 blur-xl" />

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/learn")}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium mb-6 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Learning Hub</span>
            <span className="mx-1">/</span>
            <span className="text-white/80">Course</span>
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              {/* Course icon + title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg border border-white/10">
                  {course.icon}
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-white/70 text-sm md:text-base mt-1 font-medium">{course.tagline}</p>
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  <Sparkles className="w-3 h-3" /> {course.level}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  <Clock className="w-3 h-3" /> {course.duration}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  <BookOpen className="w-3 h-3" /> {allLessons.length} Lessons
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  <Target className="w-3 h-3" /> {course.modules.length} Modules
                </div>
              </div>
            </div>

            {/* Progress ring - desktop */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progressPercent * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{progressPercent}%</span>
                </div>
              </div>
              <span className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ TAB NAVIGATION ═══════ */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === "bookmarks" && progress.bookmarkedLessons.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {progress.bookmarkedLessons.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-primary rounded-t-full" />
                )}
              </button>
            ))}

            {/* Mobile sidebar trigger */}
            {isMobile && activeTab === "learn" && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  {sidebarContent}
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="container mx-auto px-4 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Hero CTA Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--shadow-medium)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative p-8 md:p-10">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-[var(--glow-primary)] flex-shrink-0">
                    <BookOpen className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-foreground mb-2">About This Course</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">{course.description}</p>
                    <Button
                      onClick={handleStartLearning}
                      size="lg"
                      className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-primary-foreground shadow-[var(--glow-primary)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02] transition-all duration-300 font-bold px-8"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {progress.completedLessons.length > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Total Lessons", value: allLessons.length, gradient: "from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]" },
                { icon: Layers, label: "Modules", value: course.modules.length, gradient: "from-[hsl(var(--accent))] to-[hsl(var(--accent-glow))]" },
                { icon: CheckCircle, label: "Completed", value: progress.completedLessons.length, gradient: "from-[hsl(var(--success))] to-[hsl(145,50%,45%)]" },
                { icon: TrendingUp, label: "Progress", value: `${progressPercent}%`, gradient: "from-[hsl(var(--gold))] to-[hsl(32,85%,62%)]" },
              ].map((stat, i) => (
                <Card key={i} className="group relative overflow-hidden border border-border/50 hover:border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="relative p-5 text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Curriculum */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-black text-foreground">Course Curriculum</h2>
              </div>

              <div className="space-y-4">
                {course.modules.map((module, mi) => {
                  const moduleCompleted = module.lessons.every((l) =>
                    progress.completedLessons.includes(l.id)
                  );
                  const moduleProgress = module.lessons.filter((l) =>
                    progress.completedLessons.includes(l.id)
                  ).length;

                  return (
                    <Card key={module.id} className="overflow-hidden border border-border/50 hover:border-border/80 transition-colors shadow-sm">
                      {/* Module header */}
                      <div className="bg-gradient-to-r from-muted/50 to-muted/20 px-5 py-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                          moduleCompleted
                            ? "bg-gradient-to-br from-[hsl(var(--success))] to-[hsl(145,50%,45%)] text-white shadow-[var(--glow-success)]"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {moduleCompleted ? <CheckCircle className="w-5 h-5" /> : mi + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground">{module.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs font-bold">
                          {moduleProgress}/{module.lessons.length}
                        </Badge>
                      </div>

                      {/* Lessons list */}
                      <div className="divide-y divide-border/30">
                        {module.lessons.map((lesson, li) => {
                          const isCompleted = progress.completedLessons.includes(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson.id)}
                              className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-all text-left group"
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                isCompleted
                                  ? "bg-[hsl(var(--success))] text-white shadow-sm"
                                  : "border-2 border-border group-hover:border-primary/40"
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <span className="text-[10px] font-bold text-muted-foreground">{li + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                  {lesson.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {lesson.quiz && (
                                  <Badge className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20 text-[10px] font-bold">
                                    Quiz
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground font-medium">{lesson.duration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Certificate Preview */}
            <LmsCertificate
              course={course}
              completedLessons={progress.completedLessons.length}
              totalLessons={allLessons.length}
              onEarnCertificate={earnCertificate}
              certificateEarned={progress.certificateEarned}
            />
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === "learn" && (
          <div className="flex gap-8 animate-fade-in">
            {!isMobile && (
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-16 rounded-2xl border border-border/50 bg-card overflow-hidden max-h-[calc(100vh-100px)] shadow-[var(--shadow-soft)]">
                  {sidebarContent}
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              {currentLessonData ? (
                <LmsLessonView
                  lesson={currentLessonData}
                  course={course}
                  moduleTitle={currentLessonData.moduleTitle}
                  isCompleted={progress.completedLessons.includes(currentLessonData.id)}
                  isBookmarked={progress.bookmarkedLessons.includes(currentLessonData.id)}
                  note={progress.notes[currentLessonData.id] || ""}
                  quizResult={progress.quizResults[currentLessonData.id]}
                  onComplete={() => completeLesson(currentLessonData.id)}
                  onToggleBookmark={() => toggleBookmark(currentLessonData.id)}
                  onSaveNote={(note) => setNote(currentLessonData.id, note)}
                  onQuizComplete={(passed) => setQuizResult(currentLessonData.id, passed)}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  lessonIndex={currentLessonIndex}
                  totalLessons={allLessons.length}
                />
              ) : (
                <div className="text-center py-24">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Ready to learn?</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Select a lesson from the sidebar or jump right in from the beginning.
                  </p>
                  <Button
                    onClick={handleStartLearning}
                    size="lg"
                    className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-primary-foreground shadow-[var(--glow-primary)] font-bold px-8"
                  >
                    <Play className="w-5 h-5 mr-2" /> Start Learning
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKMARKS TAB */}
        {activeTab === "bookmarks" && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent-glow))] flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-black text-foreground">Saved Lessons</h2>
            </div>
            {bookmarkedLessonsData.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">No saved lessons yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Bookmark lessons while studying to quickly find them here later.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarkedLessonsData.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="group cursor-pointer hover:shadow-[var(--shadow-soft)] transition-all border border-border/50 hover:border-primary/20"
                    onClick={() => handleSelectLesson(lesson.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-sm`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lesson.moduleTitle} • {lesson.duration}</p>
                      </div>
                      <Badge
                        className={`text-[10px] font-bold ${
                          progress.completedLessons.includes(lesson.id)
                            ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {progress.completedLessons.includes(lesson.id) ? "✓ Done" : "In Progress"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <div className="animate-fade-in">
            <LmsSearch
              course={course}
              completedLessons={progress.completedLessons}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        )}

        {/* CERTIFICATE TAB */}
        {activeTab === "certificate" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <LmsCertificate
              course={course}
              completedLessons={progress.completedLessons.length}
              totalLessons={allLessons.length}
              onEarnCertificate={earnCertificate}
              certificateEarned={progress.certificateEarned}
            />
          </div>
        )}
      </div>
    </div>
  );
}
