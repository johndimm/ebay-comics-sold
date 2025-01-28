const axios = require('axios')

const getx = (pattern, r) => {
    // const re = new RegExp(pattern)
    const match = pattern.exec(r)
    if (match) {
        const html = match[1]
        return html.replace(new RegExp("<.*?>", "g"), "")
    } else {
        return null
    }
}

const get_title = (r) => {
    const pattern = /<div class=s-item__title>(.*?)<\/div>/
    return getx(pattern, r)
}

const get_price = (r) => {
    const pattern = /<span class=s-item__price>(.*?)<\/span>/
    let price = getx(pattern, r)
    return price
}

const get_cgc = (r) => {
    const pattern = /CGC [^\d\W-]{0,3} *([\d\.]*)/
    let cgc = getx(pattern, r)
    if (cgc && parseFloat(cgc) > 10) {
        cgc = null
    }
    if (cgc)
      cgc = cgc.replace(/\.$/, "")
    return cgc
}

const get_issue = (r, issue_number) => {
    const pattern = /#(\d*)/
    let good = getx(pattern, r)
    if (!good) {
        const pattern = new RegExp(` (${issue_number}) `)
        good = getx(pattern, r)
    }
    return good
}

const get_sold_on = (r) => {
    const pattern = /<span>Sold  (.*?)<\/span>/
    return getx(pattern, r)
}

const get_grade = (r) => {
    let grade
    Object.keys(grades).forEach((key, idx) => {
        if (r.includes(` ${key} `)) {
            grade = `${key} ${grades[key]}`
        }
    })
    return grade
}

const get_year = (r) => {
    const pattern = /[ \(](\d{4})($|[ \)])/
    return getx(pattern, r)
}

const get_annual = (r) => {
    const pattern = new RegExp("(Annual)", 'i')
    return getx(pattern, r)
}

const get_variant = (r) => {
    const pattern = new RegExp("(Variant)", 'i')
    return getx(pattern, r)
}

const get_seller = (r) => {    
    const pattern = /<span class=s-item__seller-info-text>(.*?)<\/span>/
    return getx(pattern, r)
}

const grades =
{
    "Gem Mint": "10",
    "Mint": "9.9",
    "NM/M": "9.8",
    "NM+": "9.6",
    "NM": "9.4",
    "NM-": "9.2",
    "VF/NM": "9.0",
    "VF+": "8.5",
    "VF": "8.0",
    "VF-": "7.5",
    "FN/VF": "7.0",
    "FN+": "6.5",
    "FN": "6.0",
    "FN-": "5.5",
    "VG/FN": "5.0",
    "VG+": "4.5",
    "VG": "4.0",
    "VG-": "3.5",
    "G/VG": "3.0",
    "G+": "2.5",
    "G": "2.0",
    "G-": "1.8",
    "Fa/G": "1.5",
    "Fa": "1.0",
    "Poor": "0.5",
}

const parseChunk = (chunk, title, issue, year) => {
    const listing_title = get_title(chunk)
    if (!listing_title) {
        return null
    }

    const price = get_price(chunk)
    const sold_on = get_sold_on(chunk)
    const seller = get_seller (chunk)

    const cgc = get_cgc(listing_title)
    const listing_issue = get_issue(listing_title, issue)
    const grade = get_grade(listing_title)
    const listing_year = get_year(listing_title)
    const annual = get_annual(listing_title)
    const variant = get_variant(listing_title)

    const json = {
        "price": price,
        "issue": listing_issue,
        "title": listing_title,
        "cgc": cgc,
        "grade": grade,
        "sold_on": sold_on,
        "listing_year": listing_year,
        "annual": annual,
        "variant": variant,
        "seller": seller
    }

    const _title = title.toLowerCase()
    const _listing_title = listing_title.toLowerCase()
    const goodTitle = (_listing_title.includes(_title) || _title.includes(_listing_title))

    if (
        (cgc || grade)
        && issue == listing_issue
        && (!listing_year || listing_year <= year)
        && goodTitle
        && !annual
        && !variant
    ) {
        return json
    } else {
        return null
    }
}

export default async function handler(req, res) {
    const { title, year, issue, sold } = req.query
    const titleEsc = title.replace(/ /g, "+")
    // const url=`https://www.ebay.com/sch/i.html?_nkw=${titleEsc}+${year}+${issue}&LH_Sold=1&_ipg=240`
    const url = `https://www.ebay.com/sch/i.html`

    const response = await axios.get(url, {
        params: {
            _nkw: `${titleEsc}+${year}+${issue}`,
            LH_Sold: sold,
            _ipg: 240
        }
    }
    )

    const divTitle = '<div class=s-item__title>'

    const chunks = response.data.split(divTitle)
    const json = []
    for (const chunk of chunks) {
        const item = parseChunk(divTitle + chunk, title, issue, year)
        if (item) {
            json.push(item)
        }
    }

    res.status(200).json(json)

    // res.status(200).json({ data: json })
}