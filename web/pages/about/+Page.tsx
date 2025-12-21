import {
  Anchor,
  Container,
  Divider,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function Page() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title>このサイトについて</Title>

        <Stack gap="md">
          <Text>
            このサイトは、日本各地の気候データを可視化し、地域ごとの気候の違いを理解できるようにすることを目的としています。
          </Text>
          <Text>
            東京の蒸し暑い夏を経験し、日本国内でより快適な気候の地域を知りたいという思いから、暑さ指数（WBGT）の年平均値を地図上にプロットしたのがこのサイトの始まりです。
          </Text>
          <Text>
            一般の方々に、日本各地がどのような気候の傾向にあるのか、地域によってどのように異なるのかを、わかりやすく可視化して理解していただくことを目指しています。
          </Text>

          <Stack gap="xs">
            <Title size="h4">提供データ</Title>
            <List>
              <List.Item>約1,300地点の気温・降水量・日照時間</List.Item>
              <List.Item>約840地点の暑さ指数（WBGT）</List.Item>
            </List>
          </Stack>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title size="h2">データソース</Title>
          <Text>
            本サイトで使用しているデータは、以下の公的機関が提供する気象データを加工して作成しました。
          </Text>
          <List>
            <List.Item>
              気温、降水量、日照時間のデータ：
              <Anchor
                href="https://www.data.jma.go.jp/stats/etrn/index.php"
                target="_blank"
                rel="noopener noreferrer"
              >
                気象庁 2020年平年値
              </Anchor>
            </List.Item>
            <List.Item>
              暑さ指数（WBGT）データ：
              <Anchor
                href="https://www.wbgt.env.go.jp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                環境省熱中症予防情報サイト
              </Anchor>
            </List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title size="h2">免責事項</Title>
          <List>
            <List.Item>
              本サイトで提供されるデータは、公的機関が公開している気象データを基に作成していますが、その正確性や完全性を保証するものではありません。
            </List.Item>
            <List.Item>
              データは参考情報としてご利用ください。重要な判断や意思決定には、必ず公式な情報源をご確認ください。
            </List.Item>
            <List.Item>
              本サイトの利用により生じたいかなる損害についても、運営者は責任を負いかねます。
            </List.Item>
            <List.Item>
              データの内容は予告なく変更される場合があります。
            </List.Item>
          </List>
        </Stack>

        <Divider />

        <Stack gap="md">
          <Title size="h2">制作者</Title>
          <Text>
            このサイトは{" "}
            <Anchor
              href="https://www.nunawa.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              nunawa
            </Anchor>{" "}
            によって制作・運営されています。
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
