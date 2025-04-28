import { ArticleStatus } from '@/apis/article/types';
import { getEnumOptions } from '@/utils';
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
import CategorySelect from '@/components/CategorySelect';

const rules = z.object({
  title: z.string().trim().max(50, '文章名称不能超过50个字符').optional(),
  status: z.number().min(0, '状态不能为空').max(1, '状态不能为空').nullable(),
  categoryId: z.string().trim().nullable(),
});

export type SearchValue = z.infer<typeof rules>;

export interface SearchbarProps {
  onSearch: (value: SearchValue) => Promise<void>;
  onReset?: () => void;
  isLoading?: boolean;
}

const defaultValues: SearchValue = {
  title: '',
  status: null,
  categoryId: null,
};

const Searchbar: React.FC<SearchbarProps> = ({
  onSearch,
  onReset,
  isLoading,
}) => {
  const formApi = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSearch(value);
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
        onReset={() => {
          formApi.reset();
          onReset?.();
        }}
      >
        <Grid>
          <Grid.Col span={3}>
            <formApi.Field
              name="title"
              children={({ name, state, handleChange, handleBlur }) => {
                return (
                  <TextInput
                    disabled={isLoading}
                    name={name}
                    value={state.value ?? ''}
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e.target.value)}
                    variant="filled"
                    leftSection={<Text size="sm">关键字</Text>}
                    leftSectionWidth={80}
                    rightSection={
                      state.value ? (
                        <Input.ClearButton onClick={() => handleChange('')} />
                      ) : undefined
                    }
                    rightSectionPointerEvents="auto"
                    placeholder="请输入关键字"
                    error={state.meta.errors[0]?.message}
                  />
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <formApi.Field
              name="status"
              children={({ name, state, handleChange, handleBlur }) => (
                <Select
                  disabled={isLoading}
                  name={name}
                  value={state.value !== null ? state.value + '' : null}
                  onBlur={handleBlur}
                  onChange={(value) => {
                    handleChange(value !== null ? parseInt(value) : null);
                  }}
                  variant="filled"
                  leftSection={<Text size="sm">状态</Text>}
                  leftSectionWidth={80}
                  clearable
                  onClear={() => handleChange(null)}
                  placeholder="请选择状态"
                  data={getEnumOptions(ArticleStatus).map((item) => ({
                    value: item.value.toString(),
                    label: item.label,
                  }))}
                  error={state.meta.errors[0]?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <formApi.Field
              name="categoryId"
              children={({ name, state, handleChange, handleBlur }) => (
                <CategorySelect
                  variant="filled"
                  withAsterisk
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={(value) => handleChange(value ?? '')}
                  error={state.meta.errors[0]?.message}
                  disabled={isLoading}
                  leftSection={<Text size="sm">分类</Text>}
                  leftSectionWidth={80}
                  clearable
                  onClear={() => handleChange(null)}
                  placeholder="请选择分类"
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
                    loading={isSubmitting || isLoading}
                    disabled={!canSubmit}
                  >
                    搜索
                  </Button>
                  <Button
                    variant="default"
                    type="reset"
                    disabled={isSubmitting || isLoading}
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
