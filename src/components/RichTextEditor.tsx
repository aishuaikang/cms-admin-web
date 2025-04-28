import { forwardRef, useImperativeHandle } from 'react';
import { addImageMutationFn } from '@/apis/image';
import { FileButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  getTaskListExtension,
  Link,
  RichTextEditor as MantineRichTextEditor,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import {
  IconColorPicker,
  IconPhotoEdit,
  IconPhotoPlus,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import Dropcursor from '@tiptap/extension-dropcursor';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ts from 'highlight.js/lib/languages/typescript';
import { createLowlight } from 'lowlight';
import '@/components/tiptap/tiptap-node/image-node/image-node.scss';

const lowlight = createLowlight();

// register languages that you are planning to use
lowlight.register({ ts });

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}
export interface RichTextEditorRef {
  setContent: (content: string) => void;
  getText: () => string | undefined;
  getJson: () => JSONContent | undefined;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(({ value, onChange }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, dropcursor: false }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({
        nested: true,
        // HTMLAttributes: {
        //   class: 'test-item',
        // },
      }),
      Image,
      Dropcursor,
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useImperativeHandle(ref, () => ({
    setContent: (content: string) => {
      editor?.commands.setContent(content);
    },
    getText: () => editor?.getText(),
    getJson: () => editor?.getJSON(),
  }));

  //   useUpdateEffect(() => {
  //     if (!editor) return;
  //     console.log('editor', editor);
  //     editor.commands.clearContent();
  //   }, [value]);

  return (
    <MantineRichTextEditor editor={editor}>
      <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
        <MantineRichTextEditor.ColorPicker
          colors={[
            '#25262b',
            '#868e96',
            '#fa5252',
            '#e64980',
            '#be4bdb',
            '#7950f2',
            '#4c6ef5',
            '#228be6',
            '#15aabf',
            '#12b886',
            '#40c057',
            '#82c91e',
            '#fab005',
            '#fd7e14',
          ]}
        />
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Control interactive={false}>
            <IconColorPicker size={16} stroke={1.5} />
          </MantineRichTextEditor.Control>
          <MantineRichTextEditor.Color color="#F03E3E" />
          <MantineRichTextEditor.Color color="#7048E8" />
          <MantineRichTextEditor.Color color="#1098AD" />
          <MantineRichTextEditor.Color color="#37B24D" />
          <MantineRichTextEditor.Color color="#F59F00" />
        </MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.UnsetColor />

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.TaskList />
          <MantineRichTextEditor.TaskListLift />
          <MantineRichTextEditor.TaskListSink />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
          <MantineRichTextEditor.ClearFormatting />
          <MantineRichTextEditor.Highlight />
          <MantineRichTextEditor.Code />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H1 />
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
          <MantineRichTextEditor.H4 />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Blockquote />
          <MantineRichTextEditor.Hr />
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
          <MantineRichTextEditor.Subscript />
          <MantineRichTextEditor.Superscript />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Link />
          <MantineRichTextEditor.Unlink />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.AlignLeft />
          <MantineRichTextEditor.AlignCenter />
          <MantineRichTextEditor.AlignJustify />
          <MantineRichTextEditor.AlignRight />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.CodeBlock />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <InsertImageControl />
          <InsertImageUploadControl />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Undo />
          <MantineRichTextEditor.Redo />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
});

function InsertImageControl() {
  const { editor } = useRichTextEditorContext();
  const addImage = () => {
    const url = window.prompt('URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }
  return (
    <MantineRichTextEditor.Control
      onClick={addImage}
      aria-label="插入图片"
      title="插入图片"
    >
      <IconPhotoEdit stroke={1.5} size={16} />
    </MantineRichTextEditor.Control>
  );
}

function InsertImageUploadControl() {
  //   const ctx = useRouteContext({ from: AdminArticleRoute.to });

  const { mutateAsync: addImageMutation } = useMutation({
    mutationFn: addImageMutationFn,
    onMutate: () => {
      return notifications.show({
        loading: true,
        message: '请稍等片刻，正在上传图片',
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: (data, _var, context) => {
      notifications.update({
        id: context,
        color: 'green',
        message: '上传图片成功',
        loading: false,
        autoClose: 2000,
      });

      const pos = editor?.state.selection.from;

      if (!pos) {
        return;
      }
      console.log('pos', pos, pos + 1);
      editor
        ?.chain()
        .focus()
        .insertContentAt(
          pos,
          data.map((image) => ({
            type: 'image',
            attrs: {
              src: `/api/common/image/download/${image.id}`,
              alt: image.title,
              title: image.title,
            },
          }))
        )
        .run();

      //   ctx.queryClient.invalidateQueries({
      //     queryKey: [IMAGE_LIST_QUERY_KEY],
      //   });
    },
    onError: (error, _var, context) => {
      notifications.update({
        id: context,
        color: 'red',
        title: '上传图片失败',
        message: error.message,
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const { editor } = useRichTextEditorContext();

  const handleFileChange = async (newFile: File) => {
    const formData = new FormData();
    formData.append('image', newFile);

    await addImageMutation(formData);
  };

  if (!editor) {
    return null;
  }

  return (
    <FileButton
      onChange={(newFile) => {
        newFile && handleFileChange(newFile);
      }}
      accept="image/png,image/jpeg"
    >
      {(props) => (
        <MantineRichTextEditor.Control
          {...props}
          aria-label="插入上传图片组件"
          title="插入上传图片组件"
        >
          <IconPhotoPlus stroke={1.5} size={16} />
        </MantineRichTextEditor.Control>
      )}
    </FileButton>
  );
}
