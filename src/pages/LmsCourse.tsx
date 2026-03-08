import { useState, useMemo, useCallback, useEffect } from "react";
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

  // Flatten all lessons
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />

      {/* Course Header */}
      <div className={`bg-gradient-to-r ${course.color} py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/learn")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Learn
            </Button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{course.icon}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
              </div>
              <p className="text-white/80 text-sm max-w-2xl">{course.tagline}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <Badge className="bg-white/20 text-white border-0">{course.level}</Badge>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" /> {course.duration}
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <BookOpen className="w-3 h-3" /> {allLessons.length} lessons
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Target className="w-3 h-3" /> {course.modules.length} modules
                </div>
              </div>
            </div>
            <div className="text-center flex-shrink-0 hidden md:block">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                  <circle
                    cx="32" cy="32" r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${progressPercent * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
              { id: "learn" as TabType, label: "Lessons", icon: Play },
              { id: "search" as TabType, label: "Search", icon: Search },
              { id: "bookmarks" as TabType, label: "Bookmarks", icon: Bookmark },
              { id: "certificate" as TabType, label: "Certificate", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "bookmarks" && progress.bookmarkedLessons.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {progress.bookmarkedLessons.length}
                  </Badge>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Card */}
            <Card className={`border-2 border-${course.colorAccent}-500/20 bg-gradient-to-br from-${course.colorAccent}-500/5 to-transparent`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">About This Course</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.description}</p>
                <Button
                  onClick={handleStartLearning}
                  className={`bg-gradient-to-r ${course.color} text-white`}
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {progress.completedLessons.length > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Lessons", value: allLessons.length, color: "text-blue-500" },
                { icon: Target, label: "Modules", value: course.modules.length, color: "text-purple-500" },
                { icon: GraduationCap, label: "Completed", value: progress.completedLessons.length, color: "text-green-500" },
                { icon: BarChart3, label: "Progress", value: `${progressPercent}%`, color: "text-amber-500" },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.map((module, mi) => (
                  <div key={module.id} className="border border-border/50 rounded-lg overflow-hidden">
                    <div className="bg-muted/30 p-4">
                      <h3 className="font-bold text-sm">
                        Module {mi + 1}: {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="divide-y divide-border/30">
                      {module.lessons.map((lesson) => {
                        const isCompleted = progress.completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors text-left"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "border-2 border-muted-foreground/30"
                            }`}>
                              {isCompleted && <span className="text-xs">✓</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{lesson.title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.quiz && (
                                <Badge variant="outline" className="text-[10px]">Quiz</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            {!isMobile && (
              <div className="w-72 flex-shrink-0">
                <div className="sticky top-16 border border-border/50 rounded-lg bg-card overflow-hidden max-h-[calc(100vh-120px)]">
                  {sidebarContent}
                </div>
              </div>
            )}

            {/* Lesson Content */}
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
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">Ready to learn?</h2>
                  <p className="text-muted-foreground mb-4">Select a lesson from the sidebar or start from the beginning.</p>
                  <Button onClick={handleStartLearning} className={`bg-gradient-to-r ${course.color}`}>
                    <Play className="w-4 h-4 mr-2" /> Start Learning
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKMARKS TAB */}
        {activeTab === "bookmarks" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              Bookmarked Lessons
            </h2>
            {bookmarkedLessonsData.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookmarked lessons yet. Bookmark lessons to quickly find them later.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {bookmarkedLessonsData.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="cursor-pointer hover:shadow-md transition-all hover:border-primary/20"
                    onClick={() => handleSelectLesson(lesson.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.moduleTitle} • {lesson.duration}</p>
                      </div>
                      <Badge variant={progress.completedLessons.includes(lesson.id) ? "default" : "outline"}>
                        {progress.completedLessons.includes(lesson.id) ? "Completed" : "In Progress"}
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
          <LmsSearch
            course={course}
            completedLessons={progress.completedLessons}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {/* CERTIFICATE TAB */}
        {activeTab === "certificate" && (
          <div className="max-w-2xl mx-auto">
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
