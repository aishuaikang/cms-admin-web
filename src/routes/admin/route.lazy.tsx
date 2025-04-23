import {
  Anchor,
  AppShell,
  Box,
  Breadcrumbs,
  Container,
  Divider,
  NavLink,
  ScrollArea,
} from '@mantine/core';
import {
  IconBook2,
  IconBuildingFactory2,
  IconHomeQuestion,
  IconLayersIntersect,
  IconPolygon,
  IconUsers,
} from '@tabler/icons-react';
import {
  createLazyFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useCreation } from 'ahooks';
import { Route as AdminDictConfigRoute } from './dict_config/route';
import { Route as AdminIndexRoute } from './index/route';
import { Route as AdminIndustryArticlesRoute } from './industry_articles/route';
import { Route as AdminInternalArticlesRoute } from './internal_articles/route';
import { Route as AdminPolicyRegulationsRoute } from './policy_regulations/route';
import { Route as AdminUsersRoute } from './users/route';

export const Route = createLazyFileRoute('/admin')({
  component: Admin,
});

function Admin() {
  const matches = useRouterState({ select: (s) => s.matches });

  const breadcrumbs = useCreation(
    () =>
      matches
        .filter((match) => match.context.title)
        .map(({ pathname, context }) => ({
          title: context.title,
          path: pathname,
        })),
    [matches]
  );

  return (
    <>
      <AppShell.Navbar p={'md'} w={200}>
        <ScrollArea w={'100%'} h="100%">
          <Divider my="xs" label="后台首页" labelPosition="center" />
          <Link
            to={AdminIndexRoute.to}
            activeOptions={{
              exact: true,
            }}
          >
            {({ isActive }) => (
              <NavLink
                component="span"
                label="后台首页"
                leftSection={<IconHomeQuestion size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Link to={AdminUsersRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="用户管理"
                leftSection={<IconUsers size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Link to={AdminDictConfigRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="字典配置"
                leftSection={<IconBook2 size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Divider my="xs" label="新闻管理" labelPosition="center" />
          <Link to={AdminIndustryArticlesRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="行业新闻"
                leftSection={<IconBuildingFactory2 size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Link to={AdminInternalArticlesRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="内部新闻"
                leftSection={<IconLayersIntersect size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Link to={AdminPolicyRegulationsRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="政策法规"
                leftSection={<IconPolygon size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          {/* <Divider my="xs" label="系统维护" labelPosition="center" />
          <Link to={AdminDictConfigRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="字典配置"
                leftSection={<IconBook2 size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link>
          <Link to={AdminSystemLogRoute.to}>
            {({ isActive }) => (
              <NavLink
                component="span"
                label="系统日志"
                leftSection={<IconLogs size={16} stroke={1.5} />}
                active={isActive}
              />
            )}
          </Link> */}
        </ScrollArea>
      </AppShell.Navbar>
      <Box w={'calc(100% - 200px)'} ml={200}>
        <Container size={'xl'}>
          <Breadcrumbs>
            {breadcrumbs.map((item, index) => (
              <Link to={item.path} key={index}>
                <Anchor size="sm" component="span" underline={'hover'}>
                  {item.title}
                </Anchor>
              </Link>
            ))}
          </Breadcrumbs>
          <Divider my="md" />
          <Box
            h={'calc(100vh - 76px - 16px - 33px - 21px)'}
            w={'100%'}
            className="overflow-hidden"
          >
            <Outlet />
          </Box>
          {/* <ScrollArea h={'calc(100vh - 76px - 16px - 37px - 21px)'} w={'100%'}> */}
          {/* </ScrollArea> */}
        </Container>
      </Box>
    </>
  );
}
