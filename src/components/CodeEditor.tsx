import {decode as base64_decode, encode as base64_encode} from 'base-64';
import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor';

function CodeEditor(props) {

  interface FileRequest {
    filePath: string
    contents: string
  }

  const initialStates = {
    codeText: props.initialData
  };
  const [currentHash, setCurrentHash] = React.useState(props.initialData)
  const [state, setState] = React.useState(initialStates.codeText);
  const settingState = (key, value) => {
    setState((currentState) => {
      let newState = currentState;
      newState[key] = value;
      return newState;
    });
  };

  function hash(v: string) {
    return v;
  }

  const handleEditorChange = (value, event) => {
    // settingState("codeText", value);
    // value = value.replace(/\n/g, '')
    setState(value);
    setCurrentHash(hash(value));
  };

  function saveFileOnServer(fileRequest: FileRequest): Promise<void> {
    const headers: Headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    const request: RequestInfo = new Request('http://127.0.0.1:20971/api/v1/project/file', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(fileRequest)
    })

    return fetch(request)
      .then(res => {
      })
  }

  return (
    <div style={{width:"100%"}}>
      <Editor
        height="80vh"
        defaultLanguage="java"
        defaultValue={state}
        onChange={handleEditorChange}
        options={{
          cursorStyle: "line",
          formatOnPaste: true,
          formatOnType: true,
          wordWrap: true
          // autoIndent: "full"
        }}
        onMount={(editor, monaco) => {

          const executeAction: monaco.editor.IActionDescriptor = {
            id: "save-code",
            label: "Save Code",
            contextMenuOrder: 2,
            contextMenuGroupId: "1_modification",
            keybindings: [
              monaco.KeyMod.Alt | monaco.KeyCode.KeyS,
            ],
            run: () => {saveFileOnServer({filePath: props.currentFile, contents: base64_encode(editor.getValue())})}
          }

          editor.addAction(executeAction);
          setTimeout(function () {
            editor.getAction("editor.action.formatDocument").run();
          }, 300);
        }}
      />
    </div>
  );
}

export default CodeEditor;