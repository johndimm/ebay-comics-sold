import Ebay from '@/components/Ebay'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
  const [_title, setTitle] = useState('')
  const [_issue, setIssue] = useState('')
  const [_year, setYear] = useState('')

  const router = useRouter()
  const { title, issue, year } = router.query

  const examples = [
    { title: 'Fantastic Four', issue: '52', year: '1966' },
    { title: 'Amazing Spider-Man', issue: '129', year: '1974' },
    { title: 'Mighty Thor', issue: '140', year: '1967' },
    { title: 'X-Men', issue: '94', year: '1975' },
    { title: 'Hulk', issue: '181', year: '1974' },
    { title: 'Avengers', issue: '57', year: '1968' },
    { title: 'Daredevil', issue: '168', year: '1980' },
    { title: 'Tales of Suspense', issue: '39', year: '1963' },
    { title: 'Tales to Astonish', issue: '27', year: '1962' },
    { title: 'Journey into Mystery', issue: '83', year: '1962' },
    { title: 'Incredible Hulk', issue: '1', year: '1962' },
  ]

  useEffect(() => {
    if (router.isReady) {
      if (title) setTitle(title)
      if (issue) setIssue(issue)
      if (year) setYear(year)
      console.log('router.query', router.query)
    }
  }, [title, issue, year])

  const submitForm = (e) => {
    e.preventDefault()
    window.location.href = `/?title=${e.target.title.value}&issue=${e.target.issue.value}&year=${e.target.year.value}`
    //setTitle(e.target.title.value)
    //setIssue(e.target.issue.value)
    //setYear(e.target.year.value)
  }


  const examplesHtml = examples.map((ex, i) => {
    return <li key={i}><a href={`/?title=${ex.title}&issue=${ex.issue}&year=${ex.year}`}>{ex.title} #{ex.issue} ({ex.year})</a></li>
  })

  return <>
    <h1>comics recently sold on ebay</h1>

    <form onSubmit={submitForm}>
      <label>
        Title:
        <input type="text" name='title' defaultValue={_title} />
      </label>
      <label>
        Issue:
        <input type="text" name='issue' size="4" defaultValue={_issue} />
      </label>
      <label>
        Year:
        <input type="text" name='year' size="4" defaultValue={_year} />
      </label>
      <input type="submit" value="Submit" />
    </form>

    <ul className='examples'>{examplesHtml}</ul>

    <Ebay title={_title} year={_year} issue={_issue} />
  </>
}

export default Home