import "./index.css"

monacoRequire.config({ paths: { 'vs': '/monaco-editor/min/vs' } })

monacoRequire(['vs/editor/editor.main'], function () {
  // https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-tokens-and-colors
  // https://github.com/Microsoft/vscode/blob/93028e44ea7752bd53e2471051acbe6362e157e9/src/vs/editor/standalone/common/themes.ts
  monaco.editor.defineTheme('default', {
    base: 'vs',
    inherit: true,
    rules: [
      
    ],
    colors: {
        
    }
  })
  
  const editor = monaco.editor.create(document.getElementById('json-editor'), {
    value: ``,
    language: 'json',
    theme: 'default',
    scrollBeyondLastLine: false
  })
  
  const generated = monaco.editor.create(document.getElementById('generated'), {
    value: ``,
    language: 'json',
    theme: 'default',
    scrollBeyondLastLine: false
  })
})

