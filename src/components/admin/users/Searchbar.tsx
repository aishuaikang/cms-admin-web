import {
  Button,
  Grid,
  Group,
  Input,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const Searchbar = () => {
  const rules = z.object({
    username: z.string().max(20, '用户名不能超过20个字符'),
    role: z.enum(['admin', 'user'], { message: '角色不合法' }).nullable(),
    phone: z
      .string()
      .regex(/^\d{11}$/, '手机号格式不正确')
      .nullable(),
  });

  const formApi = useForm({
    defaultValues: {
      username: '',
      role: null as string | null,
      phone: null as string | null,
    },
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    validators: {
      onChange: rules,
    },
  });
  return (
    <>
      <form
        className="w-full h-[56px] overflow-hidden"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await formApi.handleSubmit();
          close();
        }}
        onReset={() => formApi.reset()}
      >
        <Grid>
          <Grid.Col span={3}>
            <formApi.Field
              name="username"
              children={({ name, state, handleChange, handleBlur }) => {
                return (
                  <TextInput
                    name={name}
                    value={state.value}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    autoComplete="username"
                    variant="filled"
                    leftSection={
                      <Text size="sm" className="flex items-center">
                        用户名
                      </Text>
                    }
                    leftSectionWidth={80}
                    rightSection={
                      state.value ? (
                        <Input.ClearButton onClick={() => handleChange('')} />
                      ) : undefined
                    }
                    rightSectionPointerEvents="auto"
                    placeholder="请输入用户名"
                    error={state.meta.errors[0]?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <formApi.Field
              name="role"
              children={({ name, state, handleChange, handleBlur }) => (
                <Select
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={(value) => handleChange(value ?? null)}
                  variant="filled"
                  leftSection={
                    <Text
                      size="sm"
                      className="flex items-center justify-center"
                    >
                      角色
                    </Text>
                  }
                  leftSectionWidth={80}
                  clearable
                  placeholder="请选择角色"
                  data={[
                    {
                      value: 'admin',
                      label: '管理员',
                    },
                    {
                      value: 'user',
                      label: '用户',
                    },
                  ]}
                  error={state.meta.errors[0]?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <formApi.Field
              name="phone"
              children={({ name, state, handleChange, handleBlur }) => (
                <TextInput
                  type="text"
                  name={name}
                  value={state.value ?? ''}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value || null)}
                  autoComplete="phone"
                  variant="filled"
                  leftSection={
                    <Text size="sm" className="flex items-center">
                      手机号
                    </Text>
                  }
                  leftSectionWidth={80}
                  rightSection={
                    state.value ? (
                      <Input.ClearButton onClick={() => handleChange(null)} />
                    ) : undefined
                  }
                  rightSectionPointerEvents="auto"
                  placeholder="请输入手机号"
                  error={state.meta.errors[0]?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <formApi.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Group>
                  <Button
                    variant="filled"
                    type="submit"
                    loading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    搜索
                  </Button>
                  <Button
                    variant="default"
                    type="reset"
                    disabled={isSubmitting}
                  >
                    重置
                  </Button>
                </Group>
              )}
            />
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
};

export default Searchbar;
