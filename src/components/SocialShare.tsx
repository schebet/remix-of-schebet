import { Facebook, Twitter, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const { toast } = useToast();
  const fullUrl = `${window.location.origin}${url}`;

  const handleShare = async (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text: description,
              url: fullUrl,
            });
            return;
          } catch (err) {
            console.log("Share canceled");
            return;
          }
        }
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(fullUrl);
          toast({
            title: "Link kopiran!",
            description: "Link je kopiran u clipboard.",
          });
          return;
        } catch (err) {
          toast({
            title: "Greška",
            description: "Nije moguće kopirati link.",
            variant: "destructive",
          });
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">Podelite ovaj članak</h3>
      <div className="flex items-center gap-3 flex-wrap">
        {navigator.share && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleShare("native")}
            className="gap-2 bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Podeli</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare("facebook")}
          className="gap-2 bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-200 hover:scale-105"
        >
          <Facebook className="w-5 h-5" />
          <span className="font-medium">Facebook</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare("twitter")}
          className="gap-2 bg-[#1DA1F2]/10 border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all duration-200 hover:scale-105"
        >
          <Twitter className="w-5 h-5" />
          <span className="font-medium">Twitter</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare("copy")}
          className="gap-2 bg-background/50 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
        >
          <Link2 className="w-5 h-5" />
          <span className="font-medium">Kopiraj link</span>
        </Button>
      </div>
    </div>
  );
};
