import React, { useEffect, useState } from "react"

interface Props {
  image: string
  name: string
  classname: string|undefined
}
export const Image = ({ image, name, classname }: Props): JSX.Element => {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    setSrc(`${process.env.IMAGE_BASE_PATH}${image}`);
  }, []);

  const handleImageError = (): void => setSrc(`${process.env.IMAGE_BASE_PATH}${image}`);

  return <img className={classname} src={src} alt={name} onError={handleImageError} />;
};