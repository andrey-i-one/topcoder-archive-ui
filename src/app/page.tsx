'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import "./styles.css";

export default function Archive() {

  const columns = [
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'SRM',
      key: 'srm'
    },
    {
      title: 'Date',
      key: 'date'
    },
    {
      title: 'Tags',
      key: 'tags'
    },
    {
      title: 'Div 1 Level',
      key: 'div1Level'
    },
    {
      title: 'Div 2 Level',
      key: 'div2Level'
    }
  ];

  const [problems, setProblems] = React.useState([]);

  const [div1LevelValue, setDiv1LevelValue] = useState('');
  const [div2LevelValue, setDiv2LevelValue] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [pageNumberValue, setPageNumberValue] = useState(0);
  const [pageSizeValue, setPageSizeValue] = useState('10');
  const [orderDirectionValue, setOrderDirectionValue] = useState('ASC');
  const [orderFieldValue, setOrderFieldValue] = useState('date');
  const [totalPages, setTotalPages] = useState(1);

  async function fetchProblems() {
    console.log(totalPages);
    console.log(pageNumberValue);
    const headers: Headers = new Headers()
    headers.set('Accept', 'application/json')

    const request: RequestInfo = new Request('http://127.0.0.1:8084/api/v1/problems?page=' + pageNumberValue + 
      "&perPage=" + pageSizeValue + 
      "&sortField=" + orderFieldValue + 
      "&sortOrder=" + orderDirectionValue + 
      "&tags=" + tagValue +
      "&div1Level=" + div1LevelValue + 
      "&div2Level=" + div2LevelValue
      , {
      method: 'GET',
      headers: headers
    })

    return fetch(request)
      .then(res => res.json())
      .then(res => {
        setProblems(res.data);
        setTotalPages(res.pageInfo.totalPages);
      });
  }

  function renderColumns() {
    return columns.map((value) => {
          return <td>{value.title}</td>
        })
  }

  function prevPage() {
    if(pageNumberValue > 0) {
      setPageNumberValue(pageNumberValue - 1);
      fetchProblems();
    }
  }

  function nextPage() {
    if(pageNumberValue < totalPages - 1) {
      setPageNumberValue(pageNumberValue + 1);
      fetchProblems();
    }
  }

  function filterProblems() {
    setPageNumberValue(0);
    fetchProblems();
  }

  function renderProblems() {
    if(problems) {
      return problems.map((value) => {
            return <tr>
              <td><Link href={{ pathname: '/problem', query: { id: value.id } }}>{value.name}</Link></td>
              <td>{value.srm}</td>
              <td>{value.date}</td>
              <td>{value.tags}</td>
              <td>{value.div1Level}</td>
              <td>{value.div2Level}</td>
            </tr>
          })
    }
    return <tr></tr>
  }

  useEffect(() => {
    fetchProblems();
  }, [pageNumberValue]);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center">
        <div className="grid" align="center">
          <div className="grid-tr">
            <div className="grid-td">Div 1 Level</div>
            <div className="grid-td">Div 2 Level</div>
            <div className="grid-td">Order</div>
            <div className="grid-td">Order Field</div>
            <div className="grid-td">Tag</div>
            <div className="grid-td">Page size</div>
            <div className="grid-td">Page {pageNumberValue + 1}</div>
          </div>
          <div className="grid-tr">
            <div className="grid-td">          
              <select className="select-css"
                name="div1Level"
                defaultValue={''}
                multiple={false}
                onChange={e => setDiv1LevelValue(e.target.value)}>
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>          
              </select>
            </div>
            <div className="grid-td">
              <select
                name="div2Level"
                defaultValue={''}
                multiple={false}
                onChange={e => setDiv2LevelValue(e.target.value)}>
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>          
              </select>
            </div>
            <div className="grid-td">
              <select
                name="orderDirection"
                defaultValue={'asc'}
                multiple={false}
                onChange={e => setOrderDirectionValue(e.target.value)}>
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>          
              </select>
            </div>
            <div className="grid-td">
              <select
                name="orderField"
                defaultValue={'srm'}
                multiple={false}
                onChange={e => setOrderFieldValue(e.target.value)}>
                <option value="srm">SRM</option>
                <option value="date">Date</option>          
              </select>
            </div>
            <div className="grid-td">
              <select
                name="tag"
                defaultValue={''}
                multiple={false}
                onChange={e => setTagValue(e.target.value)}>
                <option value=""></option>
                <option value="Dynamic">Dynamic Programming</option>
                <option value="Math">Math</option>
                <option value="Brute">Brute Force</option>          
              </select>
            </div>
            <div className="grid-td">
              <select
                name="pageSize"
                defaultValue={'10'}
                multiple={false}
                onChange={e => setPageSizeValue(e.target.value)}>
                <option value="25">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>          
              </select>
            </div>
            <div className="grid-td">
              <button onClick={() => {prevPage()}}>Prev page</button>
              <button onClick={() => {nextPage()}}>Next page</button>
            </div>
            <div className="grid-td">
              <button onClick={() => filterProblems()}>Search</button>
            </div>
          </div>
        </div>
        <div className="center-container">
          <table>
            <thead>
              <tr>{renderColumns()}</tr>
            </thead>
            <tbody>
              {renderProblems()}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
