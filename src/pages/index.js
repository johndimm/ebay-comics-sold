import Ebay from '@/components/Ebay'
import { useEffect, useState } from 'react'

const Home = () => {
  const [title, setTitle] = useState('Fantastic Four')
  const [issue, setIssue] = useState('52')
  const [year, setYear] = useState('1966')

  const submitForm = (e) => {
    e.preventDefault()
    setTitle(e.target.title.value)
    setIssue(e.target.issue.value)
    setYear(e.target.year.value)
  }

  const titleEsc = title.replace(/ /g, "+")
  const url=`https://www.ebay.com/sch/i.html?_nkw=${titleEsc}+${year}+${issue}&LH_Sold=1&_ipg=240`

  return <>
    <h1>comics recently sold on ebay</h1>
    <form onSubmit={submitForm}>
      <label>
        Title:
        <input type="text" name='title' defaultValue={title} />
      </label>
      <label>
        Issue:
        <input type="text" name='issue' size="4" defaultValue={issue} />
      </label>
      <label>
        Year:
        <input type="text" name='year' size="4" defaultValue={year} />
      </label>
      <input type="submit" value="Submit" />
    </form>

    <a className="search_ebay" href={url} target="_ebay">view search results on ebay</a>

    <Ebay title={title} year={year} issue={issue} />
  </>
}

export default Home