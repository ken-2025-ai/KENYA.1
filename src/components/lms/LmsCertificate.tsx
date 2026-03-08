import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, Share2, PartyPopper } from "lucide-react";
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

  const handleDownload = () => {
    toast.success("Certificate download starting...", {
      description: "Your certificate will be saved as a PDF.",
    });
    // Generate a simple certificate image
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 710);

    // Title
    ctx.fillStyle = "#166534";
    ctx.font = "bold 48px serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 600, 150);

    // Course title
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(course.title, 600, 280);

    // Certificate name
    ctx.fillStyle = "#374151";
    ctx.font = "24px sans-serif";
    ctx.fillText(course.certificate, 600, 340);

    // Description
    ctx.fillStyle = "#6b7280";
    ctx.font = "20px sans-serif";
    ctx.fillText("This certifies that the learner has successfully completed", 600, 430);
    ctx.fillText(`all ${totalLessons} lessons and assessments in this course.`, 600, 465);

    // Date
    ctx.fillStyle = "#374151";
    ctx.font = "18px sans-serif";
    ctx.fillText(`Issued: ${new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}`, 600, 550);

    // Platform
    ctx.fillStyle = "#16a34a";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Kenya Pulse Connect — Learning Hub", 600, 700);

    // Award icon placeholder
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
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Certificate Locked</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete all {totalLessons} lessons to earn your{" "}
            <span className="font-semibold text-foreground">{course.certificate}</span> certificate.
          </p>
          <div className="h-2 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500`}
              style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedLessons}/{totalLessons} completed
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!certificateEarned) {
    onEarnCertificate();
  }

  return (
    <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          <PartyPopper className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          🎉 Congratulations!
        </h3>
        <p className="text-sm text-muted-foreground mb-2">You've earned the</p>
        <h4 className="text-lg font-bold text-foreground mb-4">{course.certificate}</h4>

        <div className="inline-block p-6 bg-card border-2 border-green-500/20 rounded-2xl shadow-lg mb-6">
          <Award className="w-16 h-16 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">All {totalLessons} lessons completed</p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleDownload} className={`bg-gradient-to-r ${course.color}`}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
