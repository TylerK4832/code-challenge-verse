
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Code, Hexagon } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="border-b relative z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            className="text-lg font-semibold no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md transition-colors px-2 py-1 flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center text-primary">
              <Hexagon className="h-5 w-5" strokeWidth={2.5}>
                <Code className="h-3 w-3 absolute" strokeWidth={3} />
              </Hexagon>
            </div>
            CodePrism
          </Button>
          <Button
            variant="link"
            className="no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md transition-colors px-2 py-1"
            onClick={() => navigate("/problems")}
          >
            Problems
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
