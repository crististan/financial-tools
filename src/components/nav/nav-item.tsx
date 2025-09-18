import {ReactNode } from "react";
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type DropdownItem = {
    title: string;
    href: string;
    description?: string;
};
  

type NavItemProps = {
    type: string;
    url: string;
    label: string;
    dropdownItems: DropdownItem[];
}

function ListItem({
    title,
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
      <li {...props}>
        <NavigationMenuLink asChild>
          <Link href={href}>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
  

export default function NavItem({ type, url, label, dropdownItems }: NavItemProps) {
    let content;

    switch (type) {
        case "link":
            content = (
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={url}>{label}</Link>
                </NavigationMenuLink>
            );
            break;
        case "gridList":
            content = (
                <>
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {dropdownItems.map((item) => (
                        <ListItem
                            key={item.title}
                            title={item.title}
                            href={item.href}
                        >
                            {item.description}
                        </ListItem>
                        ))}
                    </ul>
                    </NavigationMenuContent>
                </>
            );
            break;
        case "list":
            content = (
                <>
                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                {dropdownItems.map((item, index) => (
                                    <NavigationMenuLink key={index}  asChild>
                                    <Link href={item.href}>
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-muted-foreground">
                                            {item.description}
                                        </div>
                                    </Link>
                                    </NavigationMenuLink>
                                ))}
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </>
            );
            break;
        case "simpleList":
            content = (
                <>
                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                {dropdownItems.map((item, index) => (
                                    <NavigationMenuLink key={index} asChild>
                                        <Link href={item.href}>{item.title}</Link>
                                    </NavigationMenuLink>
                                ))}
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </>
            );
            break;
        default:
            content = null;
    }

    return (
        <NavigationMenuItem>
            { content }
        </NavigationMenuItem>
    )
}