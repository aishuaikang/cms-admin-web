import { Carousel } from '@mantine/carousel';
import {
  AspectRatio,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  List,
  Paper,
  Space,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

const data = [
  {
    image:
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Best forests to visit in North America',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Hawaii beaches review: better than you think',
    category: 'beach',
  },
  {
    image:
      'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Mountains at night: 12 best locations to enjoy the view',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Aurora in Norway: when to visit for best experience',
    category: 'nature',
  },
  {
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Best places to visit this winter',
    category: 'tourism',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Active volcanos reviews: travel at your own risk',
    category: 'nature',
  },
];

function Index() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  return (
    <Container size={'xl'}>
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        <Carousel
          slideSize={{ base: '100%', sm: '50%' }}
          slideGap={{ base: 'xl', sm: 2 }}
          align="start"
          slidesToScroll={mobile ? 1 : 2}
        >
          {data.map((item) => (
            <Carousel.Slide key={item.title}>
              <Paper
                shadow="md"
                p="xl"
                radius="md"
                style={{ backgroundImage: `url(${item.image})` }}
                className="h-[440px] flex flex-col justify-between items-start bg-cover bg-center"
              >
                <div>
                  <Text
                    className="text-white opacity-70 font-bold uppercase"
                    size="xs"
                  >
                    {item.category}
                  </Text>
                  <Title
                    order={3}
                    className="font-black text-white leading-tight text-2xl mt-2 cursor-default"
                  >
                    {item.title}
                  </Title>
                </div>
                <Button variant="white" color="dark">
                  Read article
                </Button>
              </Paper>
            </Carousel.Slide>
          ))}
        </Carousel>
        <Grid columns={24}>
          <Grid.Col span={16}>
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>合规外部新闻</Text>
                  <Button variant="transparent" size="compact-sm">
                    更多
                  </Button>
                </Group>
              </Card.Section>
              <Space h="md" />
              <List spacing="xs" size="sm" center>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          合规经营依法纳税 护航企业高质量发展
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          合规是企业的立身之本，只有依法合规经营，企业才能行稳致远。依法诚信纳税是企业合规的一个重要方面，随着税收营商环境不断优化、税收法治深入人心，越来越多的企业意识到依法诚信纳税是企业做大做强、实现高质量发展的重要保障。
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">中国税务</Text>
                          <Text size="sm">2024-11-19</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          贵州：为大规模设备更新行动注入“税动力”
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          为充分发挥税收优惠政策保障性和扶持性作用，国家税务总局贵州省税务局也积极发挥税收职能作用，梳理了设备换新相关的税收优惠政策，结合贵州企业特点和需求，有针对性地给企业提供政策支持和服务辅导，助力企业加速老旧设备淘汰、应用先进设备、优化工艺流程，为企业增加先进产能、提高生产效率加入“税动力”。
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">国家税务总局贵州省税务局</Text>
                          <Text size="sm">2025-02-17</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          国务院新闻办举行税收服务高质量发展新闻发布会
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          2024年是贯彻落实《意见》的巩固提升之年，税务部门将全面实施深化税收征管改革提升行动，集成发挥技术、业务、组织“三大变革”效应，着力建设国际一流、中国特色的智慧税务，奋力谱写高质量推进中国式现代化的税务实践新篇章。
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">国新网</Text>
                          <Text size="sm">2024-01-18</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
              </List>
            </Card>
            <Space h="md" />
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>合规百灵</Text>
                  <Button variant="transparent" size="compact-sm">
                    更多
                  </Button>
                </Group>
              </Card.Section>
              <Space h="md" />
              <List spacing="xs" size="sm" center>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          国内首例！贵州百灵“糖宁通络片”获批直接开展III期临床试验
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          其子公司“百灵毓秀（珠海）医药有限公司”收到国家药品监督管理局核准签发的《药物临床试验批准通知书》，同意中药1.1类新药糖宁通络片开展用于治疗糖尿病视网膜病变（DR）的III期临床试验。
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">2024-11-12</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          贵州省副省长罗强赴贵州百灵调研座谈
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          贵州省副省长罗强率队到安顺经开区调研医药及旅游食品产业发展，莅临贵州百灵企业集团实地调研并召开座谈会。他强调，要抓好企业帮扶，推动企业聚焦主业，加强产品研发、品牌建设和市场拓展，守牢安全底线，不断做大做强
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">2024-12-05</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          连续9年！贵州百灵再度荣膺“2024年度中国非处方药企业及产品榜”
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          12月20日至22日，由中国非处方药物协会主办的“第二届OTC品牌大会”在北京隆重举行。本次大会以“相信品牌的力量”为主题，旨在构建推动OTC品牌高质量发展的“行业生态平台”，为我国OTC品牌的发展提供新思维、新动力、新模式。
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">2024-12-23</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
                <List.Item>
                  <Grid columns={24}>
                    <Grid.Col span={6}>
                      <Center>
                        <AspectRatio ratio={4 / 3}>
                          <Image
                            radius="md"
                            src={null}
                            fallbackSrc="https://placehold.co/600x400?text=Image"
                          />
                        </AspectRatio>
                      </Center>
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                        h="100%"
                      >
                        <Title order={2} lineClamp={1} size={'h4'}>
                          2024年贵州民营企业100强榜单发布，贵州百灵连续十年上榜！
                        </Title>
                        <Text size="sm" lineClamp={3}>
                          贵州民营企业100强及制造业20强发布会在贵阳举行，省工商联发布“2024年贵州民营企业100强榜单”“2024年贵州制造业民营企业20强榜单”以及《2024年贵州民营企业百强发布报告》。凭借强劲的经营韧性与稳健的综合实力，贵州百灵连续第十年荣登“贵州民营企业100强”，排名第十三位；同时入选“贵州民营企业制造业20强”，排名第八位
                        </Text>
                        <Group justify="space-between" w={'100%'}>
                          <Text size="sm">2024-12-27</Text>
                        </Group>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </List.Item>
              </List>
            </Card>
          </Grid.Col>
          <Grid.Col span={8}>
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>政策法规</Text>
                  <Button variant="transparent" size="compact-sm">
                    更多
                  </Button>
                </Group>
              </Card.Section>
              <Space h="md" />
              <List spacing="xs" size="sm" center>
                <List.Item>个人廉洁承诺书</List.Item>
                <List.Item>百灵集团合规管理总则</List.Item>
                <List.Item>百灵集团合规管理制度</List.Item>
                <List.Item>中华人民共和国药品管理法</List.Item>
                <List.Item>医药企业防范商业贿赂风险合规指引</List.Item>
                <List.Item>医药营销合规评估报告</List.Item>
                <List.Item>医药企业合规营销服务规范</List.Item>
                <List.Item>
                  国务院反垄断委员会关于原料药领域的反垄断指南
                </List.Item>
                <List.Item>中央企业合规管理办法</List.Item>
                <List.Item>医药行业合规管理规范</List.Item>
                <List.Item>
                  国务院反垄断反不正当竞争委员会关于药品领域的反垄断指南
                </List.Item>
                <List.Item>灵工平台涉税合规发展指引报告</List.Item>
              </List>
            </Card>
          </Grid.Col>
        </Grid>
      </Flex>
    </Container>
  );
}
