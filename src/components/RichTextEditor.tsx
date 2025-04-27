import {
  getTaskListExtension,
  Link,
  RichTextEditor as MantineRichTextEditor,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import {
  IconColorPicker,
  IconImageInPicture,
  IconUpload,
} from '@tabler/icons-react';
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
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUpdateEffect } from 'ahooks';
import ts from 'highlight.js/lib/languages/typescript';
import { createLowlight } from 'lowlight';
import '@/components/tiptap/tiptap-node/image-node/image-node.scss';
import { ImageUploadNode } from '@/components/tiptap/tiptap-node/image-upload-node';
import '@/components/tiptap/tiptap-node/image-upload-node/image-upload-node.scss';

const lowlight = createLowlight();

// register languages that you are planning to use
lowlight.register({ ts });

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
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
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: (file, onProgress, abortSignal) => {
          console.log('file', file);
          console.log('onProgress', onProgress);
          console.log('abortSignal', abortSignal);
          return Promise.resolve('123');
        },
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useUpdateEffect(() => {
    if (!editor) return;
    editor.commands.setContent(value);
  }, [value]);

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
          <MantineRichTextEditor.Undo />
          <MantineRichTextEditor.Redo />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.CodeBlock />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <InsertImageControl />
          <InsertImageUploadControl />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}

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
      <IconImageInPicture stroke={1.5} size={16} />
    </MantineRichTextEditor.Control>
  );
}

function InsertImageUploadControl() {
  const { editor } = useRichTextEditorContext();
  const addImage = () => {
    editor?.chain().focus().setImageUploadNode().run();
  };

  if (!editor) {
    return null;
  }
  return (
    <MantineRichTextEditor.Control
      onClick={addImage}
      aria-label="插入上传图片组件"
      title="插入上传图片组件"
    >
      <IconUpload stroke={1.5} size={16} />
    </MantineRichTextEditor.Control>
  );
}
