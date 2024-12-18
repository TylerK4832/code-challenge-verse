import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

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
          <Link
            to="/"
            className="text-lg font-semibold no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md transition-colors px-2 py-1"
          >
            CodeVerse
          </Link>
          <Link
            to="/problems"
            className="no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground rounded-md transition-colors px-2 py-1"
          >
            Problems
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
