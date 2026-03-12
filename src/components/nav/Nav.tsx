import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from "./nav-item";
import { getLocalizedTools, CONFIG } from "@/lib/config";
import type { CommonDictionary } from "@/dictionaries/en/common";
type NavProps = {
  lang: string;
  common: CommonDictionary;
};

export function Nav({ lang, common }: NavProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;
  const tools = getLocalizedTools(common, lang);

  const navTools = tools.map((tool) => ({
    slug: `${prefix}/${tool.slug}`,
    title: tool.title,
    shortDescription: tool.shortDescription,
  }));

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavItem type="link" url={prefix || "/"} label={common.nav.home} dropdownItems={[]} />
        <NavItem type="list" url="" label={common.nav.tools} dropdownItems={navTools} />
        <NavItem type="simpleList" url="" label={common.nav.more} dropdownItems={CONFIG.usefulLinks} />
        <NavItem type="link" url={`${prefix}/contact`} label={common.nav.contact} dropdownItems={[]} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
