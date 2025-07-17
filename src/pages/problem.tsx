import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

function Dashboard() {
  const editorRef = useRef(null);
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState([]);
  const [problem, setProblem] = useState([]);
  const [state, setState] = React.useState('');
  const [result, setResult] = useState([]);

  async function fetchProblem(id: string) {
    const headers: Headers = new Headers()
    headers.set('Accept', 'application/json')

    const request: RequestInfo = new Request('http://127.0.0.1:8084/api/v1/problems/' + id, {
      method: 'GET',
      headers: headers
    })

    return fetch(request)
      .then(res => res.json())
      .then(res => {
        setProblem(res);
      });
  }

  function handleEditorChange(value: any, event: any) {
    setState(value);
  }

  async function submitProblem() {
    const headers: Headers = new Headers()
    let testCasesValue = JSON.parse(problem.tests);
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')

    console.log(state);

    const request: RequestInfo = new Request('http://127.0.0.1:8080/api/compile/json', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({language: "JAVA", sourcecode: state, memoryLimit: 500, timeLimit: 2, testCases: testCasesValue})
    })

    return fetch(request)
      .then(res => res.json())
      .then(res => {
        setResult(res);
      });
  }

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setQueryParams(params);
    fetchProblem(params.id);
  }, [searchParams]);

  return (
    <main style={{ height: "100vh" }}>
      <div style={{ marginLeft: "10vw" }} dangerouslySetInnerHTML={{ __html: problem.statement + problem.definition + problem.constraints + problem.examples}}>
      </div>
          <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
      <button onClick={() => submitProblem()}>Submit</button>      
    </main>
  );
}

export default Dashboard;