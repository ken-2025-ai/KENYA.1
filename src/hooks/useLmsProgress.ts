import { useState, useCallback, useEffect } from "react";

interface LmsProgress {
  completedLessons: string[];
  quizResults: Record<string, boolean>;
  bookmarkedLessons: string[];
  notes: Record<string, string>;
  currentLesson: string | null;
  certificateEarned: boolean;
}

const getStorageKey = (courseSlug: string) => `lms-progress-${courseSlug}`;

const defaultProgress: LmsProgress = {
  completedLessons: [],
  quizResults: {},
  bookmarkedLessons: [],
  notes: {},
  currentLesson: null,
  certificateEarned: false,
};

export function useLmsProgress(courseSlug: string) {
  const [progress, setProgress] = useState<LmsProgress>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(courseSlug));
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(getStorageKey(courseSlug), JSON.stringify(progress));
  }, [progress, courseSlug]);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((p) => ({
      ...p,
      completedLessons: p.completedLessons.includes(lessonId)
        ? p.completedLessons
        : [...p.completedLessons, lessonId],
    }));
  }, []);

  const setQuizResult = useCallback((lessonId: string, passed: boolean) => {
    setProgress((p) => ({ ...p, quizResults: { ...p.quizResults, [lessonId]: passed } }));
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setProgress((p) => ({
      ...p,
      bookmarkedLessons: p.bookmarkedLessons.includes(lessonId)
        ? p.bookmarkedLessons.filter((id) => id !== lessonId)
        : [...p.bookmarkedLessons, lessonId],
    }));
  }, []);

  const setNote = useCallback((lessonId: string, note: string) => {
    setProgress((p) => ({ ...p, notes: { ...p.notes, [lessonId]: note } }));
  }, []);

  const setCurrentLesson = useCallback((lessonId: string | null) => {
    setProgress((p) => ({ ...p, currentLesson: lessonId }));
  }, []);

  const earnCertificate = useCallback(() => {
    setProgress((p) => ({ ...p, certificateEarned: true }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    completeLesson,
    setQuizResult,
    toggleBookmark,
    setNote,
    setCurrentLesson,
    earnCertificate,
    resetProgress,
  };
}
