export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="7xl mx-auto flex justify-center px-4 py-4">
        <p className="text-sm text-gray-500">
          &copy; {year} <span className="font-bold">Profile Match</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};
