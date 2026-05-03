import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter text-brand-primary mb-2">titeZMe</h1>
      </div>
      
      <h2 className="text-8xl font-black mb-4">404</h2>
      <p className="text-xl text-[#888888] mb-8 font-medium">This page doesn't exist</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          href="/" 
          className="bg-[#2a2a2a] text-white px-8 py-3 rounded-full font-bold hover:bg-[#333333] transition-colors"
        >
          Go Home
        </Link>
        <Link 
          href="/" 
          className="bg-brand-primary text-black px-8 py-3 rounded-full font-bold hover:bg-brand-primary/90 transition-colors"
        >
          Find a Barber
        </Link>
      </div>
    </div>
  );
}
