import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import "./styles.css";
import Head from 'next/head'
import { projectNew } from "next/dist/build/swc/generated-native";

function Dashboard() {
  let HOST = process.env.API_URL;

  class Problem {
    id!: string;
    tests!: string;
    name!: string;
    srm!: string;
    date!: string;
    author!: string;
    authorLink!: string;
    statement!: string;
    definition!: string;
    constraints!: string;
    examples!: string;
  }

  interface TestResult {
    number: string;
    verdict: string;
    output: string;
    expectedOutput: string;
    time: string;
    memory: string;
  }

  class Result {
    id!: string;
    testsResults!: TestResult[];
  }

  class Factory {
    create<T>(type: (new () => T)): T {
        return new type();
    }
  }

  let factory = new Factory();
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<Problem>(factory.create(Problem));
  const [state, setState] = useState('');
  const [result, setResult] = useState<Result>(factory.create(Result));
  const [isExamplesVisible, setIsExamplesVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);  
  const [waitVisible, setWaitVisible] = useState(false);  
  const [language, setLanguage] = useState('java');

  function toggleExamples() {
    setIsExamplesVisible(isExamplesVisible => !isExamplesVisible);
  }

  function toggleSubmit() {
    setIsSubmitVisible(isSubmitVisible => !isSubmitVisible);
  }

  function toggleResult() {
    setIsResultVisible(isResultVisible => !isResultVisible);
  }

  async function fetchProblem(id: string) {
    const headers: Headers = new Headers()
    headers.set('Accept', 'application/json')

    const request: RequestInfo = new Request(HOST + '/api/v1/problems/' + id, {
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

    const request: RequestInfo = new Request(HOST + '/api/v1/submission', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({taskId: problem.id, language: language, sources: state, tests: problem.tests})
    })

    setWaitVisible(true);
    setIsResultVisible(true);

    return fetch(request)
      .then(res => res.json())
      .then(res => {
        setWaitVisible(false);
        setResult(res);
      });
  }

  function renderTestData() {
    let testResults = null;
    if(result.testsResults) {
      testResults = result.testsResults;
    }
    if(testResults) {
      return testResults.map((value) => {
            return <tr>
              <td>{value.number}</td>
              <td>{value.verdict}</td>
              <td>{value.output}</td>
              <td>{value.expectedOutput}</td>
              <td>{value.time}</td>
              <td>{value.memory}</td>
            </tr>
          })
    }
    return <tr></tr>
  }
  
  useEffect(() => {
    if(searchParams) {
      fetchProblem(Object.fromEntries(searchParams.entries()).id);
    }
  }, [searchParams]);

  return (
    <main className="problem-container">
      <Head>
        <title>TopCoder Problem</title>
      </Head>
      <div style={{ marginLeft: "1vw"}}>
        <div className="statement">
          <h3>Problem Info</h3>
          <div>{problem.name}</div>
          <div>{problem.srm}</div>
          <div>{problem.date}</div>
          <div>{problem.author}</div>
        </div>
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className="statement">
          <div dangerouslySetInnerHTML={{ __html: problem.statement}}></div>
        </div>
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className="statement">
          <div dangerouslySetInnerHTML={{ __html: problem.definition}}></div>
        </div>
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className="statement">
          <div dangerouslySetInnerHTML={{ __html: problem.constraints}}></div>
        </div>
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className={isExamplesVisible ? "btn disabled" : "btn"} onClick={toggleExamples}><h3>Test Data</h3></div>
        {isExamplesVisible && (
          <div style={{ marginLeft: "1vw" }}>
            <div className="statement">
              <div dangerouslySetInnerHTML={{ __html: problem.examples}}></div>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className={isSubmitVisible ? "btn disabled" : "btn"} onClick={toggleSubmit}><h3>Submit</h3></div>
        {isSubmitVisible && (
          <div style={{ marginLeft: "1vw" }}>
            <div className="radio-group">
              Language:    
              <label><input type="radio" name="languageRadio" value="java" defaultChecked={true} 
                onClick={e => setLanguage((e.target as HTMLInputElement).value)}/>Java </label>
              <label><input type="radio" name="languageRadio" value="csharp"  
                onClick={e => setLanguage((e.target as HTMLInputElement).value)}/>C# </label>
              <label><input type="radio" name="languageRadio" value="cpp"  
                onClick={e => setLanguage((e.target as HTMLInputElement).value)}/>C++ </label>
            </div>
            <div className="editor">
              <Editor
                height="40vh"
                language={language}
                defaultLanguage="java"
                defaultValue=""
                onChange={handleEditorChange}
                theme="vs-dark"
              />
            </div>
            <div className="submit-btn" onClick={() => submitProblem()}>Submit</div>
            {waitVisible && (
                <div className="info">Submission is being checked. Results will be shown soon. Please DON'T refresh the page.</div>
              )
            }
          </div>
        )}
      </div>
      <div style={{ marginLeft: "1vw" }}>
        <div className="flex flex-col gap-[32px] items-center">
          <div className={isResultVisible ? "btn disabled" : "btn"} onClick={toggleResult}><h3>Result</h3></div>
          {isResultVisible && (
            <div className="result">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Test #</th>
                    <th>Verdict</th>
                    <th>Output</th>
                    <th>Expected Output</th>
                    <th>Time</th>
                    <th>Memory (kbytes)</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTestData()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;