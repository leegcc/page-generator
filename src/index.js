import "./index.css"
import _ from "lodash"
import template from "./template.mustache"
import modelYaml from "raw-loader!./model.yaml"
import jsyaml from "js-yaml"

function reconfigModel(model) {
  return Object.assign({}, model, {
    breadcrumb: model.breadcrumb.map(function(item, n) {
      return Object.assign({}, item, {
        divider: n !== model.breadcrumb.length - 1,
        output: function() {
          return this.link != null ? `<li><a href="${this.link}">${this.name}</a></li>` : `<li><a href="${this.link}">${this.name}</a></li>`
        }
      })
    }),
    table: function() {
      return model.table.map(function(item) {
        return {
          name: item.name,
          cell: function() {
            const {type, field} = item
            if (type === 'string' || type === 'long') {
              return `$item.${field}`
            }
            if (type === 'LoginInfo') {
              return `<a target="_blank" href="/userinfo.htm?id=$user.id">$item.${field}</a>`
            }
            if (type === 'BidRequest') {
              return `<a target="_blank" href="/borrowinfo.htm?jid=$item.bidRequestId">$item.${field}</a>`
            }
            if (type === 'amount') {
              return `$Utils.formatNumber($item.${field})`
            }
          }
        }
      })
    }
  })
}

monacoRequire.config({ paths: { 'vs': '/monaco-editor/min/vs' } })
monacoRequire(['vs/editor/editor.main'], function () {
  // https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-tokens-and-colors
  // https://github.com/Microsoft/vscode/blob/93028e44ea7752bd53e2471051acbe6362e157e9/src/vs/editor/standalone/common/themes.ts
  monaco.editor.defineTheme('default', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '282C34' },
      { token: 'delimiter', foreground: 'bbbbbb' },
      { token: 'tag', foreground: 'e06c75' },
      { token: 'delimiter.html', foreground: 'bbbbbb' },
      { token: 'attribute.name', foreground: 'd19a66' },
      { token: 'attribute.value', foreground: '98c379' },
      { token: 'string.key.json', foreground: 'e06c75' },
      { token: 'string.value.json', foreground: '98c379' },
      { token: 'type.yaml', foreground: 'e06c75' },
      { token: 'string.yaml', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' }
    ],
    colors: {
      "button.background": "#4D78CC",
      "button.foreground": "#FFFFFF",
      "button.hoverBackground": "#6087CF",
      "diffEditor.insertedTextBackground": "#00809B33",
      "dropdown.background": "#353b45",
      "dropdown.border": "#181A1F",
      "editor.background": "#282C34",
      "editor.lineHighlightBackground": "#2C313A",
      "editor.selectionBackground": "#3E4451",
      "editorCursor.foreground": "#528BFF",
      "editorGroup.background": "#21252B",
      "editorGroup.border": "#181A1F",
      "editorGroupHeader.tabsBackground": "#21252B",
      "editorIndentGuide.background": "#3C4049",
      "editorLineNumber.foreground": "#636D83",
      "editorWhitespace.foreground": "#3C4049",
      "editorHoverWidget.background": "#21252B",
      "editorHoverWidget.border": "#181A1F",
      "editorSuggestWidget.background": "#21252B",
      "editorSuggestWidget.border": "#181A1F",
      "editorSuggestWidget.selectedBackground": "#2C313A",
      "editorWidget.background": "#21252B",
      "input.background": "#1B1D23",
      "input.border": "#181A1F",
      "focusBorder": "#528BFF",
      "list.activeSelectionBackground": "#2C313A",
      "list.activeSelectionForeground": "#D7DAE0",
      "list.focusBackground": "#2C313A",
      "list.hoverBackground": "#2C313A66",
      "list.highlightForeground": "#D7DAE0",
      "list.inactiveSelectionBackground": "#2C313A",
      "list.inactiveSelectionForeground": "#D7DAE0",
      "notification.background": "#21252B",
      "pickerGroup.border": "#528BFF",
      "scrollbar.shadow": "#00000000",
      "scrollbarSlider.background": "#4E566680",
      "scrollbarSlider.activeBackground": "#747D9180",
      "scrollbarSlider.hoverBackground": "#5A637580",
      "badge.background": "#528BFF",
      "badge.foreground": "#D7DAE0",
      "peekView.border": "#528BFF",
      "peekViewResult.background": "#21252B",
      "peekViewResult.selectionBackground": "#2C313A",
      "peekViewTitle.background": "#1B1D23",
      "peekViewEditor.background": "#1B1D23"
    }
  })

  const editor = monaco.editor.create(document.getElementById('json-editor'), {
    value: modelYaml,
    language: 'yaml',
    theme: 'default',
    automaticLayout: true,
    fontFamily: 'Consolas, STXihei, 微软雅黑, 华文细黑, "Microsoft YaHei", sans-serif',
    fontSize: 16,
  })

  const generated = monaco.editor.create(document.getElementById('generated'), {
    value: template(jsyaml.load(modelYaml)),
    language: 'html',
    theme: 'default',
    automaticLayout: true,
    fontFamily: 'Consolas, STXihei, 微软雅黑, 华文细黑, "Microsoft YaHei", sans-serif',
    fontSize: 16
  })

  function generate(yaml) {
    try {
      const model = jsyaml.load(yaml)
      generated.setValue(template(reconfigModel(model)))
    } catch (e) {

    }
  }

  editor.onDidChangeModelContent(_.debounce(() => {
    generate(editor.getValue())
  }, 300))

  generate(editor.getValue())
})

