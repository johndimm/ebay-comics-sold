// import styles from "@/styles/Home.module.css";
import { useState, useEffect, use } from "react"
import axios from 'axios'
import Chart from 'chart.js/auto'
import { Scatter } from 'react-chartjs-2';

const priceToFloat = (price) => price.replace("$", "").replace(",", "")

const ScatterPlot = ({ chartData, title }) => {
    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>{title}</h2>
            <Scatter
                data={chartData}
                options={{
                    scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'grade'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'price'
                          }
                        }
                      },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.data[context.dataIndex].description;
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    );
}

export default function Ebay({ title, year, issue, sold }) {
    const [data, setData] = useState('hello')

    const fetchData = async () => {
        const response = await axios.get("/api/fetch-ebay", {
            params: {
                title: title,
                year: year,
                issue: issue,
                sold: sold
            }
        })
        setData(response.data)
    }

    useEffect(() => {
        if (title)
          fetchData()
    }, [title, year, issue, sold])

    if (!data || data.length === 0) {
        return <div>loading...</div>
    }

    const dArray = Array.from(data)
    const table_rows = dArray.map((item, i) => {
        return <tr key={i}>
            <td>{item.sold_on}</td>
            <td>{item.price}</td>
            <td>{item.cgc}</td>
            <td>{item.grade}</td>
            <td>{item.title}</td>
            <td>{item.seller}</td>
        </tr>
    })

    const cgcPoints = dArray.filter(item => item.cgc).map((item, i) => {
        return { x: item.cgc, y: priceToFloat(item.price), description: `${item.price} ${item.title}`  }
    })

    const rawPoints = dArray.filter(item => item.grade && !item.cgc).map((item, i) => {
        return { x: item.grade.split(' ')[1], y: priceToFloat(item.price), description: `${item.price} ${item.title}`  }
    })

    const chartData = {
        datasets: [{
            label: 'Slab',
            data: cgcPoints,
            backgroundColor: 'rgb(255, 99, 132)',
        }, {
            label: 'Raw',
            data: rawPoints,
            backgroundColor: 'rgb(53, 162, 235)',
        }]
    }

    // console.log(chartData)

    const titleEsc = title.replace(/ /g, "+")
    const url = `https://www.ebay.com/sch/i.html?_nkw=${titleEsc}+${year}+${issue}&LH_Sold=${sold}&_ipg=240`
  
    return (<>
        <div className="App">
            <ScatterPlot chartData={chartData} title={`${title} ${issue} ${year}`} />

            <a className="search_ebay" href={url} target="_ebay">view search results on ebay</a>

            <table>
                <thead>
                    <tr>
                        <th>Sold On</th>
                        <th>Price</th>
                        <th>Slab</th>
                        <th>Raw</th>
                        <th>Title</th>
                        <th>Seller</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>
        </div>

    </>
    )
}