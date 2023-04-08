import React, { useContext } from "react";
import { Disclosure as HeadlessDisclosure } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { ThemeContext } from "@components/Theme";
import { type Themes } from "@appTypes/Themes";

const themes: Themes = {
  // "px-4", "pt-4", "pb-2", "text-sm"
  common: ["space-y-1 my-2"].join(" "),
  light: ["text-gray-500"].join(" "),
  dark: [""].join(" "),
};

type DisclosurePanelProps = {
  children?: React.ReactNode;
  className?: string;
};

export const DisclosurePanel = ({
  children,
  className,
}: DisclosurePanelProps): React.ReactElement => {
  const { theme } = useContext(ThemeContext);
  return (
    <HeadlessDisclosure.Panel
      className={twMerge(themes.common, themes[theme], className)}
    >
      {children}
    </HeadlessDisclosure.Panel>
  );
};