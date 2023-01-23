import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import styles from './styles.module.css';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }],
        [{ size: [] }],
        [{ script: 'super' }, { script: 'sub' }],
        [{ color: [] }, { background: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            'direction',
            { align: [] },
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'code-block',
    'align',
    'direction',
    'color',
    'background',
    'script',
    'super',
    'sub',
];

const TextEditor = ({ setContentValue, value, height, width }: any) => {
    return (
      <div className={styles.container}>
        <QuillNoSSRWrapper
          style={{height: height, width: width}}
          className={styles.textArea}
          bounds={'.app'}
          modules={modules}
          formats={formats}
          onChange={setContentValue}
          placeholder="Digite algo..."
          value={value}
          theme="snow"
        />
      </div>
    );
};

export default TextEditor;
