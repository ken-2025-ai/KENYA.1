import { Button } from "@/components/ui/button";
import { Award, Download, Share2, PartyPopper, Lock, Trophy } from "lucide-react";
import type { Course } from "@/data/lmsCourses";
import { toast } from "sonner";

interface LmsCertificateProps {
  course: Course;
  completedLessons: number;
  totalLessons: number;
  onEarnCertificate: () => void;
  certificateEarned: boolean;
}

export function LmsCertificate({
  course,
  completedLessons,
  totalLessons,
  onEarnCertificate,
  certificateEarned,
}: LmsCertificateProps) {
  const allCompleted = completedLessons >= totalLessons;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleDownload = () => {
    toast.success("Certificate download starting...", { description: "Your certificate will be saved as a PNG." });
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(0, 0, 1200, 800);
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 710);
    ctx.fillStyle = "#166534";
    ctx.font = "bold 48px serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 600, 150);
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(course.title, 600, 280);
    ctx.fillStyle = "#374151";
    ctx.font = "24px sans-serif";
    ctx.fillText(course.certificate, 600, 340);
    ctx.fillStyle = "#6b7280";
    ctx.font = "20px sans-serif";
    ctx.fillText("This certifies that the learner has successfully completed", 600, 430);
    ctx.fillText(`all ${totalLessons} lessons and assessments in this course.`, 600, 465);
    ctx.fillStyle = "#374151";
    ctx.font = "18px sans-serif";
    ctx.fillText(`Issued: ${new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}`, 600, 550);
    ctx.fillStyle = "#16a34a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Kenya Pulse Connect — Learning Hub", 600, 700);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "80px serif";
    ctx.fillText("🏆", 570, 640);

    const link = document.createElement("a");
    link.download = `certificate-${course.slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${course.certificate} - Certificate`,
        text: `I just completed the ${course.title} course on Kenya Pulse Connect! 🎓🌱`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `I just completed the ${course.title} course on Kenya Pulse Connect! 🎓🌱 ${window.location.href}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  if (!allCompleted) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/3 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-9 h-9 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-black mb-2 text-foreground">Certificate Locked</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Complete all <span className="font-bold text-foreground">{totalLessons} lessons</span> to earn your{" "}
            <span className="font-bold text-primary">{course.certificate}</span> certificate.
          </p>
          
          {/* Progress ring */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
              <circle
                cx="56" cy="56" r="48"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${progressPercent * 3.02} 302`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-foreground">{progressPercent}%</span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Complete</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground font-semibold">
            {completedLessons}/{totalLessons} lessons completed
          </p>
        </div>
      </div>
    );
  }

  if (!certificateEarned) {
    onEarnCertificate();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[hsl(var(--success))]/30 bg-gradient-to-br from-[hsl(var(--success))]/5 via-card to-[hsl(var(--gold))]/5 shadow-[var(--shadow-medium)]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMwMC5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgZmlsbD0iIzIyYzU1ZSIgZmlsbC1vcGFjaXR5PSIwLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwSDI4VjBoNHYzNHptLTggMEgyMFYwaDR2MzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[hsl(var(--gold))]/10 rounded-full -translate-y-1/2 blur-3xl" />
      
      <div className="relative p-10 text-center">
        <div className="mb-5">
          <PartyPopper className="w-14 h-14 text-[hsl(var(--accent))] mx-auto animate-bounce" />
        </div>
        <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(145,50%,45%)] bg-clip-text text-transparent">
          Congratulations! 🎉
        </h3>
        <p className="text-sm text-muted-foreground mb-2">You've earned the</p>
        <h4 className="text-xl font-black text-foreground mb-6">{course.certificate}</h4>

        <div className="inline-block p-8 bg-card border-2 border-[hsl(var(--success))]/15 rounded-3xl shadow-[var(--shadow-strong)] mb-8">
          <Trophy className="w-16 h-16 text-[hsl(var(--gold))] mx-auto mb-3" />
          <p className="text-xs text-muted-foreground font-semibold">All {totalLessons} lessons completed</p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleDownload}
            size="lg"
            className="rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-primary-foreground font-bold shadow-[var(--glow-primary)] hover:scale-[1.02] transition-all px-6"
          >
            <Download className="w-4 h-4 mr-2" /> Download Certificate
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare} className="rounded-xl font-bold border-border/50">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}
