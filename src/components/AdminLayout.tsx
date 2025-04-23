import { FC, useRef, useState } from 'react';
import { useAuth } from '@contexts/auth';
// import { pixelArt } from '@dicebear/collection';
// import { createAvatar } from '@dicebear/core';
import {
  AppShell,
  Avatar,
  Box,
  DEFAULT_THEME,
  Group,
  Menu,
  Switch,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { Route as AdminRoute } from '@routes/admin/route';
import { Route as IndexRoute } from '@routes/index/route';
import {
  IconChevronDown,
  IconHome,
  IconLogout,
  IconMoonStars,
  IconSettings,
  IconShieldCheckeredFilled,
  IconSun,
} from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
// import { useCreation } from 'ahooks';
import cx from 'clsx';
import LoginModal, { LoginModalRef } from './LoginModal';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const navs = [
    {
      label: '首页',
      to: IndexRoute.to,
      icon: IconHome,
    },
  ];

  const loginModalRef = useRef<LoginModalRef>(null);

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  //   const avatar = useCreation(() => {
  //     return createAvatar(pixelArt, {
  //       size: 128,
  //       // ... other options
  //     }).toDataUri();
  //   }, []);

  const auth = useAuth();

  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      //   footer={{ height: 60 }}
      //   navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
      transitionDuration={0}
    >
      <AppShell.Header className="flex items-center justify-between px-4 gap-4">
        <Box className="w-auto h-full flex items-center gap-2">
          <IconShieldCheckeredFilled size={30} />
          <Title order={1} size={'h3'}>
            {import.meta.env.VITE_APP_TITLE}
          </Title>
        </Box>
        <Group>
          <Switch
            color="dark.4"
            checked={computedColorScheme === 'light'}
            onChange={(e) => {
              setColorScheme(e.currentTarget.checked ? 'light' : 'dark');
            }}
            onLabel={
              <IconSun
                size={16}
                stroke={2.5}
                color="var(--mantine-color-yellow-4)"
              />
            }
            offLabel={
              <IconMoonStars
                size={16}
                stroke={2.5}
                color="var(--mantine-color-blue-6)"
              />
            }
          />
          {/* <TextInput
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={400}
            variant="filled"
            radius="xl"
            placeholder="这里可以搜索哟..."
            leftSection={
              <Text size="sm" className="flex items-center">
                全文搜索
              </Text>
            }
            leftSectionWidth={90}
            rightSectionWidth={36}
            rightSection={
              <Link
                to={SearchRoute.to}
                search={{
                  query: search.trim(),
                }}
                className="flex items-center"
              >
                <ActionIcon
                  size={26}
                  radius="xl"
                  color={DEFAULT_THEME.primaryColor}
                  variant="filled"
                >
                  <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
              </Link>
            }
          /> */}
        </Group>
        <Box className="flex items-center gap-4">
          <Group>
            {navs.map((nav) => (
              <Link key={nav.label} to={nav.to}>
                {({ isActive }) => (
                  <Group
                    gap="2"
                    style={{
                      color: isActive
                        ? DEFAULT_THEME.colors.blue[6]
                        : undefined,
                    }}
                  >
                    <nav.icon size={'16'} />
                    <Text size="sm" component="span">
                      {nav.label}
                    </Text>
                  </Group>
                )}
              </Link>
            ))}
          </Group>
          <LoginModal ref={loginModalRef} />

          {auth.isAuthenticated ? (
            <Menu
              width={200}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
              shadow="md"
              withOverlay
              overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
              }}
            >
              <Menu.Target>
                <Tooltip label={auth.userinfo?.nickname}>
                  <UnstyledButton
                    className={cx(
                      'hover:bg-login-button-color p-2 rounded-full',
                      {
                        'bg-login-button-color': userMenuOpened,
                      }
                    )}
                  >
                    <Group gap={7}>
                      <Avatar
                        alt={'name'}
                        radius="xl"
                        size={28}
                        src={
                          auth.userinfo?.image_id
                            ? import.meta.env.VITE_BASE_API +
                              `/common/image/download/${
                                auth.userinfo?.image_id
                              }?${new Date().getTime()}`
                            : undefined
                        }
                      />
                      <Text fw={500} size="sm" lh={1} mr={3} truncate maw={100}>
                        {auth.userinfo?.nickname}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>应用</Menu.Label>
                <Link to={AdminRoute.to} className="block">
                  {({ isActive }) => (
                    <Menu.Item
                      leftSection={<IconSettings size={16} stroke={1.5} />}
                      color={
                        isActive ? DEFAULT_THEME.colors.blue[6] : undefined
                      }
                    >
                      管理后台
                    </Menu.Item>
                  )}
                </Link>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={16} stroke={1.5} />}
                  color="red"
                  onClick={async () => {
                    await auth.logout();
                    navigate({
                      to: IndexRoute.to,
                      replace: true,
                    });
                  }}
                >
                  退出登录
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <UnstyledButton
              className={cx('hover:bg-login-button-color p-2 rounded-full')}
              onClick={() => loginModalRef.current?.open()}
            >
              <Group gap={7}>
                <Avatar alt={'name'} radius="xl" size={28} />
                <Text fw={500} size="sm" lh={1} mr={3}>
                  请登录
                </Text>
              </Group>
            </UnstyledButton>
          )}
        </Box>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
      {/* <AppShell.Footer>
        <Box className="w-full h-full flex justify-center items-center gap-4">
          <Text size="sm" component="span">
            © 2021 - {new Date().getFullYear()} {import.meta.env.VITE_APP_TITLE}
          </Text>
        </Box>
      </AppShell.Footer> */}
    </AppShell>
  );
};

export default Layout;
