import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import "./styles.css";

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
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')

    console.log(state);

    const request: RequestInfo = new Request('http://127.0.0.1:8080/api/compile/json', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({language: "JAVA", sourcecode: state, memoryLimit: 500, timeLimit: 2, testCases: problem.tests})
    })

    return fetch(request)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setResult(res);
      });
  }

  function renderTestData() {
    let testResults = null;
    if(problem.tests) {
      testResults = problem.tests;
    }
    if(result.execution && result.execution.testCasesResult) {
      testResults = Object.keys(result.execution.testCasesResult).map((key) => {
        return result.execution.testCasesResult[key]
      });
    }
    console.log(testResults);
    if(testResults) {
      console.log(testResults);
      return testResults.map((value) => {
            return <tr>
              <td>{value.id}</td>
              <td>{value.verdict}</td>
              <td>{value.output}</td>
              <td>{value.executionDuration}</td>
            </tr>
          })
    }
    return <tr></tr>
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
        defaultLanguage="java"
        defaultValue=""
        onChange={handleEditorChange}
      />
      <button onClick={() => submitProblem()}>Submit</button>
      <table>
        <thead>
          <tr>
            <th>Test #</th>
            <th>Verdict</th>
            <th>Output</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {renderTestData()}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;