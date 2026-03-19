import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from "./nav-item";
import { CONFIG } from "@/lib/config";
import { getCategoriesWithTools } from "@/lib/tool-data";
import type { CommonDictionary } from "@/dictionaries/en/common";
type NavProps = {
  lang: string;
  common: CommonDictionary;
};

export async function Nav({ lang, common }: NavProps) {
  const prefix = lang === "en" ? "" : `/${lang}`;
  const categoriesWithTools = await getCategoriesWithTools(lang);

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavItem type="link" url={prefix || "/"} label={common.nav.home} dropdownItems={[]} />
        <NavItem type="groupedList" url="" label={common.nav.tools} dropdownItems={[]} groupedItems={categoriesWithTools} />
        <NavItem type="simpleList" url="" label={common.nav.more} dropdownItems={CONFIG.usefulLinks} />
        <NavItem type="link" url={`${prefix}/contact`} label={common.nav.contact} dropdownItems={[]} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
