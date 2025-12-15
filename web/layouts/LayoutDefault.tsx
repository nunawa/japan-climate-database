import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.layer.css";
import "maplibre-gl/dist/maplibre-gl.css";

import { AppShell, Burger, Group, Image, MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link";
import theme from "./theme.js";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: {
            desktop: !opened,
            mobile: !opened,
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <a href="/">
              {" "}
              <Image h={50} fit="contain" src={logoUrl} />{" "}
            </a>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Link href="/" label="ホーム" onClick={toggle} />
          <Link href="/map" label="マップ" onClick={toggle} />
          <Link href="/ranking" label="ランキング" onClick={toggle} />
          <Link href="/about" label="このサイトについて" onClick={toggle} />
        </AppShell.Navbar>
        <AppShell.Main> {children} </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
