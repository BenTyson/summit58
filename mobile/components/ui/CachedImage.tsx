import { Image, type ImageProps } from 'expo-image';

type CachedImageProps = Omit<ImageProps, 'cachePolicy'>;

export function CachedImage(props: CachedImageProps) {
  return <Image cachePolicy="disk" transition={200} {...props} />;
}
