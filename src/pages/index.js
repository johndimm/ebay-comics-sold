import Ebay from '@/components/Ebay'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Analytics } from "@vercel/analytics/react"

const Home = () => {
  const [_title, setTitle] = useState('')
  const [_issue, setIssue] = useState('')
  const [_year, setYear] = useState('')
  const [_sold, setSold] = useState()

  const router = useRouter()
  const { title, issue, year, sold } = router.query

  const examples = [
    { title: 'Fantastic Four', issue: '52', year: '1966' },
    { title: 'Spider-Man', issue: '129', year: '1974' },
    { title: 'Thor', issue: '140', year: '1967' },
    { title: 'X-Men', issue: '94', year: '1975' },
    { title: 'Hulk', issue: '181', year: '1974' },
    { title: 'Avengers', issue: '57', year: '1968' },
    { title: 'Daredevil', issue: '168', year: '1980' },
    { title: 'Tales of Suspense', issue: '39', year: '1963' },
    { title: 'Tales to Astonish', issue: '27', year: '1962' },
    { title: 'Journey into Mystery', issue: '83', year: '1962' },
    { title: 'Incredible Hulk', issue: '1', year: '1962' },
    { title: 'Metal Men', issue: '1', year: '1963' },
  ]

  useEffect(() => {
    if (router.isReady) {
      if (title) setTitle(title)
      if (issue) setIssue(issue)
      if (year) setYear(year)
      if (sold) setSold(sold)
      // console.log('router.query', router.query)
    }
  }, [title, issue, year, sold])

  const navigate = (title, issue, year, sold) => {
    window.location.href = `/?title=${title}&issue=${issue}&year=${year}&sold=${sold}`
  }

  const submitForm = (e) => {
    e.preventDefault()
    const isSold = e.target.sold.value == 'Sold' ? 1 : 0
    navigate(e.target.title.value, e.target.issue.value, e.target.year.value, isSold)

    // console.log(e.target)

    //setTitle(e.target.title.value)
    //setIssue(e.target.issue.value)
    //setYear(e.target.year.value)
  }

  const soldChanged = (e) => {
   // e.preventDefault()
   console.log('soldChanged', e.target.value)
   navigate(_title, _issue, _year, e.target.value == 'Sold' ? 1 : 0)
  }

  const examplesHtml = examples.map((ex, i) => {
    return <li key={i}><a href={`/?title=${ex.title}&issue=${ex.issue}&year=${ex.year}&sold=1`}>{ex.title} #{ex.issue} ({ex.year})</a></li>
  })
  
  let radioHtml = <></>
  if (_sold != undefined) {
    radioHtml = <>
      <input type="radio" name='sold' value='Sold' defaultChecked={_sold == 1} onChange={soldChanged}/>
      <span className='checkboxText'>Sold</span>
      <input type="radio" name='sold' value='For Sale' defaultChecked={_sold == 0} onChange={soldChanged}/>
      <span className='checkboxText'>For Sale</span>
    </>
  }

  const soldChecked = _sold == 1 ? 'True' : 'False'
  console.log("sold:", sold, "_sold:", _sold, "soldChecked:", soldChecked)


  return <>
    <h1>comics recently on ebay</h1>
    <div className='subtitle'>to slab or not to slab?</div>

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

      {radioHtml}

      <input type="submit" value="Submit" />
    </form>


    <ul className='examples'>{examplesHtml}</ul>

    <Ebay title={_title} year={_year} issue={_issue} sold={_sold}/>

    <br />

    <a href="https://github.com/johndimm/ebay-comics-sold">https://github.com/johndimm/ebay-comics-sold</a>
  </>
}

export default Home