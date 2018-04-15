import "./index.css"
import _ from "lodash"
import template from "./template.mustache"

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
    automaticLayout: true
  })
  
  const generated = monaco.editor.create(document.getElementById('generated'), {
    value: template({

    }),
    language: 'html',
    theme: 'default',
    automaticLayout: true
  })

  function generate(json) {
    try {
      const model = JSON.parse(json)
      generated.setValue(template(model))
    } catch (e) {
      generated.setValue(e.toString())
    }
  }

  editor.onDidChangeModelContent(_.debounce(() => {
    generate(editor.getValue())
  }, 300))
})

