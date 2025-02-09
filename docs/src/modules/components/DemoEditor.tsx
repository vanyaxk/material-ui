import * as React from 'react';
import SimpleCodeEditor from 'react-simple-code-editor';
import Box from '@mui/material/Box';
import NoSsr from '@mui/base/NoSsr';
import { styled } from '@mui/material/styles';
import prism from '@mui/markdown/prism';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';
import CodeCopyButton from 'docs/src/modules/components/CodeCopyButton';
import { useTranslate } from 'docs/src/modules/utils/i18n';
import { useCodeCopy } from 'docs/src/modules/utils/CodeCopy';
import { blue, blueDark } from 'docs/src/modules/brandingTheme';

const StyledMarkdownElement = styled(MarkdownElement)(({ theme }) => ({
  '& .scrollContainer': {
    maxHeight: 'min(68vh, 1000px)',
    overflow: 'auto',
    backgroundColor: `${blueDark[800]} !important`,
    borderRadius: theme.shape.borderRadius,
    colorScheme: 'dark',
    '&:hover': {
      boxShadow: `0 0 0 3px ${
        theme.palette.mode === 'dark' ? theme.palette.primaryDark[400] : theme.palette.primary.light
      }`,
    },
    '&:focus-within': {
      boxShadow: `0 0 0 2px ${
        theme.palette.mode === 'dark' ? theme.palette.primaryDark.main : theme.palette.primary.main
      }`,
    },
  },
})) as any;

const StyledSimpleCodeEditor = styled(SimpleCodeEditor)(({ theme }) => ({
  ...theme.typography.body2,
  fontSize: theme.typography.pxToRem(13),
  fontFamily: theme.typography.fontFamilyCode,
  fontWeight: 400,
  WebkitFontSmoothing: 'subpixel-antialiased',
  color: '#f8f8f2',
  direction: 'ltr /*! @noflip */' as any,
  float: 'left',
  minWidth: '100%',
  '& pre': {
    // The scroll container needs to be the parent of the editor
    maxHeight: 'initial',
    maxWidth: 'initial',
  },
  '& textarea': {
    outline: 'none',
  },
  '& > textarea, & > pre': {
    whiteSpace: 'pre !important',
  },
}));

interface DemoEditorProps {
  children: React.ReactNode;
  copyButtonProps: {};
  id: string;
  language: string;
  onChange: () => {};
  value: string;
}

export default function DemoEditor(props: DemoEditorProps) {
  const { language, value, onChange, copyButtonProps, children, id } = props;
  const t = useTranslate();
  const wrapperRef = React.useRef<HTMLElement | null>(null);
  const enterRef = React.useRef<HTMLElement | null>(null);
  const handlers = useCodeCopy();

  React.useEffect(() => {
    wrapperRef.current!.querySelector('textarea')!.tabIndex = -1;
  }, []);

  return (
    <StyledMarkdownElement
      ref={wrapperRef}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
          return;
        }

        if (event.key === 'Escape') {
          enterRef.current!.focus();
          return;
        }

        if (event.key === 'Enter') {
          const textarea = wrapperRef.current!.querySelector('textarea');
          if (textarea !== document.activeElement) {
            event.preventDefault();
            event.stopPropagation();
            textarea!.focus();
          }
        }
      }}
    >
      <div className="MuiCode-root" {...handlers}>
        <div className="scrollContainer">
          <StyledSimpleCodeEditor
            padding={20}
            highlight={(code: any) =>
              `<code class="language-${language}">${prism(code, language)}</code>`
            }
            id={id}
            value={value}
            onValueChange={onChange}
          />
        </div>
        <Box
          ref={enterRef}
          aria-live="polite"
          tabIndex={0}
          sx={(theme) => ({
            position: 'absolute',
            top: theme.spacing(1),
            padding: theme.spacing(0.5, 1),
            outline: 'none',
            left: '50%',
            border: '1px solid',
            borderColor: blue[400],
            backgroundColor: blueDark[600],
            color: blueDark[50],
            transform: 'translateX(-50%)',
            borderRadius: '4px',
            fontSize: theme.typography.pxToRem(13),
            transition: 'all 0.3s',
            '&:not(:focus)': {
              top: 0,
              opacity: 0,
              pointerEvents: 'none',
            },
          })}
          dangerouslySetInnerHTML={{
            __html: t('editorHint'),
          }}
        />
        <NoSsr>
          <CodeCopyButton {...copyButtonProps} code={value} />
        </NoSsr>
        {children}
      </div>
    </StyledMarkdownElement>
  );
}
