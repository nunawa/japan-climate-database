import {
  Button,
  Container,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconChartBar, IconMap, IconSearch } from "@tabler/icons-react";
import { useData } from "vike-react/useData";
import mapPreviewImage from "../../assets/map-preview.jpg";
import { MetricCards } from "./components/MetricCards";
import { PrefectureStations } from "./components/PrefectureStations";
import type { PageContext } from "./types";

export default function Page() {
  const data = useData<PageContext["data"]>();

  return (
    <Stack gap={0}>
      <Container py="xl">
        <Stack gap="xl">
          <Stack>
            <Title
              size="h1"
              ta="center"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                wordBreak: "auto-phrase",
                textWrap: "pretty",
              }}
            >
              日本の気象データを、見&zwj;て比べて理解する
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              1300地点の気温・降水・日照、暑さ指数（WBGT）をビジュアルで比較
            </Text>
          </Stack>

          <Group justify="center">
            <Button
              component="a"
              href="/map"
              size="lg"
              leftSection={<IconMap size={20} />}
              variant="filled"
            >
              地図で見る
            </Button>
            <Button
              component="a"
              href="/ranking"
              size="lg"
              leftSection={<IconChartBar size={20} />}
              variant="filled"
            >
              ランキングを見る
            </Button>
            <Button
              component="a"
              href="#search"
              size="lg"
              leftSection={<IconSearch size={20} />}
              variant="filled"
            >
              地点をさがす
            </Button>
          </Group>
        </Stack>
      </Container>
      <Divider />
      <Container py="xl" id="search">
        <Stack>
          <Title size="h2" ta="center">
            地点をさがす
          </Title>
          <TextInput
            placeholder="地点名または都道府県名で検索..."
            leftSection={<IconSearch size={16} />}
            size="md"
            disabled
          />
        </Stack>
      </Container>
      <Divider />
      <MetricCards data={data} />
      <Divider />
      <Container py="xl">
        <Stack gap="xl">
          <Stack>
            <Title size="h2" ta="center">
              地図で見る
            </Title>
            <Text c="dimmed" ta="center">
              日本全国1300地点の気象データをインタラクティブな地図上で確認できます
            </Text>
          </Stack>

          <Stack>
            <Image
              src={mapPreviewImage}
              alt="気象データ地図プレビュー"
              radius="sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.href = "/map";
              }}
            />
            <Button
              component="a"
              href="/map"
              size="lg"
              leftSection={<IconMap size={20} />}
            >
              地図ページへ
            </Button>
          </Stack>
        </Stack>
      </Container>
      <Divider />
      <PrefectureStations stations={data.prefectural_capital_stations} />
    </Stack>
  );
}
