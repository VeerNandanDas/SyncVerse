import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RoadmapGenerator = () => {
  const [topic, setTopic] = useState("");
  const [currentKnowledge, setCurrentKnowledge] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter what you want to learn",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRoadmap("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { topic, currentKnowledge }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setRoadmap(data.roadmap);
      toast({
        title: "Success!",
        description: "Your personalized roadmap is ready",
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link 
          to="/" 
          className="text-sm text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-2 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            AI-Powered <span className="text-gradient">Roadmap Generator</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Get a personalized 5-6 month learning path tailored to your goals
          </p>
        </div>

        <Card className="p-8 border-border bg-card card-glow mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base">What do you want to learn?</Label>
              <Input
                id="topic"
                placeholder="e.g., Full Stack Web Development, Machine Learning, Mobile App Development"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge" className="text-base">What do you already know? (Optional)</Label>
              <Textarea
                id="knowledge"
                placeholder="e.g., I know basic HTML/CSS and have done some JavaScript tutorials..."
                value={currentKnowledge}
                onChange={(e) => setCurrentKnowledge(e.target.value)}
                className="bg-background/50 border-border min-h-[120px]"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </div>
        </Card>

        {roadmap && (
          <Card className="p-8 border-border bg-card card-glow animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Personalized Roadmap
            </h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-sans">
                {roadmap}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerator;
