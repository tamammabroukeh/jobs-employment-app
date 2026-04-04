function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
        <i className="fa-solid fa-briefcase text-white" />
      </div>
      <span className="text-xl font-bold text-foreground">JobsPortal</span>
    </div>
  );
}

export default Logo;
