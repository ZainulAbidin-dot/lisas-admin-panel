export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-primary text-primary-foreground h-14 flex items-center justify-center">
      <div className="7xl mx-auto flex justify-center px-4 py-4">
        <p className="text-sm">
          &copy; {year} <span className="font-bold">Lisa's Friend</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};
