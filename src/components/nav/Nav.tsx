import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavItem from "./NavItem";

const tools: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const projects: { title: string; href: string; description: string }[] = [
  {
    title: "Components",
    href: "#",
    description: "Browse all components in the library.",
  },
  {
    title: "Documentation",
    href: "#",
    description: "Learn how to use the library.",
  },
  {
    title: "Blog",
    href: "#",
    description: "Read our latest blog posts.",
  }
];

const samples: { title: string; href: string; }[] = [
  {
    title: "Components",
    href: "/components",
  },
  {
    title: "Documentation",
    href: "/docs",
  },
  {
    title: "Blog",
    href: "/blog",
  }
];

export function Nav() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavItem type="link" url="/" label="Home" dropdownItems={[]} />
        <NavItem type="gridList" url="" label="Tools" dropdownItems={tools} />
        <NavItem type="link" url="/docs" label="Docs" dropdownItems={[]} />
        <NavItem type="list" url="" label="Projects" dropdownItems={projects} />
        <NavItem type="simpleList" url="" label="More" dropdownItems={samples} />
        <NavItem type="link" url="/contact" label="Contact" dropdownItems={[]} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}