import { ArticleStatus } from '@/apis/articles/types';
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

const rules = z.object({
  keyword: z.string().max(20, '关键字不能超过20个字符').nullable(),
  status: z.string().nullable(),
});

export type SearchValue = z.infer<typeof rules>;

export interface SearchbarProps {
  onSearch: (value: SearchValue) => Promise<void>;
  onReset?: () => void;
  isLoading?: boolean;
}

const Searchbar: React.FC<SearchbarProps> = ({
  onSearch,
  onReset,
  isLoading,
}) => {
  const formApi = useForm({
    defaultValues: {
      keyword: null as string | null,
      status: null as string | null,
    },
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
              name="keyword"
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
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={(value) => {
                    console.log(value);
                    handleChange(value ?? '');
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
