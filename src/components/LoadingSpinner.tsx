const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-accent rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
