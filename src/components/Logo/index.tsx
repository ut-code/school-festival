import { Image } from "@chakra-ui/react";

const logoSvg = new URL("logo.svg", import.meta.url).toString();

export function Logo(): JSX.Element {
  return (
    <a href="https://utcode.net/" target="_blank" rel="noreferrer">
      <Image alt="ut.code();のロゴ" h={8} src={logoSvg} />
    </a>
  );
}
