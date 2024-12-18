const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container flex flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CodeVerse. All rights reserved.</p>
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