import { NavLink } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";

export function Link({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive =
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  return (
    <NavLink href={href} label={label} active={isActive} onClick={onClick} />
  );
}
