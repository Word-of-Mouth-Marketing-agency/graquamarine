import Image from "next/image";

type ActivityImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
};

function isExternalImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function ActivityImage({
  src,
  alt,
  sizes,
  className = "object-cover object-center",
}: ActivityImageProps) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
    />
  );
}
