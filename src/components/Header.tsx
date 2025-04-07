
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import Logo from "./Logo";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Check if the current route is a problem page
  const isProblemPage = location.pathname.includes('/problem/');

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
      <div className={`flex h-16 items-center justify-between ${isProblemPage ? 'px-0' : 'container'}`}>
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            className="text-lg font-semibold no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md transition-colors px-2 py-1 flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            <Logo size="lg" />
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
