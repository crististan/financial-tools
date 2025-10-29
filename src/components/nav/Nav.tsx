import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from "./nav-item";
import { CONFIG } from "@/lib/config";

const projects: { slug: string; title: string; shortDescription: string }[] = [
  {
    slug: "#",
    title: "Components",
    shortDescription: "Browse all components in the library.",
  },
  {
    slug: "#",
    title: "Documentation",
    shortDescription: "Learn how to use the library.",
  },
  {
    slug: "#",
    title: "Blog",
    shortDescription: "Read our latest blog posts.",
  }
];

export function Nav() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavItem type="link" url="/" label="Home" dropdownItems={[]} />
        <NavItem type="list" url="" label="Tools" dropdownItems={CONFIG.tools} />
        {/* <NavItem type="link" url="/docs" label="Docs" dropdownItems={[]} />
        <NavItem type="list" url="" label="Projects" dropdownItems={projects} /> */}
        <NavItem type="simpleList" url="" label="More" dropdownItems={CONFIG.usefulLinks} />
        <NavItem type="link" url="/contact" label="Contact" dropdownItems={[]} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}