
import { Code, Hexagon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="flex items-center text-primary">
            <Hexagon className="h-4 w-4 mr-0.5" />
            <Code className="h-4 w-4" />
          </div>
          <p>© {new Date().getFullYear()} CodePrism. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
