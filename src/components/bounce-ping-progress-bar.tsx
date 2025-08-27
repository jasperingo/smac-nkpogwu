
export default function BouncePingProgressBar() {
  return (
    <div className="py-8">

      <div className="flex gap-4 justify-center animate-bounce">
        <div className="relative flex size-8">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500"></span>
          <span className="relative inline-flex size-8 rounded-full bg-green-600"></span>
        </div>
        <div className="relative flex size-8">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500"></span>
          <span className="relative inline-flex size-8 rounded-full bg-green-600"></span>
        </div>
        <div className="relative flex size-8">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500"></span>
          <span className="relative inline-flex size-8 rounded-full bg-green-600"></span>
        </div>
      </div>
      
      <div className="w-36 h-2 mx-auto bg-green-600"></div>
        
    </div>
  );
}
