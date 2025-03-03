import Image from "next/image";

interface BrandingProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function Branding({ 
  size = "md", 
  showTagline = true, 
  className = "",
  layout = "horizontal"
}: BrandingProps) {
  const logoSizes = {
    sm: { width: 24, height: 24, containerClass: "p-1.5" },
    md: { width: 32, height: 32, containerClass: "p-2" },
    lg: { width: 40, height: 40, containerClass: "p-2.5" },
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const { width, height, containerClass } = logoSizes[size];

  const isHorizontal = layout === "horizontal";

  return (
    <div className={`flex ${isHorizontal ? 'flex-row items-center' : 'flex-col items-center'} ${className}`}>
      <div className={`flex items-center justify-center rounded-full bg-slate-100 ${containerClass}`}>
        <Image
          src="/globe.svg"
          alt="CRM Logo"
          width={width}
          height={height}
          className={`h-${width / 4} w-${height / 4}`}
        />
      </div>
      
      <div className={`${isHorizontal ? 'ml-3' : 'mt-2'} flex flex-col`}>
        <h1 className={`${textSizes[size]} font-semibold tracking-tight text-slate-900`}>
          Scrooge Bank CRM System
        </h1>
        {showTagline && (
          <p className="text-sm text-slate-500">
            Internal management platform
          </p>
        )}
      </div>
    </div>
  );
}
