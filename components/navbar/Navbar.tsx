import Logo from "./Logo";
import NavbarActions from "./navbar-actions";

function Navbar() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
