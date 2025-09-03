import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu";
import Link from "next/link";
import Container from "./Container";
import { Nav } from "./nav/Nav";

export default function Header() {
    return (
        <header>
            <Container>
                <div className="flex justify-between items-center">
                    <div>
                        LOGO
                    </div>
                    <Nav />
                </div>
            </Container>
        </header>
    )
}