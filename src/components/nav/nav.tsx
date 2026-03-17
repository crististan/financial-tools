import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from "./nav-item";
import { CONFIG } from "@/lib/config";
import { getLocalizedToolsFromJson } from "@/lib/tool-data";
import type { CommonDictionary } from "@/dictionaries/en/common";
type NavProps = {
  lang: string;
  common: CommonDictionary;
};

export async function Nav({ lang, common }: NavProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;
  const tools = await getLocalizedToolsFromJson(lang);

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
