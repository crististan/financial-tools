import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type DropdownItem = {
    slug: string;
    title: string;
    iconPath?: string;
    shortDescription?: string;
    cta?: {
        href: string;
        text: string;
    }
};

type GroupedCategory = {
    id: string;
    headline: string;
    slug: string;
    tools: {
        slug: string;
        title: string;
        shortDescription: string;
    }[];
};

type NavItemProps = {
    type: string;
    url: string;
    label: string;
    dropdownItems: DropdownItem[];
    groupedItems?: GroupedCategory[];
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


export default function NavItem({ type, url, label, dropdownItems, groupedItems }: NavItemProps) {
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
                            href={item.slug}
                        >
                            {item.shortDescription}
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
                                    <Link href={item.slug}>
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-muted-foreground">
                                            {item.shortDescription}
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
        case "groupedList":
            content = (
                <>
                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="w-[320px] md:w-[400px] max-h-[70vh] overflow-y-auto">
                            {groupedItems?.map((category) => (
                                <div key={category.id} className="mb-3 last:mb-0">
                                    <Link
                                        href={category.slug}
                                        className="block px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] hover:text-[var(--clr-green-500)] transition-colors font-semibold"
                                    >
                                        {category.headline}
                                    </Link>
                                    <ul>
                                        {category.tools.map((tool) => (
                                            <li key={tool.slug}>
                                                <NavigationMenuLink asChild>
                                                    <Link href={tool.slug}>
                                                        <div className="font-medium">{tool.title}</div>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
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
                                        <Link href={item.slug}>{item.title}</Link>
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
