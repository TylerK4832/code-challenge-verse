import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-xl font-bold"
              onClick={() => navigate('/problems')}
            >
              CodeVerse
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;